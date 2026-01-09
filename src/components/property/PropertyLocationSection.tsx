"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import { FiSearch } from "react-icons/fi";

const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  { ssr: false }
);

interface PropertyLocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoordinates: LatLngExpression | null;
  fallbackCoordinates: [number, number];
  onLocationSelect: (lat: number, lng: number) => void;
}

const PropertyLocationModal: React.FC<PropertyLocationModalProps> = ({
  isOpen,
  onClose,
  userCoordinates,
  fallbackCoordinates,
  onLocationSelect,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b">
        <h2 className="text-lg font-semibold">Select Property Location</h2>
        <button
          onClick={onClose}
          className="text-sm px-3 py-1 rounded-md border hover:bg-gray-100"
        >
          Close
        </button>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <LocationPickerMap
          initialCenter={userCoordinates || fallbackCoordinates}
          onLocationSelect={onLocationSelect}
          submittedQuery={submittedQuery}
          setSearchLoading={setLoading}
        />

        {/* Footer */}
        <div className="fixed left-0 right-0 bottom-2 z-10 px-8 py-3">
          <button
            className="w-full py-3 rounded-md bg-primary text-md text-white "
            onClick={onClose}
          >
            Confirm Location
          </button>
        </div>
        
      </div>

      {/* Footer */}
      <div className="bg-white border-t px-4 py-3">
        <button
          className="w-full py-3 rounded-md card-bg text-sm"
          onClick={onClose}
        >
          Confirm Location
        </button>
      </div>
    </div>
  );
};

export default PropertyLocationModal;
