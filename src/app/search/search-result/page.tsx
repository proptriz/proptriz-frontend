'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import PropertyFilter from '@/components/property/PropertyFilter';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Grid, List, Map as MapIcon } from 'lucide-react';
import { mockAgents, mockProperties } from '@/data/mockData';
import { PropertyType } from '@/types/property';
import SearchMap from '@/components/map/SearchMap';
import AgentCard from '@/components/agent/AgentCard';

const SearchResults = () => {
  const searchParams = useSearchParams();

  const [view, setView] = useState<'grid' | 'list' | 'map'>('grid');
  const [activeTab, setActiveTab] = useState<'properties' | 'agents'>('properties');
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(mockProperties);
  const [agents, setAgents] = useState(mockAgents);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserCoordinates([latitude, longitude]);
        },
        () => {
          setUserCoordinates([9.0820, 8.6753]); // Nigeria fallback
        }
      );
    }
  }, []);

  // Filter from URL
  useEffect(() => {
    const query = searchParams.get('query') || '';
    const type = searchParams.get('type') || '';
    const city = searchParams.get('city') || '';

    console.log(`Searching for: ${query} in ${city}, type: ${type}`);

    setFilteredProperties(mockProperties);
  }, [searchParams]);

  const handleFilter = (filters: any) => {
    console.log('Applied filters:', filters);
    setFilteredProperties(mockProperties); // Would filter based on real data
  };

  return (
    <div>
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          <p className="text-gray-600">Showing results for your search criteria</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <Tabs
          defaultValue="properties"
          className=""
          onValueChange={(value) => setActiveTab(value as 'properties' | 'agents')}
        >
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="agents">Agents</TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Filter */}
        <PropertyFilter onFilter={handleFilter} />

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">
              {filteredProperties.length} {activeTab} Found
            </h2>
            <p className="text-gray-500 text-sm">Showing available {activeTab} in your area</p>
          </div>

          <div className="flex items-center space-x-4">
            {view !== 'map' && <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="p-2 border border-gray-200 rounded-md focus:ring-estate-primary focus:border-estate-primary">
                <option>Most Recent</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>}

            <div className="flex items-center space-x-2 border-l pl-4 ">
              <button
                className={`p-2 rounded-md text-gray-600 ${view === 'map' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setView('map')}
              >
                <MapIcon size={20} />
              </button>
              <button
                className={`p-2 rounded-md text-gray-600 ${view === 'grid' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setView('grid')}
              >
                <Grid size={20} />
              </button>
              <button
                className={`p-2 rounded-md text-gray-600 ${view === 'list' ? 'bg-gray-100' : 'hover:bg-gray-100'}`}
                onClick={() => setView('list')}
              >
                <List size={20} />
              </button>              
            </div>
          </div>
        </div>

        {/* View Switcher */}
        {view !== 'map' ? (
          <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {activeTab !== 'agents'? filteredProperties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            )) : agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
          ))}
          </div>
        ) : (
          <div className="flex-1 h-screen relative z-0">
            {userCoordinates && (
              <SearchMap
                properties={filteredProperties}
                userLocation={userCoordinates}
                searchLabel={`Search ${activeTab}...`}
              />
            )}
          </div>
        )}

        {/* Pagination */}
        {view !== 'map' && (
          <div className="mt-8 flex justify-center">
            <div className="flex space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-estate-primary text-white border-estate-primary">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <Button variant="outline">Next</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchResults;
