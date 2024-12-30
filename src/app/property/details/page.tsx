'use client';

import { ReviewCard } from "@/components/shared/Cards";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { apartments } from "@/constant";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React from "react";
import { FaHeart, FaShareAlt, FaStar, FaBed, } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoChatbubbleEllipsesOutline, IoChevronBack } from "react-icons/io5";
import { TbView360Number } from "react-icons/tb";

const PropertyDetail = () => {
        const router = useRouter()
    return (
        <div className="flex flex-col pb-16">
            {/* Header Section */}
            <div className="relative">
                <img
                src="/skyscraper.png" // Replace with the actual property image URL
                alt="Property"
                className="w-full h-[350px] object-cover rounded-b-xl"
                /> 
                <button className=" absolute top-5 left-5 p-4 text-xl card-bg rounded-full shadow-md" onClick={()=>router.back()}>
                    <IoChevronBack />
                </button>           
                
                <div className="absolute top-5 right-5 flex space-x-3">                
                    <button className="p-2 bg-white rounded-full shadow-md">
                        <FaShareAlt />
                    </button>
                    <button className="p-2 bg-white rounded-full shadow-md">
                        <FaHeart color="green" />
                    </button>
                </div>
                <div className="absolute bottom-5 left-5 bg-black bg-opacity-50 text-white px-4 py-1 rounded-full">
                    <span>4.9</span> | <span>Apartment</span>
                </div>
            </div>

            {/* Title & Price */}
            <div className="p-5">
                <div className="flex items-center justify-between mt-3">
                    <div>
                        <h1 className="text-2xl font-bold">Wings Tower</h1>
                        <div  className="flex">
                            <HiOutlineLocationMarker />
                            <p className="text-gray-500 text-sm"> Jakarta, Indonesia</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-2xl text-right font-semibold text-green">$220</p>
                        <p className="text-gray-500 text-sm"> per year</p>
                    </div>                
                </div>
                
                <div className="flex items-center justify-between mt-5">
                    <div className="flex items-center space-x-3 text-sm">
                        <button className="px-5 py-3 bg-green text-white rounded-lg">Rent</button>
                        <button className="px-5 py-3 card-bg rounded-lg">Buy</button>
                    </div>
                    <button className="text-xl font-semibold card-bg p-4 rounded-full"><TbView360Number /></button>                
                </div>
            </div>

            {/* Agent Info */}
            <div className="px-5 py-3 flex items-center bg-gray-100 rounded-lg mx-5 card-bg">
                <img
                src="/avatar.png" // Replace with the actual agent image URL
                alt="Agent"
                className="w-12 h-12 rounded-full"
                />
                <div className="ml-3">
                <h2 className="text-lg font-bold">Anderson</h2>
                <p className="text-gray-500 text-sm">Real Estate Agent</p>
                </div>
                <button className="ml-auto p-2 card-bg text-2xl rounded-lg"><IoChatbubbleEllipsesOutline /></button>
            </div>

            {/* Property Details */}
            <div className="px-5 py-3 flex overflow-x-auto space-x-6 mt-5">
                <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center">
                    <span className="me-2"><FaBed className="text-green"/></span>
                    <span className="text-nowrap">2 Bedroom</span>
                </div>

                <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center">
                    <span className="me-2"><FaBed className="text-green"/></span>
                    <span className="text-nowrap">1 Bathroom</span>
                </div>

                <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center">
                    <span className="me-2"><FaBed className="text-green"/></span>
                    <span className="text-nowrap">120m² Area</span>
                </div>
            </div>

            {/* Map Section */}
            <div className="px-5 mt-10 space-y-3">
                <h2 className="text-lg font-bold mb-3">Location & Public Facilities</h2>
                <p className="mt-3 text-gray-500"></p>
                <select className="card-bg p-4 w-full rounded-full w-[70%] mx-auto">
                    <option value="1">2.5 km from your location</option>
                    <option value="1">3.5 km from your location</option>
                </select>

                <div className="px-5 py-3 flex overflow-x-auto space-x-4 mt-3">
                    <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center">
                        <span className="text-nowrap">2 Hospitals</span>
                    </div>

                    <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center">
                        <span className="text-nowrap">4 Gas Stations</span>
                    </div>

                    <div className="card-bg flex p-3 rounded-full text-sm text-gray-500 items-center">
                        <span className="text-nowrap">2 Schools</span>
                    </div>
                </div>

                <div className="rounded-2xl shadow-md w-full">
                    <Image
                    src="/map-image.png" 
                    alt="Map"
                    width={200}
                    height={200}
                    className="w-full h-[200px] object-contain"
                    />
                    <button className="w-full py-4 card-bg">View on map</button>
                </div>
                
            </div>

            {/* Reviews */}
            <div className="px-5 mt-10">
                <h2 className="text-lg font-bold mb-3">Reviews</h2>
                <div className="bg-gray-700 p-3 rounded-lg flex items-center">
                    <FaStar className="text-yellow-500" />
                    <span className="ml-2 text-lg text-gray-200 font-bold">4.9</span>
                    <span className="ml-2 text-gray-500">(12 reviews)</span>
                </div>
                <div className="mt-3 space-y-3">
                {/* Review Item */}
                <ReviewCard 
                reviewer="Kurt Mullins" 
                image="/avatar.png" 
                ratings={4.0}
                text="Lorem ipsum dolor sit amet, consectetur 
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                />
                {/* Add more reviews here */}
                </div>
                <button className="mt-3 text-green">View all reviews</button>
            </div>

            {/* Nearby Properties */}
            <div className="px-5 mt-10">
                <h2 className="text-lg font-bold mb-3">Nearby From this Location</h2>
                <div className="flex space-x-3">
                    {/* Property Card */}
                    <div className="grid grid-cols-2 w-full space-x-3 ">
                    {apartments.slice(0,2).map(((info, key)=>(
                        <VerticalCard
                            id={info.id}
                            name={info.name} 
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
                    
                {/* Add more cards here */}
                </div>
            </div>
        </div>
    );
};

export default PropertyDetail;
