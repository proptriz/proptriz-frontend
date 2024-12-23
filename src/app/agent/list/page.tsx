import { BackButton } from "@/components/shared/buttons";
import { agents } from "@/constant";
import Link from "next/link";

const AgentList = () => {
    
    return (
        <div className="p-6">
        <header className=" mb-6 relative">
            <BackButton />
            <h1 className="mt-10">Top Property Agents</h1>
            <h4 className="">Find the best recommendations place to live</h4>
        </header>
        <div className="grid grid-cols-2 gap-6">
            {agents.map((agent) => (
                 <Link href={'/agent/details'} key={agent.id}>
                    <div
                        key={agent.id}
                        className="bg-white p-4 rounded-xl shadow-lg flex flex-col items-center text-center relative"
                    >
                        <img
                        src={agent.image}
                        alt={agent.name}
                        className="w-24 h-24 rounded-full mb-4"
                        />
                        <span className="absolute top-4 right-4 bg-green text-white text-xs px-2 py-1 rounded-full">
                        #{agent.id}
                        </span>
                        <h2 className="font-bold text-lg">{agent.name}</h2>
                        <p className="text-sm text-gray-500">
                        ⭐ {agent.rating} | 🏠 {agent.sold} Sold
                        </p>
                    </div>
                </Link>
            ))}
        </div>
        </div>
    );
};

export default AgentList;
