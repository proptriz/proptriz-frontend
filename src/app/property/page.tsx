'use client';

import React, { useState } from 'react';
// import Layout from '@/components/layout/Layout';
import { Button } from "@/components/ui/button";
import { Grid, List } from 'lucide-react';
import { mockProperties } from '@/data/mockData';
import PropertyFilter from '@/components/property/PropertyFilter';
import PropertyCard from '@/components/property/PropertyCard';

const Properties = () => {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);
  
  const handleFilter = (filters: any) => {
    // In a real app, this would apply the filters to the API call or local data
    console.log('Applied filters:', filters);
    // For now, we'll just use the mock data
    setFilteredProperties(mockProperties);
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Properties in Nigeria</h1>
          <p className="text-gray-600">
            Browse our extensive collection of properties for sale and rent across Nigeria
          </p>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        {/* Filter Section */}
        <PropertyFilter onFilter={handleFilter} />
        
        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h2 className="text-xl font-semibold">
              {filteredProperties.length} Properties Found
            </h2>
            <p className="text-gray-500 text-sm">Showing all available properties</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Sort by:</span>
              <select className="p-2 border border-gray-200 rounded-md focus:ring-estate-primary focus:border-estate-primary">
                <option>Most Recent</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Most Popular</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2 border-l pl-4">
              <button 
                className={`p-2 rounded-md ${view === 'grid' ? 'bg-estate-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setView('grid')}
              >
                <Grid size={20} />
              </button>
              <button 
                className={`p-2 rounded-md ${view === 'list' ? 'bg-estate-primary text-white' : 'text-gray-600 hover:bg-gray-100'}`}
                onClick={() => setView('list')}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </div>
        
        {/* Property Grid */}
        <div className={`grid gap-6 ${view === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
          {filteredProperties.map(property => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
        
        {/* Pagination */}
        <div className="mt-8 flex justify-center">
          <div className="flex space-x-2">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" className="bg-estate-primary text-white border-estate-primary">
              1
            </Button>
            <Button variant="outline">
              2
            </Button>
            <Button variant="outline">
              3
            </Button>
            <Button variant="outline">
              Next
            </Button>
          </div>
        </div>
      </div>      

    </div>
  );
};

export default Properties;
