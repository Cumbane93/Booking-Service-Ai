import { AgentCategories } from "@/components/agent-categories";
import { SearchInput } from "@/components/search-input";
import prismadb from "@/lib/prismadb";

const RootPage = async () => {
    const agentCategories = await prismadb.agentCategory.findMany();
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <AgentCategories data={agentCategories}/>
        </div>);
}

export default RootPage;