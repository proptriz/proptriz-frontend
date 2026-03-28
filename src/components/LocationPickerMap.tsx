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
import logger from "../../logger.config.mjs";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Gold-and-teal custom pin rendered as an inline SVG DivIcon.
 * Replaces the old /pin.png dependency that would 404 in many environments.
 */
const GOLD_PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
  <!-- Teardrop shape -->
  <path d="M15 0C7.268 0 1 6.268 1 14c0 9.333 14 26 14 26S29 23.333 29 14C29 6.268 22.732 0 15 0z"
        fill="#f0a500" stroke="#143d4d" stroke-width="1.5"/>
  <!-- Inner circle highlight -->
  <circle cx="15" cy="14" r="7" fill="white" opacity="0.9"/>
  <!-- Center dot -->
  <circle cx="15" cy="14" r="3.5" fill="#143d4d"/>
</svg>
`;

const goldPinIcon = L.divIcon({
  html:      GOLD_PIN_SVG,
  iconSize:  [30, 40],
  iconAnchor:[15, 40],   // tip of pin touches the clicked point
  className: "",         // clear leaflet's default white-box class
});

// ─── Nigeria bounding box ─────────────────────────────────────────────────────
const NIGERIA_BOUNDS: [[number, number], [number, number]] = [
  [4.0, 2.5],
  [13.9, 14.7],
];

// ─── Props ────────────────────────────────────────────────────────────────────
interface LocationPickerMapProps {
  initialCenter?:     LatLngExpression;
  initialZoom?:       number;
  onLocationSelect:   (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
  submittedQuery:     string;
  setSearchLoading:   React.Dispatch<SetStateAction<boolean>>;
}

// ─── Marker with reverse geocoding ───────────────────────────────────────────
const LocationMarker: React.FC<{
  position:          LatLngExpression;
  setPosition:       (pos: LatLngExpression) => void;
  onLocationSelect:  (lat: number, lng: number) => void;
  onAddressResolved?: (address: string) => void;
}> = ({ position, setPosition, onLocationSelect, onAddressResolved }) => {
  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      const [currLat, currLng] = position as [number, number];

      // Prevent re-triggering at the same coordinates
      if (
        Math.abs(currLat - lat) < 0.000001 &&
        Math.abs(currLng - lng) < 0.000001
      ) return;

      setPosition([lat, lng]);
      onLocationSelect(lat, lng);

      // Reverse geocode — resolve human-readable address
      try {
        const res = await fetch(
          "https://nominatim.openstreetmap.org/reverse?" +
            new URLSearchParams({
              lat:    lat.toString(),
              lon:    lng.toString(),
              format: "json",
            })
        );
        const data = await res.json();
        if (data?.display_name) {
          logger.info("Resolved location:", data.display_name);
          onAddressResolved?.(data.display_name);   // ← was commented out; now fixed
        }
      } catch (err) {
        logger.error("Reverse geocoding failed:", err);
      }
    },
  });

  return <Marker position={position} icon={goldPinIcon} />;
};

// ─── Forward geocoding controller ─────────────────────────────────────────────
const MapSearchController: React.FC<{
  query:     string;
  setLoading:(v: boolean) => void;
  onResult:  (lat: number, lng: number) => void;
}> = ({ query, setLoading, onResult }) => {
  const map = useMap();

  useEffect(() => {
    if (!query) return;
    const controller = new AbortController();

    const geocode = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://nominatim.openstreetmap.org/search?" +
            new URLSearchParams({
              q:           query,
              format:      "json",
              countrycodes:"ng",
              bounded:     "1",
              viewbox:     "2.5,13.9,14.7,4.0",
              limit:       "1",
            }),
          {
            signal:  controller.signal,
            headers: { "Accept-Language": "en" },
          }
        );

        const data = await res.json();
        if (!data?.length) return;

        const lat = Number(data[0].lat);
        const lng = Number(data[0].lon);
        map.setView([lat, lng], 14, { animate: true });
        onResult(lat, lng);
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          logger.error("Geocoding failed:", err);
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

// ─── Main component ───────────────────────────────────────────────────────────
const LocationPickerMap: React.FC<LocationPickerMapProps> = ({
  initialCenter = [9.082, 8.6753],
  initialZoom   = 6,
  onLocationSelect,
  onAddressResolved,
  submittedQuery,
  setSearchLoading,
}) => {
  const [position, setPosition] = useState<LatLngExpression>(initialCenter);

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <MapContainer
        center={initialCenter}
        zoom={initialZoom}
        scrollWheelZoom
        zoomControl={false}
        maxBounds={NIGERIA_BOUNDS}
        className="w-full h-full"
        style={{ position: "relative", zIndex: 0 }}
      >
        
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
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