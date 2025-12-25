'use client';

import React, { useState, useEffect, useContext } from "react";
import dynamic from 'next/dynamic';
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
    sessionStorage.removeItem('prevMapCenter');
    sessionStorage.removeItem('prevMapZoom');
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

        {/* Map Section */}
        <div className="relative flex-1">
          <div className="relative top-0 z-10 lg:flex px-6 space-y-4 lg:space-y-0 lg:space-x-3 w-full lg:items-center justify-center pt-4 lg:pt-6 pb-2 bg-transparent">
            <SearchBar setQuery={setSearchQuery} onSearch={fetchProperties} />
            <NavigationTabs setValue={setFilterBy}/>
          </div>
          <Map 
            properties={properties} 
            mapCenter={mapCenter} 
            initialZoom={zoomLevel}
            mapBounds={mapBounds}
            setMapBounds={setMapBounds} 
          />  
          <div className="fixed bottom-12 right-0 left-0 m-auto pointer-events-none">
          <div className="w-full px-6 mx-auto flex items-center justify-between mb-7">
            {/* Add Agent Button */}
            <div className="">
            </div>
            {/* Location Button */}
              <button
                className="bg-primary ms-auto z-10 pointer-events-auto p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
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


