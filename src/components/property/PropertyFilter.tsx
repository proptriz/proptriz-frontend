"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { FiSearch, FiMapPin, FiX } from "react-icons/fi";
import { LuSlidersHorizontal } from "react-icons/lu";
import { CategoryEnum, PropertyFilterPayload } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

const PRICE_LIMITS = {
  rent: 1_000_000_000,
  sale: 900_000_000_000,
} as const;

const getPriceMax = (listedFor: string): number =>
  listedFor === "rent" ? PRICE_LIMITS.rent : PRICE_LIMITS.sale;

const getBudgetPresets = (listedFor: string, priceMax: number) => {
  if (listedFor === "rent") {
    return [
      { label: "Any",          min: 0,          max: priceMax     },
      { label: "Under ₦100k",  min: 0,          max: 100_000      },
      { label: "Under ₦500k",  min: 100_000,    max: 500_000      },
      { label: "₦500k–₦2M",   min: 500_000,    max: 2_000_000    },
      { label: "₦2M–₦5M",     min: 2_000_000,  max: 5_000_000    },
      { label: "₦5M+",         min: 5_000_000,  max: priceMax     },
    ];
  }
  return [
    { label: "Any",          min: 0,            max: priceMax       },
    { label: "Under ₦5M",   min: 0,            max: 5_000_000      },
    { label: "₦5M–₦20M",   min: 5_000_000,    max: 20_000_000     },
    { label: "₦20M–₦100M", min: 20_000_000,   max: 100_000_000    },
    { label: "₦100M+",      min: 100_000_000,  max: priceMax       },
  ];
};

const CATEGORY_OPTIONS: { value: CategoryEnum; icon: string; label: string }[] = [
  { value: CategoryEnum.house, icon: "🏠", label: "Apartment" },
  { value: CategoryEnum.land, icon: "🏢", label: "Land" },
  { value: CategoryEnum.hotel, icon: "🏪", label: "Hotel" },
  { value: CategoryEnum.shortlet, icon: "🏡", label: "Shortlet" },
  { value: CategoryEnum.office, icon: "🏘️", label: "Office" },
  { value: CategoryEnum.shop, icon: "🏨", label: "Shop" },
  { value: CategoryEnum.others, icon: "🏨", label: "Others" },
];

const LIST_FOR_OPTIONS = [
  { value: "all",  label: "All",  icon: "🌐" },
  { value: "rent", label: "Rent", icon: "🔑" },
  { value: "sale", label: "Sale", icon: "🏷️" },
] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

type ListedFor = "all" | "sale" | "rent";

interface LocationResult {
  query: string;
  lat: number;
  lng: number;
  name: string;
  lga?: string;
  state?: string;
}

interface FilterState {
  propertyType: CategoryEnum;
  listedFor: ListedFor;
  price: [number, number];
  description: string;
}

interface FilterProps {
  onFilter: (filters: PropertyFilterPayload) => void;
  /** Optional: number of matching results to display in header */
  resultCount?: number;
  setTogglePopup?: (value: boolean) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatNum = (n: number) =>
  n.toLocaleString("en-NG");

const stripNonDigit = (v: string) =>
  v.replace(/[^\d]/g, "");

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Tiny inline map thumbnail built from SVG — no external dependency */
function MapThumb({ lat, lng }: { lat: number; lng: number }) {
  return (
    <div className="w-14 h-10 rounded-lg overflow-hidden flex-shrink-0 relative"
         style={{ background: "linear-gradient(135deg,#1a3a2a,#0f2d1f)" }}>
      <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 56 40" preserveAspectRatio="none">
        <line x1="0" y1="13" x2="56" y2="13" stroke="white" strokeWidth=".7"/>
        <line x1="0" y1="27" x2="56" y2="27" stroke="white" strokeWidth=".7"/>
        <line x1="18" y1="0" x2="18" y2="40" stroke="white" strokeWidth=".7"/>
        <line x1="38" y1="0" x2="38" y2="40" stroke="white" strokeWidth=".7"/>
        <path d="M0 22 Q15 18 28 23 Q42 28 56 20" stroke="#2ea06a" strokeWidth="1.5" fill="none" opacity=".6"/>
      </svg>
      <span className="relative z-10 flex items-center justify-center h-full text-base">📍</span>
    </div>
  );
}

/** Active filter tag chip */
function FilterTag({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 bg-[#e8f5ee] border border-[rgba(26,122,74,0.2)]
                     text-[#1a7a4a] text-[11px] font-semibold px-2.5 py-1 rounded-full">
      {label}
      <button
        type="button"
        onClick={onRemove}
        className="w-4 h-4 rounded-full bg-[rgba(26,122,74,0.2)] flex items-center justify-center
                   hover:bg-[#1a7a4a] hover:text-white transition-colors"
      >
        <FiX size={9} strokeWidth={3} />
      </button>
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const PropertyFilter: React.FC<FilterProps> = ({
  onFilter,
  resultCount,
  setTogglePopup,
}) => {
  const abortRef = useRef<AbortController | null>(null);

  const [locationQuery, setLocationQuery]   = useState("");
  const [locationResult, setLocationResult] = useState<LocationResult | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [filters, setFilters] = useState<FilterState>({
    propertyType: CategoryEnum.house,
    listedFor: "all",
    price: [0, PRICE_LIMITS.sale],
    description: "",
  });

  const PRICE_MAX      = getPriceMax(filters.listedFor);
  const BUDGET_PRESETS = getBudgetPresets(filters.listedFor, PRICE_MAX);

  // ── Clamp price when listedFor changes ──────────────────────────────────────
  useEffect(() => {
    setFilters((f) => ({
      ...f,
      price: [Math.min(f.price[0], PRICE_MAX), Math.min(f.price[1], PRICE_MAX)],
    }));
  }, [filters.listedFor, PRICE_MAX]);

  // ── Forward geocoding (Nominatim, debounced) ─────────────────────────────────
  useEffect(() => {
    if (!locationQuery || locationQuery.length < 3) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const timer = setTimeout(async () => {
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
          { signal: controller.signal, headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (!data?.length) return;
        const item = data[0];
        setLocationResult({
          query:  locationQuery,
          lat:    Number(item.lat),
          lng:    Number(item.lon),
          name:   item.display_name.split(",")[0],
          lga:    item.address?.county || item.address?.city_district,
          state:  item.address?.state,
        });
      } catch (err) {
        if ((err as Error).name !== "AbortError") console.error("Geocoding error", err);
      } finally {
        setLoadingLocation(false);
      }
    }, 500);

    return () => { clearTimeout(timer); controller.abort(); };
  }, [locationQuery]);

  // ── Price helpers ────────────────────────────────────────────────────────────
  const handleMinChange = (raw: string) => {
    const n = Number(stripNonDigit(raw) || 0);
    setFilters((f) => ({ ...f, price: [Math.min(n, f.price[1]), f.price[1]] }));
  };

  const handleMaxChange = (raw: string) => {
    const n = Number(stripNonDigit(raw) || PRICE_MAX);
    setFilters((f) => ({
      ...f,
      price: [f.price[0], Math.min(Math.max(n, f.price[0]), PRICE_MAX)],
    }));
  };

  // ── Active filter tag helpers ────────────────────────────────────────────────
  const activeTags: { label: string; onRemove: () => void }[] = [];

  if (locationResult) {
    activeTags.push({
      label: `📍 ${locationResult.name}`,
      onRemove: () => { setLocationResult(null); setLocationQuery(""); },
    });
  }
  if (filters.propertyType !== CategoryEnum.house) {
    activeTags.push({
      label: filters.propertyType.charAt(0).toUpperCase() + filters.propertyType.slice(1),
      onRemove: () => setFilters((f) => ({ ...f, propertyType: CategoryEnum.house })),
    });
  }
  if (filters.listedFor !== "all") {
    activeTags.push({
      label: filters.listedFor === "rent" ? "🔑 Rent" : "🏷️ Sale",
      onRemove: () => setFilters((f) => ({ ...f, listedFor: "all" })),
    });
  }
  const isDefaultPrice =
    filters.price[0] === 0 && filters.price[1] >= PRICE_MAX;
  if (!isDefaultPrice) {
    activeTags.push({
      label: `₦${formatNum(filters.price[0])} – ${filters.price[1] >= PRICE_MAX ? "Max" : `₦${formatNum(filters.price[1])}`}`,
      onRemove: () => setFilters((f) => ({ ...f, price: [0, PRICE_MAX] })),
    });
  }

  // ── Reset ────────────────────────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    setLocationQuery("");
    setLocationResult(null);
    const resetState: FilterState = {
      propertyType: CategoryEnum.house,
      listedFor: "all",
      price: [0, PRICE_LIMITS.sale],
      description: "",
    };
    setFilters(resetState);
    onFilter({
      location:     undefined,
      propertyType: CategoryEnum.house,
      listedFor:    "all",
      priceMin:     null,
      priceMax:     null,
      description:  undefined,
    });
  }, [onFilter]);

  // ── Submit ───────────────────────────────────────────────────────────────────
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      location:     locationResult ?? undefined,
      propertyType: filters.propertyType,
      listedFor:    filters.listedFor,
      priceMin:     filters.price[0],
      priceMax:     filters.price[1],
      description:  filters.description || undefined,
    });
    setTogglePopup?.(false);
  };

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <form onSubmit={handleSubmit} className="flex flex-col" noValidate>

      {/* ── Section helper ── */}
      {/* Wrap each section in a consistent container */}

      {/* ── Active filter tags ──────────────────────────────────────────────── */}
      {activeTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {activeTags.map((t) => (
            <FilterTag key={t.label} label={t.label} onRemove={t.onRemove} />
          ))}
        </div>
      )}

      {/* ── Location ────────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-2 flex items-center gap-1">
          📍 Location
        </p>

        <div className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-xl
                        px-3.5 py-2.5 transition-all duration-200
                        focus-within:border-[#1a7a4a] focus-within:bg-white
                        focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]">
          <FiMapPin className="text-[#9ca3af] flex-shrink-0" size={15} />
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search city, area or landmark…"
            className="flex-1 bg-transparent outline-none text-sm text-[#111827] placeholder:text-[#9ca3af]"
          />
          {locationQuery && (
            <button
              type="button"
              onClick={() => { setLocationQuery(""); setLocationResult(null); }}
              className="text-[#9ca3af] hover:text-[#4b5563] transition-colors"
            >
              <FiX size={14} />
            </button>
          )}
        </div>

        {/* Loading state */}
        {loadingLocation && (
          <div className="flex items-center gap-1.5 text-[11px] text-[#9ca3af] mt-1.5">
            <div className="w-2.5 h-2.5 border-2 border-[#e5e7eb] border-t-[#1a7a4a] rounded-full animate-spin" />
            Searching location…
          </div>
        )}

        {/* Result card */}
        {locationResult && !loadingLocation && (
          <div className="mt-2 bg-[#e8f5ee] border border-[rgba(26,122,74,0.2)] rounded-xl p-3
                          flex items-center gap-3">
            <MapThumb lat={locationResult.lat} lng={locationResult.lng} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#111827] truncate">{locationResult.name}</p>
              <p className="text-xs text-[#4b5563] truncate">
                {locationResult.lga && `${locationResult.lga}, `}{locationResult.state}
              </p>
              <p className="text-[10px] text-[#9ca3af] font-mono mt-0.5">
                {Math.abs(locationResult.lat).toFixed(4)}°{locationResult.lat >= 0 ? "N" : "S"},{" "}
                {Math.abs(locationResult.lng).toFixed(4)}°{locationResult.lng >= 0 ? "E" : "W"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => { setLocationResult(null); setLocationQuery(""); }}
              className="w-6 h-6 rounded-full bg-[rgba(26,122,74,0.15)] flex items-center justify-center
                         hover:bg-[#1a7a4a] hover:text-white text-[#1a7a4a] transition-colors flex-shrink-0"
            >
              <FiX size={11} strokeWidth={3} />
            </button>
          </div>
        )}
      </div>

      {/* ── Property Type ────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-2">
          🏷️ Property Type
        </p>
        <div className="grid grid-cols-4 gap-1.5">
          {CATEGORY_OPTIONS.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, propertyType: cat.value }))}
              className={`flex flex-col items-center gap-1 py-2.5 px-1 rounded-xl border-[1.5px]
                          text-[10px] font-medium transition-all duration-200 cursor-pointer
                          ${filters.propertyType === cat.value
                            ? "border-[#1a7a4a] bg-[#e8f5ee] text-[#1a7a4a] font-bold"
                            : "border-[#e5e7eb] text-[#4b5563] bg-[#f9fafb] hover:border-[#2ea06a]"
                          }`}
            >
              <span className="text-lg leading-none">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Listed For ───────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-2">
          🔑 Listed For
        </p>
        <div className="flex gap-1.5">
          {LIST_FOR_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setFilters((f) => ({ ...f, listedFor: opt.value }))}
              className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-[13px] font-medium
                          transition-all duration-200
                          ${filters.listedFor === opt.value
                            ? "bg-[#1a7a4a] text-white border-[#1a7a4a] font-bold"
                            : "bg-[#f9fafb] text-[#4b5563] border-[#e5e7eb] hover:border-[#2ea06a]"
                          }`}
            >
              <span className="mr-1">{opt.icon}</span>
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Price Budget ─────────────────────────────────────────────────────── */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]">
            💰 Price Budget
          </p>
          <span className="text-[10px] text-[#9ca3af]">
            ₦ / {filters.listedFor === "rent" ? "year" : "total"}
          </span>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {BUDGET_PRESETS.map((p) => {
            const active = filters.price[0] === p.min && filters.price[1] === p.max;
            return (
              <button
                key={p.label}
                type="button"
                onClick={() => setFilters((f) => ({ ...f, price: [p.min, p.max] }))}
                className={`px-3 py-1.5 rounded-full text-[11px] border-[1.5px] font-medium
                            transition-all duration-200
                            ${active
                              ? "bg-[#f5a623] border-[#f5a623] text-[#111] font-bold"
                              : "bg-[#f9fafb] text-[#4b5563] border-[#e5e7eb] hover:border-[#2ea06a]"
                            }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Min / max inputs */}
        <div className="grid grid-cols-2 gap-2.5">
          {[
            { label: "Min Price", value: filters.price[0] || "", handler: handleMinChange, placeholder: "₦ 0" },
            {
              label: "Max Price",
              value: filters.price[1] >= PRICE_MAX ? "" : filters.price[1],
              handler: handleMaxChange,
              placeholder: "No limit",
            },
          ].map((field) => (
            <div
              key={field.label}
              className="bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-xl px-3 py-2.5
                         transition-all duration-200
                         focus-within:border-[#1a7a4a] focus-within:bg-white
                         focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]"
            >
              <p className="text-[9px] font-bold text-[#9ca3af] uppercase tracking-[0.5px]">
                {field.label}
              </p>
              <input
                inputMode="numeric"
                value={field.value}
                onChange={(e) => field.handler(e.target.value)}
                placeholder={field.placeholder}
                className="w-full bg-transparent outline-none text-sm font-semibold text-[#111827]
                           placeholder:text-[#9ca3af] mt-0.5"
              />
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="mt-2.5 bg-[#f9fafb] rounded-lg px-3 py-2 flex items-center gap-1.5 text-[11px] text-[#4b5563]">
          🎯 Showing:{" "}
          <span className="font-bold text-[#1a7a4a]">
            ₦{formatNum(filters.price[0])} —{" "}
            {filters.price[1] >= PRICE_MAX ? "No limit" : `₦${formatNum(filters.price[1])}`}
          </span>
        </div>
      </div>

      {/* ── Keywords ─────────────────────────────────────────────────────────── */}
      <div className="mb-6">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-2">
          ✏️ Keywords
        </p>
        <div className="flex items-start gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-xl
                        px-3.5 py-3 transition-all duration-200
                        focus-within:border-[#1a7a4a] focus-within:bg-white
                        focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]">
          <FiSearch className="text-[#9ca3af] flex-shrink-0 mt-0.5" size={14} />
          <input
            value={filters.description}
            onChange={(e) => setFilters((f) => ({ ...f, description: e.target.value }))}
            placeholder="e.g. furnished, fenced, parking lot…"
            className="flex-1 bg-transparent outline-none text-sm text-[#111827] placeholder:text-[#9ca3af]"
          />
        </div>
        <p className="text-[10px] text-[#9ca3af] mt-1.5 flex items-center gap-1">
          💡 Separate terms with commas for best results
        </p>
      </div>

      {/* ── Sticky actions bar ───────────────────────────────────────────────── */}
      <div className="sticky bottom-0 bg-white pt-3 border-t border-[#f3f4f6] flex gap-2.5 -mx-5 px-5 pb-1">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-3.5 rounded-xl bg-[#f3f4f6] text-[#4b5563]
                     font-semibold text-sm hover:bg-[#e5e7eb] transition-colors"
        >
          ↺ Reset
        </button>

        <button
          type="submit"
          className="flex-1 py-3.5 rounded-xl font-bold text-sm text-white
                     bg-gradient-to-br from-[#1a7a4a] to-[#2ea06a]
                     flex items-center justify-center gap-2
                     shadow-[0_4px_16px_rgba(26,122,74,0.35)]
                     hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(26,122,74,0.45)]
                     transition-all duration-200"
        >
          <FiSearch size={15} strokeWidth={2.5} />
          {resultCount !== undefined
            ? `Show ${resultCount.toLocaleString()} results`
            : "Apply Filters"}
        </button>
      </div>
    </form>
  );
};

export default PropertyFilter;
