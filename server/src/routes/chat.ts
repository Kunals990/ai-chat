import { Router, Request, Response } from "express";
import { handleGeminiResponse } from "../llms/gemini";
import { handleOpenAIResponse } from "../llms/gpt";
import prisma from "./prisma";

const router = Router();


const modelHandlers: Record<string, (chat: string) => Promise<string | undefined>> = {
  "Gemini": handleGeminiResponse,
  "GPT-4": handleOpenAIResponse,
};

//add new session

router.post("/", async (req: Request, res: Response): Promise<void> => {
  try {
    const { chat, llm, sessionId } = req.body;
    const handler = modelHandlers[llm];

    if (!sessionId) {
      res.status(400).json({ chat: "Missing sessionId", role: "system" });
      return;
    }

    const response = handler ? await handler(chat) ?? "No response" : "Unsupported LLM";

    // Store user message
    await prisma.chat.create({
      data: {
        role: "user",
        message: chat,
        llm,
        sessionId,
      },
    });

    // Store assistant message
    await prisma.chat.create({
      data: {
        role: "assistant",
        message: response,
        llm,
        sessionId,
      },
    });

    res.json({ chat: response, role: "assistant" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ chat: "Internal Server Error", role: "system" });
  }
});

export default router;

