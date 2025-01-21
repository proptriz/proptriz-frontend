'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaAngleDown, FaRegBell } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { IoChevronBack } from "react-icons/io5";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { FaBullseye } from "react-icons/fa";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function PropertyMap() {
    const router = useRouter();
    
    return (
        <div className="flex flex-col">
            {/* Map Section */}
            <div className="relative flex-1 z-0">
                {/* Top Buttons */}
                <div className="absolute z-10 p-4">
                    <button className="p-4 text-xl card-bg rounded-full shadow-md" onClick={()=>router.push('/property/details')}>
                        <IoChevronBack />
                    </button>
                    <div className="flex overflow-x-auto space-x-4 mt-3 px-5">
                        {['2 Hospitals', '4 Gas Stations', '2 Schools'].map((item, index) => (
                        <div
                            key={index}
                            className="bg-white flex p-3 rounded-full text-sm text-gray-500 items-center shadow-md"
                        >
                            <span className="whitespace-nowrap">{item}</span>
                        </div>
                        ))}
                    </div>
                </div>

                {/* Bottom Content */}
                <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 w-full md:max-w-[650px] md:mx-auto px-4 z-10">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center bg-white p-3 rounded-full text-sm shadow-md">
                            <HiOutlineLocationMarker className="mr-2" />
                            <span>Yola Adamawa, Nigeria</span>
                            <FaAngleDown />
                        </div>
                        <button className="p-3 rounded-full bg-gray-800 text-white text-2xl shadow-md">
                            <FaBullseye />
                        </button>
                    </div>

                    {/* Location Details */}
                    <div className="bg-white w-full rounded-3xl p-4 shadow-lg">
                        <h2 className="text-lg font-bold mb-3">Location Details</h2>
                        <div className="max-h-[250px] overflow-y-auto">
                            <div
                                className="rounded-full p-4 border border-[#DCDFD9] my-4 cursor-pointer hover:bg-gray-100 flex items-center"
                            >
                                <button className="card-bg rounded-full p-3 mr-2" disabled>
                                    <HiOutlineLocationMarker />
                                </button>
                                <p className="text-gray-500">
                                    Opposite Gate-04 Jimeta International Market, Yola
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <Map />
            </div>
        </div>
    );
}
