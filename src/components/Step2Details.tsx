"use client";

import { PropertyStatusEnum } from "../types/property";
import type { PropertyFormData } from "../types/property";
import SectionCard from "./SectionCard";
import TogglePills from "./TogglePills";
import PhotoUploadSection from "./PhotoUploadSection";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

// ─── Facility data ────────────────────────────────────────────────────────────

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

// ─── Category-seeded default features ────────────────────────────────────────

const CATEGORY_FEATURE_DEFAULTS: Record<string, { name: string; quantity: number }[]> = {
  house:    [{ name: "Bedrooms", quantity: 3 }, { name: "Bathrooms", quantity: 2 }, { name: "Garage", quantity: 1 }],
  shortlet: [{ name: "Bedrooms", quantity: 2 }, { name: "Bathrooms", quantity: 1 }, { name: "Living Room", quantity: 1 }],
  hotel:    [{ name: "Reception Area", quantity: 1 }, { name: "Conference Room", quantity: 1 }, { name: "Rooms", quantity: 10 }],
  office:   [{ name: "Meeting Room", quantity: 1 }, { name: "Workstations", quantity: 10 }, { name: "Server Room", quantity: 1 }],
  land:     [{ name: "Fenced", quantity: 1 }, { name: "Survey Plan", quantity: 1 }, { name: "Registered Title", quantity: 1 }],
  shop:     [{ name: "Display Area", quantity: 1 }, { name: "Storage Room", quantity: 1 }],
  others:   [],
};

// ─── Focus helpers ────────────────────────────────────────────────────────────

const onFocusTeal = (el: HTMLElement) => {
  el.style.borderColor = "#1e5f74";
  el.style.background  = "white";
  el.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.08)";
};
const onBlurTeal = (el: HTMLElement) => {
  el.style.borderColor = "#e5e7eb";
  el.style.background  = "#f9fafb";
  el.style.boxShadow   = "none";
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Step2Props {
  data: PropertyFormData;
  onUpdate: (partial: Partial<PropertyFormData>) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step2Details({ data, onUpdate }: Step2Props) {

  // ── Features ───────────────────────────────────────────────────────────
  const categoryDefaults = CATEGORY_FEATURE_DEFAULTS[data.category] ?? [];
  const usingDefaults    = data.features.length === 0;
  const displayFeatures  = usingDefaults ? categoryDefaults : data.features;

  const materializeDefaults = () => categoryDefaults.map((f) => ({ ...f }));

  const updateFeatureName = (index: number, name: string) => {
    const base = usingDefaults ? materializeDefaults() : [...data.features];
    base[index] = { ...base[index], name };
    onUpdate({ features: base });
  };

  const updateFeatureQty = (index: number, qty: number) => {
    const base = usingDefaults ? materializeDefaults() : [...data.features];
    base[index] = { ...base[index], quantity: Math.max(1, qty) };
    onUpdate({ features: base });
  };

  const removeFeature = (index: number) => {
    const base = usingDefaults ? materializeDefaults() : [...data.features];
    onUpdate({ features: base.filter((_, i) => i !== index) });
  };

  const addFeature = () => {
    const base = usingDefaults ? materializeDefaults() : [...data.features];
    onUpdate({ features: [...base, { name: "", quantity: 1 }] });
  };

  // ── Facilities ─────────────────────────────────────────────────────────
  const toggleFacility = (label: string) => {
    if (data.facilities.includes(label)) {
      onUpdate({ facilities: data.facilities.filter((f) => f !== label) });
    } else {
      onUpdate({ facilities: [...data.facilities, label] });
    }
  };

  const addCustomFacility = () =>
    onUpdate({ facilities: [...data.facilities, `__custom_${Date.now()}`] });

  const updateCustomFacility = (oldVal: string, newVal: string) =>
    onUpdate({ facilities: data.facilities.map((f) => (f === oldVal ? newVal : f)) });

  const removeCustomFacility = (val: string) =>
    onUpdate({ facilities: data.facilities.filter((f) => f !== val) });

  const customFacilities = data.facilities.filter((f) => !DEFAULT_FACILITIES.includes(f));

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* ── Photos ────────────────────────────────────────────────────────── */}
      <SectionCard icon="📸" title="Property Photos">
        <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
          Add up to 5 photos. The first photo will be your listing cover image.
        </p>
        <PhotoUploadSection
          photos={data.photos}
          maxPhotos={5}
          onUpload={(files) => onUpdate({ photos: [...data.photos, ...files] })}
          onRemove={(i) => onUpdate({ photos: data.photos.filter((_, idx) => idx !== i) })}
        />
        {data.photos.length === 0 && (
          <p className="text-[11px] text-amber-500 mt-2 flex items-center gap-1">
            💡 Properties with photos get 3× more views
          </p>
        )}
      </SectionCard>

      {/* ── Listing Status ────────────────────────────────────────────────── */}
      <SectionCard icon="📋" title="Listing Status">
        <TogglePills<PropertyStatusEnum>
          options={[
            { label: "Available", value: PropertyStatusEnum.available, icon: "✅" },
            { label: "Reserved",  value: PropertyStatusEnum.rented,    icon: "⏳" },
            { label: "Taken",     value: PropertyStatusEnum.sold,      icon: "❌" },
          ]}
          value={data.status}
          onChange={(val) => onUpdate({ status: val })}
        />
      </SectionCard>

      {/* ── Description ───────────────────────────────────────────────────── */}
      <SectionCard icon="📝" title="Description">
        <div
          className="flex items-start gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                     rounded-xl px-3.5 py-3 transition-all duration-200"
          onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
          onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
        >
          <span className="text-[#9ca3af] text-base pt-0.5 flex-shrink-0">📝</span>
          <textarea
            rows={4}
            placeholder="Describe the property, its features and neighbourhood… what makes it special?"
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full outline-none bg-transparent text-sm
                       text-[#111827] placeholder:text-[#9ca3af] resize-none"
          />
        </div>
      </SectionCard>

      {/* ── Property Features ─────────────────────────────────────────────── */}
      <SectionCard icon="🛏️" title="Property Features">

        {usingDefaults && categoryDefaults.length > 0 && (
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-bold
                       px-3 py-1 rounded-full mb-3"
            style={{ background: "#e0f0f5", color: "#1e5f74" }}
          >
            {CATEGORY_FEATURE_DEFAULTS[data.category]?.length ? "🏠" : "📦"}
            {data.category.charAt(0).toUpperCase() + data.category.slice(1)} defaults loaded — tap to edit
          </div>
        )}

        <div className="flex flex-col gap-2">
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-2 px-3 py-2.5 bg-[#f9fafb]
                         border-[1.5px] border-[#e5e7eb] rounded-xl transition-all duration-200"
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = "#1e5f74";
                e.currentTarget.style.background  = "white";
                e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.08)";
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background  = "#f9fafb";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              <span className="text-[#d1d5db] text-sm select-none flex-shrink-0 cursor-grab">⠿</span>

              <input
                type="text"
                placeholder="Feature name e.g. Swimming Pool"
                value={feature.name}
                onChange={(e) => updateFeatureName(index, e.target.value)}
                className="flex-1 bg-transparent border-none outline-none
                           text-sm text-[#111827] placeholder:text-[#9ca3af] min-w-0"
              />

              <div className="flex items-center border-[1.5px] border-[#e5e7eb]
                              rounded-lg overflow-hidden flex-shrink-0">
                <button
                  type="button"
                  onClick={() => updateFeatureQty(index, feature.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center text-base transition-colors"
                  style={{ background: "#e0f0f5", color: "#1e5f74" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1e5f74"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#e0f0f5"; (e.currentTarget as HTMLButtonElement).style.color = "#1e5f74"; }}
                >−</button>
                <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
                  {feature.quantity}
                </span>
                <button
                  type="button"
                  onClick={() => updateFeatureQty(index, feature.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center text-base transition-colors"
                  style={{ background: "#e0f0f5", color: "#1e5f74" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#1e5f74"; (e.currentTarget as HTMLButtonElement).style.color = "white"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#e0f0f5"; (e.currentTarget as HTMLButtonElement).style.color = "#1e5f74"; }}
                >+</button>
              </div>

              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center
                           justify-center flex-shrink-0 hover:bg-red-500 hover:text-white transition-colors"
              >
                <IoClose size={12} />
              </button>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addFeature}
          className="w-full mt-3 flex items-center justify-center gap-2
                     py-2.5 rounded-xl border-[1.5px] border-dashed
                     text-[12px] font-semibold bg-transparent transition-all duration-200"
          style={{ borderColor: "#1e5f74", color: "#1e5f74" }}
          onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "#e0f0f5"}
          onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
        >
          <FaPlus size={10} /> Add Feature
        </button>
      </SectionCard>

      {/* ── Facilities ────────────────────────────────────────────────────── */}
      <SectionCard icon="🌿" title="Environment & Facilities">
        <div className="flex flex-wrap gap-2 mb-3">
          {DEFAULT_FACILITIES.map((facility) => {
            const selected = data.facilities.includes(facility);
            return (
              <button
                key={facility}
                type="button"
                onClick={() => toggleFacility(facility)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           border-[1.5px] text-[11px] font-medium transition-all duration-200"
                style={selected
                  ? { borderColor: "#1e5f74", background: "#e0f0f5", color: "#1e5f74", fontWeight: 700 }
                  : { borderColor: "#e5e7eb", background: "#f9fafb", color: "#4b5563" }}
                onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"; }}
                onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
              >
                <span>{FACILITY_ICONS[facility]}</span>
                {facility}
              </button>
            );
          })}
        </div>

        {customFacilities.map((fac) => (
          <div
            key={fac}
            className="flex items-center gap-2 mt-2 px-3 py-2.5
                       bg-[#fffbeb] border-[1.5px] border-dashed border-[#f0a500] rounded-xl"
            onFocusCapture={(e) => { e.currentTarget.style.borderStyle = "solid"; e.currentTarget.style.boxShadow = "0 0 0 3px rgba(240,165,0,0.12)"; }}
            onBlurCapture={(e)  => { e.currentTarget.style.borderStyle = "dashed"; e.currentTarget.style.boxShadow = "none"; }}
          >
            <span className="text-[#d97706] text-sm flex-shrink-0">✏️</span>
            <input
              type="text"
              placeholder="Custom facility name…"
              value={fac.startsWith("__custom_") ? "" : fac}
              onChange={(e) => updateCustomFacility(fac, e.target.value)}
              className="flex-1 bg-transparent border-none outline-none
                         text-sm text-[#111827] placeholder:text-[#d97706]"
            />
            <button
              type="button"
              onClick={() => removeCustomFacility(fac)}
              className="text-[#f59e0b] hover:text-red-500 transition-colors flex-shrink-0"
            >
              <IoClose size={14} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={addCustomFacility}
          className="w-full mt-3 flex items-center justify-center gap-2
                     py-2.5 rounded-xl border-[1.5px] border-dashed
                     text-[12px] font-semibold transition-all duration-200"
          style={{ borderColor: "#f0a500", color: "#c88400", background: "#fffbeb" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fef3c7"; (e.currentTarget as HTMLButtonElement).style.borderStyle = "solid"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "#fffbeb"; (e.currentTarget as HTMLButtonElement).style.borderStyle = "dashed"; }}
        >
          <FaPlus size={10} /> Add Custom Facility
        </button>
      </SectionCard>
    </div>
  );
}