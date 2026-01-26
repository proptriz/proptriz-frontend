'use client';

import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
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
import Link from "next/link";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function ExplorePage() {
  const { authUser, isSigningInUser } = useContext(AppContext);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  const [searchInput, setSearchInput] = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [filterBy, setFilterBy] = useState<string>('house');
  const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(null);
  const [zoomLevel, setZoomLevel] = useState<number>(7);

  const renderedMarkerIds = useRef<Set<string>>(new Set());

  // Get user location
  const fetchLocation = async () => {    
    const [lat, lng] = await getUserPosition();
    setMapCenter([lat, lng]);
  };

  useEffect(() => {
    fetchLocation();
    setZoomLevel(7);
  }, [authUser]);

  const onLocateMe = async () => {    
    sessionStorage.removeItem('prevMapCenter');
    sessionStorage.removeItem('prevMapZoom');
    await fetchLocation();
    setZoomLevel(10);
  };

  const fetchProperties = useCallback(
    async (signal: AbortSignal) => {
      try {
        const ne = mapBounds!.getNorthEast();
        const sw = mapBounds!.getSouthWest();

        const params = new URLSearchParams({
          query: appliedSearchQuery ?? "",
          page: "1",
          limit: "50",
          category: filterBy ?? "",
          listed_for: "",
          ne_lat: ne.lat.toString(),
          ne_lng: ne.lng.toString(),
          sw_lat: sw.lat.toString(),
          sw_lng: sw.lng.toString(),
        });

        const response = await propertyService.getAllProperties(
          params.toString(),
          { signal }
        );

        if (!response.success) {
          logger.error("Error fetching properties:", response.message);
          return;
        }

        const newMarkers: PropertyType[] = [];

        for (const property of response.data) {
          if (!renderedMarkerIds.current.has(property.id)) {
            renderedMarkerIds.current.add(property.id);
            newMarkers.push(property);
          }
        }

        if (newMarkers.length) {
          setProperties(prev => [...prev, ...newMarkers]);
        }

        logger.info("New properties added:", newMarkers.length);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          logger.error("Fetch properties failed:", error.message);
        }
      }
    },
    [mapBounds, appliedSearchQuery, filterBy]
  );

  const onSearchClick = useCallback(() => {
    renderedMarkerIds.current.clear();
    setProperties([]);
    setAppliedSearchQuery(searchInput);
  }, [searchInput]);

  useEffect(() => {
    if (!mapBounds) return;

    const controller = new AbortController();
    fetchProperties(controller.signal);

    return () => {
      controller.abort();
    };
  }, [fetchProperties, mapBounds]);

  useEffect(() => {
    renderedMarkerIds.current.clear();
    setProperties([]);
    setAppliedSearchQuery(searchInput);
  }, [filterBy, appliedSearchQuery]);

  useEffect(() => {
    if (searchInput === "" && appliedSearchQuery) {
      renderedMarkerIds.current.clear();
      setProperties([]);
      setAppliedSearchQuery("");
    }
  }, [searchInput, appliedSearchQuery]);


  return (
    <div className="flex-1 flex-col w-full h-screen overflow-hidden">
      {/* Header */}
      <Header />

      {/* Map Section */}
      <div className="relative flex-1">
        <div className="relative top-0 z-50 lg:flex px-6 space-y-4 lg:space-y-0 lg:space-x-3 w-full lg:items-center justify-center pt-4 lg:pt-6 pb-2 bg-transparent">
          <SearchBar
            value={searchInput}
            onChange={setSearchInput}
            onSearch={onSearchClick}
          />
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
                <Link href={"/property/add"}
                  className={`text-white text-sm bg-primary z-10 pointer-events-auto p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 outline-none ring-2 ring-offset-2 ring-secondary focus:text-secondary rounded-md`}
                >
                  List Property
              </Link>
            </div>
            {/* Location Button */}
              <button
                className="bg-primary ms-auto z-10 pointer-events-auto p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary"
                style={{
                  borderRadius: '50%',
                  width: '35px',
                  height: '35px',
                  padding: '0px',
                }}
                onClick={()=>onLocateMe()}
                disabled={isSigningInUser}
              >
                <Image
                  className="mx-auto"
                  src="/icon/my_location.png"
                  width={40}
                  height={40}
                  alt="my location"
                  priority
                  fetchPriority="high"
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


