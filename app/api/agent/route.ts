import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, agentCategoryId } = body;

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !agentCategoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }


        // TODO: Check for subscription

        const agent = await prismadb.agent.create({
            data: {
                agentCategoryId,
                userId: user.id,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed
            }
        });

        return NextResponse.json(agent);
    } catch (error) {
        console.log("[AGENT_POST]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}