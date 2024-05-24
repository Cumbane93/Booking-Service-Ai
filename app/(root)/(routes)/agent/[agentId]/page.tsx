import prismadb from "@/lib/prismadb";
import { AgentForm } from "./components/agent-form";

interface AgentIdPageProps {
    params: {
        agentId: string;
    };
};

const AgentIdPage = async ({
    params
}: AgentIdPageProps) => {
    // TODO: Check subcription

    const agent = await prismadb.agent.findUnique({
        where: {
            id: params.agentId,
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