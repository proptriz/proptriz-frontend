'use client';

import React, { useState } from 'react';
import AgentCard from '@/components/agent/AgentCard';
import { Button } from "@/components/ui/button";
import { Search, Filter, MapPin } from 'lucide-react';
import { mockAgents } from '@/data/mockData';

const Agents = () => {
  const [agents, setAgents] = useState(mockAgents);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would filter the agents based on search term and location
    console.log('Search term:', searchTerm);
    console.log('Location:', location);
    // For now, just use the mock data
    setAgents(mockAgents);
  };
  
  return (
    <div>
      {/* Page Header */}
      <div className="bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-2">Find a Property Agent</h1>
          <p className="text-gray-600">
            Connect with experienced property agents across Nigeria
          </p>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Search Form */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <form onSubmit={handleSearch}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Agent Name</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text" 
                    placeholder="Search by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                  <select 
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 py-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  >
                    <option value="">All Locations</option>
                    <option value="lagos">Lagos</option>
                    <option value="abuja">Abuja</option>
                    <option value="port-harcourt">Port Harcourt</option>
                    <option value="ibadan">Ibadan</option>
                  </select>
                </div>
              </div>
              
              <div className="flex items-end">
                <Button type="submit" className="w-full bg-estate-primary text-white hover:bg-estate-primary/90">
                  <Search className="mr-2 h-4 w-4" /> Find Agents
                </Button>
              </div>
            </div>
          </form>
        </div>
        
        {/* Results Header */}
        <div className="mb-6">
          <h2 className="text-xl font-semibold">
            {agents.length} Agents Found
          </h2>
          <p className="text-gray-500 text-sm">Showing all available property agents</p>
        </div>
        
        {/* Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} />
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
              Next
            </Button>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 bg-gray-50 mt-8">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Are You a Property Agent?</h2>
          <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
            Join PropertyHub Nigeria to expand your reach and connect with potential clients.
            List your properties and grow your business with us.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button className="bg-estate-primary text-white hover:bg-estate-primary/90">
              Register as an Agent
            </Button>
            <Button variant="outline" className="border-estate-primary text-estate-primary">
              Learn More
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Agents;
