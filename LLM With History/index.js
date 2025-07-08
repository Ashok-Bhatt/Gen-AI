import 'dotenv/config'
import { question } from 'readline-sync';
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.apiKey;
const ai = new GoogleGenAI({});

const startChat = async (chat) => {
    const prompt = question("User Prompt: ");
    const response = await chat.sendMessage({
        message : prompt,
    });
    console.log(`LLM: ${response.text} \n`);
    startChat(chat);
}   

async function main(){

    const chat = ai.chats.create({
        model: "gemini-2.5-flash",
        history: [
        {
            role: "user",
            parts: [],
        },
        {
            role: "model",
            parts: [],
        },
        ],
    });

    await startChat(chat);
}

await main()