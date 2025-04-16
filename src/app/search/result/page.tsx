'use client';

import React, { useState, use, useEffect } from "react";
import { BackButton } from "@/components/shared/buttons";
import { FaFilter } from "react-icons/fa";
import SearchBar from "@/components/shared/SearchBar";
import { MdCalendarViewDay } from "react-icons/md";
import { HiViewGrid } from "react-icons/hi";
import { categories, styles } from "@/constant";
import { VerticalCard } from "@/components/shared/VerticalCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Popup from "@/components/shared/Popup";
import formatPrice from "@/utils/formatPrice";
import { useAllProperties } from "@/services/propertyApi";
import { PropertyType } from "@/definitions";

const EmptySearch = ({searchParams}:{ searchParams: Promise<{ filter: string, query: string }> }) => {
    const router = useRouter();
    const resolvedParams = use(searchParams)
    // console.log('filter parameter: ', resolvedParams)

    const [ propCount, setPropCount ] = useState<number>(4);
    const [togglePopup, setTogglePopup] = useState(false);
    const [filter, setFilter] = useState<any>({category: 'office'});
    const { properties, isLoading, isError } = useAllProperties({ category: resolvedParams.filter });

    return (
        <div className="p-6 pb-24 relative min-h-screen">
            <div className="flex items-center justify-between mb-5">
                <BackButton />            
                <h2 className="font-bold">Search Results</h2>
                <button className="top-5 left-5 p-4 text-xl card-bg rounded-full"
                onClick={()=>setTogglePopup(!togglePopup)} 
                >
                    <FaFilter />
                </button>                 
            </div>
            <SearchBar />
            <div className="flex items-center mb-3 sm:mb-5 mt-3">
                <p className="mb-4 font-[Raleway]">Found<span className="font-bold"> {properties?.length} </span>properties</p>
                <button className="px-5 py-3 mb-6 rounded-full ml-auto card-bg flex gap-1"><HiViewGrid /><MdCalendarViewDay /></button>
            </div>

            {/* Property Card */}
            <div className="grid grid-cols-2 gap-3">                
                {properties && properties.map(((item:PropertyType, key:any)=>(
                    <VerticalCard 
                        id={item._id}
                        name={item.title} 
                        price={formatPrice(item.price)} 
                        type={item.category} 
                        address={item.address} 
                        image={item.banner} 
                        period={item.period? item.period : ''} 
                        rating={0}
                        key={key}
                    />
                )))}
            </div>

            {/* Notification popup */}      
            <Popup header="Filter" toggle={togglePopup} setToggle={setTogglePopup} useMask={true}>
            <div className="">
                    {/* filter by categories section */}
                    <section>
                        <h2 className={`${styles.H2}`}>Property type</h2>                
                        <nav className="flex space-x-4 px-4 py-2 overflow-x-auto">
                            {categories.map((item, index) => (
                                <button
                                key={index}
                                className={`flex items-center px-4 py-2 rounded-lg ${
                                    item.title === "House" ? "bg-[#234F68] text-white" : "bg-gray-100"
                                }`}
                                >
                                {/* <span>{tab.icon}</span> */}
                                <span>{item.title}</span>
                                </button>
                            ))}
                        </nav>
                    </section>
                    
                    <section>
                        <h2 className={`${styles.H2}`}>Location</h2>
                        <Link href={'/property/add/location'}>
                            <div className="rounded-2xl w-full overflow-hidden">
                                <Image
                                src="/map-image.png" 
                                alt="Map"
                                width={200}
                                height={200}
                                className="w-full h-[200px] object-contain"
                                />
                            </div> 
                        </Link>
                    </section>
                    <button className={`${styles.GREENBTN} w-full mt-5`}>Apply filter</button>
                </div>
            </Popup>
        </div>
    );
};

export default EmptySearch;
