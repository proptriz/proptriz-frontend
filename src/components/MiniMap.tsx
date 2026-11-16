"use client";

import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

const GOLD_PIN_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
  <path d="M15 0C7.268 0 1 6.268 1 14c0 9.333 14 26 14 26S29 23.333 29 14C29 6.268 22.732 0 15 0z"
        fill="#f0a500" stroke="#143d4d" stroke-width="1.5"/>
  <circle cx="15" cy="14" r="7" fill="white" opacity="0.9"/>
  <circle cx="15" cy="14" r="3.5" fill="#143d4d"/>
</svg>
`;

const goldPinIcon = L.divIcon({
  html: GOLD_PIN_SVG,
  iconSize: [30, 40],
  iconAnchor: [15, 40], // tip of the pin sits on the coordinate
  className: "",
});

/** Keeps the view on the pin when the coordinates change, and fixes sizing inside modals / tabs. */
function Recenter({ lat, lng, zoom }: { lat: number; lng: number; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], zoom, { animate: false });
    const id = setTimeout(() => map.invalidateSize(), 0);
    return () => clearTimeout(id);
  }, [map, lat, lng, zoom]);
  return null;
}

export interface MiniMapProps {
  lat: number;
  lng: number;
  /** Street level by default. */
  zoom?: number;
  /** Hide the pin (e.g. before the user has chosen a location). */
  showPin?: boolean;
  className?: string;
}

/**
 * Small, static map centred on one pin. It never takes pointer or keyboard input,
 * so the element wrapping it (a button or a link) receives every tap.
 * Load it with next/dynamic and `ssr: false`: Leaflet needs `window`.
 */
export default function MiniMap({ lat, lng, zoom = 16, showPin = true, className = "" }: MiniMapProps) {
  return (
    <div
      className={`relative z-0 h-full w-full ${className}`}
      style={{ isolation: "isolate", pointerEvents: "none" }} // Leaflet's z-indexes stay inside this box
      aria-hidden="true"
    >
      <MapContainer
        center={[lat, lng]}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        dragging={false}
        scrollWheelZoom={false}
        doubleClickZoom={false}
        touchZoom={false}
        boxZoom={false}
        keyboard={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" maxZoom={19} />
        {showPin && <Marker position={[lat, lng]} icon={goldPinIcon} interactive={false} keyboard={false} />}
        <Recenter lat={lat} lng={lng} zoom={zoom} />
      </MapContainer>
      {/* OpenStreetMap asks for visible credit; the Leaflet control is off because it would steal taps */}
      <span
        className="absolute bottom-0 left-0 z-[500] bg-white/80 px-1.5 py-[1px] text-[9px] leading-tight text-[#4b5563]"
      >
        © OpenStreetMap
      </span>
    </div>
  );
}
