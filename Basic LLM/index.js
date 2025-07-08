import 'dotenv/config'
import { question } from 'readline-sync';
import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.apiKey;
const ai = new GoogleGenAI({});

const getChatResponse = async (prompt) => {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    return response.text;
}   

async function main(){
    const prompt = question("Prompt: ");
    const response = await getChatResponse(prompt);
    console.log(`response: ${response} \n`);
    main()
}

main()