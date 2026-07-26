import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
    let lastError: any;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (error: any) {
            lastError = error;
            // 429 is Too Many Requests (Quota)
            if (error.message?.includes('429') || error.status === 429) {
                const delay = Math.pow(2, i) * 1000 + Math.random() * 1000;
                console.warn(`Quota hit. Retrying in ${Math.round(delay)}ms... (Attempt ${i + 1}/${maxRetries})`);
                await sleep(delay);
                continue;
            }
            throw error;
        }
    }
    throw lastError;
}

export const aiService = {
    async getChatResponse(messages: { role: 'user' | 'model', content: string }[]) {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: "You are Klasso AI, an intelligent school assistant. You help teachers, parents, and school proprietors manage curricula, create exam questions, structure lesson notes, and answer academic queries."
            });

            let history = messages.slice(0, -1);
            if (history.length > 0 && history[0].role !== 'user') {
                history = history.slice(1);
            }

            const chat = model.startChat({
                history: history.map(m => ({
                    role: m.role === 'user' ? 'user' : 'model',
                    parts: [{ text: m.content }],
                })),
                generationConfig: {
                    maxOutputTokens: 1000,
                },
            });

            return await callWithRetry(async () => {
                const result = await chat.sendMessage(messages[messages.length - 1].content);
                const response = await result.response;
                return response.text();
            });
        } catch (error: any) {
            console.error("AI Service Error:", error);
            if (error.message?.includes('429')) {
                throw new Error("Einstein is briefly overwhelmed (API Quota Exceeded). Please wait a few seconds and try again.");
            }
            throw new Error("Failed to get response from AI Tutor. Please check your connection or wait a moment.");
        }
    },

    async summarizeText(text: string) {
        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const prompt = `Summarize the following study material into key bullet points and a brief overview:\n\n${text}`;

            return await callWithRetry(async () => {
                const result = await model.generateContent(prompt);
                const response = await result.response;
                return response.text();
            });
        } catch (error: any) {
            console.error("AI Summarization Error:", error);
            if (error.message?.includes('429')) {
                throw new Error("API Quota exceeded. Please wait a moment.");
            }
            throw error;
        }
    },

    async generateQuiz(topic: string, count: number): Promise<any[]> {
        try {
            const model = genAI.getGenerativeModel({
                model: "gemini-2.0-flash",
                systemInstruction: "You are an expert tutor. You generate extremely accurate, challenging, and strictly formatted JSON multiple-choice quizzes."
            });

            const prompt = `Generate a ${count}-question multiple choice quiz about "${topic}". 
            
            Return the response strictly as a JSON array where each item has the following schema:
            {
                "id": number (starting from 1),
                "text": "The question string",
                "options": ["Option A", "Option B", "Option C", "Option D"],
                "correctAnswer": number (index of the correct option, 0-3)
            }
            
            Do NOT wrap the output in markdown code blocks. Just return the raw JSON array. Make sure the questions are accurate and relevant to the topic.`;

            const responseText = await callWithRetry(async () => {
                const result = await model.generateContent({
                    contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    generationConfig: {
                        responseMimeType: "application/json",
                    }
                });
                return result.response.text();
            });

            const cleanedText = responseText.replace(/```json/gi, '').replace(/```/g, '').trim();
            const jsonSchema = JSON.parse(cleanedText);

            return jsonSchema;
        } catch (error: any) {
            console.error("AI Quiz Generation Error:", error);
            if (error.message?.includes('429')) {
                throw new Error("Exceeded AI request limit. Einstein needs a 20-second break!");
            }
            throw new Error("Failed to generate quiz. Please try again or check your API limit.");
        }
    }
};
