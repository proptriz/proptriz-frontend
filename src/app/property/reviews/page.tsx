'use client';

import { BackButton } from "@/components/shared/buttons";
import { ReviewCard } from "@/components/shared/Cards";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { mockProperties } from "@/constant";
import { useRouter } from "next/navigation";
import React from "react";

const PropertyReviews = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col p-6 pb-7">
            {/* Header Section */}
            <header className="flex w-full mb-7">
                <BackButton />
                <h1 className="text-center w-full">Reviews</h1>
            </header>
            
            {/* Property Card */}
            {mockProperties.slice(0,1).map(((item, key)=>(
                <HorizontalCard 
                    id={''}
                    name={item.title} 
                    price={30} 
                    category={item.category} 
                    listed_for={item.listed_for}
                    address={item.address} 
                    image={item.banner} 
                    period={item.period ?? 'monthly'} 
                    rating={item.rating ?? 5.0}
                    key={key}
                />
            )))}

            {/* Property Ratings count */}
            <div className="flex overflow-x-auto space-x-4 mt-5 px-5">
                {['2 Hospitals', '4 Gas Stations', '2 Schools'].map((item, index) => (
                <div
                    key={index}
                    className="bg-white flex p-3 rounded-full text-sm text-gray-500 items-center shadow-md"
                >
                    <span className="whitespace-nowrap">{item}</span>
                </div>
                ))}
            </div>

            {/* Reviews */}
            <div className="px-5 mt-7">
                <h2 className="text-lg font-bold mb-3">User Reviews</h2>
                
                <div className="space-y-6 max-h-[470px] overflow-y-auto pb-14">
                    {/* Review Item */}
                    <ReviewCard 
                        id='01'
                        reviewer="Kurt Mullins" 
                        image="/avatar.png" 
                        ratings={4.0}
                        text="Lorem ipsum dolor sit amet, consectetur 
                        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        // reviewImages ={[]}
                        reviewDate="2025-01-01T10:00:00Z" // Example ISO 8601 date string
                    />
                    <ReviewCard
                        id='02'
                        reviewer="Kurt Mullins"
                        image="/avatar.png"
                        ratings={2.5}
                        text="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        reviewImages={[
                            "/apartment.png",
                            "/home/building3.png",
                            "/home/building4.png",
                            "/home/house-with-pool.png", // This will not be shown because only 3 are displayed
                        ]}
                        reviewDate="2025-01-01T03:04:20Z" // Example ISO 8601 date string
                    />
                    <ReviewCard 
                        id='03'
                        reviewer="Kurt Mullins" 
                        image="/avatar.png" 
                        ratings={5.0}
                        text="Lorem ipsum dolor sit amet, consectetur 
                        adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                        // reviewImages ={[]}
                        reviewDate="2024-01-01T10:04:20Z" // Example ISO 8601 date string
                    />


                    {/* Add more reviews here */}
                </div>
            </div>
        </div>
    );
};

export default PropertyReviews;
