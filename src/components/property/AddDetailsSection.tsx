'use client';

import { useEffect, useState, useCallback } from "react";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import ToggleCollapse from "../shared/ToggleCollapse";
import { CategoryEnum, Feature, NegotiableEnum } from "@/types";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  listingCategory:     CategoryEnum;
  existingFeatures?:   Feature[];
  existingFacilities?: string[];
  onNegotiableChange?: (value: NegotiableEnum) => void;
  onFeaturesChange?:   (features: Feature[]) => void;
  onFacilitiesChange?: (facilities: string[]) => void;
}

// ─── Stable custom facility type ─────────────────────────────────────────────
//
//  ROOT CAUSE OF THE BUG:
//    customFacilities was string[]. Every input was keyed by its array index.
//    When the user typed a character, setState ran, React re-rendered, and
//    because the keys were positional (0, 1, 2…) React couldn't guarantee
//    it was looking at the same DOM node — so it unmounted and remounted
//    the focused input, stealing focus.
//
//  FIX:
//    Each custom facility is now { id, value }. The id is assigned exactly
//    once when the entry is created and never changes. Keying the JSX element
//    by id means React always reconciles to the same DOM node regardless of
//    how many siblings are added or removed around it → focus is never lost.
//
type CustomFacility = { id: string; value: string };

function makeId(): string {
  return `cf_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
}
function makeCustomFacility(value = ""): CustomFacility {
  return { id: makeId(), value };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface FeatureRowProps {
  feature:  Feature;
  index:    number;
  onChange: (index: number, key: keyof Feature, value: string | number) => void;
  onRemove: (index: number) => void;
}

function FeatureRow({ feature, index, onChange, onRemove }: FeatureRowProps) {
  return (
    <div
      className="flex items-center gap-2 px-3 py-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                 rounded-xl transition-all duration-200
                 focus-within:border-[#1e5f74] focus-within:bg-white
                 focus-within:shadow-[0_0_0_3px_rgba(30,95,116,0.08)]"
    >
      <span className="text-[#d1d5db] text-sm cursor-grab select-none flex-shrink-0" title="Drag to reorder">
        ⠿
      </span>

      <input
        type="text"
        placeholder="e.g. Swimming Pool, Garden…"
        value={feature.name}
        onChange={(e) => onChange(index, "name", e.target.value)}
        className="flex-1 bg-transparent border-none outline-none text-sm text-[#111827]
                   placeholder:text-[#9ca3af] min-w-0"
      />

      <div className="flex items-center border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden flex-shrink-0">
        <button
          type="button"
          onClick={() => onChange(index, "quantity", Math.max(1, feature.quantity - 1))}
          className="w-7 h-7 flex items-center justify-center text-base
                     bg-[#e0f0f5] text-[#1e5f74]
                     hover:bg-[#1e5f74] hover:text-white transition-colors"
        >−</button>
        <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
          {feature.quantity}
        </span>
        <button
          type="button"
          onClick={() => onChange(index, "quantity", feature.quantity + 1)}
          className="w-7 h-7 flex items-center justify-center text-base
                     bg-[#e0f0f5] text-[#1e5f74]
                     hover:bg-[#1e5f74] hover:text-white transition-colors"
        >+</button>
      </div>

      <button
        type="button"
        onClick={() => onRemove(index)}
        className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center justify-center
                   flex-shrink-0 hover:bg-red-500 hover:text-white transition-colors"
        aria-label={`Remove ${feature.name}`}
      >
        <IoClose size={13} />
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AddPropertyDetails({
  listingCategory,
  existingFeatures   = [],
  existingFacilities = [],
  onNegotiableChange,
  onFeaturesChange,
  onFacilitiesChange,
}: AddPropertyDetailsProps) {

  const categoryDefaults = CATEGORY_FEATURES[listingCategory] ?? [];

  const [negotiable, setNegotiable] = useState<NegotiableEnum>(NegotiableEnum.Negotiable);

  const [features, setFeatures] = useState<Feature[]>(
    existingFeatures.length > 0 ? existingFeatures : categoryDefaults
  );

  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(existingFacilities);

  // Stable entries — id assigned once, never changes
  const [customFacilities, setCustomFacilities] = useState<CustomFacility[]>(() =>
    existingFacilities
      .filter((f) => !DEFAULT_FACILITIES.includes(f))
      .map((f) => makeCustomFacility(f))
  );

  // ── Notify parent ──────────────────────────────────────────────────────────
  useEffect(() => { onNegotiableChange?.(negotiable); }, [negotiable, onNegotiableChange]);
  useEffect(() => { onFeaturesChange?.(features); }, [features, onFeaturesChange]);
  useEffect(() => {
    onFacilitiesChange?.([
      ...selectedFacilities,
      ...customFacilities.map((c) => c.value).filter(Boolean),
    ]);
  }, [selectedFacilities, customFacilities, onFacilitiesChange]);

  // ── Feature handlers ───────────────────────────────────────────────────────
  const handleFeatureChange = useCallback(
    (index: number, key: keyof Feature, value: string | number) =>
      setFeatures((prev) => {
        const next = [...prev];
        next[index] = { ...next[index], [key]: value };
        return next;
      }),
    []
  );
  const handleAddFeature    = useCallback(() =>
    setFeatures((prev) => [...prev, { name: "", quantity: 1 }]), []);
  const handleRemoveFeature = useCallback((index: number) =>
    setFeatures((prev) => prev.filter((_, i) => i !== index)), []);

  // ── Standard facility toggle ───────────────────────────────────────────────
  const toggleFacility = useCallback((facility: string) =>
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((f) => f !== facility)
        : [...prev, facility]
    ), []);

  // ── Custom facility handlers (keyed by stable id, not index) ──────────────
  const handleAddCustomFacility = useCallback(() =>
    setCustomFacilities((prev) => [...prev, makeCustomFacility()]), []);

  // Mutates only the matching entry by id — all other entries are untouched,
  // their keys are unchanged, their DOM nodes are NOT remounted.
  const handleCustomFacilityChange = useCallback((id: string, value: string) =>
    setCustomFacilities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, value } : c))
    ), []);

  const handleRemoveCustomFacility = useCallback((id: string) =>
    setCustomFacilities((prev) => prev.filter((c) => c.id !== id)), []);

  const extraExisting = existingFacilities.filter((f) => !DEFAULT_FACILITIES.includes(f));
  const allFacilities = [...DEFAULT_FACILITIES, ...extraExisting];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <ToggleCollapse header="🏗️ Other Details" open>
      <div className="flex flex-col gap-4 mt-2">

        {/* ── Negotiable ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                        flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
            Price Negotiation
          </p>

          <div className="flex gap-2">
            {([
              { value: NegotiableEnum.Negotiable,    label: "✅ Negotiable"  },
              { value: NegotiableEnum.NonNegotiable, label: "🔒 Fixed Price" },
            ] as const).map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setNegotiable(opt.value)}
                className={`flex-1 py-2.5 rounded-xl border-[1.5px] text-[13px] font-medium
                            transition-all duration-200
                            ${negotiable === opt.value
                              ? "bg-[#1e5f74] text-white border-[#1e5f74] font-bold"
                              : "bg-[#f9fafb] text-[#4b5563] border-[#e5e7eb] hover:border-[#1e5f74]"
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
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                        flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
            Property Features
          </p>

          {existingFeatures.length === 0 && categoryDefaults.length > 0 && (
            <div className="inline-flex items-center gap-1.5 bg-[#e0f0f5] text-[#1e5f74]
                            text-[11px] font-bold px-3 py-1 rounded-full mb-3">
              {listingCategory === "house" ? "🏠" : listingCategory === "land" ? "🏘️" : "🏢"}
              {listingCategory.charAt(0).toUpperCase() + listingCategory.slice(1)} defaults loaded
            </div>
          )}

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

          <button
            type="button"
            onClick={handleAddFeature}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5
                       rounded-xl border-[1.5px] border-dashed border-[#1e5f74]
                       text-[#1e5f74] text-[12px] font-semibold
                       bg-transparent hover:bg-[#e0f0f5] hover:border-solid
                       transition-all duration-200"
          >
            <FaPlus size={10} /> Add feature
          </button>
        </div>

        {/* ── Facilities ───────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
          <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                        flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
            Environment &amp; Facilities
          </p>

          {/* Standard chips */}
          <div className="flex flex-wrap gap-2">
            {allFacilities.map((facility) => {
              const selected = selectedFacilities.includes(facility);
              return (
                <button
                  key={facility}
                  type="button"
                  onClick={() => toggleFacility(facility)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full
                              border-[1.5px] text-[11px] font-medium transition-all duration-200
                              ${selected
                                ? "border-[#1e5f74] bg-[#e0f0f5] text-[#1e5f74] font-bold"
                                : "border-[#e5e7eb] bg-[#f9fafb] text-[#4b5563] hover:border-[#1e5f74]"
                              }`}
                >
                  {FACILITY_ICONS[facility] && <span>{FACILITY_ICONS[facility]}</span>}
                  {facility}
                </button>
              );
            })}
          </div>

          {/* ── Custom facility inputs ────────────────────────────────────────
               key={entry.id}  ← the only thing that matters for the fix.
               id is set once at creation; React maps the same key → same
               DOM <input> → browser never unmounts the focused element.
          ───────────────────────────────────────────────────────────────── */}
          {customFacilities.map((entry) => (
            <div
              key={entry.id}
              className="flex items-center gap-2 mt-3 px-3 py-2.5
                         bg-[#fffbeb] border-[1.5px] border-dashed border-[#f0a500]
                         rounded-xl transition-all duration-200
                         focus-within:border-solid
                         focus-within:shadow-[0_0_0_3px_rgba(240,165,0,0.12)]"
            >
              <span className="text-[#d97706] text-sm flex-shrink-0">✏️</span>
              <input
                type="text"
                placeholder="Custom facility name…"
                value={entry.value}
                onChange={(e) => handleCustomFacilityChange(entry.id, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none
                           text-sm text-[#111827] placeholder:text-[#d97706]"
              />
              <button
                type="button"
                onClick={() => handleRemoveCustomFacility(entry.id)}
                className="text-[#f59e0b] hover:text-red-500 transition-colors flex-shrink-0"
                aria-label="Remove"
              >
                <IoClose size={14} />
              </button>
            </div>
          ))}

          <button
            type="button"
            onClick={handleAddCustomFacility}
            className="w-full mt-3 flex items-center justify-center gap-2 py-2.5
                       rounded-xl border-[1.5px] border-dashed border-[#f0a500]
                       text-[#92400e] text-[12px] font-semibold bg-[#fffbeb]
                       hover:bg-[#fef3c7] hover:border-solid transition-all duration-200"
          >
            <FaPlus size={10} /> Add Custom Facility
          </button>
        </div>

      </div>
    </ToggleCollapse>
  );
}