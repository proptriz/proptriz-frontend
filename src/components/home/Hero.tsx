
import React from 'react';
import { Button } from "@/components/ui/button";
import { Search, Home, Building, MapPin } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-[500px] bg-gradient-to-r from-estate-dark to-estate-primary overflow-hidden">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center z-0" 
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1582407947304-fd86f028f716?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2400&q=80)',
          filter: 'brightness(0.4)'
        }}
      />
      
      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 h-full flex flex-col justify-center">
        <div className="max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Find Your Perfect Property in Nigeria
          </h1>
          <p className="text-lg md:text-xl text-white/90 mb-8">
            Search from thousands of properties for sale and rent across Nigeria. 
            Connect with verified agents to help you with your property journey.
          </p>
          
          {/* Search Form */}
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-estate-primary focus:border-estate-primary">
                    <option value="">Select Location</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="portharcourt">Port Harcourt</option>
                    <option value="ibadan">Ibadan</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <Home className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select className="w-full pl-10 py-3 bg-gray-50 border border-gray-200 rounded-md focus:ring-estate-primary focus:border-estate-primary">
                    <option value="">Property Type</option>
                    <option value="house">House</option>
                    <option value="hotel">Hotel</option>
                    <option value="land">Land</option>
                    <option value="office">Office</option>
                    <option value="shop">Shop</option>
                  </select>
                </div>
              </div>
              
              <div className="flex-1 flex">
                <Button className="w-full bg-estate-primary text-white hover:bg-estate-primary/90">
                  <Search className="mr-2 h-4 w-4" /> Search
                </Button>
              </div>
            </div>
            
            {/* Quick selections */}
            <div className="flex flex-wrap mt-4 gap-2">
              <Button variant="outline" size="sm" className="bg-white">
                <Home className="mr-1 h-3 w-3" /> Houses
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                <Building className="mr-1 h-3 w-3" /> Apartments
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                Popular in Lagos
              </Button>
              <Button variant="outline" size="sm" className="bg-white">
                New Listings
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
