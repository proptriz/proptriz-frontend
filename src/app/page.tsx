// /app/page.tsx
'use client';

import React, { useState, useEffect, useContext, useRef, useCallback } from "react";
import dynamic from 'next/dynamic';
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import propertyService from "@/services/propertyApi";
import { CategoryEnum, PropertyFilterPayload, PropertyType } from "@/types/property";
import getUserPosition from "@/utils/getUserPosition";
import { AppContext } from "@/context/AppContextProvider";
import Header from "@/components/shared/Header";
import Link from "next/link";
import { FiNavigation } from "react-icons/fi";
import type L from "leaflet";
import { useLanguage } from "@/i18n/LanguageContext";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ExplorePage() {
  const { authUser, isSigningInUser } = useContext(AppContext);
  const { t } = useLanguage();

  const [properties, setProperties]             = useState<PropertyType[]>([]);
  const [searchInput, setSearchInput]           = useState("");
  const [appliedSearchQuery, setAppliedSearchQuery] = useState("");
  const [category, setCategory]                 = useState<CategoryEnum>(CategoryEnum.house);
  const [listedFor, setListedFor]               = useState<string>("all");
  const [minPriceBudget, setMinPriceBudget]     = useState<number>(0);
  const [maxPriceBudget, setMaxPriceBudget]     = useState<number>(900_000_000_000);
  const [mapBounds, setMapBounds]               = useState<L.LatLngBounds | null>(null);
  const [mapCenter, setMapCenter]               = useState<[number, number] | null>(null);
  const [zoomLevel, setZoomLevel]               = useState<number>(7);
  const [selectedProperty, setSelectedProperty] = useState<PropertyType | null>(null);

  const renderedMarkerIds = useRef<Set<string>>(new Set());
  const [nextCursor, setNextCursor]             = useState<string | undefined>(undefined);

  // ── Location ───────────────────────────────────────────────────────────
  const fetchLocation = useCallback(async () => {
    const [lat, lng] = await getUserPosition();
    setMapCenter([lat, lng]);
  }, []);

  useEffect(() => {
    fetchLocation();
    setZoomLevel(7);
  }, [authUser, fetchLocation]);

  const onLocateMe = async () => {
    sessionStorage.removeItem("prevMapCenter");
    sessionStorage.removeItem("prevMapZoom");
    await fetchLocation();
    setZoomLevel(10);
  };

  // ── Fetch properties ──────────────────────────────────────────────────
  const fetchProperties = useCallback(
    async (signal: AbortSignal) => {
      if (!mapBounds) return;
      try {
        const ne = mapBounds.getNorthEast();
        const sw = mapBounds.getSouthWest();

        const params = new URLSearchParams({
          query:      appliedSearchQuery ?? "",
          category:   category ?? "",
          listed_for: listedFor === "all" ? "" : listedFor,
          min_price:  minPriceBudget.toString(),
          max_price:  maxPriceBudget.toString(),
          ne_lat:     ne.lat.toString(),
          ne_lng:     ne.lng.toString(),
          sw_lat:     sw.lat.toString(),
          sw_lng:     sw.lng.toString(),
          cursor:     nextCursor ?? "",
        });

        const result = await propertyService.getAllProperties(params.toString(), { signal });
        if (!result.success) return;

        const newMarkers: PropertyType[] = [];
        for (const property of result.properties) {
          if (!renderedMarkerIds.current.has(property._id)) {
            renderedMarkerIds.current.add(property._id);
            newMarkers.push(property);
          }
        }

        if (newMarkers.length) {
          setProperties((prev) => [...prev, ...newMarkers]);
          setNextCursor(result.nextCursor);
        }
      } catch (error: unknown) {
        if ((error as Error).name !== "AbortError") {
          console.error("Fetch properties failed:", (error as Error).message);
        }
      }
    },
    [mapBounds, appliedSearchQuery, category, listedFor, minPriceBudget, maxPriceBudget]
  );

  // ── Search / filter handlers ──────────────────────────────────────────
  const onSearchClick = useCallback(() => {
    renderedMarkerIds.current.clear();
    setProperties([]);
    setAppliedSearchQuery(searchInput);
  }, [searchInput]);

  const onFilter = useCallback(
    (filters: PropertyFilterPayload) => {
      renderedMarkerIds.current.clear();
      setProperties([]);
      setSelectedProperty(null);

      if (filters.location) {
        sessionStorage.removeItem("prevMapCenter");
        sessionStorage.removeItem("prevMapZoom");
        setZoomLevel(10);
        setMapCenter([filters.location.lat, filters.location.lng]);
      }

      setListedFor(filters.listedFor);
      setMinPriceBudget(filters.priceMin ?? 0);
      setMaxPriceBudget(filters.priceMax ?? 900_000_000_000);
      setCategory(filters.propertyType);
      setSearchInput(filters.description ?? "");
      setAppliedSearchQuery(filters.description ?? appliedSearchQuery);
    },
    [appliedSearchQuery]
  );

  // ── Effects ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mapBounds) return;
    const controller = new AbortController();
    fetchProperties(controller.signal);
    return () => controller.abort();
  }, [fetchProperties, mapBounds]);

  useEffect(() => {
    renderedMarkerIds.current.clear();
    setProperties([]);
    setAppliedSearchQuery(searchInput);
  }, [category, appliedSearchQuery]);

  useEffect(() => {
    if (searchInput === "" && appliedSearchQuery) {
      renderedMarkerIds.current.clear();
      setProperties([]);
      setAppliedSearchQuery("");
    }
  }, [searchInput, appliedSearchQuery]);

  // ─────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-screen-safe overflow-hidden">
      <Header />

      {/* ── Map fills the remaining height ────────────────────────────── */}
      <div className="relative flex-1 overflow-hidden">

        {/* Search bar — overlaid on the map at the top */}
        <div className="absolute top-0 left-0 right-0 z-[500] px-4 pt-3 pb-2">
          <div className="mx-auto max-w-[480px]">
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              onSearch={onSearchClick}
              onFilter={onFilter}
            />
          </div>
        </div>

        {/* Category tabs — below search, still above map */}
        <div className="absolute top-[64px] left-0 right-0 z-[499] px-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl
                          shadow-[0_2px_10px_rgba(0,0,0,0.1)] px-2 py-1 mx-auto max-w-[480px]">
            <NavigationTabs onChange={setCategory} value={category} />
          </div>
        </div>

        {/* Leaflet map */}
        <Map
          properties={properties}
          mapCenter={mapCenter}
          initialZoom={zoomLevel}
          mapBounds={mapBounds}
          setMapBounds={setMapBounds}
          onMarkerClick={(property: PropertyType) => setSelectedProperty(property)}
        />

        {/* ── Floating action buttons ──────────────────────────────────── */}
        <div className="absolute bottom-[72px] right-4 z-[300] flex flex-col gap-2">
          {/* Locate me */}
          <button
            onClick={onLocateMe}
            disabled={isSigningInUser}
            aria-label={t("map_my_location")}
            className="w-10 h-10 rounded-full bg-white flex items-center justify-center
                       shadow-[0_2px_12px_rgba(0,0,0,0.18)]
                       hover:shadow-lg transition-shadow
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiNavigation size={16} className="text-[#1e5f74]" />
          </button>
        </div>

        {/* ── List property button ─────────────────────────────────────── */}
        <div className="absolute bottom-[72px] left-4 z-[400]">
          <Link
            href="/property/add"
            className="inline-flex items-center gap-1.5 text-white
                       text-[13px] font-bold px-4 py-2.5 rounded-xl
                       shadow-[0_4px_14px_rgba(30,95,116,0.4)]
                       hover:shadow-[0_6px_18px_rgba(30,95,116,0.5)]
                       transition-shadow"
                style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
          >
            {t("map_list_property")}
          </Link>
        </div>
      </div>

      <Footer />
    </div>
  );
}