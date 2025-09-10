"use client";
import React from "react";
import { HiOutlineLocationMarker } from "react-icons/hi";
import ToggleCollapse from "@/components/shared/ToggleCollapse";
import LocationPickerMap from "@/components/LocationPickerMap ";
import type { LatLngExpression } from "leaflet";

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
    <ToggleCollapse header="Property Location" open={false}>
      <h3 className="mt-10 font-semibold">Location</h3>
      <div className="rounded-full p-4 border border-[#DCDFD9] my-4 cursor-pointer hover:bg-gray-100 flex items-center">
        <button className="card-bg rounded-full p-3 mr-2 text-2xl" disabled>
          <HiOutlineLocationMarker />
        </button>
        <p className="text-gray-700 text-sm">
          Opposite Gate-04 Jimeta International Market, Yola
        </p>
      </div>
      <div className="max-h-[280px] overflow-hidden rounded-lg border border-gray-200 relative map-container-fix">
        <LocationPickerMap
          initialCenter={userCoordinates || fallbackCoordinates}
          onLocationSelect={onLocationSelect}
        />
      </div>
      <button className="w-full py-4 card-bg text-sm rounded-b-lg" disabled>
        Set & Save Location
      </button>
    </ToggleCollapse>
  );
};

export default PropertyLocationSection;
