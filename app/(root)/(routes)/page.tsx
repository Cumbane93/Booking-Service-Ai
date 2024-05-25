import { AgentCategories } from "@/components/agent-categories";
import { Agents } from "@/components/agents";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";

interface RootPageProps {
    searchParams: {
        agentCategoryId: string;
        name: string;
    }
}

const RootPage = async ({
    searchParams
}: RootPageProps) => {
    const data = await prismadb.agent.findMany({
        where: {
            agentCategoryId: searchParams.agentCategoryId,
            name: {
                search: searchParams.name
            }
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    messages: true
                }
            }
        }
    })
    const agentCategories = await prismadb.agentCategory.findMany();
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <AgentCategories data={agentCategories} />
            <Agents  data={data} />
        </div>);
}

export default RootPage;