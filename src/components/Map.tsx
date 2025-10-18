
"use client";
import React, { SetStateAction, useEffect, useMemo, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { PropertyType } from '@/types'
import Link from 'next/link';
import debounce from "lodash.debounce";

const propertyIcon = L.icon({
  iconUrl: '/pin.png',
  // shadowUrl: '/pin.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const locationIcon = L.icon({
  iconUrl: '/location/location-banner.png',
  iconSize: [35, 41],
  iconAnchor: [12, 41],
});

interface MapUpdaterProps {
  center: LatLngExpression;
  zoom: number;
}

// This component updates the map view
const MapUpdater = ({ center, zoom }: MapUpdaterProps) => {
  const map = useMap();
  
  useEffect(() => {
    // ✅ Restore state on mount
    const savedCenter = sessionStorage.getItem('prevMapCenter');
    const savedZoom = sessionStorage.getItem('prevMapZoom');
    
    if (savedCenter && savedZoom) {
      const [lat, lng] = JSON.parse(savedCenter);
      map.setView([lat, lng], parseInt(savedZoom, 10));
      
    } else {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  
  return null;
};

interface MapBoundsUpdaterProps {
  onBoundsChange: (bounds: L.LatLngBounds) => void;
}

const MapBoundsUpdater: React.FC<MapBoundsUpdaterProps> = ({ onBoundsChange }) => {
  const map = useMap();

  const debouncedUpdateBounds = useMemo(
    () =>
      debounce(() => {
        const currentCenter = map.getCenter();
        const currentZoom = map.getZoom();

        // Persist into sessionStorage
        sessionStorage.setItem(
          'prevMapCenter',
          JSON.stringify([currentCenter.lat, currentCenter.lng])
        );
        sessionStorage.setItem('prevMapZoom', currentZoom.toString());

        const bounds = map.getBounds();
        onBoundsChange(bounds);
      }, 500),
    [map, onBoundsChange]
  );

  React.useEffect(() => {
    // listen to map events
    map.on("moveend", debouncedUpdateBounds);
    map.on("zoomend", debouncedUpdateBounds);

    // trigger on mount
    debouncedUpdateBounds();

    return () => {
      map.off("moveend", debouncedUpdateBounds);
      map.off("zoomend", debouncedUpdateBounds);
      debouncedUpdateBounds.cancel(); // ✅ cleanup debounce
    };
  }, [map, debouncedUpdateBounds]);

  return null;
};

interface MapProps {
  properties: PropertyType[];
  mapCenter: [number, number] | null;
  initialZoom?: number;
  mapBounds?: L.LatLngBounds | null;
  setMapBounds?: React.Dispatch<SetStateAction<L.LatLngBounds | null>>;
  searchLabel?: string;
}

const Map: React.FC<MapProps> = ({ 
  properties, 
  mapCenter,
  initialZoom = 13,
  mapBounds = null,
  setMapBounds  = () => {},
  searchLabel="Search properties..."
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);
  // const [mapBounds, setMapBounds] = useState<L.LatLngBounds | null>(null);

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

        {/* Capture bounds */}
        {mapCenter && <MapBoundsUpdater onBoundsChange={setMapBounds} />}

        {/* User Location Marker */}
        {mapCenter && (
          <Marker position={mapCenter as LatLngExpression} icon={locationIcon as any} />
        )}

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
                  href={`/property/details/${property.id}`}
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
