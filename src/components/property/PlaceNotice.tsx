"use client";

import { FiX } from "react-icons/fi";
import type { PlaceFilter, PlaceTier } from "@/types/property";
import { useLanguage } from "@/i18n/LanguageContext";
import { interpolate } from "@/i18n/translations";
import { placeTitle, sameTierKey } from "@/utils/locationLabels";

export interface PlaceMatch {
  /** Level the results actually came from. */
  tier: PlaceTier;
  /** True when the chosen place had no listings and a wider level was used. */
  widened: boolean;
  /** Listings loaded so far; null while loading. */
  count: number | null;
}

interface PlaceNoticeProps {
  place: PlaceFilter;
  match: PlaceMatch | null;
  onClear: () => void;
  className?: string;
}

/**
 * Small bar shown while results are limited to a chosen postcode or place.
 * Says what is being shown (and when the search was widened) and lets the user clear it.
 */
export default function PlaceNotice({ place, match, onClear, className = "" }: PlaceNoticeProps) {
  const { t } = useLanguage();
  const title = placeTitle(place);

  let text = `📮 ${title}`;
  if (match?.widened) {
    text = interpolate(t("place_showing_wider"), { place: title, tier: t(sameTierKey(match.tier, place.country)) });
  } else if (match?.count === 0) {
    text = interpolate(t("place_none"), { place: title });
  } else if (match?.count != null) {
    const n = match.count;
    text = `📮 ${title} · ${n === 1 ? t("filter_loc_listing_one") : interpolate(t("filter_loc_listings"), { n: n.toLocaleString() })}`;
  }

  return (
    <div
      role="status"
      className={`flex items-center justify-between gap-2 rounded-xl bg-[#e0f0f5] border
                  border-[rgba(30,95,116,0.25)] px-3 py-2 ${className}`}
    >
      <p className="text-[12px] font-semibold text-[#143d4d] truncate">{text}</p>
      <button
        type="button"
        onClick={onClear}
        aria-label={t("place_clear")}
        className="w-6 h-6 rounded-full bg-[rgba(30,95,116,0.15)] flex items-center justify-center
                   hover:bg-[#1e5f74] hover:text-white text-[#1e5f74] transition-colors flex-shrink-0"
      >
        <FiX size={11} strokeWidth={3} />
      </button>
    </div>
  );
}
