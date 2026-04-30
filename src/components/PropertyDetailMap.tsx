"use client";

import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  MapContainer, TileLayer, Marker, Popup,
  Polyline, useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import { AFRICAN_BOUNDS, PropertyType } from "@/types/property";
import { LANDMARK_CATEGORIES } from "@/components/PropertyLocationModal";
import type { ExternalLandmark } from "@/components/LandmarksPickerMap";
import logger from "logger.config.mjs";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An ExternalLandmark enriched with the road-distance data from the backend.
 * `distanceM` comes directly from the backend's Haversine calculation in
 * LandmarkService.findNearProperty() — no client-side computation needed.
 */
export type LandmarkWithDistance = ExternalLandmark & {
  /** Straight-line distance in metres returned by GET /api/landmarks/near */
  distanceM: number;
};

interface OsrmRoute {
  landmarkId: string;
  coords:     [number, number][];
  distanceM:  number;
  durationS:  number;
  midIdx:     number;
}

// ─────────────────────────────────────────────────────────────────────────────
// OSRM ROUTING
// Uses the public OSRM demo server (OpenStreetMap road network).
// For production: swap OSRM_BASE for a self-hosted instance.
// ─────────────────────────────────────────────────────────────────────────────

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving";

function decodePolyline(encoded: string): [number, number][] {
  const coords: [number, number][] = [];
  let idx = 0, lat = 0, lng = 0;
  while (idx < encoded.length) {
    let shift = 0, result = 0, byte: number;
    do { byte = encoded.charCodeAt(idx++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lat += (result & 1) ? ~(result >> 1) : (result >> 1);
    shift = 0; result = 0;
    do { byte = encoded.charCodeAt(idx++) - 63; result |= (byte & 0x1f) << shift; shift += 5; } while (byte >= 0x20);
    lng += (result & 1) ? ~(result >> 1) : (result >> 1);
    coords.push([lat / 1e5, lng / 1e5]);
  }
  return coords;
}

async function fetchOsrmRoute(
  fromLat: number, fromLng: number,
  toLat: number,   toLng: number,
  signal: AbortSignal,
): Promise<{ coords: [number, number][]; distanceM: number; durationS: number } | null> {
  const url = `${OSRM_BASE}/${fromLng},${fromLat};${toLng},${toLat}?overview=full&geometries=polyline`;
  try {
    const res  = await fetch(url, { signal });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.code !== "Ok" || !data.routes?.length) return null;
    const route = data.routes[0];
    return {
      coords:    decodePolyline(route.geometry),
      distanceM: Math.round(route.distance),
      durationS: Math.round(route.duration),
    };
  } catch (err: any) {
    if (err.name !== "AbortError") logger.error("OSRM route error:", err);
    return null;
  }
}

function fmtDist(m: number): string {
  return m < 1000 ? `${m} m` : `${(m / 1000).toFixed(1)} km`;
}

function fmtDuration(s: number): string {
  const m = Math.round(s / 60);
  return m < 1 ? "< 1 min" : `${m} min`;
}

// ─────────────────────────────────────────────────────────────────────────────
// MARKER FACTORIES
// ─────────────────────────────────────────────────────────────────────────────

function makePropertyPin(listedFor: string): L.DivIcon {
  const isRent = listedFor !== "sale";
  const bg     = isRent ? "#1e5f74" : "#f0a500";
  const textC  = isRent ? "#ffffff" : "#143d4d";
  const shadow = isRent ? "rgba(30,95,116,0.55)" : "rgba(240,165,0,0.55)";
  const dot    = isRent ? "#a8d8e8" : "#fff8e1";
  const html = `
<div style="display:inline-flex;flex-direction:column;align-items:center;
            filter:drop-shadow(0 6px 16px ${shadow});">
  <div style="display:flex;align-items:center;justify-content:center;gap:5px;
    padding:7px 16px;background:${bg};border-radius:22px;
    color:${textC};font-family:'DM Sans',sans-serif;font-size:12px;font-weight:800;
    white-space:nowrap;box-shadow:0 0 0 3px white,0 6px 20px ${shadow};">
    <span style="width:7px;height:7px;border-radius:50%;background:${dot};flex-shrink:0;"></span>
    This Property
  </div>
  <div style="width:0;height:0;border-left:9px solid transparent;
    border-right:9px solid transparent;border-top:11px solid ${bg};margin-top:-1px;"></div>
</div>`;
  return L.divIcon({ className: "", html, iconSize: [130, 50], iconAnchor: [65, 50] });
}

function makeLandmarkPin(name: string, emoji: string, index: number): L.DivIcon {
  const short  = name.length > 15 ? name.slice(0, 14) + "…" : name;
  const label  = `${emoji} ${short}`;
  const pillW  = Math.max(88, label.length * 7.2 + 22);
  const pillH  = 26;
  const tailH  = 8;
  const bg     = index < 3 ? "#1e5f74" : "#4b5563";
  const shadow = index < 3 ? "rgba(30,95,116,0.35)" : "rgba(107,114,128,0.35)";
  const html = `
<div style="display:inline-flex;flex-direction:column;align-items:center;
            filter:drop-shadow(0 2px 6px ${shadow});">
  <div style="display:flex;align-items:center;justify-content:center;gap:3px;
    width:${pillW}px;height:${pillH}px;padding:0 10px;
    background:${bg};border-radius:${pillH / 2}px;
    color:white;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:700;
    white-space:nowrap;box-shadow:0 0 0 1.5px white;">
    <span style="background:rgba(255,255,255,0.22);border-radius:50%;
      width:14px;height:14px;display:flex;align-items:center;
      justify-content:center;font-size:8px;font-weight:900;flex-shrink:0;">${index + 1}</span>
    ${label}
  </div>
  <div style="width:0;height:0;border-left:6px solid transparent;
    border-right:6px solid transparent;border-top:${tailH}px solid ${bg};margin-top:-1px;"></div>
</div>`;
  return L.divIcon({
    className: "", html,
    iconSize: [pillW, pillH + tailH], iconAnchor: [pillW / 2, pillH + tailH],
  });
}

function makeDistanceLabel(distM: number, durationS: number): L.DivIcon {
  const dist = fmtDist(distM);
  const dur  = fmtDuration(durationS);
  const w    = (dist.length + dur.length) * 6 + 50;
  const html = `
<div style="display:inline-flex;align-items:center;gap:4px;background:white;
  border:1.5px solid #1e5f74;border-radius:10px;padding:3px 8px;
  box-shadow:0 2px 8px rgba(0,0,0,0.14);font-family:'DM Sans',sans-serif;
  white-space:nowrap;pointer-events:none;">
  <span style="font-size:10px;font-weight:700;color:#1e5f74;">${dist}</span>
  <span style="width:3px;height:3px;border-radius:50%;background:#d1d5db;flex-shrink:0;"></span>
  <span style="font-size:10px;font-weight:600;color:#6b7280;">${dur} drive</span>
</div>`;
  return L.divIcon({ className: "", html, iconSize: [w, 24], iconAnchor: [w / 2, 12] });
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE CONTROLLER — fetches OSRM routes after map mounts
// ─────────────────────────────────────────────────────────────────────────────

const RouterController: React.FC<{
  propLat:   number;
  propLng:   number;
  landmarks: LandmarkWithDistance[];
  onRoutes:  (routes: OsrmRoute[]) => void;
}> = ({ propLat, propLng, landmarks, onRoutes }) => {
  const map    = useMap();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current || landmarks.length === 0) return;
    didRun.current = true;
    const ctrl = new AbortController();

    (async () => {
      const results: OsrmRoute[] = [];
      for (const lm of landmarks) {
        const r = await fetchOsrmRoute(propLat, propLng, lm.lat, lm.lng, ctrl.signal);
        if (!r) continue;
        results.push({
          landmarkId: lm.id,
          coords:     r.coords,
          distanceM:  r.distanceM,
          durationS:  r.durationS,
          midIdx:     Math.floor(r.coords.length / 2),
        });
        // Yield between requests to respect OSRM demo rate-limit
        await new Promise(res => setTimeout(res, 180));
      }
      onRoutes(results);
      if (results.length > 0) {
        const all: [number, number][] = [
          [propLat, propLng],
          ...results.flatMap(r => r.coords),
        ];
        map.fitBounds(L.latLngBounds(all), { padding: [60, 60], maxZoom: 16, animate: true });
      }
    })().catch(err => {
      if (err?.name !== "AbortError") logger.error("Route fetch failed:", err);
    });

    return () => ctrl.abort();
  }, [propLat, propLng, landmarks, map, onRoutes]);

  return null;
};

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface PropertyDetailMapProps {
  property:   PropertyType;
  landmarks:  LandmarkWithDistance[];
  mapCenter:  [number, number];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PropertyDetailMap: React.FC<PropertyDetailMapProps> = ({
  property,
  landmarks,
  mapCenter,
}) => {
  const [routes,      setRoutes]      = useState<OsrmRoute[]>([]);
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const handleRoutes = useCallback((r: OsrmRoute[]) => setRoutes(r), []);

  const lineColor   = (id: string) => activeRoute === id ? "#f0a500" : "#1e5f74";
  const lineWeight  = (id: string) => activeRoute === id ? 5 : 3;
  const lineOpacity = (id: string) => activeRoute && activeRoute !== id ? 0.28 : 0.72;

  return (
    <div className="w-full h-full" style={{ minHeight: 400 }}>
      <MapContainer
        center={mapCenter}
        zoom={15}
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

        <RouterController
          propLat={mapCenter[0]} propLng={mapCenter[1]}
          landmarks={landmarks}  onRoutes={handleRoutes}
        />

        {/* ── Road route polylines ── */}
        {routes.map((route) => {
          const lm  = landmarks.find(l => l.id === route.landmarkId);
          const cat = lm ? LANDMARK_CATEGORIES.find(c => c.value === lm.category) : null;

          return (
            <React.Fragment key={route.landmarkId}>
              <Polyline
                positions={route.coords}
                pathOptions={{
                  color:     lineColor(route.landmarkId),
                  weight:    lineWeight(route.landmarkId),
                  opacity:   lineOpacity(route.landmarkId),
                  dashArray: activeRoute && activeRoute !== route.landmarkId ? "6 5" : undefined,
                  lineCap:   "round",
                  lineJoin:  "round",
                }}
                eventHandlers={{
                  click: () => setActiveRoute(prev =>
                    prev === route.landmarkId ? null : route.landmarkId
                  ),
                }}
              />

              {/* Mid-route distance + duration label */}
              {route.coords[route.midIdx] && (
                <Marker
                  position={route.coords[route.midIdx]}
                  icon={makeDistanceLabel(route.distanceM, route.durationS)}
                  interactive={false}
                  zIndexOffset={-100}
                />
              )}

              {/* Active route detail popup */}
              {activeRoute === route.landmarkId && lm && (
                <Marker
                  position={route.coords[route.midIdx] ?? mapCenter}
                  icon={L.divIcon({
                    className: "",
                    html: `
<div style="background:white;border:1.5px solid #f0a500;border-radius:12px;
  padding:8px 12px;box-shadow:0 4px 16px rgba(0,0,0,0.15);
  font-family:'DM Sans',sans-serif;min-width:160px;pointer-events:none;">
  <div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
    <span style="font-size:15px;">${cat?.emoji ?? "📍"}</span>
    <span style="font-size:12px;font-weight:800;color:#111827;">${lm.name}</span>
  </div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
    <div style="background:#e0f0f5;border-radius:7px;padding:4px 7px;text-align:center;">
      <div style="font-size:11px;font-weight:800;color:#1e5f74;">${fmtDist(route.distanceM)}</div>
      <div style="font-size:9px;color:#6b7280;">by road</div>
    </div>
    <div style="background:#fef3c7;border-radius:7px;padding:4px 7px;text-align:center;">
      <div style="font-size:11px;font-weight:800;color:#c88400;">${fmtDuration(route.durationS)}</div>
      <div style="font-size:9px;color:#6b7280;">drive</div>
    </div>
  </div>
</div>`,
                    iconSize: [180, 80], iconAnchor: [90, -12],
                  })}
                  zIndexOffset={500}
                  interactive={false}
                />
              )}
            </React.Fragment>
          );
        })}

        {/* ── Property marker ── */}
        <Marker
          position={mapCenter}
          icon={makePropertyPin(property.listed_for ?? "rent")}
          zIndexOffset={1000}
        >
          <Popup closeButton={false} offset={L.point(0, -52)}>
            <div style={{ fontFamily: "DM Sans, system-ui", minWidth: 160, padding: "6px 4px" }}>
              <p style={{ fontWeight: 800, fontSize: 13, color: "#111827", marginBottom: 3 }}>
                {property.title ?? "This Property"}
              </p>
              <p style={{ fontSize: 11, color: "#6b7280", marginBottom: 4 }}>{property.address}</p>
              <p style={{ fontSize: 10, color: "#9ca3af", fontFamily: "monospace" }}>
                {mapCenter[0].toFixed(5)}, {mapCenter[1].toFixed(5)}
              </p>
            </div>
          </Popup>
        </Marker>

        {/* ── Landmark markers ── */}
        {landmarks.map((lm, i) => {
          const cat   = LANDMARK_CATEGORIES.find(c => c.value === lm.category);
          const emoji = cat?.emoji ?? "📍";
          const route = routes.find(r => r.landmarkId === lm.id);

          return (
            <Marker
              key={lm.id}
              position={[lm.lat, lm.lng]}
              icon={makeLandmarkPin(lm.name, emoji, i)}
              zIndexOffset={200 - i}
              eventHandlers={{
                click: () => setActiveRoute(prev => prev === lm.id ? null : lm.id),
              }}
            >
              <Popup closeButton={false} offset={[0, -(26 + 8 + 4)]}>
                <div style={{ fontFamily: "DM Sans, system-ui", padding: "6px 4px", minWidth: 160 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
                    <span style={{ fontSize: 18 }}>{emoji}</span>
                    <div>
                      <p style={{ fontWeight: 800, fontSize: 12, color: "#111827", lineHeight: 1.3 }}>
                        {lm.name}
                      </p>
                      <p style={{ fontSize: 10, color: "#9ca3af" }}>{cat?.label ?? "Landmark"}</p>
                    </div>
                  </div>
                  {/* verifiedCount badge */}
                  <div style={{ marginBottom: 6 }}>
                    <span style={{
                      display: "inline-flex", alignItems: "center", gap: 4,
                      background: lm.verifiedCount >= 5 ? "#e0f0f5" : "#f9fafb",
                      color: lm.verifiedCount >= 5 ? "#1e5f74" : "#6b7280",
                      border: `1px solid ${lm.verifiedCount >= 5 ? "#c5dde6" : "#e5e7eb"}`,
                      borderRadius: 100, padding: "2px 8px", fontSize: 10, fontWeight: 700,
                    }}>
                      ✓ {lm.verifiedCount} {lm.verifiedCount === 1 ? "verification" : "verifications"}
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                    <div style={{ background: "#e0f0f5", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <p style={{ fontWeight: 800, fontSize: 12, color: "#1e5f74" }}>
                        {/* Use OSRM road distance when available, fallback to backend distanceM */}
                        {route ? fmtDist(route.distanceM) : fmtDist(lm.distanceM)}
                      </p>
                      <p style={{ fontSize: 9, color: "#6b7280" }}>
                        {route ? "by road" : "straight-line"}
                      </p>
                    </div>
                    <div style={{ background: "#fef3c7", borderRadius: 8, padding: "5px 8px", textAlign: "center" }}>
                      <p style={{ fontWeight: 800, fontSize: 12, color: "#c88400" }}>
                        {route ? fmtDuration(route.durationS) : "—"}
                      </p>
                      <p style={{ fontSize: 9, color: "#6b7280" }}>
                        {route ? "drive" : "no route yet"}
                      </p>
                    </div>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default PropertyDetailMap;