import { GoogleGenAI, Type } from '@google/genai';
import 'dotenv/config'
import {scrapeWebURL} from "./scrapper.js"

console.log(process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({apiKey: process.env.GEMINI_API_KEY});

const scrapeWebURLDeclaration = {
  name: 'scrapeWebURL',
  description: 'Scrapes the webpage content from the provided Web URL',
  parameters: {
    type: Type.OBJECT,
    properties: {
      url: {
        type: Type.STRING,
        description: 'URL that is going to be scrapped',
      }
    },
    required: ['url'],
  },
};

const availableTools = {
  scrapeWebURL
}

const response = await ai.models.generateContent({
  model: 'gemini-2.5-flash',
  contents: 'Kindly scrape my leetcode profile: https://leetcode.com/u/ashokbhatt2048/',
  config: {
    tools: [{
      functionDeclarations: [scrapeWebURLDeclaration]
    }],
  },
});

if (response.functionCalls && response.functionCalls.length > 0) {
  const functionCall = response.functionCalls[0];
  const name = functionCall.name;
  const args = functionCall.args;
  console.log(`Function to call: ${functionCall.name}`);
  console.log(`Arguments: ${JSON.stringify(functionCall.args)}`);
  console.log(await availableTools[name](args))

} else {
  console.log("No function call found in the response.");
  console.log(response.text);
}