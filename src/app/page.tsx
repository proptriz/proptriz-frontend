'use client';

import React, { useState, useEffect } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { FaRegBell } from "react-icons/fa6";
import PropertyListing from "@/components/property/Listing";
import Link from "next/link";
import { useAllProperties } from "@/services/propertyApi";
import Image from "next/image";
import Skeleton from "@/components/skeleton/Skeleton";
import { FaRegUser } from "react-icons/fa";
import { useSession } from "next-auth/react"
import { categories } from "@/constant";

export default function RootPage() {
  const [ settingsMenu, setSettingsMenu ] = useState<string>('hidden');
  // const [properties, setProperties] = useState<PropertyType[]>(mockProperties);
  const [ filterBy, setFilterBy ] = useState<string>('house');

  const { properties, isLoading, isError } = useAllProperties({category: filterBy});
  const {  data: session } = useSession();

  // useEffect(() => {
  //   const fetchProperties = async () => {
  //     const response = await propertyService.getAllProperties();
  //     if (response.data) {
  //       setProperties(response.data);
  //       console.log("Listed properties: ", response.data)
  //     } else {
  //       setError(response.message);
  //       console.log("error fetching all properties: ", response.message)
  //     }
  //     setLoading(false);
  //   };

  //   fetchProperties();
  // }, []);


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
          <Image
            width={100}
            height={60}
            src="/banner.png"
            alt="banner"
            className="h-auto max-w-full"
          />
        </div>

        {/* Notification & Profile Section */}
        <div className="flex items-center space-x-4 ml-auto text-gray-500 text-xl"> 
          <button onClick={()=>setSettingsMenu('')}>
            {!session?.user ? 
              <FaRegUser className="" /> :
              <img
                src="/avatar.png"
                alt="profile"
                className="rounded-full w-10 h-10"
              />
            }            
          </button>         
          
          <button className="text-gray-500 text-xl">{session?.user?.email}<FaRegBell /></button>
        </div>
      </header>
      <div className="px-6 py-3">
        <SearchBar disable={isLoading} filter={filterBy} />
      </div>
      
      {/* Navigation Tabs */}
      <NavigationTabs setValue={setFilterBy} disable={isLoading} />

      {/* Main Section */}
      { isLoading || isError ? <Skeleton type="landing" />
      :
      <div className="relative flex-1">
        {/* Recent Listing */}
        { properties && properties.length>0 && <PropertyListing properties={properties.slice(0,6)}/> }        
      </div>}

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


