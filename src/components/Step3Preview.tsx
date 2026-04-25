"use client";

import type { PropertyFormData } from "../types/property";
import { ListForEnum, NegotiableEnum } from "../types/property";
import SectionCard from "./SectionCard";
import MapPreview from "./MapPreview";
import { useLanguage } from "@/i18n/LanguageContext";
import { interpolate } from "@/i18n/translations";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Step3PreviewProps {
  data:                 PropertyFormData;
  onUpdate:             (partial: Partial<PropertyFormData>) => void;
  onOpenLocationPicker: () => void;
}

// ─── Summary item ─────────────────────────────────────────────────────────────

function SummaryItem({
  label,
  value,
  highlight,
}: {
  label:      string;
  value:      string;
  highlight?: boolean;
}) {
  return (
    <div className="bg-[#f9fafb] rounded-xl px-3 py-2.5 border border-[#f0f0f0]">
      <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide">{label}</p>
      <p
        className="text-sm font-bold mt-0.5 capitalize"
        style={{ color: highlight ? "#1e5f74" : "#111827" }}
      >
        {value}
      </p>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function Step3Preview({
  data,
  onUpdate,
  onOpenLocationPicker,
}: Step3PreviewProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col gap-4">

      {/* ── Location ─────────────────────────────────────────────────── */}
      <SectionCard icon="📍" title={t("s3_location")}>
        <div className="mb-3">
          <div
            className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                       rounded-xl px-3.5 py-3 transition-all duration-200"
            onFocusCapture={(e) => {
              e.currentTarget.style.borderColor = "#1e5f74";
              e.currentTarget.style.background  = "white";
              e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.1)";
            }}
            onBlurCapture={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.background  = "#f9fafb";
              e.currentTarget.style.boxShadow   = "none";
            }}
          >
            <span className="text-[#9ca3af] text-base flex-shrink-0">🗺️</span>
            <input
              type="text"
              placeholder={t("s1_location_ph")}
              value={data.address}
              onChange={(e) => onUpdate({ address: e.target.value })}
              className="w-full outline-none bg-transparent text-sm
                         text-[#111827] placeholder:text-[#9ca3af]"
            />
          </div>
        </div>
        <MapPreview
          address={data.address}
          coordinates={data.coordinates}
          onChangeLocation={onOpenLocationPicker}
        />
      </SectionCard>

      {/* ── Listing summary ───────────────────────────────────────────── */}
      <SectionCard icon="👁️" title={t("s3_sum_header")}>
        <div className="flex flex-col gap-3">

          {/* Photo strip */}
          {data.photos.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {data.photos.map((photo, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={i}
                  src={URL.createObjectURL(photo)}
                  alt={`preview-${i}`}
                  className="w-16 h-16 rounded-xl object-cover flex-shrink-0
                             border border-[#e5e7eb]"
                />
              ))}
            </div>
          )}

          {/* Key info grid */}
          <div className="grid grid-cols-2 gap-2">
            <SummaryItem label={t("s3_sum_title")}    value={data.title || "—"} />
            <SummaryItem label={t("s3_sum_category")} value={data.category} />
            <SummaryItem
              label={t("s3_sum_price")}
              value={`${data.currency}${Number(data.price).toLocaleString()}`}
              highlight
            />
            <SummaryItem
              label={t("s3_sum_listed_for")}
              value={data.listedFor === ListForEnum.rent
                ? t("list_for_rent")
                : t("list_for_sale")}
            />
            {data.listedFor === ListForEnum.rent && (
              <SummaryItem label={t("s3_sum_period")} value={data.renewPeriod} />
            )}
            <SummaryItem label={t("s3_sum_status")} value={data.status} />
            <SummaryItem
              label={t("s3_sum_duration")}
              value={interpolate(t("s3_sum_weeks"), { n: data.duration })}
            />
            <SummaryItem
              label={t("s3_sum_negotiable")}
              value={data.negotiable === NegotiableEnum.Negotiable
                ? t("s3_sum_yes")
                : t("s3_sum_no")}
            />
          </div>

          {/* Features */}
          {data.features.filter(Boolean).length > 0 && (
            <div className="pt-2 border-t border-[#e5e7eb]">
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide mb-1.5">
                {t("s3_sum_features")}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {data.features
                  .filter((f) => f && !f.startsWith("__custom_"))
                  .map((f) => (
                    <span
                      key={f}
                      className="text-[11px] font-medium px-2.5 py-0.5 rounded-full"
                      style={{ background: "#fef3cd", color: "#c88400" }}
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
              <p className="text-[10px] text-[#9ca3af] uppercase tracking-wide mb-1">
                {t("s3_sum_description")}
              </p>
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
