'use client';

import React, { useState, useEffect } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import { SlMenu } from "react-icons/sl";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import propertyService from "@/services/propertyApi";
import { mockProperties } from "@/constant";
import { PropertyType } from "@/types";
import getUserPosition from "@/utils/getUserPosition";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ExplorePage() {
  const [ settingsMenu, setSettingsMenu ] = useState<string>('hidden');
  const [properties, setProperties] = useState<PropertyType[]>(mockProperties);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ filterBy, setFilterBy ] = useState<string>('house');
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

  // Get user location
  useEffect(() => {
  const fetchLocation = async () => {
    const [lat, lng] = await getUserPosition();
    console.log("User location:", lat, lng);
    setUserCoordinates([lat, lng]);
  };
  fetchLocation();
  }, []);

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
      <header className="p-4 flex justify-between items-center sticky top-0 z-50">        
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
          <Image
            width={100}
            height={60}
            src="/banner.png"
            alt="banner"
            className="h-auto max-w-full"
          />
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center space-x-4 ml-auto">           
          <button className="text-gray-500 text-xl"><SlMenu /></button>
        </div>
      </header>
      <div className="px-6 py-3 z-10">
        <SearchBar />
        <NavigationTabs setValue={setFilterBy}/>
      </div>

      {/* Map Section */}
      <div className="relative flex-1">
        <Map properties={properties} mapCenter={userCoordinates} />        
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


