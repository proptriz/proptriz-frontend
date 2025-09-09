
"use client";
import React, { useState } from 'react';
import { AppButton as Button } from "@/components/shared/buttons";
import { Select } from "@/components/shared/Input";
import { Slider } from "@/components/shared/Input";
import { TiFilter } from "react-icons/ti";
import { FiSearch } from "react-icons/fi";

interface FilterProps {
  onFilter: (filters: any) => void;
}

const PropertyFilter = ({ onFilter }: FilterProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState({
    location: '',
    type: '',
    priceType: 'all',
    priceRange: [0, 10000000],
    bedrooms: '',
    bathrooms: ''
  });

  const handleFilterChange = (name: string, value: any) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  const locationOptions = [
    { value: "lagos", label: "Lagos" },
    { value: "abuja", label: "Abuja" },
    { value: "portharcourt", label: "Port Harcourt" },
    { value: "ibadan", label: "Ibadan" },
    { value: "kano", label: "Kano" }
  ];

  const propertyTypes = [
    { value: "all", label: "All Types" },
    { value: "house", label: "House" },
    { value: "hotel", label: "Hotel" },
    { value: "apartment", label: "Apartment" },
    { value: "land", label: "Land" },
    { value: "office", label: "Office" },
    { value: "shop", label: "Shop" }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow mb-6">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap -mx-2 space-y-4 md:space-y-0">
          {/* Basic Filters - Always Visible */}
          <div className="flex items-center space-x-2 w-full px-2 md:w-1/3">
            <span className="text-sm text-gray-600">Sort by:</span>
            <select className="p-2 border border-gray-200 rounded-md focus:ring-estate-primary focus:border-estate-primary">
              <option>Most Recent</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Most Popular</option>
            </select>
          </div>
          <div className="w-full px-2 md:w-1/3 mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">All Locations</option>
              {locationOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full px-2 md:w-1/3 mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Property Type</label>
            <select 
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              {propertyTypes.map(type => (
                <option key={type.value} value={type.value}>{type.label}</option>
              ))}
            </select>
          </div>

          <div className="w-full px-2 md:w-1/3 mb-4 md:mb-0">
            <label className="block text-sm font-medium text-gray-700 mb-1">Sale/Rent</label>
            <div className="flex space-x-2">
              <button
                type="button"
                className={`flex-1 p-2 rounded-md border ${
                  filters.priceType === 'all' ? 'bg-estate-primary text-white border-estate-primary' : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => handleFilterChange('priceType', 'all')}
              >
                All
              </button>
              <button
                type="button"
                className={`flex-1 p-2 rounded-md border ${
                  filters.priceType === 'sale' ? 'bg-estate-primary text-white border-estate-primary' : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => handleFilterChange('priceType', 'sale')}
              >
                Buy
              </button>
              <button
                type="button"
                className={`flex-1 p-2 rounded-md border ${
                  filters.priceType === 'rent' ? 'bg-estate-primary text-white border-estate-primary' : 'bg-white text-gray-700 border-gray-300'
                }`}
                onClick={() => handleFilterChange('priceType', 'rent')}
              >
                Rent
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Filters - Toggleable */}
        {isExpanded && (
          <div className="mt-4 border-t pt-4">
            <div className="flex flex-wrap -mx-2">
              <div className="w-full px-2 md:w-1/3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Price Range</label>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 100]}
                    max={100}
                    step={1}
                    className="mt-1"
                  />
                  <div className="flex justify-between mt-2 text-sm">
                    <span>₦0</span>
                    <span>₦10,000,000+</span>
                  </div>
                </div>
              </div>

              <div className="w-full px-2 md:w-1/3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bedrooms</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div className="w-full px-2 md:w-1/3 mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Bathrooms</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between">
          <Button 
            type="button" 
            className="flex items-center text-gray-700 mb-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <TiFilter className="h-4 w-4 mr-2" />
            {isExpanded ? 'Less Filters' : 'More Filters'}
          </Button>
          
          <div className="flex space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              className="border-estate-secondary text-estate-primary"
              onClick={() => setFilters({
                location: '',
                type: '',
                priceType: 'all',
                priceRange: [0, 10000000],
                bedrooms: '',
                bathrooms: ''
              })}
            >
              Reset
            </Button>
            <Button 
              type="submit" 
              className="bg-estate-primary text-white hover:bg-estate-primary/90"
            >
              <FiSearch className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PropertyFilter;
