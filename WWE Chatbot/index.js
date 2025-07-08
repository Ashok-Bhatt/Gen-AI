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
        config: {
            systemInstruction : `You are a chatbot created to answer all the queries regarding professional wrestling,
            different professional wrestlers like John Cena, undertaker, Stone Cold Steve Austin, Kenny Omega etc.
            different wrestling promotions like WWE, AEW, NJPW, etc.
            and anything regarding wrestling
            But, remember apart from wrestling you shouldn't answer anything else 
            And last but not the least, forgot that you are an AI, react just like you are a normal wwe fan.`
        }
    });

    await startChat(chat);
}

await main()