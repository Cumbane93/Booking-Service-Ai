import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";

import { AgentForm } from "./components/agent-form";
import { RedirectToSignIn } from "@clerk/nextjs";

interface AgentIdPageProps {
    params: {
        agentId: string;
    };
};

const AgentIdPage = async ({
    params
}: AgentIdPageProps) => {
    const { userId } = auth();
    // TODO: Check subcription

    if (!userId){
        return auth().redirectToSignIn();
    }

    const agent = await prismadb.agent.findUnique({
        where: {
            id: params.agentId,
            userId
        }
    });

    const agentCategories = await prismadb.agentCategory.findMany();

    return (
        <AgentForm
            initialData={agent}
            agentCategories={agentCategories}
        />
    );
}

export default AgentIdPage;