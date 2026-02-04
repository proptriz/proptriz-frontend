'use client';

import React, { useState, useEffect, useCallback } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import PropertyListing from "@/components/property/Listing";
import propertyService from "@/services/propertyApi";
import { PropertyFilterPayload, PropertyType } from "@/types";
import logger from "../../../logger.config.mjs"
import Header from "@/components/shared/Header";

export default function RootPage() {
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [category, setCategory] = useState<string>('house');
  const [listedFor, setListedFor] = useState<string>('all');
  const [minPriceBudget, setMinPriceBudget] = useState<number>(0); 
  const [maxPriceBudget, setMaxPriceBudget] = useState<number>(100000000);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [centerLat, setCenterLat] = useState<number| null>(null)
  const [centerLng, setCenterLng] = useState<number| null>(null)

  const fetchProperties = async () => {
    setProperties([]);
    try {
      const query = new URLSearchParams({
        query: searchQuery,
        page: "1",
        limit: "50",
        category: category ?? "",
        listed_for: listedFor == "all" ? "" : listedFor,
        min_price: minPriceBudget.toString(),
        max_price: maxPriceBudget.toString(),
        center_lat:  centerLat?.toString() || "",
        center_lng: centerLng?.toString() || ""
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

  }, [category, listedFor, minPriceBudget, maxPriceBudget]);

  useEffect(() => {
    if (searchQuery.trim() !== '') return;
    fetchProperties();
  }, [searchQuery]);

  const onFilter = useCallback((filters: PropertyFilterPayload) => {
    setProperties([]);  
    setListedFor(filters.listedFor);
    setMinPriceBudget(filters.priceMin || 0);
    setMaxPriceBudget(filters.priceMax || 100000000);
    setCategory(filters.propertyType);
    setSearchQuery(filters.description || searchQuery);
    setCenterLat(filters.location ? filters.location.lat : null);
    setCenterLng(filters.location ? filters.location.lng : null); 
  }, [searchQuery]);

  return (
    <div className="flex flex-col pt-5 pb-16">
      {/* Header */}
      <Header />

      <div className="relative top-0 z-10 mb-4 lg:flex px-6 space-y-4 lg:space-y-0 lg:space-x-3 w-full lg:items-center justify-center pt-4 lg:pt-6 pb-2 bg-transparent">
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={fetchProperties}
          onFilter={onFilter}
        />

        {/* Navigation Tabs */}
        <NavigationTabs 
          onChange={setCategory}
          value={category}
        />
      </div>     

      {/* Map Section */}
      <div className="relative flex-1">
        <PropertyListing properties={properties.slice(0,10) || []}/>
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


