'use clint';
import { useState } from "react";
import { BackButton } from "./buttons"
import { AgentProps } from "@/definitions";


export default function ProfileInfo( {agent, menu}: { agent: AgentProps, menu: string[] } ){
    const statusCountStyle = 'border-2 border-white py-4 rounded-xl font-[Montserrat]'
    const [ listOrSold, setListOrSold ] = useState<string>(menu[0]);

    return (
        <>
        <BackButton />            
        <h1 className="text-2xl font-bold text-center 2xl mb-5">Profile</h1>
        <div className="mb-6 text-center">
            <h2 className="font-bold text-lg">{agent.name}</h2>
            <p className="text-gray-500">{agent.email}</p>
            
            <div className="flex flex-col items-center mb-5">
                <div className="bg-white w-32 h-32 rounded-full p-1 mt-4">
                    <img
                        src="https://placehold.co/40"
                        alt="profile"
                        className="rounded-full w-full h-full object-cover"
                    />                    
                </div>                    
                <div className="-mt-4 ml-12">
                    <span className="bg-green text-white text-xs px-2 py-1 rounded-full">
                    #1
                    </span>
                </div>
            </div>
            {/* Count Status */}
            <div className="grid grid-cols-3 space-x-6 text-center mb-5">
                <div className={statusCountStyle}>
                    <p className="font-bold">{agent.rating}</p>
                    <p className="text-gray-500 ">Rating</p>
                </div>
                <div className={statusCountStyle}>
                    <p className="font-bold">{agent.reviews}</p>
                    <p className="text-gray-500">Reviews</p>
                </div>
                <div className={statusCountStyle}>
                    <p className="font-bold">{agent.sold}</p>
                    <p className="text-gray-500">Sold</p>
                </div>
            </div>
        </div>
        {/* List or Sold Toggle button */}
        <div className="flex bg-gray-200 rounded-full shadow-lg text-white mb-7 p-4 space-x-4 w-full">
            {menu.map((list, key)=>(
                <button key={key} className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold===list? 'bg-white text-[#61AF74]': 'bg-gray-200' }`}
                onClick={()=>setListOrSold(list)}
                >
                    {list}
                </button>
            ))           

            }
        </div>
        </>
    )
}