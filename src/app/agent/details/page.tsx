'use client';

import React, { useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { agent, mockProperties } from "@/constant";
import ProfileInfo from "@/components/shared/ProfileInfo";
import formatPrice from "@/utils/formatPrice";

const AgentProfileDetail = () => {

    const statusCountStyle = 'border-2 border-white py-4 rounded-xl font-[Montserrat]'
    const [ listOrSold, setListOrSold ] = useState<string>('list');

    return (
        <div className="p-6 pb-24 relative">
            <ProfileInfo agent={agent} menu={['Listing', 'sold']} />

            {/* Card List  */}
            <section>
                <p className="text-lg mb-4 font-[Raleway]"><span className="font-bold">140</span> Listings</p>
                <div className="grid grid-cols-2 gap-6">
                {mockProperties.map((listing, key) => (
                    <VerticalCard
                    key={key}
                    id={listing._id}
                    name={listing.title}
                    price={formatPrice(listing.price)}
                    address={listing.address}
                    period={'month'}
                    rating={5.0}
                    type="apartment"
                    image={listing.banner}
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
