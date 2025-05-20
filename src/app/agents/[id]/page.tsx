'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import PropertyCard from '@/components/property/PropertyCard';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Phone, 
  Mail,
  Facebook,
  Twitter,
  Instagram,
  Star,
  CheckCircle,
  Calendar,
  Send
} from 'lucide-react';
import { AgentType } from '@/components/agent/AgentCard';
import { PropertyType } from '@/types/property';
import { getAgentById, getAgentProperties } from '@/data/mockData';

const AgentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [agent, setAgent] = useState<AgentType | null>(null);
  const [properties, setProperties] = useState<PropertyType[]>([]);
  
  useEffect(() => {
    if (id) {
      // Convert id to string to fix type error
      const foundAgent = getAgentById(id);
      if (foundAgent) {
        setAgent(foundAgent);
        const agentProperties = getAgentProperties(foundAgent.id);
        setProperties(agentProperties);
      }
    }
  }, [id]);
  
  if (!agent) {
    return (
      <div>
        <div className="container mx-auto px-4 py-12 text-center">
          <p className="text-xl">Loading agent details...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container mx-auto px-4">
          <div className="text-sm text-gray-600">
            <Link href="/" className="hover:text-estate-primary">Home</Link> {' > '} 
            <Link href="/agents" className="hover:text-estate-primary">Agents</Link> {' > '} 
            <span className="text-estate-primary">{agent.name}</span>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        {/* Agent Header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="bg-estate-primary h-32"></div>
          <div className="px-6 pb-6">
            <div className="flex flex-col md:flex-row">
              {/* Agent Image */}
              <div className="-mt-16 md:mr-6">
                <img 
                  src={agent.imageUrl} 
                  alt={agent.name} 
                  className="h-32 w-32 rounded-full border-4 border-white object-cover"
                />
              </div>
              
              {/* Agent Info */}
              <div className="mt-4 md:mt-0 md:flex-grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                  <div>
                    <h1 className="text-2xl font-bold">{agent.name}</h1>
                    <p className="text-gray-600">{agent.title}</p>
                    <div className="flex items-center mt-2">
                      <MapPin className="h-4 w-4 text-estate-secondary mr-1" />
                      <span className="text-gray-600">{agent.location}, Nigeria</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 flex flex-wrap gap-2">
                    {agent.featured && (
                      <Badge className="bg-yellow-500">
                        Featured Agent
                      </Badge>
                    )}
                    <Badge className="bg-estate-primary">
                      Verified
                    </Badge>
                  </div>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-4">
                  <div className="flex items-center">
                    <div className="flex mr-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < agent.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-gray-600">({agent.rating})</span>
                  </div>
                  <div className="text-gray-600">
                    <span className="font-medium">{agent.propertiesCount}</span> Properties
                  </div>
                  <div className="text-gray-600">
                    <CheckCircle className="h-4 w-4 text-estate-success inline mr-1" />
                    <span>Active since 2020</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* About Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h2 className="text-xl font-semibold mb-4">About {agent.name}</h2>
              <p className="text-gray-700 mb-4">
                {agent.name} is a highly experienced {agent.title} with a proven track record in the Nigerian real estate market.
                Specializing in properties within {agent.location} and surrounding areas, {agent.name.split(' ')[0]} has helped countless
                clients find their perfect property.
              </p>
              <p className="text-gray-700">
                With {agent.propertiesCount} active listings and a stellar rating of {agent.rating}/5, 
                you can trust {agent.name.split(' ')[0]} to provide professional and reliable service for all your property needs. 
                Whether you're looking to buy, sell, or rent, {agent.name.split(' ')[0]} has the expertise to guide you through the process.
              </p>
            </div>
            
            {/* Agent Properties */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">{agent.name}'s Properties</h2>
                <div className="flex items-center">
                  <span className="text-gray-600 mr-2">Filter by:</span>
                  <select className="border border-gray-300 rounded-md p-1 focus:ring-estate-primary focus:border-estate-primary">
                    <option value="all">All</option>
                    <option value="sale">For Sale</option>
                    <option value="rent">For Rent</option>
                  </select>
                </div>
              </div>
              
              {properties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {properties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 py-4">No properties currently listed by this agent.</p>
              )}
            </div>
            
            {/* Reviews Section */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-6">Client Reviews</h2>
              
              {/* Review stats */}
              <div className="flex flex-col md:flex-row md:items-center mb-8">
                <div className="mb-4 md:mb-0 md:mr-8 text-center">
                  <div className="text-5xl font-bold text-estate-primary">{agent.rating}</div>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-5 w-5 ${i < Math.floor(agent.rating) ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 mt-1">Based on 24 reviews</p>
                </div>
                
                <div className="flex-grow">
                  {[5, 4, 3, 2, 1].map((num) => (
                    <div key={num} className="flex items-center mb-2">
                      <span className="w-8 text-sm text-gray-600">{num} star</span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mx-2">
                        <div 
                          className="bg-yellow-500 h-2 rounded-full" 
                          style={{ width: `${num === 5 ? 70 : num === 4 ? 20 : num === 3 ? 5 : 2}%` }}
                        ></div>
                      </div>
                      <span className="w-8 text-sm text-right text-gray-600">
                        {num === 5 ? 16 : num === 4 ? 5 : num === 3 ? 2 : 1}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Sample Reviews */}
              <div className="space-y-6">
                {[
                  {
                    name: "John Okafor",
                    rating: 5,
                    date: "2 months ago",
                    comment: "Excellent service! Helped me find the perfect home in Ikoyi within my budget. Very professional and responsive."
                  },
                  {
                    name: "Amina Ibrahim",
                    rating: 5,
                    date: "3 months ago",
                    comment: "I was impressed with the knowledge and dedication shown throughout our property search. Would highly recommend!"
                  },
                  {
                    name: "David Adeyemi",
                    rating: 4,
                    date: "5 months ago",
                    comment: "Great experience overall. The agent was thorough and helped negotiate a fair price for my new office space."
                  }
                ].map((review, index) => (
                  <div key={index} className={`${index !== 0 ? 'border-t pt-6' : ''}`}>
                    <div className="flex justify-between mb-2">
                      <div className="font-semibold">{review.name}</div>
                      <div className="text-gray-500 text-sm flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {review.date}
                      </div>
                    </div>
                    <div className="flex mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex justify-center">
                <Button variant="outline" className="border-estate-primary text-estate-primary">
                  See More Reviews
                </Button>
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Card */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Contact {agent.name.split(' ')[0]}</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-start">
                  <Phone className="h-5 w-5 text-estate-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{agent.phone}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Mail className="h-5 w-5 text-estate-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{agent.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-estate-primary mr-3 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Location</p>
                    <p className="font-medium">{agent.location}, Nigeria</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mb-6">
                <a href="#" className="text-gray-600 hover:text-estate-primary">
                  <Facebook />
                </a>
                <a href="#" className="text-gray-600 hover:text-estate-primary">
                  <Twitter />
                </a>
                <a href="#" className="text-gray-600 hover:text-estate-primary">
                  <Instagram />
                </a>
              </div>
              
              <Button className="w-full bg-estate-primary text-white hover:bg-estate-primary/90">
                Call Now
              </Button>
            </div>
            
            {/* Message Form */}
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">Send a Message</h2>
              <form>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Your full name"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Your email address"
                  />
                </div>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input 
                    type="tel" 
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Your phone number"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                  <textarea 
                    rows={3}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="I'm interested in your properties..."
                  />
                </div>
                <Button className="w-full bg-estate-secondary text-white hover:bg-estate-secondary/90">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentDetail;
