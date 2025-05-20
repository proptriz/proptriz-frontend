
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';
import { PropertyType } from '@/types/property';
import Link from 'next/link';

// Import markerIcon files
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';
import { Search } from 'lucide-react';

const propertyIcon = new Icon({
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

interface SearchMapProps {
  properties: PropertyType[];
  userLocation: [number, number];
  initialZoom?: number;
  searchLabel?: string;
}

const SearchMap: React.FC<SearchMapProps> = ({ 
  properties, 
  userLocation,
  initialZoom = 13,
  searchLabel="Search properties..."
}) => {
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  const handleMarkerClick = (property: PropertyType) => {
    setSelectedProperty(property);
  };

  return (
    <div className="relative h-full">
      {/* Search bar overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000]">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // handleSearch(searchQuery); // connect to your handler if needed
          }}
          className="flex items-center bg-white shadow-md rounded-lg overflow-hidden"
        >
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder={searchLabel}
              className="w-full pl-10 pr-10 py-2 text-sm border-none outline-none"
              // value={searchQuery}
              // onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-estate-primary text-white text-sm font-medium hover:bg-estate-primary/90"
          >
            Search
          </button>
        </form>
      </div>

      {/* Map Container */}
      <div className="bg-white rounded-lg overflow-hidden shadow-md h-full">
        <MapContainer
          style={{ height: "100%", width: "100%" }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />

          {/* Update map view to user location */}
          <MapUpdater center={userLocation as LatLngExpression} zoom={initialZoom} />

          {properties.map(property => (
            <Marker
              key={property.id}
              position={[property.latitude, property.longitude] as LatLngExpression}
              icon={propertyIcon as any}
              eventHandlers={{ click: () => handleMarkerClick(property) }}
            >
              <Popup>
                <div className="p-2 min-w-[200px]">
                  <div className="mb-2">
                    <img
                      src={property.imageUrl}
                      alt={property.title}
                      className="w-full h-24 object-cover rounded-sm"
                    />
                  </div>
                  <h4 className="font-medium text-estate-primary">{property.title}</h4>
                  <p className="text-sm text-gray-600 mb-1">{property.location}</p>
                  <p className="font-semibold mb-2">₦{property.price.toLocaleString()}</p>
                  <Link
                    href={`/properties/${property.id}`}
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
    </div>
  );

};

export default SearchMap;
