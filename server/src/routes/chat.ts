// routes/chat.ts
import { Router, Request, Response } from "express";
import { handleGeminiResponse } from "../llms/gemini";
import { handleOpenAIResponse } from "../llms/gpt";
import { resolve } from "path";
import pool from "../db";

const router = Router();

const modelHandlers: Record<string, (chat: any) => Promise<string | undefined>> = {
  "Gemini": handleGeminiResponse,
  "GPT-4": handleOpenAIResponse,
  // Add more models easily:
  // "Claude": handleClaudeResponse,
  // "Llama": handleLlamaResponse,
};

router.post("/", async (req: Request, res: Response): Promise<void> => {
    try{
        const { chat, llm } = req.body;
        const handler = modelHandlers[llm];

        let result: string;
        if(handler){
            result = await handler(chat) ?? `No response from ${llm}`;
        }
        else{
            result = `Unsupported model`;
        }
        await pool.query(
            "INSERT INTO chats (role, message, llm) VALUES ($1, $2, $3)",
            ["user", chat, llm]
            );
        await pool.query(
            "INSERT INTO chats (role, message, llm) VALUES ($1, $2, $3)",
            ["assistant", result, llm]
            );

        res.json({chat:result,role:"assistant"});

    }catch(err){
        console.error(err);
        res.json({chat:"Something went wrong",role:"assistant"})
    }
  
});


router.get("/test", async (req, res) => {
  const result = await pool.query("SELECT NOW()");
  res.json(result.rows);
});

export default router;