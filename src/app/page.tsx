'use client';

import React, { useState, useEffect, useContext } from "react";
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
import { AppContext } from "@/context/AppContextProvider";
import logger from "../../logger.config.mjs"
import Splash from "@/components/shared/Splash";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ExplorePage() {
  const { authUser, isSigningInUser, autoLoginUser, registerUser } = useContext(AppContext);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ filterBy, setFilterBy ] = useState<string>('house');
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);

  // Get user location
  useEffect(() => {
  const fetchLocation = async () => {
    const [lat, lng] = await getUserPosition();
    // logger.debug("User location:", lat, lng);
    setMapCenter([lat, lng]);
  };
  fetchLocation();
  }, [authUser]);

  useEffect(() => {
    if (!mapBounds) return
    
    const fetchProperties = async () => {
      setLoading(true);

      const ne = mapBounds.getNorthEast(); // top-right
      const sw = mapBounds.getSouthWest(); // bottom-left

      const query = new URLSearchParams({
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
        logger.info("Listed properties: ", response.data)
      } else {
        setError(response.message);
        logger.error("error fetching all properties: ", response.message)
      }
      setLoading(false);
    };
  
    fetchProperties();
  }, [filterBy, mapBounds]);

  const handleLocationButtonClick = async () => {
    // clear previous map state when findme option is changed
    sessionStorage.removeItem('prevMapCenter');
    sessionStorage.removeItem('prevMapZoom');
    const userloc = await getUserPosition();
    if (userloc) {
      setMapCenter(userloc);
      logger.info('User location obtained successfully on button click:', {userloc});
    } else {
      setMapCenter(null);
    }
  };

  return (
    <div className="flex flex-col w-full h-screen">
      {
      isSigningInUser ? 
      <Splash /> :
      <div>
        {/* Header */}
        <header className="p-6 flex justify-between items-center w-full z-50 shadow-md">        
        
          {/* Centered Banner */}
          <div className="">
            <Image
              width={100}
              height={60}
              src="/banner.png"
              alt="banner"
              className="h-auto max-w-full"
            />
          </div>

          {/* Menu icon*/}
          <div className="ml-auto">           
            <button className="text-gray-500 text-xl "><SlMenu /></button>
          </div>

        </header>
        <div className="z-10 lg:flex px-6 py-6 space-y-4 lg:space-y-0  w-full">
          <SearchBar />
          <NavigationTabs setValue={setFilterBy}/>
        </div>

        {/* Map Section */}
        <div className="relative flex-1">
          <Map 
            properties={properties} 
            mapCenter={mapCenter} 
            mapBounds={mapBounds}
            setMapBounds={setMapBounds} 
          />        
        </div>

        {/* Footer Navigation */}
        <Footer />
      </div>
      }
    </div>
  );
};


