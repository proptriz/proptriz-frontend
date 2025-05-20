
import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Icon, LatLngExpression, Map as LeafletMap } from 'leaflet';
import { Locate } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Fix Leaflet icon issues
import markerIconUrl from 'leaflet/dist/images/marker-icon.png';
import markerShadowUrl from 'leaflet/dist/images/marker-shadow.png';

// Create custom pin icon
const locationIcon = new Icon({
  iconUrl: markerIconUrl,
  shadowUrl: markerShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: 'location-marker'
});

// Define center of Nigeria
const NIGERIA_CENTER: LatLngExpression = [9.0820, 8.6753];
const DEFAULT_ZOOM = 6;
const USER_LOCATION_ZOOM = 14;

interface LocationPickerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  initialLat?: number;
  initialLng?: number;
}

interface LocationMarkerProps {
  onLocationSelect: (lat: number, lng: number) => void;
  position: [number, number] | null;
  setPosition: React.Dispatch<React.SetStateAction<[number, number] | null>>;
}

// This component is used to update the map view when Find Me is clicked
const MapUpdater = ({ center, zoom }: { center: LatLngExpression, zoom: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  
  return null;
};

const LocationMarker = ({ onLocationSelect, position, setPosition }: LocationMarkerProps) => {
  useMapEvents({
    click(e) {
      const newPosition: [number, number] = [e.latlng.lat, e.latlng.lng];
      setPosition(newPosition);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker 
      position={position} 
      icon={locationIcon as any}
    />
  );
};

const LocationPicker: React.FC<LocationPickerProps> = ({ 
  onLocationSelect,
  initialLat,
  initialLng
}) => {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );
  const [mapCenter, setMapCenter] = useState<LatLngExpression>(
    initialLat && initialLng ? [initialLat, initialLng] : NIGERIA_CENTER
  );
  const [mapZoom, setMapZoom] = useState(initialLat && initialLng ? 12 : DEFAULT_ZOOM);
  const mapRef = useRef<LeafletMap | null>(null);

  // Auto-detect user location on component mount
  useEffect(() => {
    handleFindMe();
  }, []);

  const handleFindMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const newPosition: [number, number] = [latitude, longitude];
          setPosition(newPosition);
          setMapCenter(newPosition);
          setMapZoom(USER_LOCATION_ZOOM);
          onLocationSelect(latitude, longitude);
        },
        () => {
          // Use Nigeria center as fallback
          setMapCenter(NIGERIA_CENTER);
          setMapZoom(DEFAULT_ZOOM);
        }
      );
    }
  };

  return (
    <div style={{ height: '400px', width: '100%', position: 'relative' }}>
      <div className="mb-2 flex justify-between items-center">
        <div className="text-sm bg-white/80 p-2 rounded">
          Click on the map to set the property location
        </div>
        
        <Button 
          type="button" 
          size="sm"
          className="rounded-md bg-blue-500 hover:bg-blue-600 text-white shadow-md flex items-center gap-2"
          onClick={handleFindMe}
          title="Find my location"
        >
          <Locate className="h-4 w-4" />
          <span>Locate Me</span>
        </Button>
      </div>
      
      <MapContainer 
        style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
        scrollWheelZoom={true}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        
        <MapUpdater center={mapCenter} zoom={mapZoom} />
        
        <LocationMarker 
          onLocationSelect={onLocationSelect} 
          position={position}
          setPosition={setPosition}
        />
      </MapContainer>
    </div>
  );
};

export default LocationPicker;
