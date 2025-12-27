
"use client";
import React, { SetStateAction, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import * as L from 'leaflet';
import type { LatLngExpression } from 'leaflet';
import { PropertyType } from '@/types'
import debounce from "lodash.debounce";
import MapMarkerPopup from './MapMarkerPopup';

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
      }, 2000),
    [map, onBoundsChange]
  );

  useEffect(() => {
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
  setMapBounds  = () => {},
}) => {

  return (
    <div className="absolute h-full w-full z-0" style={{ minHeight: 400, height: '100%', overflow: 'hidden' }}>
      
      {/* Map Container */}
      <MapContainer
        zoomControl={false}
        className="w-full flex-1 fixed bottom-0 h-full left-0 right-0"
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
          >
            <Popup 
              closeButton={true}
              minWidth={200}
              maxWidth={250}
              className="custom-popup"
              offset={L.point(0, -3)}
            >
              <MapMarkerPopup property={property} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
