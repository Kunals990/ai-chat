import { GoogleGenAI } from "@google/genai";


export async function handleGeminiResponse(chat:string) {
    try{
        
        const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY ||"" }  ); 
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",
            contents: chat,
        });
        console.log(response);
        const text=response.text;

        return text || "No response generated";

    }catch(err){
        console.error(err);
        return "Something went wrong with gemini";
    }
}