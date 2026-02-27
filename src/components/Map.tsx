"use client";

import React, { SetStateAction, useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import * as L from "leaflet";
import type { LatLngExpression } from "leaflet";
import { ListForEnum, PropertyType } from "@/types";
import debounce from "lodash.debounce";
import MapMarkerPopup from "./MapMarkerPopup";
import { createPriceIcon } from "./PriceMarkerIcon";

// ─── User-location icon ───────────────────────────────────────────────────────
// Replaced brittle /location/location-banner.png with an inline SVG data-URL
// so the user dot always renders even if the image asset is missing.
const locationIcon = L.divIcon({
  className: "",
  html: `<div style="
    width:16px;height:16px;
    background:#3b82f6;
    border:3px solid white;
    border-radius:50%;
    box-shadow:0 0 0 6px rgba(59,130,246,0.25);
  "></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// ─── Sub-components ───────────────────────────────────────────────────────────

interface MapUpdaterProps {
  center: LatLngExpression;
  zoom: number;
}

/** Restores saved map position from sessionStorage on mount, then sets to center/zoom */
const MapUpdater = ({ center, zoom }: MapUpdaterProps) => {
  const map = useMap();
  useEffect(() => {
    const savedCenter = sessionStorage.getItem("prevMapCenter");
    const savedZoom   = sessionStorage.getItem("prevMapZoom");
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

/** Fires onBoundsChange on every move/zoom end, debounced 500ms */
const MapBoundsUpdater: React.FC<MapBoundsUpdaterProps> = ({ onBoundsChange }) => {
  const map = useMap();

  const debouncedUpdate = useMemo(
    () =>
      debounce(() => {
        const c = map.getCenter();
        sessionStorage.setItem("prevMapCenter", JSON.stringify([c.lat, c.lng]));
        sessionStorage.setItem("prevMapZoom", map.getZoom().toString());
        onBoundsChange(map.getBounds());
      }, 500),
    [map, onBoundsChange]
  );

  useEffect(() => {
    map.on("moveend", debouncedUpdate);
    map.on("zoomend", debouncedUpdate);
    debouncedUpdate(); // initial trigger

    return () => {
      map.off("moveend", debouncedUpdate);
      map.off("zoomend", debouncedUpdate);
      debouncedUpdate.cancel();
    };
  }, [map, debouncedUpdate]);

  return null;
};

// ─── Main Map component ───────────────────────────────────────────────────────

interface MapProps {
  properties: PropertyType[];
  mapCenter: [number, number] | null;
  initialZoom?: number;
  mapBounds?: L.LatLngBounds | null;
  setMapBounds?: React.Dispatch<SetStateAction<L.LatLngBounds | null>>;
  /** Called when a property marker is tapped — use this for the peek card */
  onMarkerClick?: (property: PropertyType) => void;
}

const Map: React.FC<MapProps> = ({
  properties,
  mapCenter,
  initialZoom = 7,
  setMapBounds = () => {},
  onMarkerClick = () => {},
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  /** Nigeria/West-Africa bounding box prevents panning off continent */
  const africaBounds: L.LatLngBoundsExpression = [
    [-35, -20],
    [38, 55],
  ];

  const handleMarkerClick = (property: PropertyType) => {
    setSelectedId(property._id);
    onMarkerClick(property); // notify parent (e.g. show peek card in ExplorePage)
  };

  const handlePopupClose = () => {
    setSelectedId(null);
  };

  return (
    <div
      className="absolute inset-0 z-0"
      style={{ minHeight: 400, overflow: "hidden" }}
    >
      <MapContainer
        center={mapCenter ?? [9.082, 8.6753]}
        zoom={initialZoom}
        zoomControl={false}
        maxBounds={africaBounds}
        maxBoundsViscosity={1.0}
        className="w-full h-full"
      >
        {/* Map tiles */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Restore/update position */}
        {mapCenter && (
          <MapUpdater center={mapCenter as LatLngExpression} zoom={initialZoom} />
        )}

        {/* Bounds updater */}
        {mapCenter && <MapBoundsUpdater onBoundsChange={setMapBounds} />}

        {/* User location marker */}
        {mapCenter && (
          <Marker
            position={mapCenter as LatLngExpression}
            icon={locationIcon}
            zIndexOffset={1000}
          />
        )}

        {/* Property markers — price pins, colour-coded by listing type */}
        {properties.map((property) => (
          <Marker
            key={property._id}
            position={[property.latitude, property.longitude] as LatLngExpression}
            icon={createPriceIcon({
              price: property.price,
              listedFor: property.listed_for as ListForEnum,
              isSelected: selectedId === property._id,
            })}
            eventHandlers={{
              click: () => handleMarkerClick(property),
              popupclose: handlePopupClose,
            }}
          >
            <Popup
              closeButton
              minWidth={200}
              maxWidth={260}
              className="custom-popup"
              offset={L.point(0, -4)}
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
