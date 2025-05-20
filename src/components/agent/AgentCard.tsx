'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Phone, Mail, MapPin, Star } from 'lucide-react';

export interface AgentType {
  id: string | number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  rating: number;
  propertiesCount: number;
  imageUrl: string;
  featured?: boolean;
}

interface AgentCardProps {
  agent: AgentType;
}

const AgentCard = ({ agent }: AgentCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg">
      <div className="relative">
        <Link href={`/agents/${agent.id}`}>
          <div className="h-48 overflow-hidden">
            <img 
              src={agent.imageUrl} 
              alt={agent.name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
        </Link>
        {agent.featured && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-yellow-500 text-white border-yellow-500">
              Featured Agent
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex flex-col items-center text-center mb-4">
          <Link href={`/agents/${agent.id}`}>
            <h3 className="font-semibold text-lg hover:text-estate-primary">{agent.name}</h3>
          </Link>
          <p className="text-gray-600 text-sm">{agent.title}</p>
          <div className="flex items-center mt-2">
            <MapPin className="h-4 w-4 text-estate-secondary mr-1" />
            <span className="text-sm text-gray-600">{agent.location}</span>
          </div>
        </div>
        
        <div className="flex items-center justify-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`h-4 w-4 ${i < agent.rating ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="ml-2 text-sm text-gray-600">({agent.propertiesCount} listings)</span>
        </div>
        
        <div className="border-t pt-3">
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center text-sm text-gray-600">
              <Phone className="h-4 w-4 mr-1" />
              <span>{agent.phone}</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <Link 
              href={`/agents/${agent.id}`} 
              className="w-full bg-estate-primary text-white py-2 rounded text-center hover:bg-estate-primary/90 transition-colors"
            >
              View Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgentCard;
