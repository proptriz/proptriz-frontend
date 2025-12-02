"use client";

import React from "react";
import dynamic from 'next/dynamic';
import { HiOutlineLocationMarker } from "react-icons/hi";
import ToggleCollapse from "@/components/shared/ToggleCollapse";
import type { LatLngExpression } from "leaflet";

const LocationPickerMap = dynamic(() => import("@/components/LocationPickerMap"), { ssr: false });

interface PropertyLocationSectionProps {
  userCoordinates: LatLngExpression | null;
  fallbackCoordinates: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

const PropertyLocationSection: React.FC<PropertyLocationSectionProps> = ({
  userCoordinates,
  fallbackCoordinates,
  onLocationSelect,
}) => {
  return (
    <div>      
      <div className="max-h-[280px] overflow-hidden rounded-lg border border-gray-200 relative map-container-fix">
        <LocationPickerMap
          initialCenter={userCoordinates || fallbackCoordinates}
          onLocationSelect={onLocationSelect}
        />
      </div>
      <button className="w-full py-4 card-bg text-sm rounded-b-lg" disabled>
        Click to select property Location
      </button>
    </div>
  );
};

export default PropertyLocationSection;
