import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";
import { ChatClient } from "./components/client";


interface ChatIdPageProps {
    params: {
        chatId: string;
    }
}

const ChatIdPage = async ({
    params
}: ChatIdPageProps) => {
    const { userId } = auth();

    if (!userId) {
        return auth().redirectToSignIn();
    }

    const agent = await prismadb.agent.findUnique({
        where: {
            id: params.chatId
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "asc",
                },
                where: {
                    userId,
                }
            },
            _count: {
                select: {
                    messages: true
                }
            }
        }
    });

    if (!agent) {
        return redirect("/");
    }
    return (
        <ChatClient agent= {agent} />
    );
}

export default ChatIdPage;