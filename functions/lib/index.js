"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paystackWebhook = exports.verifyPaystackPayment = void 0;
const functions = __importStar(require("firebase-functions"));
const admin = __importStar(require("firebase-admin"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const crypto = __importStar(require("crypto"));
admin.initializeApp();
const db = admin.firestore();
// Plan definitions — amounts in kobo (₦ × 100). 
// IMPORTANT: These are the source of truth. Never trust client-sent amounts.
const PLAN_AMOUNTS = {
    pro: { amountKobo: 150000, name: "Pro Mastery" }, // ₦1,500
    plus: { amountKobo: 300000, name: "Plus +" }, // ₦3,000
};
/**
 * verifyPaystackPayment — HTTPS Callable
 *
 * Called from the frontend after a successful Paystack popup.
 * Flow:
 *   1. Validate the caller is authenticated
 *   2. Call Paystack /transaction/verify/:reference
 *   3. Confirm amount and status match what we expect
 *   4. Update Firestore users/{uid}.subscriptionStatus = 'pro'
 *   5. Return success to the client
 *
 * SECURITY: Amount validation is done server-side. The client only sends
 * the reference string — it cannot fake the amount or status.
 */
exports.verifyPaystackPayment = functions.https.onCall(async (data, context) => {
    // 1. Must be authenticated
    if (!context.auth) {
        throw new functions.https.HttpsError("unauthenticated", "You must be signed in to verify a payment.");
    }
    const { reference, plan = "pro" } = data;
    if (!reference || typeof reference !== "string") {
        throw new functions.https.HttpsError("invalid-argument", "A payment reference is required.");
    }
    if (!PLAN_AMOUNTS[plan]) {
        throw new functions.https.HttpsError("invalid-argument", "Unknown plan specified.");
    }
    const secretKey = functions.config().paystack?.secret_key;
    if (!secretKey) {
        functions.logger.error("Paystack secret key not configured.");
        throw new functions.https.HttpsError("internal", "Payment service is not configured. Please contact support.");
    }
    // 2. Verify with Paystack API
    let paystackData;
    try {
        const response = await (0, node_fetch_1.default)(`https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`, {
            headers: {
                Authorization: `Bearer ${secretKey}`,
                "Content-Type": "application/json",
            },
        });
        const json = (await response.json());
        if (!json.status) {
            functions.logger.warn("[verifyPaystackPayment] Paystack returned error:", json.message);
            throw new functions.https.HttpsError("aborted", "Payment verification failed. Please contact support.");
        }
        paystackData = json.data;
    }
    catch (err) {
        if (err instanceof functions.https.HttpsError)
            throw err;
        functions.logger.error("[verifyPaystackPayment] Fetch error:", err);
        throw new functions.https.HttpsError("internal", "Could not reach payment gateway.");
    }
    // 3. Validate payment status and amount
    if (paystackData.status !== "success") {
        throw new functions.https.HttpsError("aborted", `Payment was not successful. Status: ${paystackData.status}`);
    }
    const expectedAmount = PLAN_AMOUNTS[plan].amountKobo;
    if (paystackData.amount !== expectedAmount) {
        // Amount mismatch — possible tampering
        functions.logger.error("[verifyPaystackPayment] Amount mismatch!", { expected: expectedAmount, received: paystackData.amount, uid: context.auth.uid });
        throw new functions.https.HttpsError("aborted", "Payment amount mismatch. Please contact support.");
    }
    // 4. All good — upgrade the user in Firestore
    const uid = context.auth.uid;
    try {
        await db.collection("users").doc(uid).set({
            subscriptionStatus: "pro",
            subscriptionPlan: plan,
            subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
            paystackReference: reference,
        }, { merge: true });
    }
    catch (err) {
        functions.logger.error("[verifyPaystackPayment] Firestore update failed:", err);
        throw new functions.https.HttpsError("internal", "Could not activate subscription. Please contact support with your reference.");
    }
    functions.logger.info("[verifyPaystackPayment] Subscription activated:", { uid, plan, reference });
    return { success: true, plan, message: "Subscription activated successfully!" };
});
/**
 * paystackWebhook — HTTPS endpoint
 *
 * Secondary guarantee. Paystack calls this endpoint directly for every
 * payment event, even if the user closes the browser tab.
 * Register this URL in: Paystack Dashboard → Settings → Webhooks
 *
 * URL after deployment:
 * https://<region>-<project-id>.cloudfunctions.net/paystackWebhook
 */
exports.paystackWebhook = functions.https.onRequest(async (req, res) => {
    if (req.method !== "POST") {
        res.status(405).send("Method Not Allowed");
        return;
    }
    // Validate the Paystack signature to ensure this is a genuine request
    const secretKey = functions.config().paystack?.secret_key;
    if (!secretKey) {
        functions.logger.error("[paystackWebhook] Secret key not configured.");
        res.status(500).send("Server misconfiguration.");
        return;
    }
    const paystackSignature = req.headers["x-paystack-signature"];
    const computedHash = crypto
        .createHmac("sha512", secretKey)
        .update(JSON.stringify(req.body))
        .digest("hex");
    if (computedHash !== paystackSignature) {
        functions.logger.warn("[paystackWebhook] Invalid signature — ignoring request.");
        res.status(401).send("Invalid signature.");
        return;
    }
    const event = req.body;
    functions.logger.info("[paystackWebhook] Event received:", event.event);
    // Handle charge.success — the main payment event
    if (event.event === "charge.success") {
        const txData = event.data;
        const customerEmail = txData?.customer?.email;
        const reference = txData?.reference;
        const amountKobo = txData?.amount;
        if (!customerEmail || !reference) {
            functions.logger.warn("[paystackWebhook] Missing email or reference in event.");
            res.status(200).send("OK"); // Always 200 to stop Paystack retries
            return;
        }
        // Look up the user by email
        try {
            const usersSnap = await db
                .collection("users")
                .where("email", "==", customerEmail)
                .limit(1)
                .get();
            if (usersSnap.empty) {
                functions.logger.warn("[paystackWebhook] No user found for email:", customerEmail);
                res.status(200).send("OK");
                return;
            }
            const userDoc = usersSnap.docs[0];
            // Determine plan from amount
            const matchedPlan = Object.entries(PLAN_AMOUNTS).find(([, { amountKobo: expected }]) => expected === amountKobo);
            const plan = matchedPlan ? matchedPlan[0] : "pro";
            await userDoc.ref.set({
                subscriptionStatus: "pro",
                subscriptionPlan: plan,
                subscribedAt: admin.firestore.FieldValue.serverTimestamp(),
                paystackReference: reference,
            }, { merge: true });
            functions.logger.info("[paystackWebhook] Subscription activated via webhook:", {
                uid: userDoc.id, plan, reference
            });
        }
        catch (err) {
            functions.logger.error("[paystackWebhook] Error processing webhook:", err);
            // Still return 200 — Paystack will retry on 5xx but we want to silence on partial error
        }
    }
    // Always respond 200 to Paystack
    res.status(200).send("OK");
});
//# sourceMappingURL=index.js.map