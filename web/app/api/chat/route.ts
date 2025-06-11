import { NextResponse } from 'next/server';
import { handleGeminiResponse } from '@/lib/llm/gemini';
import { handleOpenAIResponse } from '@/lib/llm/gpt';

const modelHandlers: Record<string, (chat: any) => Promise<string | undefined>> = {
  "Gemini": handleGeminiResponse,
  "GPT-4": handleOpenAIResponse,
  // Add more models easily:
  // "Claude": handleClaudeResponse,
  // "Llama": handleLlamaResponse,
};

export async function POST(req: Request) {

    try{
        const body = await req.json();
        const { chat, llm } = body;

        const handler = modelHandlers[llm];
        
        let result: string;
        if (handler) {
            result = await handler(chat) ?? `No response from ${llm}`;
        } else {
            result = `❌ Unsupported model: ${llm}. Available models: ${Object.keys(modelHandlers).join(", ")}`;
        }

        return NextResponse.json({
            chat: result,
            role: "assistant",
        })

    }catch(err){
        console.error(err);
        return NextResponse.json({
            chat:"Something went wrong!",
            role:"assistant",
        })

    }
  
}