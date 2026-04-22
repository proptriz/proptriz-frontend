"use client";

import { useState, useCallback } from "react";
import { PropertyStatusEnum }    from "../types/property";
import type { PropertyFormData } from "../types/property";
import SectionCard               from "./SectionCard";
import TogglePills               from "./TogglePills";
import PhotoUploadSection        from "./PhotoUploadSection";
import { FaPlus }                from "react-icons/fa6";
import { IoClose }               from "react-icons/io5";
import { useLanguage }          from "@/i18n/LanguageContext";

// ─────────────────────────────────────────────────────────────────────────────
// PRESET FEATURES
// Shown as toggleable pills in the Property Features section.
// These are merged together with user-typed custom entries in data.features.
// ─────────────────────────────────────────────────────────────────────────────

const PRESET_FEATURES: { label: string; icon: string }[] = [
  { label: "Parking Lot",       icon: "🅿️" },
  { label: "Garden",            icon: "🌿" },
  { label: "Gym",               icon: "🏋️" },
  { label: "Swimming Pool",     icon: "🏊" },
  { label: "Home Theatre",      icon: "🎬" },
  { label: "Kids Friendly",     icon: "👶" },
  { label: "24hr Electricity",  icon: "⚡" },
  { label: "Water Supply",      icon: "💧" },
  { label: "Security Services", icon: "🔒" },
  { label: "CCTV",              icon: "📹" },
  { label: "Generator",         icon: "🔋" },
  { label: "Wifi / Internet",   icon: "📶" },
  { label: "Boys Quarter",      icon: "🏠" },
  { label: "Pet Allowed",       icon: "🐾" },
];

const PRESET_LABELS = new Set(PRESET_FEATURES.map((f) => f.label));

// ─────────────────────────────────────────────────────────────────────────────
// FOCUS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// STABLE CUSTOM ENTRY  (avoids lost-focus bug — key is token, not value)
// ─────────────────────────────────────────────────────────────────────────────

interface CustomEntry {
  token: string;   // stable identity — never mutated after creation
  value: string;   // what the user typed — mutated freely
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface Step2Props {
  data:     PropertyFormData;
  onUpdate: (partial: Partial<PropertyFormData>) => void;
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Merge preset toggles + non-empty custom values into data.features */
function buildFeatures(presets: string[], customs: CustomEntry[]): string[] {
  const customValues = customs.map((e) => e.value.trim()).filter(Boolean);
  return [...presets, ...customValues];
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function Step2Details({ data, onUpdate }: Step2Props) {
  const { t } = useLanguage();

  // ── Seed preset selection from data.features ──────────────────────────────
  const [presetSelected, setPresetSelected] = useState<string[]>(() =>
    data.features.filter((f) => PRESET_LABELS.has(f))
  );

  // ── Seed custom entries from data.features ────────────────────────────────
  const [customEntries, setCustomEntries] = useState<CustomEntry[]>(() =>
    data.features
      .filter((f) => !PRESET_LABELS.has(f))
      .map((value) => ({ token: `__c_${Date.now()}_${Math.random()}`, value }))
  );

  const sync = useCallback(
    (nextPreset: string[], nextCustom: CustomEntry[]) => {
      onUpdate({ features: buildFeatures(nextPreset, nextCustom) });
    },
    [onUpdate],
  );

  // ── Preset toggle ─────────────────────────────────────────────────────────
  const togglePreset = useCallback((label: string) => {
    const next = presetSelected.includes(label)
      ? presetSelected.filter((f) => f !== label)
      : [...presetSelected, label];
    setPresetSelected(next);
    sync(next, customEntries);
  }, [presetSelected, customEntries, sync]);

  // ── Custom entry handlers ─────────────────────────────────────────────────
  const addCustom = useCallback(() => {
    const entry: CustomEntry = { token: `__c_${Date.now()}`, value: "" };
    const next = [...customEntries, entry];
    setCustomEntries(next);
    // No sync yet — empty value excluded from array
  }, [customEntries]);

  const updateCustom = useCallback((token: string, value: string) => {
    const next = customEntries.map((e) => e.token === token ? { ...e, value } : e);
    setCustomEntries(next);
    sync(presetSelected, next);
  }, [customEntries, presetSelected, sync]);

  const removeCustom = useCallback((token: string) => {
    const next = customEntries.filter((e) => e.token !== token);
    setCustomEntries(next);
    sync(presetSelected, next);
  }, [customEntries, presetSelected, sync]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-4">

      {/* ── Photos ──────────────────────────────────────────────────────── */}
      <SectionCard icon="📸" title={t("s2_photos")}>
        <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
          {t("s2_photos_sub")}
        </p>
        <PhotoUploadSection
          photos={data.photos}
          maxPhotos={5}
          onUpload={(files) => onUpdate({ photos: [...data.photos, ...files] })}
          onRemove={(i) => onUpdate({ photos: data.photos.filter((_, idx) => idx !== i) })}
        />
        {data.photos.length === 0 && (
          <p className="text-[11px] text-amber-500 mt-2 flex items-center gap-1">
            💡 {t("s2_photos_tip")}
          </p>
        )}
      </SectionCard>

      {/* ── Listing Status ───────────────────────────────────────────────── */}
      <SectionCard icon="📋" title={t("s2_status")}>
        <TogglePills<PropertyStatusEnum>
          options={[
            { label: t("s2_status_available"), value: PropertyStatusEnum.available,   icon: "✅" },
            { label: t("s2_status_rented"),    value: PropertyStatusEnum.rented,      icon: "⏳" },
            { label: t("s2_status_unavail"),   value: PropertyStatusEnum.unavailable, icon: "❌" },
          ]}
          value={data.status}
          onChange={(val) => onUpdate({ status: val })}
        />
      </SectionCard>

      {/* ── Description ─────────────────────────────────────────────────── */}
      <SectionCard icon="📝" title={t("s2_description")}>
        <div
          className="flex items-start gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                     rounded-xl px-3.5 py-3 transition-all duration-200"
          onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
          onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
        >
          <span className="text-[#9ca3af] text-base pt-0.5 flex-shrink-0">📝</span>
          <textarea
            rows={4}
            placeholder={t("s2_description_ph")}
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full outline-none bg-transparent text-sm
                       text-[#111827] placeholder:text-[#9ca3af] resize-none"
          />
        </div>
      </SectionCard>

      {/* ── Property Features & Facilities ──────────────────────────────── */}
      {/*
        Features and facilities are now a single string[] field.
        Preset pills let the user toggle common amenities quickly.
        Custom entries handle anything not in the preset list.
      */}
      <SectionCard icon="🌿" title={t("s2_features")}>
        <p className="text-[11px] text-[#9ca3af] mb-3 leading-relaxed">
          {t("s2_features_sub")}
        </p>

        {/* Preset toggles */}
        <div className="flex flex-wrap gap-2 mb-3">
          {PRESET_FEATURES.map(({ label, icon }) => {
            const selected = presetSelected.includes(label);
            return (
              <button
                key={label}
                type="button"
                onClick={() => togglePreset(label)}
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
                <span>{icon}</span>
                {label}
              </button>
            );
          })}
        </div>

        {/* Custom entries — key={token} is stable so focus is never lost */}
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
              placeholder={t("s2_custom_ph")}
              value={entry.value}
              onChange={(e) => updateCustom(entry.token, e.target.value)}
              className="flex-1 bg-transparent border-none outline-none
                         text-sm text-[#111827] placeholder:text-[#d97706]"
            />
            <button
              type="button"
              onClick={() => removeCustom(entry.token)}
              className="text-[#f59e0b] hover:text-red-500 transition-colors flex-shrink-0"
            >
              <IoClose size={14} />
            </button>
          </div>
        ))}

        {/* Add custom */}
        <button
          type="button"
          onClick={addCustom}
          className="w-full mt-3 flex items-center justify-center gap-2
                     py-2.5 rounded-xl border-[1.5px] border-dashed
                     text-[12px] font-semibold transition-all duration-200"
          style={{ borderColor: "#f0a500", color: "#c88400", background: "#fffbeb" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background  = "#fef3c7";
            (e.currentTarget as HTMLButtonElement).style.borderStyle = "solid";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background  = "#fffbeb";
            (e.currentTarget as HTMLButtonElement).style.borderStyle = "dashed";
          }}
        >
          <FaPlus size={10} /> {t("s2_add_custom")}
        </button>
      </SectionCard>
    </div>
  );
}
