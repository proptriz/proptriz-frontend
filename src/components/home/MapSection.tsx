'use client'; 

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MapPin, Search } from 'lucide-react';
import NigeriaMap from '../map/NigeriaMap';
import { getFeaturedProperties } from '@/data/mockData';
import { useRouter } from 'next/navigation';
import { PropertyType } from '@/types/property';

const MapSection = () => {
  const [isMapReady, setIsMapReady] = useState(false);
  const properties = getFeaturedProperties();
  const router = useRouter();

  // Convert properties to RegionData format for NigeriaMap
  const regionData = properties.reduce((acc: any[], property: PropertyType) => {
    // Group properties by state
    const existingRegion = acc.find(region => region.name === property.state);
    if (existingRegion) {
      existingRegion.properties += 1;
    } else if (property.latitude && property.longitude) {
      acc.push({
        name: property.state,
        properties: 1,
        coordinates: [property.latitude, property.longitude] as [number, number]
      });
    }
    return acc;
  }, []);

  // We can show this initially and then reveal the map
  const handleExploreMap = () => {
    setIsMapReady(true);
  };

  const handleCityClick = (city: string) => {
    router.push(`/search?city=${city}`);
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Find Properties Across Nigeria</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our interactive map to discover properties in different locations. Click on pins to see property details and find your next home or investment.</p>
        </div>
        
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          {/* Map Container */}
          <div className="w-full h-[500px] rounded-lg overflow-hidden mb-6 relative">
            {!isMapReady ? (
              <>
                {/* Placeholder for the map */}
                <div className="w-full h-full bg-[url('https://plus.unsplash.com/premium_photo-1661963079200-b57a9c264a9e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80')] bg-no-repeat bg-cover opacity-60"></div>
                
                {/* Overlay with message */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/90 p-6 rounded-lg shadow-lg text-center max-w-md">
                    <h3 className="font-semibold text-xl mb-3">Interactive Nigeria Map</h3>
                    <p className="text-gray-600 mb-4">
                      Click below to explore our interactive map with property listings across Nigeria.
                      You can zoom, pan, and click on locations to see available properties.
                    </p>
                    <Button className="bg-estate-primary text-white hover:bg-estate-primary/90" onClick={handleExploreMap}>
                      <MapPin className="mr-2 h-4 w-4" /> Explore Map
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <NigeriaMap regions={regionData} onRegionSelect={(region) => router.push(`/search?state=${region}`)} />
            )}
          </div>
          
          {/* Popular Cities */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Cities</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {['Lagos', 'Abuja', 'Port Harcourt', 'Ibadan', 'Kano', 'Enugu'].map(city => (
                <button 
                  key={city} 
                  className="flex items-center justify-center p-3 border border-gray-200 rounded-md hover:bg-gray-50 hover:border-estate-primary transition-colors" 
                  onClick={() => handleCityClick(city)}
                >
                  <MapPin className="h-4 w-4 mr-2 text-estate-primary" />
                  <span>{city}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;
