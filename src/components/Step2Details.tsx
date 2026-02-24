"use client";

import {
  ListForEnum,
  RenewalEnum,
  PropertyStatusEnum,
  NegotiableEnum,
  CurrencyEnum,
} from "../types/property";
import type { PropertyFormData } from "../types/property";
import SectionCard from "./SectionCard";
import TogglePills from "./TogglePills";
import Counter from "./Counter";
import CurrencySelector from "./CurrencySelector";
import AddPropertyDetails from "./property/AddDetailsSection";
import { CategoryEnum } from "@/types";

const AMENITIES: { icon: string; label: string }[] = [
  { icon: "💧", label: "Water" },
  { icon: "⚡", label: "Power" },
  { icon: "🔒", label: "Security" },
  { icon: "🅿️", label: "Parking" },
  { icon: "🏊", label: "Pool" },
  { icon: "🏋️", label: "Gym" },
  { icon: "🌿", label: "Garden" },
  { icon: "🛗", label: "Elevator" },
];

interface Step2Props {
  data: PropertyFormData;
  onUpdate: (partial: Partial<PropertyFormData>) => void;
}

export default function Step2Details({ data, onUpdate }: Step2Props) {
  const getFeatureQty = (name: string) =>
    data.features.find((f) => f.name === name)?.quantity ?? 0;

  const setFeatureQty = (name: string, quantity: number) => {
    const others = data.features.filter((f) => f.name !== name);
    onUpdate({ features: quantity > 0 ? [...others, { name, quantity }] : others });
  };

  const toggleFacility = (label: string) => {
    if (data.facilities.includes(label)) {
      onUpdate({ facilities: data.facilities.filter((f) => f !== label) });
    } else {
      onUpdate({ facilities: [...data.facilities, label] });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Listing type + price */}
      <SectionCard icon="✏️" title="Property Info">
        <div className="flex flex-col gap-3.5">
          {/* Listed for */}
          <TogglePills<ListForEnum>
            label="Listed For *"
            options={[
              { label: "For Rent", value: ListForEnum.rent, icon: "🔑" },
              { label: "For Sale", value: ListForEnum.sale, icon: "🏷️" },
            ]}
            value={data.listedFor}
            onChange={(val) => onUpdate({ listedFor: val })}
          />

          {/* Price */}
          <div>
            <p className="text-xs font-semibold text-[#111827] mb-1.5">
              {data.listedFor === ListForEnum.rent ? "Rent Price" : "Sell Price"} *
            </p>
            <div className="flex items-center gap-2">
              <CurrencySelector
                value={data.currency}
                onChange={(val) => onUpdate({ currency: val })}
              />
              <div
                className="flex-1 flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                           rounded-[10px] px-3.5 py-[11px] transition-all duration-200
                           focus-within:border-[#1a7a4a] focus-within:bg-white
                           focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]"
              >
                <input
                  type="number"
                  min={0}
                  placeholder="0.00"
                  value={data.price}
                  onChange={(e) => onUpdate({ price: e.target.value })}
                  className="w-full outline-none bg-transparent text-sm text-[#111827] placeholder:text-[#9ca3af]"
                />
              </div>
            </div>
          </div>

          {/* Tenancy period - only for rent */}
          {data.listedFor === ListForEnum.rent && (
            <TogglePills<RenewalEnum>
              label="Tenancy Period"
              options={[
                { label: "Monthly", value: RenewalEnum.monthly },
                { label: "Yearly", value: RenewalEnum.yearly },
                { label: "Weekly", value: RenewalEnum.weekly },
              ]}
              value={data.renewPeriod}
              onChange={(val) => onUpdate({ renewPeriod: val })}
            />
          )}
        </div>
      </SectionCard>

      {/* Availability */}
      <SectionCard icon="📋" title="Availability">
        <div className="flex flex-col gap-3.5">
          <TogglePills<PropertyStatusEnum>
            label="Status"
            options={[
              { label: "Available", value: PropertyStatusEnum.available, icon: "✅" },
              { label: "Reserved", value: PropertyStatusEnum.reserved, icon: "⏳" },
              { label: "Taken", value: PropertyStatusEnum.taken, icon: "❌" },
            ]}
            value={data.status}
            onChange={(val) => onUpdate({ status: val })}
          />

          {/* Duration */}
          <div>
            <p className="text-xs font-semibold text-[#111827] mb-1.5">
              Listing Duration (weeks)
            </p>
            <Counter
              label=""
              value={data.duration}
              min={1}
              max={52}
              onIncrement={() => onUpdate({ duration: Math.min(52, data.duration + 1) })}
              onDecrement={() => onUpdate({ duration: Math.max(1, data.duration - 1) })}
              suffix="weeks"
            />
          </div>

          {/* Negotiable toggle */}
          <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]">
            <div>
              <p className="text-sm font-semibold text-[#111827]">Price Negotiable</p>
              <p className="text-xs text-[#9ca3af]">Buyers can make offers</p>
            </div>
            <button
              type="button"
              onClick={() =>
                onUpdate({
                  negotiable:
                    data.negotiable === NegotiableEnum.Negotiable
                      ? NegotiableEnum.NonNegotiable
                      : NegotiableEnum.Negotiable,
                })
              }
              className={`w-11 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0 ${
                data.negotiable === NegotiableEnum.Negotiable
                  ? "bg-[#1a7a4a]"
                  : "bg-[#d1d5db]"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                  data.negotiable === NegotiableEnum.Negotiable ? "right-1" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>
      </SectionCard>

      {/* Description */}
      <SectionCard icon="📝" title="Description">
        <div
          className="flex items-start gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                     rounded-[10px] px-3.5 py-3 transition-all duration-200
                     focus-within:border-[#1a7a4a] focus-within:bg-white
                     focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]"
        >
          <span className="text-[#9ca3af] text-base pt-0.5 flex-shrink-0">📝</span>
          <textarea
            rows={3}
            placeholder="Describe the property, its features and neighbourhood…"
            value={data.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full outline-none bg-transparent text-sm text-[#111827] placeholder:text-[#9ca3af] resize-none"
          />
        </div>
      </SectionCard>

      {/* Features */}
      <SectionCard icon="🛏️" title="Features & Facilities">
        <AddPropertyDetails 
        listingCategory={CategoryEnum.house} 
        existingFacilities={data.facilities}  
        />
      </SectionCard>
    </div>
  );
}
