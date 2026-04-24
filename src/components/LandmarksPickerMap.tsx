"use client";

import React, { useEffect, useCallback } from "react";
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
import logger from "logger.config.mjs";
import { type LandmarkCategory, LANDMARK_CATEGORIES } from "./PropertyLocationModal";
import { AFRICAN_BOUNDS } from "@/types/property";

// ─────────────────────────────────────────────────────────────────────────────
// EXPORTED TYPE — matches LandmarkResponse from the backend + landmark.api.ts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A landmark that already exists in the global DB.
 * Shape matches LandmarkResponse from landmark.api.ts exactly.
 * Used as "grey pill" context markers in the picker map and as the
 * duplication-guard list inside the Add popup.
 */
export interface ExternalLandmark {
  id:            string;
  name:          string;
  category:      LandmarkCategory;
  lat:           number;
  lng:           number;
  createdBy:     string;
  lastUpdatedBy: string;
  verifiedCount: number;
  /** Straight-line metres from the reference property — set by the backend */
  distanceM?:    number;
  createdAt:     string;
  updatedAt:     string;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKER VARIANTS + COLOURS
// ─────────────────────────────────────────────────────────────────────────────

const COLORS = {
  confirmed: {
    bg: "#1e5f74", text: "#ffffff",
    shadow: "rgba(30,95,116,0.45)", dot: "#a8d8e8", tail: "#1e5f74",
  },
  selected: {
    bg: "#143d4d", text: "#ffffff",
    shadow: "rgba(20,61,77,0.65)", dot: "#f0a500", tail: "#143d4d",
  },
  pending: {
    bg: "#f0a500", text: "#143d4d",
    shadow: "rgba(240,165,0,0.45)", dot: "#fff8e1", tail: "#f0a500",
  },
  /** Global DB landmarks — muted grey, lower visual priority */
  external: {
    bg: "#6b7280", text: "#ffffff",
    shadow: "rgba(107,114,128,0.35)", dot: "#d1d5db", tail: "#6b7280",
  },
} as const;

type MarkerVariant = keyof typeof COLORS;

function truncateName(name: string, max = 14): string {
  return name.length <= max ? name : name.slice(0, max - 1) + "…";
}

function makeLandmarkPinIcon(
  name:    string,
  emoji:   string,
  variant: MarkerVariant,
): L.DivIcon {
  const c         = COLORS[variant];
  const label     = `${emoji} ${truncateName(name)}`;
  const charCount = label.length;
  const pillW     = Math.max(72, charCount * 7.8 + 20);
  const pillH     = 28;
  const tailH     = 9;
  const totalH    = pillH + tailH;
  const fontSize  = charCount > 16 ? "10px" : charCount > 12 ? "11px" : "12px";

  const ringStyle =
    variant === "selected"
      ? `box-shadow:0 0 0 2.5px white,0 6px 18px ${c.shadow};transform:scale(1.12);`
      : variant === "pending"
      ? `box-shadow:0 0 0 2px white,0 4px 14px ${c.shadow};transform:scale(1.06);`
      : `box-shadow:0 3px 10px ${c.shadow};`;

  const opacity = variant === "external" ? "opacity:0.72;" : "";

  const html = `
<div style="
  position:relative;display:inline-flex;flex-direction:column;align-items:center;
  cursor:pointer;filter:drop-shadow(0 3px 6px ${c.shadow});
  transition:transform 0.15s ease,filter 0.15s ease;${opacity}
">
  <div style="
    display:flex;align-items:center;justify-content:center;gap:3px;
    width:${pillW}px;height:${pillH}px;background:${c.bg};
    border-radius:${pillH / 2}px;color:${c.text};
    font-family:'DM Sans','system-ui',sans-serif;font-size:${fontSize};
    font-weight:700;letter-spacing:-0.01em;white-space:nowrap;padding:0 10px;
    ${ringStyle}transition:transform 0.15s ease,box-shadow 0.15s ease;
  ">
    <span style="width:5px;height:5px;border-radius:50%;background:${c.dot};opacity:0.85;flex-shrink:0;"></span>
    ${label}
  </div>
  <div style="width:0;height:0;border-left:${tailH - 2}px solid transparent;
    border-right:${tailH - 2}px solid transparent;
    border-top:${tailH}px solid ${c.tail};margin-top:-1px;"></div>
</div>`;

  return L.divIcon({
    className:  "",
    html,
    iconSize:   [pillW, totalH],
    iconAnchor: [pillW / 2, totalH],
    popupAnchor:[0, -(totalH + 4)],
  });
}

function makePendingPinIcon(): L.DivIcon {
  const size = 36, tailH = 10, totalH = size + tailH;
  const html = `
<div style="display:inline-flex;flex-direction:column;align-items:center;cursor:pointer;
            filter:drop-shadow(0 4px 10px rgba(240,165,0,0.5));">
  <div style="width:${size}px;height:${size}px;border-radius:50%;background:#f0a500;
    display:flex;align-items:center;justify-content:center;
    color:#143d4d;font-size:20px;font-weight:900;
    box-shadow:0 0 0 3px white,0 4px 14px rgba(240,165,0,0.5);transform:scale(1.05);">+</div>
  <div style="width:0;height:0;border-left:8px solid transparent;
    border-right:8px solid transparent;border-top:${tailH}px solid #f0a500;margin-top:-1px;"></div>
</div>`;
  return L.divIcon({
    className: "", html,
    iconSize: [size, totalH], iconAnchor: [size / 2, totalH],
    popupAnchor: [0, -(totalH + 4)],
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// INNER MAP COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const ClickHandler: React.FC<{ onMapClick: (lat: number, lng: number) => void }> = ({ onMapClick }) => {
  useMapEvents({ click(e) { onMapClick(e.latlng.lat, e.latlng.lng); } });
  return null;
};

const MapSearchController: React.FC<{
  query:      string;
  setLoading: (v: boolean) => void;
}> = ({ query, setLoading }) => {
  const map = useMap();
  useEffect(() => {
    if (!query) return;
    const ctrl = new AbortController();
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(
          "https://nominatim.openstreetmap.org/search?" +
          new URLSearchParams({ q: query, format: "json", countrycodes: "ng", bounded: "1", viewbox: "2.5,13.9,14.7,4.0", limit: "1" }),
          { signal: ctrl.signal, headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (data?.length) map.setView([Number(data[0].lat), Number(data[0].lon)], 15, { animate: true });
      } catch (err) {
        if ((err as any).name !== "AbortError") logger.error("Geocoding failed:", err);
      } finally { setLoading(false); }
    })();
    return () => ctrl.abort();
  }, [query, map, setLoading]);
  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Local landmark added in this session (before saving to the DB).
 * Kept separate from ExternalLandmark so pending items never get
 * confused with DB records.
 */
export interface LocalLandmark {
  /** Temporary client-side id (crypto.randomUUID) */
  id:       string;
  name:     string;
  lat:      number;
  lng:      number;
  category: LandmarkCategory;
}

interface LandmarksPickerMapProps {
  initialCenter:     LatLngExpression;
  /** Landmarks added by the user in this editing session */
  localLandmarks:    LocalLandmark[];
  /** Which localLandmark is currently selected (teal ring) */
  selectedId?:       string | null;
  /** Unconfirmed click awaiting the Add popup */
  pendingPin:        { lat: number; lng: number } | null;
  /** Global DB landmarks — shown as muted grey pills */
  externalLandmarks: ExternalLandmark[];
  onMapClick:        (lat: number, lng: number) => void;
  /** Called when a local landmark marker is clicked */
  onMarkerClick?:    (id: string) => void;
  submittedQuery:    string;
  setSearchLoading:  (v: boolean) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const LandmarksPickerMap: React.FC<LandmarksPickerMapProps> = ({
  initialCenter,
  localLandmarks,
  selectedId       = null,
  pendingPin,
  externalLandmarks,
  onMapClick,
  onMarkerClick,
  submittedQuery,
  setSearchLoading,
}) => {
  return (
    <div className="w-full h-full" style={{ minHeight: 300 }}>
      <MapContainer
        center={initialCenter}
        zoom={14}
        scrollWheelZoom
        zoomControl={false}
        maxBounds={AFRICAN_BOUNDS}
        className="w-full h-full"
        style={{ position: "relative", zIndex: 0 }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={19}
        />

        <ClickHandler onMapClick={onMapClick} />
        <MapSearchController query={submittedQuery} setLoading={setSearchLoading} />

        {/* ── Global DB landmarks — grey pills, informational only ── */}
        {externalLandmarks.map((lm) => {
          const cat   = LANDMARK_CATEGORIES.find(c => c.value === lm.category);
          const emoji = cat?.emoji ?? "📍";
          return (
            <Marker
              key={`ext-${lm.id}`}
              position={[lm.lat, lm.lng]}
              icon={makeLandmarkPinIcon(lm.name, emoji, "external")}
              // not interactive — visual context only
              eventHandlers={{}}
            />
          );
        })}

        {/* ── Session landmarks — teal (confirmed) or dark-teal (selected) ── */}
        {localLandmarks.map((lm) => {
          const cat     = LANDMARK_CATEGORIES.find(c => c.value === lm.category);
          const emoji   = cat?.emoji ?? "📍";
          const variant: MarkerVariant = lm.id === selectedId ? "selected" : "confirmed";
          return (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={makeLandmarkPinIcon(lm.name, emoji, variant)}
              eventHandlers={{ click: () => onMarkerClick?.(lm.id) }}
            />
          );
        })}

        {/* ── Pending pin — gold "+" awaiting the Add popup ── */}
        {pendingPin && (
          <Marker
            position={[pendingPin.lat, pendingPin.lng]}
            icon={makePendingPinIcon()}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default LandmarksPickerMap;