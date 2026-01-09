"use client";

import React, { SetStateAction, useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMapEvents,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import type { LatLngExpression } from "leaflet";
import logger from "../../logger.config.mjs"

const pickerIcon = L.icon({
  iconUrl: "/pin.png",
  shadowUrl: "location/location-banner.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const NIGERIA_BOUNDS: [[number, number], [number, number]] = [
  [4.0, 2.5],
  [13.9, 14.7],
];

interface LocationPickerMapProps {
  initialCenter?: LatLngExpression;
  initialZoom?: number;
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
  submittedQuery: string;
  setSearchLoading: React.Dispatch<SetStateAction<boolean>>;
}

/* ---------------- Marker + Reverse Geocode ---------------- */

const LocationMarker: React.FC<{
  position: LatLngExpression;
  setPosition: (pos: LatLngExpression) => void;
  onLocationSelect: (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
}> = ({ position, setPosition, onLocationSelect, onAddressResolved }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;

      const [currLat, currLng] = position as [number, number];

      // 🚫 Prevent infinite loop
      if (
        Math.abs(currLat - lat) < 0.000001 &&
        Math.abs(currLng - lng) < 0.000001
      ) {
        return;
      }

      setPosition([lat, lng]);
      onLocationSelect(lat, lng);

      // Reverse geocode (safe)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?` +
            new URLSearchParams({
              lat: lat.toString(),
              lon: lng.toString(),
              format: "json",
            })
        );

        const data = await res.json();
        if (data?.display_name ) {
          logger.info("resolved location: ", data.display_name)
          // onAddressResolved(data.display_name);
        }
      } catch (err) {
        logger.error("Reverse geocoding failed", err);
      }
    },
  });

  return <Marker position={position} icon={pickerIcon as any} />;
};

/* ---------------- Forward Geocoding Controller ---------------- */

const MapSearchController: React.FC<{
  query: string;
  setLoading: (v: boolean) => void;
  onResult: (lat: number, lng: number) => void;
}> = ({ query, setLoading, onResult }) => {
  const map = useMap();

  useEffect(() => {
    if (!query) return;

    const controller = new AbortController();

    const geocode = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              q: query,
              format: "json",
              countrycodes: "ng",
              bounded: "1",
              viewbox: "2.5,13.9,14.7,4.0",
              limit: "1",
            }),
          {
            signal: controller.signal,
            headers: {
              "Accept-Language": "en",
            },
          }
        );

        const data = await res.json();
        if (!data?.length) return;

        const lat = Number(data[0].lat);
        const lng = Number(data[0].lon);

        map.setView([lat, lng], 13, { animate: true });
        onResult(lat, lng);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          logger.error("Geocoding failed", err);
        }
      } finally {
        setLoading(false);
      }
    };

    geocode();
    return () => controller.abort();
  }, [query, map]);

  return null;
};


/* ---------------- Main Component ---------------- */

const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialCenter = [9.082, 8.6753],
  initialZoom = 6,
  onLocationSelect,
  onAddressResolved,
  submittedQuery,
  setSearchLoading
}) => {
  const [position, setPosition] = useState<LatLngExpression>(initialCenter);
  

  return (
    <div className="absolute h-full w-full space-y-3" style={{ minHeight: 400 }}>

      {/* Map */}
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        zoomControl={false}
        maxBounds={NIGERIA_BOUNDS}
        className="w-full flex-1 fixed bottom-0 h-full left-0 right-0"
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        <MapSearchController
          query={submittedQuery}
          setLoading={setSearchLoading}
          onResult={(lat, lng) => {
            setPosition([lat, lng]);
            onLocationSelect(lat, lng);
          }}
        />

        <LocationMarker
          position={position}
          setPosition={setPosition}
          onLocationSelect={onLocationSelect}
          onAddressResolved={onAddressResolved}
        />
      </MapContainer>
    </div>
  );
};

export default LocationPickerMap;
