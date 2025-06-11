import OpenAI from "openai";
const client = new OpenAI();

export async function handleOpenAIResponse(chat:string) {
    
    try{
        const response = await client.responses.create({
            model: "gpt-4.1-nano",
            input: chat
        });

        const result = await response.output_text;

        return result;

    }catch(err){
        console.log(err);
        return "Something went wrong";
    }
}