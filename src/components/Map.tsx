
"use client";
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { PropertyType } from '@/types'
import Link from 'next/link';

const propertyIcon = L.icon({
  iconUrl: 'pin.png',
  shadowUrl: 'location/location-banner.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapUpdaterProps {
  center: LatLngExpression;
  zoom: number;
}

// This component updates the map view
const MapUpdater = ({ center, zoom }: MapUpdaterProps) => {
  const map = useMap();
  
  React.useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

interface MapProps {
  properties: PropertyType[];
  mapCenter: [number, number] | null;
  initialZoom?: number;
  searchLabel?: string;
}

const Map: React.FC<MapProps> = ({ 
  properties, 
  mapCenter,
  initialZoom = 13,
  searchLabel="Search properties..."
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  const handleMarkerClick = (property: PropertyType) => {
    setSelectedProperty(property);
  };

  return (
    <div className="relative h-full w-full" style={{ minHeight: 400, height: '100%', overflow: 'hidden' }}>
      
      {/* Map Container */}
      <MapContainer
        zoomControl={false}
        className="w-full flex-1 fixed bottom-0 h-[calc(100vh-80.19px)] left-0 right-0 z-[0]"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* Update map view to user location */}
        {mapCenter && <MapUpdater center={mapCenter as LatLngExpression} zoom={initialZoom} />}
        {properties.map(property => (
          <Marker
            key={property.id}
            position={[property.latitude, property.longitude]  as LatLngExpression}
            icon={propertyIcon as any}
            eventHandlers={{ click: () => handleMarkerClick(property) }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <div className="mb-2">
                  <img
                    src={property.banner}
                    alt={property.title}
                    className="w-full h-24 object-cover rounded-sm"
                  />
                </div>
                <h4 className="font-medium text-estate-primary">{property.title}</h4>
                <p className="text-sm text-gray-600 mb-1">{property.address}</p>
                <p className="font-semibold mb-2">₦{property.price.toLocaleString()}</p>
                <Link
                  href={`/property/details/${'2'}`}
                  className="text-sm text-estate-primary hover:underline"
                >
                  View Details
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
