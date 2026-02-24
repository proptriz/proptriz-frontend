"use client";

import type { PropertyFormData } from "../types/property";
import { ListForEnum, NegotiableEnum } from "../types/property";
import SectionCard from "./SectionCard";
import MapPreview from "./MapPreview";

interface Step3PreviewProps {
  data: PropertyFormData;
  onUpdate: (partial: Partial<PropertyFormData>) => void;
  onOpenLocationPicker: () => void;
}

export default function Step3Preview({
  data,
  onUpdate,
  onOpenLocationPicker,
}: Step3PreviewProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Location */}
      <SectionCard icon="📍" title="Location">
        <div className="mb-3">
          <div
            className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                       rounded-[10px] px-3.5 py-3 transition-all duration-200
                       focus-within:border-[#1a7a4a] focus-within:bg-white
                       focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]"
          >
            <span className="text-[#9ca3af] text-base flex-shrink-0">🗺️</span>
            <input
              type="text"
              placeholder="Street address, city…"
              value={data.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              className="w-full outline-none bg-transparent text-sm text-[#111827] placeholder:text-[#9ca3af]"
            />
          </div>
        </div>
        <MapPreview
          address={data.address}
          coordinates={data.coordinates}
          onChangeLocation={onOpenLocationPicker}
        />
      </SectionCard>

      {/* Summary card */}
      <SectionCard icon="👁️" title="Listing Summary">
        <div className="flex flex-col gap-3">
          {/* Photos preview strip */}
          {data.photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {data.photos.map((photo, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={URL.createObjectURL(photo)}
                  alt={`preview-${i}`}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0 border border-[#e5e7eb]"
                />
              ))}
            </div>
          )}

          {/* Key info */}
          <div className="grid grid-cols-2 gap-2 text-sm">
            <SummaryItem label="Title" value={data.title || "—"} />
            <SummaryItem label="Category" value={data.category} />
            <SummaryItem
              label="Price"
              value={`${data.currency}${Number(data.price).toLocaleString()}`}
              highlight
            />
            <SummaryItem
              label="Listed For"
              value={data.listedFor === ListForEnum.rent ? "Rent" : "Sale"}
            />
            {data.listedFor === ListForEnum.rent && (
              <SummaryItem label="Period" value={data.renewPeriod} />
            )}
            <SummaryItem label="Status" value={data.status} />
            <SummaryItem label="Duration" value={`${data.duration} weeks`} />
            <SummaryItem
              label="Negotiable"
              value={data.negotiable === NegotiableEnum.Negotiable ? "Yes" : "No"}
            />
          </div>

          {/* Features */}
          {data.features.length > 0 && (
            <div className="pt-2 border-t border-[#e5e7eb]">
              <p className="text-xs text-[#9ca3af] mb-1.5">Features</p>
              <div className="flex gap-3">
                {data.features.map((f) => (
                  <span
                    key={f.name}
                    className="text-xs font-medium text-[#4b5563] bg-[#f3f4f6] px-2 py-1 rounded-md"
                  >
                    {f.name}: {f.quantity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Facilities */}
          {data.facilities.length > 0 && (
            <div className="pt-2 border-t border-[#e5e7eb]">
              <p className="text-xs text-[#9ca3af] mb-1.5">Amenities</p>
              <div className="flex flex-wrap gap-1.5">
                {data.facilities.map((f) => (
                  <span
                    key={f}
                    className="text-xs font-medium text-[#1a7a4a] bg-[#e8f5ee] px-2 py-0.5 rounded-full"
                  >
                    {f}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {data.description && (
            <div className="pt-2 border-t border-[#e5e7eb]">
              <p className="text-xs text-[#9ca3af] mb-1">Description</p>
              <p className="text-xs text-[#4b5563] leading-relaxed line-clamp-3">
                {data.description}
              </p>
            </div>
          )}
        </div>
      </SectionCard>
    </div>
  );
}

function SummaryItem({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#f9fafb] rounded-lg px-3 py-2">
      <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide">{label}</p>
      <p
        className={`text-sm font-semibold mt-0.5 capitalize ${
          highlight ? "text-[#1a7a4a]" : "text-[#111827]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
