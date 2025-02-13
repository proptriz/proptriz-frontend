'use client';

import React, { useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/shared/SearchBar";
import { FaRegBell } from "react-icons/fa6";
import { mockProperties } from "@/constant";
import Image from "next/image";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import Skeleton from "@/components/skeleton/Skeleton";

export default function PropertyListPage() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    if(loading) return <Skeleton type="list" />

    return (
        <div className="flex flex-col pt-5 pb-16">
            {/* Header */}
            <header className="p-4 flex justify-between items-center">
                <button className={`absolute top-5 left-1 p-4 text-xl hover:bg-white`} onClick={()=>router.back()}>
                    <IoChevronBack />
                </button>    
                {/* Centered Banner */}
                <div className="absolute left-1/2 transform -translate-x-1/2">
                    <Image
                        src="/banner.png"
                        width={70}
                        height={50}
                        alt="banner"
                        className="h-auto max-w-full"
                    />
                </div>

                {/* Notification & Profile Section */}
                <div className="flex items-center space-x-4 ml-auto">
                    <button className="text-gray-500 text-xl"><FaRegBell /></button>
                </div>
            </header>
            <div className="px-6 py-3">
                <SearchBar />
            </div>

            {/* Explore Nearby Property List */}
            <section className="px-4 my-6">
                <h2 className="text-lg font-semibold">Properties</h2>
                <div className="grid grid-cols-2 gap-4 mt-4">                    
                    {mockProperties.map(((item, key)=>(
                        <Link href={'/property/details'} key={key}>
                            <div className="bg-white p-3 rounded-2xl  shadow-md">
                                <div className="w-full bg-cover bg-center h-48 rounded-xl relative" style={{ backgroundImage: `url(${item.banner})`}}>
                                    <div className="absolute bottom-2 right-2 bg-gray-700 text-white font-bold p-1 rounded-xl">
                                        N{item.price}
                                        <span className="text-xs">{item.period}</span>
                                    </div>
                                </div>
                                <div>
                                    <p className="text-md font-semibold my-2">{item.title}</p>
                                    <div className="flex space-x-2">
                                        <span className="text-yellow-500">★</span>
                                        <span className="text-gray-500 text-sm">{0}</span>
                                        <p className="text-gray-500 text-sm">{item.address}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    )))}
                </div>
            </section>

        </div>
    );
};


