"use client";
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import type { LatLngExpression } from "leaflet";

const pickerIcon = L.icon({
  iconUrl: "/pin.png",
  shadowUrl: "location/location-banner.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface LocationPickerMapProps {
  initialCenter?: LatLngExpression;
  initialZoom?: number;
  onLocationSelect: (lat: number, lng: number) => void;
}

const LocationMarker: React.FC<{
  position: LatLngExpression | null;
  setPosition: (pos: LatLngExpression) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setPosition([lat, lng]);
      onLocationSelect(lat, lng);
    },
  });

  return position ? <Marker position={position} icon={pickerIcon as any} /> : null;
};

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialCenter = [9.082, 8.6753], // Nigeria center by default
  initialZoom = 6,
  onLocationSelect,
}) => {
  const [position, setPosition] = useState<LatLngExpression | null>(null);

  return (
    <div className="relative h-full w-full" style={{ minHeight: 400 }}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom={true}
        zoomControl={false}
        className="w-full h-full rounded-lg border border-gray-200"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
        />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
