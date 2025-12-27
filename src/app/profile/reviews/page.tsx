'use client';

import { BackButton } from "@/components/shared/buttons";
import { ReviewCard } from "@/components/shared/Cards";
import Image from "next/image";
import React from "react";
import { FaBed, } from "react-icons/fa";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoChatbubbleEllipsesOutline, } from "react-icons/io5";

const AllReviewsPage = () => {
  return (
    <div className="flex flex-col p-6 pb-16">
      {/* Header Section */}
      <header className="flex w-full mb-10">
          <BackButton />
          <h1 className="text-center w-full">All Reviews</h1>
      </header>
            
      {/* Agent Info */}
      <div className="px-5 py-3 flex items-center bg-gray-100 rounded-lg mx-5 card-bg">
        <Image
          src="/avatar.png" // Replace with the actual agent image URL
          width={15}
          height={15}
          alt="Agent"
          className="w-12 h-12 rounded-full"
        />
        <div className="ml-3">
          <h2 className="text-lg font-bold">Anderson</h2>
          <p className="text-gray-500 text-sm">Real Estate Agent</p>
        </div>
        <button className="ml-auto p-2 card-bg text-2xl rounded-lg">
          <IoChatbubbleEllipsesOutline />
        </button>
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

    {/* Reviews */}
    <div className="px-5 mt-10">
      <h2 className="text-lg font-bold mb-3">User Reviews</h2>
                
      <div className="space-y-6 max-h-[500px] overflow-y-auto">
        {/* Review Item */}
        <div className="border border-[#DCDFD9] rounded-2xl">
          <div className="p-3 rounded-lg flex items-center h-16">
            <Image 
              src={'/home/building1.png'}
              width={50} 
              height={50} 
              className="rounded-lg" 
              alt={'property'}
            />
            <div className="ml-2 space-y-1"> 
              <p className="font-bold">Fairview Apartment</p>                                
              <div  className="flex items-center">
                <span className="font-bold mr-2">4.9</span>
                <HiOutlineLocationMarker />
                <p className="text-gray-500 text-sm"> Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          <ReviewCard
            id='01' 
            reviewer="Kurt Mullins" 
            image="/avatar.png" 
            ratings={4.0}
            text="Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            reviewDate="2025-01-01T10:00:00Z" // Example ISO 8601 date string
          />
        </div>
        <div className="border border-[#DCDFD9] rounded-2xl">
          <div className="p-3 rounded-lg flex items-center h-16">
            <Image 
              src={'/home/building1.png'} 
              width={50} 
              height={50} 
              className="rounded-lg" 
              alt={'property'}
            />
            <div className="ml-2 space-y-1"> 
              <p className="font-bold">Fairview Apartment</p>                                
              <div  className="flex items-center">
                <span className="font-bold mr-2">4.9</span>
                <HiOutlineLocationMarker />
                <p className="text-gray-500 text-sm"> Jakarta, Indonesia</p>
              </div>
            </div>
          </div>

          <ReviewCard 
            id='02'
            reviewer="Kurt Mullins" 
            image="/avatar.png" 
            ratings={4.0}
            text="Lorem ipsum dolor sit amet, consectetur 
            adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            reviewDate="2025-01-01T10:00:00Z" // Example ISO 8601 date string
          />
        </div>

      {/* Add more reviews here */}
      </div>
    </div>
  </div>
  );
};

export default AllReviewsPage;
