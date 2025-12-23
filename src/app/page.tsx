'use client';

import React, { useState, useEffect, useContext } from "react";
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import propertyService from "@/services/propertyApi";
import { PropertyType } from "@/types";
import getUserPosition from "@/utils/getUserPosition";
import { AppContext } from "@/context/AppContextProvider";
import logger from "../../logger.config.mjs"
import Header from "@/components/shared/Header";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ExplorePage() {
  const { authUser, isSigningInUser } = useContext(AppContext);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterBy, setFilterBy] = useState<string>('house');
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(13);

  // Get user location
  const fetchLocation = async () => {    
    const [lat, lng] = await getUserPosition();
    // logger.debug("User location:", lat, lng);
    setMapCenter([lat, lng]);
    setZoomLevel(13);
  };

  useEffect(() => {
    // sessionStorage.removeItem('prevMapCenter');
    // sessionStorage.removeItem('prevMapZoom');
    fetchLocation();

  }, [authUser]);

  const fetchProperties = async () => {
    if (!mapBounds) return
    setProperties([]);

    try {
      const ne = mapBounds.getNorthEast(); // top-right
      const sw = mapBounds.getSouthWest(); // bottom-left

      const query = new URLSearchParams({
        query: searchQuery,
        page: "1",
        limit: "50",
        category: filterBy,
        listed_for: "",
        ne_lat: ne.lat.toString(),
        ne_lng: ne.lng.toString(),
        sw_lat: sw.lat.toString(),
        sw_lng: sw.lng.toString()
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

  }, [filterBy, mapBounds]);

  useEffect(() => {
    if (searchQuery.trim() === '') return;

    fetchProperties();
  }, [searchQuery,]);

  return (
    <div className="flex flex-col w-full h-screen">
        {/* Header */}
        <Header />
        <div className="z-10 lg:flex px-6 py-6 space-y-4 lg:space-y-0  w-full">
          <SearchBar setQuery={setSearchQuery} onSearch={fetchProperties} />
          <NavigationTabs setValue={setFilterBy}/>
        </div>

        {/* Map Section */}
        <div className="relative flex-1">
          <Map 
            properties={properties} 
            mapCenter={mapCenter} 
            initialZoom={zoomLevel}
            mapBounds={mapBounds}
            setMapBounds={setMapBounds} 
          />        
        </div>

        <div className="absolute bottom-12 z-10 right-0 left-0 m-auto pointer-events-none">
          <div className="w-[90%] lg:w-full lg:px-6 mx-auto flex items-center justify-between">
            {/* Add Agent Button */}
            <div className="">
            </div>
            {/* Location Button */}
            <div >
              <button
                className="bg-primary mx-auto"
                style={{
                  borderRadius: '50%',
                  width: '55px',
                  height: '55px',
                  padding: '0px',
                }}
                onClick={()=>fetchLocation()}
                disabled={isSigningInUser}
              >
                <Image
                  className="mx-auto"
                  src="/icon/my_location.png"
                  width={40}
                  height={40}
                  alt="my location"
                />
              </button>
            </div>
          </div>
        </div>

        {/* Footer Navigation */}
        <Footer />
    </div>
  );
};


