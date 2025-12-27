'use client';

import React, { useState, useEffect } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import PropertyListing from "@/components/property/Listing";
import dynamic from 'next/dynamic';
import propertyService from "@/services/propertyApi";
import { PropertyType } from "@/types";
import logger from "../../../logger.config.mjs"
import Header from "@/components/shared/Header";

export default function RootPage() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ filterBy, setFilterBy ] = useState<string>('house');

  const fetchProperties = async () => {
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
        logger.error("error fetching all properties: ", response.message);

      }
    } catch (error:any) {
      logger.error("error fetching all properties: ", error.message)
    }
    
  };

  useEffect(() => {
    fetchProperties();

  }, [filterBy]);

  useEffect(() => {
    if (searchQuery.trim() !== '') return;
    fetchProperties();
  }, [searchQuery]);

  return (
    <div className="flex flex-col pt-5 pb-16">
      {/* Header */}
      <Header />
      <div className="px-6 py-3">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={fetchProperties}
         />
      </div>
      
      {/* Navigation Tabs */}
      <NavigationTabs setValue={setFilterBy}/>

      {/* Map Section */}
      <div className="relative flex-1">
        <PropertyListing properties={properties.slice(0,6) || []}/>
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


