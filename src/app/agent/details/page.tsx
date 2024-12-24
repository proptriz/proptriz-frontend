'use client';

import React, { useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { agent } from "@/constant";

const AgentProfileDetail = () => {

    const statusCountStyle = 'border-2 border-white py-4 rounded-xl font-[Montserrat]'
    const [ listOrSold, setListOrSold ] = useState<string>('list');

    return (
        <div className="p-6 pb-24 relative">
            <BackButton />            
            <div className="mb-6 text-center">
                <h2 className="font-bold text-2xl">{agent.name}</h2>
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
            <div className="flex bg-gray-100 rounded-full shadow-lg text-white mb-7">
                <button className={`w-full py-1 rounded-full text-gray-600 text-center text-sm ${listOrSold==='list'? 'bg-[#61AF74] text-white': 'bg-gray-100' }`}
                    onClick={()=>setListOrSold('list')}
                >
                    Listing
                </button>
                <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${listOrSold==='sold'? 'bg-[#61AF74] text-white': 'bg-gray-100' }`}
                    onClick={()=>setListOrSold('sold')}
                >
                    Sold
                </button>
            </div>

            {/* Card List  */}
            <section>
                <p className="text-lg mb-4 font-[Raleway]"><span className="font-bold">140</span> Listings</p>
                <div className="grid grid-cols-2 gap-6">
                {agent.listings.map((listing) => (
                    <VerticalCard
                    name={listing.name}
                    price={listing.price}
                    address={listing.location}
                    period={'month'}
                    rating={5.0}
                    type="apartment"
                    image={listing.image}
                    />
                ))}
                </div>
            </section>

            <button className="fixed bottom-2 left-1/2 transform -translate-x-1/2 z-10 w-[80%] bg-green text-white text-lg font-bold py-3 rounded-xl">
                Start Chat
            </button>
        </div>
    );
};

export default AgentProfileDetail;
