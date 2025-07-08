import 'dotenv/config'
import { question } from 'readline-sync';
import { GoogleGenAI } from "@google/genai";

const geminiApiKey = process.env.GEMINI_API_KEY;
const openWeatherApiKey = process.env.OPEN_WEATHER_API_KEY;
const ai = new GoogleGenAI({geminiApiKey});

const addNum = ({num1, num2}) => {
    return num1 + num2;
}

const getTemperature = async ({location}) => {
        const geolocationResponse = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${location}&limit=1&appid=${openWeatherApiKey}`);
        const geolocationData = await geolocationResponse.json();
        const latitude = geolocationData[0]["lat"];
        const longitude = geolocationData[0]["lon"];

        const temperatureResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${openWeatherApiKey}`);
        const temperatureData = await temperatureResponse.json();
        const temperature = temperatureData["main"]["temp"];

        return temperature;
}

const addNumsDeclaration = {
    name : "addNum",
    description: "This is a function that will add two given numbers",
    parameters: {
        type: "OBJECT",
        properties: {
            num1: {
                type: "INTEGER",
                description: "It will be an integer representing first number E.g.: 10",

            },
            num2: {
                type: "INTEGER",
                description: "It will be an integer representing second number E.g.: 10",
            }
        },
        required : ['num1', 'num2'],
    }
}

const getTemperatureDeclaration = {
    name : "getTemperature",
    description: "This is a function that will fetch the current temperature of a given place in kelvin and you will give response in celsius",
    parameters: {
        type: "OBJECT",
        properties: {
            location: {
                type: "STRING",
                description: "It will be representing the name of the place whose current temperature we are interested in",
            }
        },
        required : ['location'],
    }
}

const availableTools = {
    addNum,
    getTemperature,
}

const startChat = async (chat) => {
    const prompt = question("User Prompt: ");
    const response = await chat.sendMessage({
        message : prompt,
    });

    if (response.functionCalls && response.functionCalls.length>0){
        for (let i=0; i<response.functionCalls.length; i++){
            const {name, args} = response.functionCalls[i];
            const toolResponse = {
                name : name,
                response : await availableTools[name](args)
            }
            const finalResponse = await chat.sendMessage({
                message: `This is the response provided by tool : ${JSON.stringify(toolResponse)}`,
            })
            console.log(`LLM: ${finalResponse.text}`)
        }
    } else {
        console.log(`LLM: ${response.text}`);
    }

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
            systemInstruction : `You are a chatbot and you need to answer all the questions asked by user
            You are provided some external tools like which you can use and if none of the tool is appropriate to use then you can answer it your own.
            `,
            tools: [{
                functionDeclarations: [addNumsDeclaration, getTemperatureDeclaration]
            }],
        }
    });

    await startChat(chat);
}

await main()