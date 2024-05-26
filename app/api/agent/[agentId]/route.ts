import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function PATCH(
    req: Request,
    { params }: { params: { agentId: string } }
) {
    try {
        const body = await req.json();
        const user = await currentUser();
        const { src, name, description, instructions, seed, agentCategoryId } = body;

        if (!params.agentId) {
            return new NextResponse("Agent ID is required", { status: 400 });
        }

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if (!src || !name || !description || !instructions || !seed || !agentCategoryId) {
            return new NextResponse("Missing required fields", { status: 400 });
        }


        // TODO: Check for subscription

        const agent = await prismadb.agent.update({
            where: {
                id: params.agentId,
                userId: user.id
            },
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
        console.log("[AGENT_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}

export async function DELETE(
    request: Request,
    { params }: { params: { agentId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const agent = await prismadb.agent.delete({
            where: {
                userId,
                id: params.agentId,
            }
        });

        return NextResponse.json(agent);

    } catch (error) {
        console.log("[AGENT_DELETE]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}