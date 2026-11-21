"use client";

import { useEffect, useState } from "react";
import {
  getFullPostcode,
  POSTCODE_REVEALED_EVENT,
  REQUEST_CONTACT_EVENT,
} from "@/services/postcodeApi";
import type { PropertyType } from "@/types/property";
import { useLanguage } from "@/i18n/LanguageContext";
import { adminLabels } from "@/utils/locationLabels";

// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500

function Tile({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-xl bg-[#f1f6f8] px-3 py-2">
      <p className="text-[10px] text-[#6b7280]">{label}</p>
      <p className="text-[13px] font-semibold text-[#143d4d] truncate">{value || "—"}</p>
    </div>
  );
}

function Badge({ ok, okText, noText }: { ok: boolean; okText: string; noText: string }) {
  return (
    <span
      className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap flex-shrink-0"
      style={ok ? { background: "#dcfce7", color: "#166534" } : { background: "#fef3c7", color: "#92400e" }}
    >
      {ok ? `✓ ${okText}` : noText}
    </span>
  );
}

/**
 * Location card on the property details page.
 *  - Nigerian listing with a postcode: masked code (LA-11-U34-••-••), Verified badge, State and LGA,
 *    and "Get exact address", which contacts the agent and then shows the full code.
 *  - Any other listing with place names: area + region, "Location verified", Country and region.
 * Renders nothing for listings saved before this feature (no postcode, no place names).
 */
export default function PostcodeReveal({ property }: { property: PropertyType }) {
  const { t } = useLanguage();
  const masked = property.postcode?.public_code;
  const place = property.place;
  const [full, setFull] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [asked, setAsked] = useState(false);

  useEffect(() => {
    if (!masked) return;
    let alive = true;
    getFullPostcode(property._id).then((code) => { if (alive && code) setFull(code); });
    const onRevealed = (e: Event) => {
      const detail = (e as CustomEvent<{ propertyId: string; postcode: string | null }>).detail;
      if (detail?.propertyId === property._id && detail.postcode) setFull(detail.postcode);
    };
    window.addEventListener(POSTCODE_REVEALED_EVENT, onRevealed);
    return () => { alive = false; window.removeEventListener(POSTCODE_REVEALED_EVENT, onRevealed); };
  }, [property._id, masked]);

  if (!masked && !place?.region && !place?.area) return null;

  const labels = adminLabels(property.country);
  const card = "bg-white rounded-2xl border border-[#e5e7eb] p-4 flex flex-col gap-2.5";
  const heading = (
    <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] flex items-center gap-1.5">
      <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
      {t("loc_location_label")}
    </p>
  );

  // ── No postcode: area + region from the map ──
  if (!masked) {
    const headline = [place?.area ?? place?.subregion, place?.region].filter(Boolean).join(", ");
    const nigeria = property.country === "NG";
    return (
      <div className={card}>
        {heading}
        <div className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3" style={{ background: "#e0f0f5" }}>
          <p className="text-[15px] font-bold text-[#143d4d] truncate">{headline}</p>
          <Badge ok={!!place?.verified} okText={t("loc_location_verified")} noText={t("loc_location_unverified")} />
        </div>
        <div className="flex gap-2">
          {nigeria ? (
            <>
              <Tile label={t(labels.region)} value={place?.region} />
              <Tile label={t(labels.subregion)} value={place?.subregion} />
            </>
          ) : (
            <>
              <Tile label={t("loc_country")} value={place?.country_name ?? property.country} />
              <Tile label={t(labels.region)} value={place?.region} />
            </>
          )}
        </div>
      </div>
    );
  }

  // ── Nigerian postcode ──
  const code = full ?? masked;
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* clipboard is blocked in some webviews */ }
  };
  const requestExact = () => {
    setAsked(true);
    // StickyAgent owns the agent's contact links: it opens the chat / call and records the contact.
    window.dispatchEvent(new CustomEvent(REQUEST_CONTACT_EVENT, { detail: { propertyId: property._id } }));
  };

  return (
    <div className={card}>
      {heading}
      <div className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3" style={{ background: "#e0f0f5" }}>
        <div className="min-w-0">
          <p className="text-[10px] font-bold" style={{ color: "#1e5f74" }}>{t("loc_postcode_label")}</p>
          <p className="text-[16px] font-bold tracking-[0.5px] text-[#143d4d]">{code}</p>
        </div>
        <Badge ok={!!property.postcode?.verified} okText={t("loc_verified")} noText={t("loc_unverified")} />
      </div>

      <div className="flex gap-2">
        <Tile label={t(labels.region)} value={place?.region} />
        <Tile label={t(labels.subregion)} value={place?.subregion} />
      </div>

      {full ? (
        <button
          type="button"
          onClick={copy}
          className="w-full rounded-xl py-2.5 text-[13px] font-bold active:scale-[0.98] transition-transform"
          style={{ background: "#e0f0f5", color: "#143d4d" }}
        >
          {copied ? t("loc_copied") : t("loc_copy")}
        </button>
      ) : (
        <button
          type="button"
          onClick={requestExact}
          className="w-full rounded-xl py-2.5 text-[13px] font-bold active:scale-[0.98] transition-transform"
          style={{ background: "#f0a500", color: "#143d4d" }}
        >
          {t("loc_get_exact")}
        </button>
      )}

      <p className="text-[11px] text-[#6b7280]">
        {full ? t("loc_exact_code") : asked ? t("loc_signin_reveal") : t("loc_full_shared")}
      </p>
    </div>
  );
}
