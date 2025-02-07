'use client';

import React, { useState, useEffect } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { FaRegBell } from "react-icons/fa6";
import PropertyListing from "@/components/property/Listing";
import dynamic from 'next/dynamic';
import Link from "next/link";
import propertyService from "@/services/propertyApi";
import { PropertyType } from "@/definitions";
import { mockProperties } from "@/constant";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function RootPage() {
  const [ mapOrList, setMapOrList ] = useState<string>('list')
  const [ settingsMenu, setSettingsMenu ] = useState<string>('hidden');
  const [properties, setProperties] = useState<PropertyType[]>(mockProperties);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      const response = await propertyService.getAllProperties();
      if (response.success) {
        setProperties(response.data.data);
        console.log("Listed properties: ", response.data.data)
      } else {
        setError(response.message);
        console.log("error fetching all properties: ", response.message)
      }
      setLoading(false);
    };

    fetchProperties();
  }, []);


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
          <button onClick={()=>setSettingsMenu('')}>
          <img
            src="/avatar.png"
            alt="profile"
            className="rounded-full w-10 h-10"
          />
          </button>         
          
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
        {/* Centralized Button Tabs */}
        {/* <div className="fixed top-2 left-1/2 transform -translate-x-1/2 z-10 flex w-[70%] max-w-md bg-gray-100 rounded-full shadow-lg text-white">
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
        </div> */}

        {/* Map Component or List */}
        {
          mapOrList==='map'? 
          <Map />:
          <PropertyListing properties={properties.slice(0,6)}/>
        }
        
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


