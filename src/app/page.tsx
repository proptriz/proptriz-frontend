'use client';

import React, { useState } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Map from "@/components/Map";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { FaRegBell } from "react-icons/fa6";
import PropertyListing from "@/components/property/Listing";

const HomePage: React.FC = () => {
  const [ mapOrList, setMapOrList ] = useState<string>('map')
  return (
    <div className="flex flex-col pt-5 pb-32">
      {/* Header */}
      <header className="p-4 flex justify-between items-center relative">
        {/* Centered Banner */}
        <div className="absolute left-1/2 transform -translate-x-1/2">
          <img
            src="banner.png"
            alt="banner"
            className="h-auto max-w-full"
          />
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center space-x-4 ml-auto">
          <button className="text-gray-500 text-xl"><FaRegBell /></button>
          {/* <img
            src="https://placehold.co/40"
            alt="profile"
            className="rounded-full w-10 h-10"
          /> */}
        </div>
      </header>
      <div className="px-6 py-3">
        <SearchBar />
      </div>
      
      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Map Section */}
      <div className="relative flex-1">
        {/* Centralized Button Tabs */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-10 flex w-[70%] bg-gray-100 rounded-full shadow-md text-white">
          <button className={`w-full py-1 rounded-full text-gray-600 text-center text-sm ${mapOrList==='map'? 'bg-[#61AF74]': 'bg-gray-100' }`}
            onClick={()=>setMapOrList('map')}
          >
            Map
          </button>
          <button className={`w-full py-2 rounded-full text-gray-600 text-center text-sm ${mapOrList==='list'? 'bg-[#61AF74]': 'bg-gray-100' }`}
            onClick={()=>setMapOrList('list')}
          >
            Listing
          </button>
        </div>

        {/* Map Component or List */}
        {
          mapOrList==='map'? 
          <Map />:
          <PropertyListing />
        }
        
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};

export default HomePage;
