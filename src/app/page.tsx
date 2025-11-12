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
import { PropertyType } from "@/types";
import getUserPosition from "@/utils/getUserPosition";
import { AppContext } from "@/context/AppContextProvider";
import logger from "../../logger.config.mjs"

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ExplorePage() {
  const { authUser, isSigningInUser, autoLoginUser, registerUser } = useContext(AppContext);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ searchQuery, setSearchQuery ] = useState<string>('');
  const [ filterBy, setFilterBy ] = useState<string>('house');
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
    setLoading(true);
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

  }, [filterBy, mapBounds]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      fetchProperties();
    }
  }, [searchQuery]);

  return (
    <div className="flex flex-col w-full h-screen">
        {/* Header */}
        <header className="p-6 flex justify-between items-center w-full z-50 shadow-md">        
        
          {/* Centered Banner */}
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
            {/* Add Seller Button */}
            <div className="pointer-events-auto">
              <Link href={`/seller/registration`}>
                <button
                  style={{
                    height: '55px',
                    fontSize: '20px',
                    borderRadius: '10px',
                    color: '#ffc153',
                    paddingLeft: '45px',
                    paddingRight: '45px',
                  }}
                  disabled={isSigningInUser}
                >
                  Agent
                </button>
              </Link>
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


