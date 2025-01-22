'use client';

import React, { useState } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { FaRegBell } from "react-icons/fa6";
import dynamic from 'next/dynamic';
import Link from "next/link";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ExplorePage() {
  const [ settingsMenu, setSettingsMenu ] = useState<string>('hidden');

  const menuItems = [
    {title: 'Login', link: '/profile/login'},
    {title: 'Transaction', link: '/profile/transaction'}
]

  return (
      <div className="flex flex-col pt-5 pb-16">
        {/* Header */}
        <header className="p-4 flex justify-between items-center relative">        
            <div className={`absolute top-5 right-2 divide-y-2 space-y-5 px-4 py-8 bg-white text-sm ${settingsMenu}`}>  
                {menuItems.map((item, index) => (
                    <button className="hover:card-bg hover:shadow-md block" key={index}>
                    <Link href={item.link} >
                        {item.title}
                    </Link>
                    </button>
                )) }                
            </div>
      
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
        </div>
      </header>
      <div className="px-6 py-3">
        <SearchBar />
      </div>
      
      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Map Section */}
      <div className="relative flex-1">
        <Map />        
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


