'use client';

import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ToggleCollapse from "../shared/ToggleCollapse";
import { CategoryEnum, Feature, NegotiableEnum } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

/** Emoji map for known facility names — no icon library needed */
const FACILITY_ICONS: Record<string, string> = {
  "Parking Lot":       "🅿️",
  "Pet Allowed":       "🐾",
  "Garden":            "🌿",
  "Gym":               "🏋️",
  "Park":              "🏞️",
  "Home Theatre":      "🎬",
  "Kid's Friendly":    "👶",
  "Electricity":       "⚡",
  "Water Supply":      "💧",
  "Drainage System":   "🚿",
  "Security Services": "🔒",
};

const DEFAULT_FACILITIES = Object.keys(FACILITY_ICONS);

const CATEGORY_FEATURES: Record<string, Feature[]> = {
  house:      [{ name: "Bedrooms", quantity: 3 }, { name: "Bathrooms", quantity: 2 }, { name: "Garage", quantity: 1 }],
  apartment:  [{ name: "Bedrooms", quantity: 2 }, { name: "Bathrooms", quantity: 1 }, { name: "Floors", quantity: 1 }],
  hotel:      [{ name: "Reception Area", quantity: 1 }, { name: "Conference Room", quantity: 1 }, { name: "Rooms", quantity: 10 }],
  commercial: [{ name: "Storage Room", quantity: 1 }, { name: "Security System", quantity: 1 }],
  land:       [{ name: "Fenced", quantity: 1 }, { name: "Survey Plan", quantity: 1 }, { name: "Registered Title", quantity: 1 }],
  villa:      [{ name: "Bedrooms", quantity: 5 }, { name: "Swimming Pool", quantity: 1 }, { name: "Garage", quantity: 2 }],
};

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddPropertyDetailsProps {
  listingCategory: CategoryEnum;
  existingFeatures?: Feature[];
  existingFacilities?: string[];
  onNegotiableChange?: (value: NegotiableEnum) => void;
  onFeaturesChange?: (features: Feature[]) => void;
  onFacilitiesChange?: (facilities: string[]) => void;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FeatureRowProps {
  feature: Feature;
  index: number;
  onChange: (index: number, key: keyof Feature, value: string | number) => void;
  onRemove: (index: number) => void;
}

function FeatureRow({ feature, index, onChange, onRemove }: FeatureRowProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                 rounded-xl transition-all duration-200
                 focus-within:border-[#1a7a4a] focus-within:bg-white
                 focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.08)]"
    >
      {/* Drag handle hint */}
      <span className="text-[#d1d5db] text-sm cursor-grab select-none flex-shrink-0"
            title="Drag to reorder">
        ⠿
      </span>

      {/* Name input */}
      <input
        type="text"
        placeholder="e.g. Swimming Pool, Garden…"
        value={feature.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-sm text-[#111827]
                   placeholder:text-[#9ca3af] min-w-0"
      />

      {/* Inline counter */}
      <div className="flex items-center border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden flex-shrink-0">
        <button
          type="button"
          onClick={() => onChange(index, "quantity", Math.max(1, feature.quantity - 1))}
          className="w-7 h-7 flex items-center justify-center text-base
                     bg-[#e8f5ee] text-[#1a7a4a] font-light
                     hover:bg-[#2ea06a] hover:text-white transition-colors"
        >
          −
        </button>
        <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
          {feature.quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(index, "quantity", feature.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center text-base
                     bg-[#e8f5ee] text-[#1a7a4a] font-light
                     hover:bg-[#2ea06a] hover:text-white transition-colors"
        >
          +
        </button>
      </div>

      {/* Remove button */}
      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center
                   flex-shrink-0 hover:bg-red-500 hover:text-white transition-colors"
        aria-label={`Remove ${feature.name}`}
      >
        <IoClose size={13} strokeWidth={2} />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddPropertyDetails({
  listingCategory,
  existingFeatures = [],
  existingFacilities = [],
  onNegotiableChange,
  onFeaturesChange,
  onFacilitiesChange,
}: AddPropertyDetailsProps) {

  const categoryDefaults = CATEGORY_FEATURES[listingCategory] ?? [];

  // ── State ──────────────────────────────────────────────────────────────────
  const [negotiable, setNegotiable] = useState<NegotiableEnum>(NegotiableEnum.Negotiable);

  /** Single source of truth — merge existing or fall back to category defaults */
  const [features, setFeatures] = useState<Feature[]>(
    existingFeatures.length > 0 ? existingFeatures : categoryDefaults
  );

  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(existingFacilities);
  const [customFacilities, setCustomFacilities]     = useState<string[]>([]);

  // ── Notify parent ──────────────────────────────────────────────────────────
  useEffect(() => { onNegotiableChange?.(negotiable); }, [negotiable, onNegotiableChange]);
  useEffect(() => { onFeaturesChange?.(features); }, [features, onFeaturesChange]);
  useEffect(() => {
    onFacilitiesChange?.([...selectedFacilities, ...customFacilities.filter(Boolean)]);
  }, [selectedFacilities, customFacilities, onFacilitiesChange]);

  // ── Feature handlers ───────────────────────────────────────────────────────
  const handleFeatureChange = useCallback(
    (index: number, key: keyof Feature, value: string | number) => {
      setFeatures((prev) => {
        const updated = [...prev];
        updated[index] = { ...updated[index], [key]: value };
        return updated;
      });
    },
    []
  );

  const handleAddFeature = useCallback(() => {
    setFeatures((prev) => [...prev, { name: "", quantity: 1 }]);
  }, []);

  const handleRemoveFeature = useCallback((index: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── Facility handlers ──────────────────────────────────────────────────────
  const toggleFacility = useCallback((facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    );
  }, []);

  const handleAddCustomFacility = useCallback(() => {
    setCustomFacilities((prev) => [...prev, ""]);
  }, []);

  const handleCustomFacilityChange = useCallback((index: number, value: string) => {
    setCustomFacilities((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const handleRemoveCustomFacility = useCallback((index: number) => {
    setCustomFacilities((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // ── All visible facilities (built-in + any extra from existingFacilities) ──
  const extraExisting = existingFacilities.filter((f) => !DEFAULT_FACILITIES.includes(f));
  const allFacilities = [...DEFAULT_FACILITIES, ...extraExisting];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <ToggleCollapse header="🏗️ Other Details" open>
      <div className="flex flex-col gap-4 mt-2">

        {/* ── Negotiable ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] inline-block" />
            Price Negotiation
          </p>

          <div className="flex gap-2">
            {[
              { value: NegotiableEnum.Negotiable,    label: "✅ Negotiable",  },
              { value: NegotiableEnum.NonNegotiable, label: "🔒 Fixed Price", },
            ].map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNegotiable(opt.value)}
                className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-[13px] font-medium
                            transition-all duration-200
                            ${negotiable === opt.value
                              ? "bg-[#1a7a4a] text-white border-[#1a7a4a] font-bold"
                              : "bg-[#f9fafb] text-[#4b5563] border-[#e5e7eb] hover:border-[#2ea06a]"
                            }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          <p className="text-[11px] text-[#9ca3af] text-center mt-2">
            {negotiable === NegotiableEnum.Negotiable
              ? "Buyers can propose a different price"
              : "The listed price is final"}
          </p>
        </div>

        {/* ── Property Features ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] inline-block" />
            Property Features
          </p>

          {/* Category defaults badge */}
          {existingFeatures.length === 0 && categoryDefaults.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-[#e8f5ee] text-[#1a7a4a]
                            text-[11px] font-bold px-3 py-1 rounded-full mb-3">
              {listingCategory === "house" ? "🏠" : listingCategory === "land" ? "🏘️" : "🏢"}
              {listingCategory.charAt(0).toUpperCase() + listingCategory.slice(1)} defaults loaded
            </div>
          )}

          {/* Feature list — single source, no duplicate .map() */}
          <div className="flex flex-col gap-2">
            {features.map((feature, index) => (
              <FeatureRow
                key={index}
                feature={feature}
                index={index}
                onChange={handleFeatureChange}
                onRemove={handleRemoveFeature}
              />
            ))}
          </div>

          {/* Add feature */}
          <button
            type="button"
            onClick={handleAddFeature}
            className="w-full mt-3 flex items-center justify-center gap-2
                       py-2.5 rounded-xl border-[1.5px] border-dashed border-[#1a7a4a]
                       text-[#1a7a4a] text-[12px] font-semibold
                       bg-transparent hover:bg-[#e8f5ee] hover:border-solid
                       transition-all duration-200"
          >
            <FaPlus size={10} />
            Add feature
          </button>
        </div>

        {/* ── Facilities ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] inline-block" />
            Environment &amp; Facilities
          </p>

          {/* Standard facility chips */}
          <div className="flex flex-wrap gap-2">
            {allFacilities.map((facility) => {
              const isSelected = selectedFacilities.includes(facility);
              const icon = FACILITY_ICONS[facility];
              return (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                              border-[1.5px] text-[11px] font-medium
                              transition-all duration-200
                              ${isSelected
                                ? "border-[#1a7a4a] bg-[#e8f5ee] text-[#1a7a4a] font-bold"
                                : "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563] hover:border-[#2ea06a]"
                              }`}
                >
                  {icon && <span>{icon}</span>}
                  {facility}
                </button>
              );
            })}

            {/* Custom facility chips (already saved) */}
            {customFacilities
              .filter(Boolean)
              .map((fac, i) => (
                <span
                  key={`custom-${i}`}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                             border-[1.5px] border-dashed border-[#f5a623]
                             bg-[#fffbeb] text-[#92400e] text-[11px] font-medium"
                >
                  ✨ {fac}
                  <button
                    type="button"
                    onClick={() => handleRemoveCustomFacility(i)}
                    className="text-[#d97706] hover:text-[#92400e] transition-colors ml-0.5"
                  >
                    <IoClose size={11} />
                  </button>
                </span>
              ))
            }
          </div>

          {/* Custom facility inputs (being typed) */}
          {customFacilities.map((fac, index) => (
            <div
              key={`input-${index}`}
              className="flex items-center gap-2 mt-3 px-3 py-2.5
                         bg-[#fffbeb] border-[1.5px] border-dashed border-[#f5a623]
                         rounded-xl transition-all duration-200
                         focus-within:border-solid focus-within:shadow-[0_0_0_3px_rgba(245,166,35,0.12)]"
            >
              <span className="text-[#d97706] text-sm flex-shrink-0">✏️</span>
              <input
                type="text"
                placeholder="Custom facility name…"
                value={fac}
                onChange={(e) => handleCustomFacilityChange(index, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none
                           text-sm text-[#111827] placeholder:text-[#d97706]"
              />
              <button
                type="button"
                onClick={() => handleRemoveCustomFacility(index)}
                className="text-[#f59e0b] hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Remove"
              >
                <IoClose size={14} />
              </button>
            </div>
          ))}

          {/* Add custom facility */}
          <button
            type="button"
            onClick={handleAddCustomFacility}
            className="w-full mt-3 flex items-center justify-center gap-2
                       py-2.5 rounded-xl border-[1.5px] border-dashed border-[#f5a623]
                       text-[#92400e] text-[12px] font-semibold bg-[#fffbeb]
                       hover:bg-[#fef3c7] hover:border-solid transition-all duration-200"
          >
            <FaPlus size={10} />
            Add Custom Facility
          </button>
        </div>

      </div>
    </ToggleCollapse>
  );
}
