import {Request, Response, Router} from "express";
import prisma from "./prisma";


const router = Router();

router.post("/",async (req: Request, res: Response): Promise<void> =>{
    try{
        const {email,name}=req.body;

        if(!email){
            res.status(400).json({error:"Email is required"});
            return;
        }

        let user = await prisma.user.findUnique({where:{email}});
        if(!user){
            user = await prisma.user.create({
                data: {
                    email,
                    name: name,
                }
            });
        }
        res.json({ user });
        return ;

    }catch (e) {
        res.status(404).json({error: "An error occurred while processing your request."});
    }
})

export default router;