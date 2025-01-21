'use client';

import HorizontalCard from "@/components/shared/HorizontalCard";
import SearchBar from "@/components/shared/SearchBar";
import { apartments } from "@/constant";
import { useRouter } from "next/navigation";
import React from "react";
import { IoChevronBack } from "react-icons/io5";

const LocationDetailsPage = () => {
        const router = useRouter()
    return (
        <div className="flex flex-col pb-16">
            {/* Header Section */}
            <div className="flex flex-row">
                <div className="relative basis-3/4">
                    <img
                    src="/skyscraper.png" // Replace with the actual property image URL
                    alt="Property"
                    className="w-full h-[350px] object-cover rounded-b-xl"
                    /> 
                    <button className=" absolute top-5 left-5 p-4 text-xl card-bg rounded-full shadow-md" onClick={()=>router.back()}>
                        <IoChevronBack />
                    </button>           
                    
                    <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white px-4 py-1 rounded-full">
                        <span className="bg-green text-white text-xs px-2 py-1 rounded-full">
                            #1
                        </span>
                    </div>
                </div>
                <div className="basis-1/3">
                    <div>
                        <img
                            src="/home/building4.png" // Replace with the actual property image URL
                            alt="Property"
                            className="w-full h-full object-cover rounded-b-xl"
                        /> 
                        <img
                            src="/home/building3.png" // Replace with the actual property image URL
                            alt="Property"
                            className="w-full h-full object-cover rounded-b-xl"
                        /> 
                    </div>
                    
                </div>
            </div>
            <div className="p-6 relative">
                <h1 className="mt-10">Ikeja</h1>
                <h4 className="mb-6">Our recommended real estates in Ikeja, Lagos</h4>

                <SearchBar />
            
                {/* location properties */}
                <section className="mt-6">
                    <p className="text-lg mb-4 font-[Raleway]">Found <span className="font-bold">140</span> Properties</p>
                    {/* Property Card */}
                    <div className="space-y-5">
                        {apartments.slice(0,2).map(((info, key)=>(
                            <HorizontalCard name={info.name} 
                                id={info.id}
                                price={30} 
                                type="" 
                                address={info.address} 
                                image={info.image} 
                                period={info.period} 
                                rating={info.rating}
                                key={key}
                            />
                        )))}
                    </div>
                </section>
            </div>
            
            
        </div>
    );
};

export default LocationDetailsPage;
