"use client";

import { useState, useCallback } from "react";
import { PropertyStatusEnum } from "../types/property";
import type { PropertyFormData } from "../types/property";
import SectionCard from "./SectionCard";
import TogglePills from "./TogglePills";
import PhotoUploadSection from "./PhotoUploadSection";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

// ─── Facility data ────────────────────────────────────────────────────────────

const FEATURE_ICONS: Record<string, string> = {
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

const DEFAULT_FEATURES = Object.keys(FEATURE_ICONS);

// ─── Custom feature entry ─────────────────────────────────────────────────────

interface CustomFeatureEntry {
  /** Stable identity — never mutated after creation */
  token: string;
  /** User-typed text — mutable */
  value: string;
}

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

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Merge the preset-toggle list + custom entries into the flat string[]
 * that PropertyFormData.features expects.
 *
 * Custom entries whose value is blank are excluded — they will not be
 * sent to the backend until the user has actually typed something.
 */
function buildFeaturesArray(
  presetSelected: string[],
  customEntries:  CustomFeatureEntry[],
): string[] {
  const customs = customEntries
    .map((e) => e.value.trim())
    .filter(Boolean);
  return [...presetSelected, ...customs];
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function Step2Details({ data, onUpdate }: Step2Props) {

  // ── Preset selection (from DEFAULT_FEATURES) ──────────────────────────────
  //
  // Seed from data.features on first render: any value that matches a preset
  // label goes here; anything else is treated as a custom entry below.

  const [presetSelected, setPresetSelected] = useState<string[]>(() =>
    data.features.filter((f) => DEFAULT_FEATURES.includes(f))
  );

  // ── Custom entries — stable token + mutable value ─────────────────────────

  const [customEntries, setCustomEntries] = useState<CustomFeatureEntry[]>(() =>
    data.features
      .filter((f) => !DEFAULT_FEATURES.includes(f))
      .map((value) => ({
        token: `__custom_${Date.now()}_${Math.random()}`,
        value,
      }))
  );

  // ── Shared updater: called whenever preset or custom state changes ─────────
  //
  // Keeps data.features in sync so the parent always has the latest flat list.

  const syncFeatures = useCallback(
    (nextPreset: string[], nextCustom: CustomFeatureEntry[]) => {
      onUpdate({ features: buildFeaturesArray(nextPreset, nextCustom) });
    },
    [onUpdate],
  );

  // ── Preset toggle ─────────────────────────────────────────────────────────

  const toggleFeature = useCallback(
    (label: string) => {
      const next = presetSelected.includes(label)
        ? presetSelected.filter((f) => f !== label)
        : [...presetSelected, label];
      setPresetSelected(next);
      syncFeatures(next, customEntries);
    },
    [presetSelected, customEntries, syncFeatures],
  );

  // ── Custom entry handlers ─────────────────────────────────────────────────

  const addCustomFeature = useCallback(() => {
    const entry: CustomFeatureEntry = {
      token: `__custom_${Date.now()}`,
      value: "",
    };
    const next = [...customEntries, entry];
    setCustomEntries(next);
    // No need to sync yet — empty value won't be included in the array
  }, [customEntries]);

  /**
   * Update the *value* of an entry identified by its stable token.
   * The token (and therefore the key) never changes → no remount → no lost focus.
   */
  const updateCustomFeature = useCallback(
    (token: string, newValue: string) => {
      const next = customEntries.map((e) =>
        e.token === token ? { ...e, value: newValue } : e,
      );
      setCustomEntries(next);
      syncFeatures(presetSelected, next);
    },
    [customEntries, presetSelected, syncFeatures],
  );

  const removeCustomFeature = useCallback(
    (token: string) => {
      const next = customEntries.filter((e) => e.token !== token);
      setCustomEntries(next);
      syncFeatures(presetSelected, next);
    },
    [customEntries, presetSelected, syncFeatures],
  );

  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-4">

      {/* ── Photos ──────────────────────────────────────────────────────── */}
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

      {/* ── Listing Status ───────────────────────────────────────────────── */}
      <SectionCard icon="📋" title="Listing Status">
        <TogglePills<PropertyStatusEnum>
          options={[
            { label: "Available",   value: PropertyStatusEnum.available,   icon: "✅" },
            { label: "Rented",      value: PropertyStatusEnum.rented,      icon: "⏳" },
            { label: "Unavailable", value: PropertyStatusEnum.unavailable, icon: "❌" },
          ]}
          value={data.status}
          onChange={(val) => onUpdate({ status: val })}
        />
      </SectionCard>

      {/* ── Description ─────────────────────────────────────────────────── */}
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

      {/* ── Property Features ───────────────────────────────────────────── */}
      <SectionCard icon="🌿" title="Property Features">

        {/* Preset toggles */}
        <div className="flex flex-wrap gap-2 mb-3">
          {DEFAULT_FEATURES.map((feature) => {
            const selected = presetSelected.includes(feature);
            return (
              <button
                key={feature}
                type="button"
                onClick={() => toggleFeature(feature)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           border-[1.5px] text-[11px] font-medium transition-all duration-200"
                style={
                  selected
                    ? { borderColor: "#1e5f74", background: "#e0f0f5", color: "#1e5f74", fontWeight: 700 }
                    : { borderColor: "#e5e7eb", background: "#f9fafb", color: "#4b5563" }
                }
                onMouseEnter={(e) => {
                  if (!selected)
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74";
                }}
                onMouseLeave={(e) => {
                  if (!selected)
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                }}
              >
                <span>{FEATURE_ICONS[feature]}</span>
                {feature}
              </button>
            );
          })}
        </div>

        {/* Custom entries
            key={entry.token} — STABLE identity, never changes between keystrokes.
            The token is set once at creation and never mutated, so React always
            reconciles this as the same DOM node regardless of what the user types. */}
        {customEntries.map((entry) => (
          <div
            key={entry.token}
            className="flex items-center gap-2 mt-2 px-3 py-2.5
                       bg-[#fffbeb] border-[1.5px] border-dashed border-[#f0a500] rounded-xl"
            onFocusCapture={(e) => {
              e.currentTarget.style.borderStyle = "solid";
              e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(240,165,0,0.12)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderStyle = "dashed";
              e.currentTarget.style.boxShadow   = "none";
            }}
          >
            <span className="text-[#d97706] text-sm flex-shrink-0">✏️</span>
            <input
              type="text"
              placeholder="Custom feature name…"
              value={entry.value}
              onChange={(e) => updateCustomFeature(entry.token, e.target.value)}
              className="flex-1 bg-transparent border-none outline-none
                         text-sm text-[#111827] placeholder:text-[#d97706]"
            />
            <button
              type="button"
              onClick={() => removeCustomFeature(entry.token)}
              className="text-[#f59e0b] hover:text-red-500 transition-colors flex-shrink-0"
            >
              <IoClose size={14} />
            </button>
          </div>
        ))}

        {/* Add custom */}
        <button
          type="button"
          onClick={addCustomFeature}
          className="w-full mt-3 flex items-center justify-center gap-2
                     py-2.5 rounded-xl border-[1.5px] border-dashed
                     text-[12px] font-semibold transition-all duration-200"
          style={{ borderColor: "#f0a500", color: "#c88400", background: "#fffbeb" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background    = "#fef3c7";
            (e.currentTarget as HTMLButtonElement).style.borderStyle   = "solid";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background    = "#fffbeb";
            (e.currentTarget as HTMLButtonElement).style.borderStyle   = "dashed";
          }}
        >
          <FaPlus size={10} /> Add Custom Feature
        </button>
      </SectionCard>
    </div>
  );
}