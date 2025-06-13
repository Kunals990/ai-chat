import OpenAI from "openai";


export async function handleOpenAIResponse(chat:string) {
    
    try{
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey) {
        throw new Error("Missing OPENAI_API_KEY");
        }

        const openai = new OpenAI({ apiKey });
        const response = await openai.chat.completions.create({
            model: "gpt-4.1-nano", // or "gpt-3.5-turbo", "gpt-4", etc.
            messages: [
                {
                    role: "user",
                    content: chat
                }
            ]
        });

        const result = response.choices[0]?.message?.content;

        return result || "No response generated";

    }catch(err){
        console.log(err);
        return "Something went wrong";
    }
}