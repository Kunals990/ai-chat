import {NextResponse} from "next/server";


export async function POST(req: Request){
    try{
        const body=await req.json();

        const result = await fetch("http://localhost:3001/api/auth",{
            method:"POST",
            headers:{
                "Content-Type": "application/json",
            },
            body:JSON.stringify(body),
        })

        const data = await result.json();

        return NextResponse.json(data);

    }catch (err) {
        console.error(err);
        return NextResponse.json("Something went wrong with auth");
    }
}