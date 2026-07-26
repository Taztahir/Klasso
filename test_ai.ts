import { aiService } from './src/services/ai';
import * as dotenv from 'dotenv';
dotenv.config();

async function testAI() {
    console.log("Testing AI Service...");
    try {
        const response = await aiService.getChatResponse("Hello, who are you?");
        console.log("Response:", response);
    } catch (e: any) {
        console.error("Test failed:", e.message);
    }
}

testAI();
