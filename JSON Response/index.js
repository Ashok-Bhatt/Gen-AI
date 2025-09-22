import 'dotenv/config'
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({});

const getAnswer = async () => {
  return await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: "List out some popular cooking recipes, and include the amount of ingredients.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            recipeName: {type : Type.STRING},
            ingredients: {
              type: Type.ARRAY,
              items: {type: Type.STRING},
            }
          },
          propertyOrdering: ["recipeName", "ingredients"],
        },
        length: 10,
      }
    }
  });
}

const answer = await getAnswer();
console.log(answer['candidates'][0]["content"]["parts"][0]["text"]);