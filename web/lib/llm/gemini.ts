import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ||"" }    );

export async function handleGeminiResponse(chat:string) {
    try{
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: chat,
        });

        const result= await response.text;

        return result;

    }catch(err){
        console.error(err);
        return "Something went wrong";
    }
}