"use client";

import React, { useEffect, useRef, useState } from "react";
import { AppButton as Button } from "@/components/shared/buttons";
import { Slider } from "@/components/shared/Input";
import { FiSearch, FiMapPin } from "react-icons/fi";
import { TiFilter } from "react-icons/ti";

export interface PropertyFilterPayload {
  location?: {
    query: string;
    lat: number;
    lng: number;
    name: string;
    lga?: string;
    state?: string;
  };
  propertyType: string;
  priceType: "all" | "sale" | "rent";
  priceMin: number | null;
  priceMax: number | null;
  description?: string;
}


interface FilterProps {
  onFilter: (filters: PropertyFilterPayload) => void;
}

const PRICE_MAX = 100_000_000;

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "house", label: "House" },
  { value: "apartment", label: "Apartment" },
  { value: "land", label: "Land" },
  { value: "office", label: "Office" },
  { value: "shop", label: "Shop" },
];

const PropertyFilter: React.FC<FilterProps> = ({ onFilter }) => {
  const abortRef = useRef<AbortController | null>(null);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResult, setLocationResult] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [filters, setFilters] = useState({
    propertyType: "all",
    priceType: "all" as "all" | "sale" | "rent",
    price: [0, PRICE_MAX],
    description: "",
  });

  /* ---------------- Location Search (Forward + Reverse) ---------------- */

  useEffect(() => {
    if (!locationQuery || locationQuery.length < 3) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchLocation = async () => {
      try {
        setLoadingLocation(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              q: locationQuery,
              format: "json",
              addressdetails: "1",
              countrycodes: "ng",
              limit: "1",
            }),
          {
            signal: controller.signal,
            headers: { "Accept-Language": "en" },
          }
        );

        const data = await res.json();
        if (!data?.length) return;

        const item = data[0];

        setLocationResult({
          query: locationQuery,
          lat: Number(item.lat),
          lng: Number(item.lon),
          name: item.display_name.split(",")[0],
          lga: item.address?.county || item.address?.city_district,
          state: item.address?.state,
        });
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          console.error("Geocoding failed", err);
        }
      } finally {
        setLoadingLocation(false);
      }
    };

    const debounce = setTimeout(fetchLocation, 500);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [locationQuery]);

  /* ---------------- Submit ---------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onFilter({
      location: locationResult || undefined,
      propertyType: filters.propertyType,
      priceType: filters.priceType,
      priceMin: filters.price[0],
      priceMax: filters.price[1],
      description: filters.description || undefined,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-4 space-y-4"
    >
      {/* ---------------- Location ---------------- */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Location
        </label>
        <div className="relative">
          <FiMapPin className="absolute left-3 top-3 text-gray-400" />
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search city, area or landmark"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-estate-primary"
          />
        </div>

        {loadingLocation && (
          <p className="text-xs text-gray-500 mt-1">Searching location…</p>
        )}

        {locationResult && (
          <div className="mt-2 p-3 rounded-md bg-gray-50 border text-sm">
            <div className="font-medium">{locationResult.name}</div>
            <div className="text-gray-600">
              {locationResult.lga && `${locationResult.lga}, `}
              {locationResult.state}
            </div>
          </div>
        )}
      </div>

      {/* ---------------- Property Type ---------------- */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Property Type
        </label>
        <select
          className="w-full p-2 border rounded-md"
          value={filters.propertyType}
          onChange={(e) =>
            setFilters((f) => ({ ...f, propertyType: e.target.value }))
          }
        >
          {propertyTypes.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </div>

      {/* ---------------- Sale / Rent ---------------- */}
      <div className="flex gap-2">
        {(["all", "sale", "rent"] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() =>
              setFilters((f) => ({ ...f, priceType: type }))
            }
            className={`flex-1 py-2 rounded-md border ${
              filters.priceType === type
                ? "bg-estate-primary text-white"
                : "bg-white"
            }`}
          >
            {type === "all" ? "All" : type === "sale" ? "Buy" : "Rent"}
          </button>
        ))}
      </div>

      {/* ---------------- Price (Modern UX) ---------------- */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Price Range (₦)
        </label>

        <Slider
          // value={filters.price}
          min={0}
          max={PRICE_MAX}
          step={100_000}
          onValueChange={(v) =>
            setFilters((f) => ({ ...f, price: v }))
          }
          defaultValue={[0, 10_000_000]}

        />


        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>₦{filters.price[0].toLocaleString()}</span>
          <span>₦{filters.price[1].toLocaleString()}</span>
        </div>
      </div>

      {/* ---------------- Description Query ---------------- */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-1 block">
          Description contains
        </label>
        <input
          value={filters.description}
          onChange={(e) =>
            setFilters((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="e.g. furnished, sea view, serviced"
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* ---------------- Actions ---------------- */}
      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" className="bg-estate-primary text-white">
          <FiSearch className="mr-2" />
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default PropertyFilter;
