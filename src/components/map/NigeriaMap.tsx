
import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression } from 'leaflet';

// Import markerIcon files
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

const stateIcon = new Icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Define center of Nigeria
const NIGERIA_CENTER: LatLngExpression = [9.0820, 8.6753];
const DEFAULT_ZOOM = 6;

interface RegionData {
  name: string;
  properties: number;
  coordinates: [number, number];
}

interface NigeriaMapProps {
  selectedRegion?: string | null;
  onRegionSelect?: (region: string) => void;
  regions?: RegionData[];
}

const NigeriaMap: React.FC<NigeriaMapProps> = ({ 
  selectedRegion = null, 
  onRegionSelect,
  regions = [] 
}) => {
  const [activeRegion, setActiveRegion] = useState<string | null>(selectedRegion);
  
  // Default regions if none provided
  const defaultRegions = [
    { name: 'Lagos', properties: 145, coordinates: [6.5244, 3.3792] as [number, number] },
    { name: 'Abuja', properties: 98, coordinates: [9.0765, 7.3986] as [number, number] },
    { name: 'Port Harcourt', properties: 72, coordinates: [4.8156, 7.0498] as [number, number] },
    { name: 'Ibadan', properties: 56, coordinates: [7.3775, 3.9470] as [number, number] },
    { name: 'Kano', properties: 43, coordinates: [12.0022, 8.5920] as [number, number] },
    { name: 'Enugu', properties: 38, coordinates: [6.4431, 7.5022] as [number, number] }
  ];
  
  // If no regions are provided, use default regions
  const mapRegions = regions.length > 0 ? regions : defaultRegions;
  
  const handleRegionClick = (regionName: string) => {
    setActiveRegion(regionName);
    if (onRegionSelect) {
      onRegionSelect(regionName);
    }
  };
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md h-full">
      <div className="p-4 bg-gray-50 border-b">
        <h3 className="font-semibold text-lg">Properties Across Nigeria</h3>
        <p className="text-gray-500 text-sm">
          Click on a state to view available properties
        </p>
      </div>
      
      <div className="h-[500px] relative">
        <MapContainer 
          style={{ 
            height: "100%", 
            width: "100%", 
            borderRadius: "0rem" 
          }}
          scrollWheelZoom={true}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {mapRegions.map(region => (
            <Marker
              key={region.name}
              position={region.coordinates}
              icon={stateIcon as any}
              eventHandlers={{
                click: () => handleRegionClick(region.name),
              }}
            >
              <Popup>
                <div className="p-1">
                  <h4 className="font-medium">{region.name}</h4>
                  <p className="text-sm text-gray-600">
                    {region.properties} {region.properties === 1 ? 'property' : 'properties'}
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default NigeriaMap;
