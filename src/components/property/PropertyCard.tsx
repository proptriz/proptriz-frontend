'use client';

import React from 'react';
import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { MapPin, Home, Building, Bed, Bath, Square } from 'lucide-react';
import { PropertyType } from '../../types/property';

interface PropertyCardProps {
  property: PropertyType;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  // Get the right icon based on property type
  const getPropertyIcon = (type: string) => {
    switch (type) {
      case 'house':
        return <Home className="h-4 w-4" />;
      case 'hotel':
      case 'office':
        return <Building className="h-4 w-4" />;
      default:
        return <Home className="h-4 w-4" />;
    }
  };

  return (
    <div className="property-card group">
      <div className="relative">
        <Link href={`/property/property-detail/${property.id}`}>
          <img 
            src={property.imageUrl} 
            alt={property.title} 
            className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>
        <div className="absolute top-3 left-3">
          <Badge className={`${property.forSale ? 'bg-estate-primary' : 'bg-estate-secondary'}`}>
            {property.forSale ? 'For Sale' : 'For Rent'}
          </Badge>
        </div>
        {property.featured && (
          <div className="absolute top-3 right-3">
            <Badge variant="outline" className="bg-yellow-500 text-white border-yellow-500">
              Featured
            </Badge>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="flex items-center text-estate-secondary mb-2">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">{property.location}</span>
        </div>
        
        <Link href={`/property/${property.id}`}>
          <h3 className="font-semibold text-lg mb-1 hover:text-estate-primary">{property.title}</h3>
        </Link>
        
        <div className="flex items-center space-x-1 mb-3">
          <Badge variant="outline" className="flex items-center space-x-1 text-xs">
            {getPropertyIcon(property.type)}
            <span>{property.type.charAt(0).toUpperCase() + property.type.slice(1)}</span>
          </Badge>
        </div>
        
        <div className="flex justify-between items-center mb-3">
          {property.type !== 'land' && (
            <div className="flex space-x-4 text-sm text-gray-500">
              {property.beds && (
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span>{property.beds}</span>
                </div>
              )}
              {property.baths && (
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span>{property.baths}</span>
                </div>
              )}
            </div>
          )}
          {property.area && (
            <div className="flex items-center text-sm text-gray-500">
              <Square className="h-4 w-4 mr-1" />
              <span>{property.area} m²</span>
            </div>
          )}
        </div>
        
        <div className="flex justify-between items-center border-t pt-3">
          <div>
            <span className="font-bold text-estate-dark text-lg">₦{property.price.toLocaleString()}</span>
            {property.forRent && <span className="text-gray-500 text-sm">/month</span>}
          </div>
          <Link 
            href={`/property/${property.id}`} 
            className="text-estate-primary text-sm font-semibold hover:underline"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
