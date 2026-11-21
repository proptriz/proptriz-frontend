import type { PlaceFilter, PlaceTier } from "@/types/property";
import type { Translations } from "@/i18n/translations";

type TKey = keyof Translations;

/**
 * What each administrative level is called, per country. Values are translation keys.
 * NG uses postcode levels (state / LGA / district / area); other countries use map names.
 */
export interface AdminLabels {
  region: TKey;
  subregion: TKey;
  area: TKey;
  sameRegion: TKey;
  sameSubregion: TKey;
  sameArea: TKey;
}

const NG: AdminLabels = {
  region: "loc_state", subregion: "loc_lga", area: "loc_area",
  sameRegion: "loc_same_state", sameSubregion: "loc_same_lga", sameArea: "loc_same_area",
};
const KE: AdminLabels = {
  region: "loc_county", subregion: "loc_subcounty", area: "loc_neighbourhood",
  sameRegion: "loc_same_county", sameSubregion: "loc_same_subcounty", sameArea: "loc_same_neighbourhood",
};
const CD: AdminLabels = {
  region: "loc_province", subregion: "loc_commune", area: "loc_neighbourhood",
  sameRegion: "loc_same_province", sameSubregion: "loc_same_commune", sameArea: "loc_same_neighbourhood",
};
const OTHER: AdminLabels = {
  region: "loc_region", subregion: "loc_district", area: "loc_neighbourhood",
  sameRegion: "loc_same_region", sameSubregion: "loc_same_district", sameArea: "loc_same_neighbourhood",
};

export const adminLabels = (country?: string): AdminLabels =>
  country === "NG" ? NG : country === "KE" ? KE : country === "CD" ? CD : OTHER;

/** Translation key for the name of a tier ("District", "LGA", "County"...). */
export const tierNameKey = (tier: PlaceTier | "unit" | "distance", country?: string): TKey => {
  const l = adminLabels(country);
  if (tier === "region") return l.region;
  if (tier === "subregion") return l.subregion;
  if (tier === "district") return "loc_district";
  if (tier === "distance") return "loc_nearest";
  return l.area;
};

/** Translation key for "Same area / Same LGA / Same county ..." */
export const sameTierKey = (tier: PlaceTier | "distance", country?: string): TKey => {
  const l = adminLabels(country);
  if (tier === "region") return l.sameRegion;
  if (tier === "subregion") return l.sameSubregion;
  if (tier === "district") return "loc_same_district";
  if (tier === "distance") return "loc_nearest";
  return l.sameArea;
};

/** Headline for a chosen place at its current level ("LA-11-U34", "Westlands", "Nairobi County"). */
export const placeTitle = (p: PlaceFilter): string =>
  p.kind === "postcode" ? p.code : (p.tier === "area" ? p.area : p.tier === "subregion" ? p.subregion : p.region) ?? p.label;

const POSTCODE_TIERS: PlaceTier[] = ["area", "district", "subregion", "region"];
const PLACE_TIERS: PlaceTier[] = ["area", "subregion", "region"];

/** Levels a chosen place can be widened to, starting with its own. */
export const widerTiers = (place: PlaceFilter): PlaceTier[] => {
  const all = place.kind === "postcode" ? POSTCODE_TIERS : PLACE_TIERS;
  if (place.kind === "postcode") {
    const have = place.code.split("-").length; // 1 state, 2 LGA, 3 district, 4 area
    return all.slice(4 - have);
  }
  return all.filter((t) => (t === "area" ? !!place.area : t === "subregion" ? !!place.subregion : !!place.region));
};

/** The same place, cut back to a wider level ("LA-11-U34" + subregion -> "LA-11"). */
export const widenPlace = (place: PlaceFilter, tier: PlaceTier): PlaceFilter => {
  if (place.kind === "postcode") {
    const keep = { region: 1, subregion: 2, district: 3, area: 4 }[tier];
    return { ...place, tier, code: place.code.split("-").slice(0, keep).join("-") };
  }
  return {
    ...place,
    tier,
    area: tier === "area" ? place.area : undefined,
    subregion: tier === "region" ? undefined : place.subregion,
  };
};

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

/** Mirrors the server check: does the typed address mention the area, LGA or state the pin is in? */
export const addressMentionsPlace = (
  address: string | undefined,
  place: { region?: string; subregion?: string; area?: string }
): boolean => {
  if (!address) return false;
  const hay = ` ${norm(address)} `;
  return [place.area, place.subregion, place.region]
    .filter((n): n is string => !!n)
    .map((n) => norm(n).replace(/ (state|county|province|lga)$/, ""))
    .some((n) => n.length >= 3 && hay.includes(` ${n} `));
};
