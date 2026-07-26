import * as functions from "firebase-functions";
import * as admin from "firebase-admin";
import fetch from "node-fetch";
import * as crypto from "crypto";
import { defineSecret } from "firebase-functions/params";

admin.initializeApp();
const db = admin.firestore();

// Define the Paystack secret as a Firebase Secret (stored in Google Cloud Secret Manager)
// Set it with: firebase functions:secrets:set PAYSTACK_SECRET_KEY
const paystackSecretKey = defineSecret("PAYSTACK_SECRET_KEY");

// Plan definitions — amounts in kobo (₦ × 100).
// IMPORTANT: These are the source of truth. Never trust client-sent amounts.
const PLAN_AMOUNTS: Record<string, { amountKobo: number; name: string }> = {
    pro: { amountKobo: 150000, name: "Pro Mastery" },  // ₦1,500
    plus: { amountKobo: 300000, name: "Plus +" },        // ₦3,000
};

/**
 * verifyPaystackPayment — HTTPS Callable
 *
 * Called from the frontend after a successful Paystack popup.
 * Verifies payment server-side with Paystack API, then upgrades Firestore.
 */
export const verifyPaystackPayment = functions
    .runWith({ secrets: ["PAYSTACK_SECRET_KEY"] })
    .https.onCall(async (data: { reference: string; plan?: string }, context: functions.https.CallableContext) => {
        // 1. Must be authenticated
        if (!context.auth) {
            throw new functions.https.HttpsError(
                "unauthenticated",
                "You must be signed in to verify a payment."
            );
        }

        const { reference, plan = "pro" } = data;

        if (!reference || typeof reference !== "string") {
            throw new functions.https.HttpsError("invalid-argument", "A payment reference is required.");
        }

        if (!PLAN_AMOUNTS[plan]) {
            throw new functions.https.HttpsError("invalid-argument", "Unknown plan specified.");
        }

        const secretKey = paystackSecretKey.value();
        if (!secretKey) {
            functions.logger.error("Paystack secret key not configured via Firebase Secrets.");
            throw new functions.https.HttpsError(
                "internal",
                "Payment service is not configured. Please contact support."
            );
        }

        // 2. Verify with Paystack API
        let paystackData: any;
        try {
            const response = await fetch(
                `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
                {
                    headers: {
                        Authorization: `Bearer ${secretKey}`,
                        "Content-Type": "application/json",
                    },
                }
            );
            const json = (await response.json()) as any;
            if (!json.status) {
                functions.logger.warn("[verifyPaystackPayment] Paystack error:", json.message);
                throw new functions.https.HttpsError("aborted", "Payment verification failed. Please contact support.");
            }
            paystackData = json.data;
        } catch (err: any) {
            if (err instanceof functions.https.HttpsError) throw err;
            functions.logger.error("[verifyPaystackPayment] Fetch error:", err);
            throw new functions.https.HttpsError("internal", "Could not reach payment gateway.");
        }

        // 3. Validate status and amount server-side
        if (paystackData.status !== "success") {
            throw new functions.https.HttpsError("aborted", `Payment not successful. Status: ${paystackData.status}`);
        }

        const expectedAmount = PLAN_AMOUNTS[plan].amountKobo;
        if (paystackData.amount !== expectedAmount) {
            functions.logger.error("[verifyPaystackPayment] Amount mismatch!", {
                expected: expectedAmount, received: paystackData.amount, uid: context.auth.uid,
            });
            throw new functions.https.HttpsError("aborted", "Payment amount mismatch. Please contact support.");
        }

        // 4. Upgrade user in Firestore
        const uid = context.auth.uid;
        try {
            await db.collection("users").doc(uid).set(
                {
                    subscriptionStatus: "pro",
                    subscriptionPlan: plan,
                    subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
                    paystackReference: reference,
                },
                { merge: true }
            );
        } catch (err) {
            functions.logger.error("[verifyPaystackPayment] Firestore update failed:", err);
            throw new functions.https.HttpsError(
                "internal",
                "Could not activate subscription. Contact support with reference: " + reference
            );
        }

        functions.logger.info("[verifyPaystackPayment] Subscription activated:", { uid, plan, reference });
        return { success: true, plan, message: "Subscription activated successfully!" };
    });

/**
 * paystackWebhook — HTTPS endpoint
 *
 * Paystack calls this directly for every payment event.
 * Register URL in: Paystack Dashboard → Settings → Webhooks
 *
 * URL after deployment:
 * https://us-central1-[your-firebase-project].cloudfunctions.net/paystackWebhook
 */
export const paystackWebhook = functions
    .runWith({ secrets: ["PAYSTACK_SECRET_KEY"] })
    .https.onRequest(async (req: functions.https.Request, res: functions.Response) => {
        if (req.method !== "POST") { res.status(405).send("Method Not Allowed"); return; }

        const secretKey = paystackSecretKey.value();
        if (!secretKey) {
            functions.logger.error("[paystackWebhook] Secret key not configured.");
            res.status(500).send("Server misconfiguration."); return;
        }

        // Validate Paystack signature
        const paystackSignature = req.headers["x-paystack-signature"] as string;
        const computedHash = crypto
            .createHmac("sha512", secretKey)
            .update(JSON.stringify(req.body))
            .digest("hex");

        if (computedHash !== paystackSignature) {
            functions.logger.warn("[paystackWebhook] Invalid signature.");
            res.status(401).send("Invalid signature."); return;
        }

        const event = req.body;
        functions.logger.info("[paystackWebhook] Event received:", event.event);

        if (event.event === "charge.success") {
            const txData = event.data;
            const customerEmail = txData?.customer?.email;
            const reference = txData?.reference;
            const amountKobo = txData?.amount;

            if (!customerEmail || !reference) {
                res.status(200).send("OK"); return;
            }

            try {
                const usersSnap = await db.collection("users").where("email", "==", customerEmail).limit(1).get();
                if (!usersSnap.empty) {
                    const userDoc = usersSnap.docs[0];
                    const matchedPlan = Object.entries(PLAN_AMOUNTS).find(([, { amountKobo: exp }]) => exp === amountKobo);
                    const plan = matchedPlan ? matchedPlan[0] : "pro";
                    await userDoc.ref.set(
                        {
                            subscriptionStatus: "pro",
                            subscriptionPlan: plan,
                            subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
                            paystackReference: reference,
                        },
                        { merge: true }
                    );
                    functions.logger.info("[paystackWebhook] Subscription activated:", { uid: userDoc.id, plan });
                }
            } catch (err) {
                functions.logger.error("[paystackWebhook] Error:", err);
            }
        }

        res.status(200).send("OK");
    });
