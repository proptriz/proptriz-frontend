"use client";

import { useEffect, useState } from "react";
import { FiX } from "react-icons/fi";
import { locatePin, suggestLocations, type LocationSuggestion } from "@/services/postcodeApi";
import type { PlaceFilter, PlaceTier } from "@/types/property";
import { useLanguage } from "@/i18n/LanguageContext";
import { interpolate } from "@/i18n/translations";
import { placeTitle, sameTierKey, tierNameKey, widenPlace, widerTiers } from "@/utils/locationLabels";
import getUserPosition from "@/utils/getUserPosition";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

interface FilterPlacePickerProps {
  /** Text in the location box (owned by the filter sheet). */
  query: string;
  onClearQuery: () => void;
  place: PlaceFilter | null;
  onPlace: (place: PlaceFilter | null) => void;
  widen: boolean;
  onWiden: (value: boolean) => void;
  /** "Near me": the filter sheet treats it like a searched location. */
  onNearMe: (lat: number, lng: number) => void;
}

const isFallbackPosition = (lat: number, lng: number) => lat === 9.082 && lng === 8.6753;

const toPlace = (s: LocationSuggestion): PlaceFilter =>
  s.kind === "postcode"
    ? { kind: "postcode", code: s.code ?? "", tier: (s.tier === "unit" ? "area" : s.tier) as PlaceTier, label: s.label, country: "NG" }
    : {
        kind: "place",
        country: s.country,
        region: s.region,
        subregion: s.subregion,
        area: s.area,
        tier: (s.tier === "unit" || s.tier === "district" ? "area" : s.tier) as PlaceTier,
        label: s.name ?? s.label,
      };

export { placeTitle };

/**
 * Location helpers for the filter sheet:
 *  - suggestions (with listing counts) as the user types a postcode prefix or a place name
 *  - the chosen place, with chips to widen it (area -> district -> LGA -> state)
 *  - "Near me" and "My area" shortcuts
 */
export default function FilterPlacePicker({
  query, onClearQuery, place, onPlace, widen, onWiden, onNearMe,
}: FilterPlacePickerProps) {
  const { t } = useLanguage();
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [busy, setBusy] = useState<"near" | "mine" | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Suggestions from live listings, debounced
  useEffect(() => {
    const q = query.trim();
    if (place || q.length < 2) { setSuggestions([]); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const rows = await suggestLocations(q, controller.signal);
      if (!controller.signal.aborted) setSuggestions(rows);
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [query, place]);

  const listings = (n: number) =>
    n === 1 ? t("filter_loc_listing_one") : interpolate(t("filter_loc_listings"), { n: n.toLocaleString() });

  const choose = (p: PlaceFilter) => {
    setNotice(null);
    setSuggestions([]);
    onPlace(p);
    onClearQuery();
  };

  const handleNearMe = async () => {
    setBusy("near");
    setNotice(null);
    const [lat, lng] = await getUserPosition();
    setBusy(null);
    if (isFallbackPosition(lat, lng)) { setNotice(t("filter_location_denied")); return; }
    onPlace(null);
    onNearMe(lat, lng);
  };

  const handleMyArea = async () => {
    setBusy("mine");
    setNotice(null);
    const [lat, lng] = await getUserPosition();
    if (isFallbackPosition(lat, lng)) { setBusy(null); setNotice(t("filter_location_denied")); return; }
    const info = await locatePin(lat, lng);
    setBusy(null);
    if (!info?.country) { setNotice(t("filter_my_area_fail")); return; }

    if (info.supported && info.postcode?.found && info.postcode.postcode) {
      // Area level: the first four segments (state-LGA-district-area)
      const code = info.postcode.postcode.split("-").slice(0, 4).join("-");
      choose({
        kind: "postcode",
        code,
        tier: "area",
        label: [info.place.subregion, info.place.region].filter(Boolean).join(", "),
        country: "NG",
      });
      return;
    }
    const { region, subregion, area } = info.place;
    if (!region) { setNotice(t("filter_my_area_fail")); return; }
    choose({
      kind: "place",
      country: info.country,
      region,
      subregion,
      area,
      tier: area && subregion ? "area" : subregion ? "subregion" : "region",
      label: area ?? subregion ?? region,
    });
  };

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-[11px] border-[1.5px] font-medium transition-all duration-200 ${
      active
        ? "bg-[#143d4d] border-[#143d4d] text-white font-bold"
        : "bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#1e5f74]"
    }`;

  return (
    <div className="mt-2 flex flex-col gap-2">
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="rounded-xl border border-[#e5e7eb] bg-white overflow-hidden">
          {suggestions.map((s) => (
            <button
              key={`${s.kind}-${s.tier}-${s.code ?? [s.country, s.region, s.subregion, s.area].join("|")}`}
              type="button"
              onClick={() => choose(toPlace(s))}
              className="w-full flex items-center justify-between gap-3 px-3.5 py-2.5 text-left
                         hover:bg-[#f3f7f9] border-b border-[#f1f5f9] last:border-0"
            >
              <span className="min-w-0">
                <span className="block text-[13px] font-bold text-[#143d4d] truncate">
                  {s.kind === "postcode" ? s.code : s.name}
                </span>
                {s.label && <span className="block text-[11px] text-[#6b7280] truncate">{s.label}</span>}
              </span>
              <span className="text-[11px] text-[#6b7280] flex-shrink-0 text-right">
                {t(tierNameKey(s.tier, s.country))}
                <span className="block font-semibold text-[#1e5f74]">{listings(s.count)}</span>
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Chosen place */}
      {place && (
        <div className="rounded-xl bg-[#e0f0f5] border border-[rgba(30,95,116,0.2)] p-3 flex flex-col gap-2.5">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[14px] font-bold tracking-[0.3px] text-[#143d4d] truncate">{placeTitle(place)}</p>
              <p className="text-[11px] text-[#4b5563] truncate">
                {t(tierNameKey(place.tier, place.country))}
                {place.label && place.label !== placeTitle(place) ? ` · ${place.label}` : ""}
              </p>
            </div>
            <button
              type="button"
              aria-label={t("filter_reset")}
              onClick={() => onPlace(null)}
              className="w-6 h-6 rounded-full bg-[rgba(30,95,116,0.15)] flex items-center justify-center
                         hover:bg-[#1e5f74] hover:text-white text-[#1e5f74] transition-colors flex-shrink-0"
            >
              <FiX size={11} strokeWidth={3} />
            </button>
          </div>

          {/* How wide to search */}
          {widerTiers(place).length > 1 && (
            <div>
              <p className="text-[10px] font-bold text-[#4b5563] mb-1.5">{t("filter_search_scope")}</p>
              <div className="flex flex-wrap gap-1.5">
                {widerTiers(place).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => onPlace(widenPlace(place, tier))}
                    className={chip(place.tier === tier)}
                  >
                    {t(sameTierKey(tier, place.country))}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Fallback when the chosen level has no listings */}
          {place.tier !== "region" && (
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="min-w-0">
                <span className="block text-[11px] font-bold text-[#143d4d]">{t("filter_widen_title")}</span>
                <span className="block text-[11px] text-[#4b5563]">{t("filter_widen_hint")}</span>
              </span>
              <input
                type="checkbox"
                checked={widen}
                onChange={(e) => onWiden(e.target.checked)}
                className="w-4 h-4 accent-[#1e5f74] flex-shrink-0"
              />
            </label>
          )}
        </div>
      )}

      {/* Shortcuts */}
      {!place && (
        <div className="flex flex-wrap gap-1.5">
          <button type="button" onClick={handleNearMe} disabled={busy !== null} className={chip(false)}>
            {busy === "near" ? t("filter_searching") : `📍 ${t("filter_near_me")}`}
          </button>
          <button type="button" onClick={handleMyArea} disabled={busy !== null} className={chip(false)}>
            {busy === "mine" ? t("filter_searching") : `🏘️ ${t("filter_my_area")}`}
          </button>
        </div>
      )}

      {notice && <p className="text-[11px] text-amber-700">{notice}</p>}
    </div>
  );
}
