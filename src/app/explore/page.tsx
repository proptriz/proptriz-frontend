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
import { PropertyType } from "@/types";
import { mockProperties } from "@/constant";
import Image from "next/image";
import logger from "../../../logger.config.mjs"
import { SlMenu } from "react-icons/sl";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function RootPage() {
  const [properties, setProperties] = useState<PropertyType[]>(mockProperties);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ filterBy, setFilterBy ] = useState<string>('house');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async () => {
    setLoading(true);
    setProperties([]);

    try {
      const query = new URLSearchParams({
        query: searchQuery,
        page: "1",
        limit: "50",
        category: filterBy,
        listed_for: "",
        // Add other filters as needed
      }).toString();

      const response = await propertyService.getAllProperties(query);

      if (response.success) {
        setProperties(response.data);
        logger.info("Listed properties: ", response.data);

      } else {
        setError(response.message);
        logger.error("error fetching all properties: ", response.message);

      }
      setLoading(false);
    } catch (error:any) {
      setError(error.message);
      logger.error("error fetching all properties: ", error.message)

    } finally {
      setLoading(false);
    }

    
  };

  useEffect(() => {
    fetchProperties();

  }, [filterBy]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetchProperties();
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col pt-5 pb-16">
      {/* Header */}
      <header className="p-6 flex justify-between items-center w-full z-50 shadow-md">        
        <div className={`nav_item disabled`}>
          <Link href="/" aria-label="Home" >
            <Image src="/logo.png" alt="proptriz" width={104} height={64} />
          </Link>
        </div>

        <div className="text-xl font-bold">
          ropTriz
        </div>

        {/* Menu icon*/}
        <div className="ml-auto">           
          <button className="text-gray-500 text-xl "><SlMenu /></button>
        </div>
      </header>

      <div className="px-6 py-3">
        <SearchBar setQuery={setSearchQuery} onSearch={fetchProperties} />
      </div>
      
      {/* Navigation Tabs */}
      <NavigationTabs setValue={setFilterBy}/>

      {/* Map Section */}
      <div className="relative flex-1">
        <PropertyListing properties={properties.slice(0,6) ?? []}/>
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


