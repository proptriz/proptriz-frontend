"use client";

import {
  CategoryEnum, ListForEnum, RenewalEnum,
  NegotiableEnum, PropertyStatusEnum,
} from "../types/property";
import type { PropertyFormData } from "../types/property";
import SectionCard from "./SectionCard";
import TogglePills from "./TogglePills";
import Counter from "./Counter";
import PriceInput from "./PriceInput";
import MapPreview from "./MapPreview";

// ─── Category config ──────────────────────────────────────────────────────────

const CATEGORIES = [
  { value: CategoryEnum.house,   icon: "🏠", label: "House"   },
  { value: CategoryEnum.shortlet,icon: "🛎️", label: "Shortlet"},
  { value: CategoryEnum.hotel,   icon: "🏨", label: "Hotel"   },
  { value: CategoryEnum.office,  icon: "🏢", label: "Office"  },
  { value: CategoryEnum.land,    icon: "🏘️", label: "Land"   },
  { value: CategoryEnum.shop,    icon: "🏪", label: "Shop"    },
  { value: CategoryEnum.others,  icon: "🏗️", label: "Others" },
];

// ─── Focus helpers ────────────────────────────────────────────────────────────

const onFocusTeal = (el: HTMLElement) => {
  el.style.borderColor = "#1e5f74";
  el.style.background  = "white";
  el.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.1)";
};
const onBlurTeal = (el: HTMLElement) => {
  el.style.borderColor = "#e5e7eb";
  el.style.background  = "#f9fafb";
  el.style.boxShadow   = "none";
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface Step1Props {
  data: PropertyFormData;
  onUpdate: (partial: Partial<PropertyFormData>) => void;
  onOpenLocationPicker: () => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step1Basics({ data, onUpdate, onOpenLocationPicker }: Step1Props) {
  return (
    <div className="flex flex-col gap-4">

      {/* ── Property Type ─────────────────────────────────────────────────── */}
      <SectionCard icon="🏷️" title="Property Type">
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => {
            const active = data.category === cat.value;
            return (
              <button
                key={cat.value}
                type="button"
                onClick={() => onUpdate({ category: cat.value })}
                className="flex flex-col items-center gap-1 py-2.5 rounded-xl
                           border-[1.5px] text-[10px] font-medium
                           transition-all duration-200 cursor-pointer"
                style={active
                  ? { borderColor: "#1e5f74", background: "#e0f0f5", color: "#1e5f74", fontWeight: 700 }
                  : { borderColor: "#e5e7eb", color: "#4b5563" }}
                onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"; }}
                onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
              >
                <span className="text-lg">{cat.icon}</span>
                {cat.label}
              </button>
            );
          })}
        </div>
      </SectionCard>

      {/* ── Property Title ────────────────────────────────────────────────── */}
      <SectionCard icon="✏️" title="Property Title">
        <div
          className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                     rounded-xl px-3.5 py-3 transition-all duration-200"
          onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
          onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
        >
          <span className="text-[#9ca3af] text-base flex-shrink-0">🏠</span>
          <input
            type="text"
            placeholder="e.g. Modern 3-Bed Duplex in Lekki"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full outline-none bg-transparent text-sm
                       text-[#111827] placeholder:text-[#9ca3af]"
          />
        </div>
        {!data.title && (
          <p className="text-[11px] text-red-400 mt-1.5 flex items-center gap-1">
            ⚠️ Title is required
          </p>
        )}
      </SectionCard>

      {/* ── Pricing ───────────────────────────────────────────────────────── */}
      <SectionCard icon="💰" title="Pricing">
        <div className="flex flex-col gap-3.5">

          <TogglePills<ListForEnum>
            label="Listed For *"
            options={[
              { label: "For Rent", value: ListForEnum.rent, icon: "🔑" },
              { label: "For Sale", value: ListForEnum.sale, icon: "🏷️" },
            ]}
            value={data.listedFor}
            onChange={(val) => onUpdate({ listedFor: val })}
          />

          <PriceInput
            label={data.listedFor === ListForEnum.rent ? "Rent Price" : "Sell Price"}
            value={data.price}
            onChange={(val) => onUpdate({ price: val })}
            currency={data.currency}
            onCurrencyChange={(val) => onUpdate({ currency: val })}
          />

          {/* Tenancy period — rent only */}
          {data.listedFor === ListForEnum.rent && (
            <TogglePills<RenewalEnum>
              label="Tenancy Period"
              options={[
                { label: "Daily",   value: RenewalEnum.daily   },
                { label: "Weekly",  value: RenewalEnum.weekly  },
                { label: "Monthly", value: RenewalEnum.monthly },
                { label: "Yearly",  value: RenewalEnum.yearly  },
              ]}
              value={data.renewPeriod}
              onChange={(val) => onUpdate({ renewPeriod: val })}
            />
          )}

          {/* Negotiable toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]">
            <div>
              <p className="text-sm font-semibold text-[#111827]">
                {data.negotiable === NegotiableEnum.Negotiable ? "✅ Negotiable" : "🔒 Fixed Price"}
              </p>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                {data.negotiable === NegotiableEnum.Negotiable
                  ? "Buyers can propose a different price"
                  : "The listed price is final"}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  negotiable: data.negotiable === NegotiableEnum.Negotiable
                    ? NegotiableEnum.NonNegotiable
                    : NegotiableEnum.Negotiable,
                })
              }
              className="w-12 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0"
              style={{ background: data.negotiable === NegotiableEnum.Negotiable ? "#1e5f74" : "#d1d5db" }}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                             transition-all duration-200
                             ${data.negotiable === NegotiableEnum.Negotiable ? "right-1" : "left-1"}`}
              />
            </button>
          </div>
        </div>
      </SectionCard>

      {/* ── Listing Duration ──────────────────────────────────────────────── */}
      <SectionCard icon="📅" title="Listing Duration">
        <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
          How many weeks should this listing stay active before it expires?
        </p>
        <Counter
          label="Duration"
          value={data.duration}
          min={1}
          max={52}
          suffix="weeks"
          onIncrement={() => onUpdate({ duration: Math.min(52, data.duration + 1) })}
          onDecrement={() => onUpdate({ duration: Math.max(1, data.duration - 1) })}
        />
        <div className="flex justify-between mt-2">
          {[1, 4, 12, 26, 52].map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => onUpdate({ duration: w })}
              className="px-2.5 py-1 rounded-lg text-[11px] font-bold border-[1.5px]
                         transition-all duration-150"
              style={data.duration === w
                ? { borderColor: "#1e5f74", background: "#e0f0f5", color: "#1e5f74" }
                : { borderColor: "#e5e7eb", background: "#f9fafb", color: "#6b7280" }}
            >
              {w === 52 ? "1yr" : w === 26 ? "6mo" : w === 12 ? "3mo" : w === 4 ? "4wk" : "1wk"}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* ── Location ──────────────────────────────────────────────────────── */}
      <SectionCard icon="📍" title="Property Location">
        {/* Address text input */}
        <div
          className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                     rounded-xl px-3.5 py-3 mb-3 transition-all duration-200"
          onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
          onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
        >
          <span className="text-[#9ca3af] text-base flex-shrink-0">🗺️</span>
          <input
            type="text"
            placeholder="Street address, area, city…"
            value={data.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            className="w-full outline-none bg-transparent text-sm
                       text-[#111827] placeholder:text-[#9ca3af]"
          />
        </div>

        {/* Map preview + hint */}
        <MapPreview
          address={data.address}
          coordinates={data.coordinates}
          onChangeLocation={onOpenLocationPicker}
          hint="📌 Tap the map to drop a pin on your property's exact location — buyers use the map to find properties near them."
        />
      </SectionCard>
    </div>
  );
}