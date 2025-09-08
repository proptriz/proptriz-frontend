"use client";

import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import propertyService from "@/services/propertyApi";
import { PropertyType } from "@/types";

// Marker icon for other locations
const customIcon = new L.Icon({
  iconUrl: '/pin.png',
  iconSize: [20, 36], // Size of the icon
  iconAnchor: [12, 41], // Anchor point of the icon
  popupAnchor: [1, -34], // Popup position relative to the icon
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Default marker icon for center
const defaultIcon = new L.Icon.Default();
interface PropertyListingProps {
  properties: PropertyType[];
}

const Map: React.FC<PropertyListingProps> = ({ properties }) => {
  // const [properties, setProperties] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);


  const center: [number, number] = [9.0820, 8.6753]; // Nigeria coordinates
  const markers = [
    { position: [6.5244, 3.3792], price: "200K" }, // Lagos
    { position: [9.0579, 7.4951], price: "210K" }, // Abuja
    { position: [7.3775, 3.9470], price: "300K" }  // Ibadan
  ];

  return (
    <div className="relative flex-1 h-full w-full" style={{ height: '100vh', width: '100%' }}>
        <MapContainer
            center={center}
            zoom={6}
            style={{ height: "100%", width: "100%", zIndex: 5 }}
        >
            <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Center marker */}
            <Marker position={center} icon={defaultIcon}>
              <Popup>Your locaion</Popup>
            </Marker>

            {properties.map((marker, idx) => (
            <Marker key={idx} position={[marker.map_location?.coordinates[0], marker.map_location?.coordinates[1]] as [number, number]} icon={customIcon}>
                <Popup>{marker.price}</Popup>
            </Marker>
            ))}
        </MapContainer>
    </div>

  );
};

export default Map;
