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

  const [searchValue, setSearchValue] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [loading, setLoading] = useState(false);
  
    const triggerSearch = () => {
      if (searchValue.trim()) {
        setSubmittedQuery(searchValue.trim());
      }
    };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex flex-col">
      

      {/* Map */}
      <div className="flex-1 relative">
        {/* Header */}
        <div className="relative flex items-center justify-between px-4 py-2 bg-white border-b z-10 mb-3">
          <h2 className="text-lg font-semibold">Select Property Location</h2>
          <button
            onClick={onClose}
            className="text-sm px-3 py-1 rounded-md hover:bg-red-500 bg-red-700 text-white"
          >
            Close
          </button>
        </div>
        {/* Search Bar */}
        <div className="relative w-full md:max-w-[75%] lg:max-w-[50%] mx-auto z-10">
          <div className="flex">
            <div className="flex bg-white rounded-l-full shadow-md p-2 w-full">
              <input
                type="text"
                placeholder="Search location (Nigeria only)..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                className="w-full outline-none text-gray-600"
              />
            </div>
  
            <button
              type="button"
              onClick={triggerSearch}
              disabled={loading}
              className="ml-1 bg-primary px-6 rounded-r-full text-white flex items-center justify-center"
            >
              {loading ? (
                <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              ) : (
                <FiSearch className="text-xl" />
              )}
            </button>
          </div>
        </div>
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
    </div>
  );
};

export default PropertyLocationModal;
