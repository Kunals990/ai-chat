// routes/session.ts
import { Router, Request, Response } from "express";
import prisma from "./prisma";

const router = Router();

// POST /api/session
router.post("/",async (req: Request, res: Response): Promise<void> =>{
    const { userId } = req.body;

    if (!userId) {
        res.status(400).json({ error: "userId is required" });
        return;
    }

    try {
        const session = await prisma.session.create({
            data: {
                userId,
            },
        });

        res.status(201).json({ sessionId: session.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create session" });
    }
});

export default router;
