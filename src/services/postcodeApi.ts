import axiosClient from "@/config/client";
import logger from "../../logger.config.mjs";

/**
 * Nigeria postcode (NIPOST) endpoints, proxied by the backend (/api/v1/postcode).
 * Every helper returns null on failure so the UI can simply hide itself:
 * postcodes exist only for Nigerian pins (the backend answers 422 elsewhere).
 */

export type Confidence = "high" | "medium" | "low";

export interface PostcodeSegments {
  state: string; lga: string; district: string; area: string; unit: string;
}

export interface ResolveResult {
  found: boolean;
  postcode?: string;
  segments?: PostcodeSegments;
  distanceM?: number;
  confidence?: Confidence;
}

export interface VerifyResult {
  postcode?: string;
  segments?: PostcodeSegments;
  valid: boolean;
  matched: boolean;
  verified: boolean;
  distanceM?: number;
  state_name?: string;
  lga_name?: string;
}

/** Administrative names for a pin. NG: region = state, subregion = LGA. */
export interface PlaceNames {
  country_name?: string;
  region?: string;
  subregion?: string;
  area?: string;
  verified: boolean;
}

/** Answer to "where is this pin?" for any country. `supported` = Nigeria (postcodes apply). */
export interface LocateResult {
  country?: string;
  supported: boolean;
  place: PlaceNames;
  postcode: ResolveResult | null;
}

export type MatchTier = "area" | "district" | "subregion" | "region" | "distance";

/** One row in the search box dropdown. Counts come from live listings. */
export interface LocationSuggestion {
  kind: "postcode" | "place";
  tier: Exclude<MatchTier, "distance"> | "unit";
  count: number;
  label: string;
  country: string;
  code?: string; // kind = postcode, e.g. "LA-11-U34"
  name?: string; // kind = place
  region?: string;
  subregion?: string;
  area?: string;
}

export interface AutocompleteResult {
  segment: "state" | "lga" | "district" | "area" | "unit";
  suggestions: { code: string; label: string }[];
}

export type PostcodeStatus = "ok" | "unsupported" | "unavailable";

const classify = (error: any): PostcodeStatus =>
  error?.response?.status === 422 ? "unsupported" : "unavailable";

/** Pin -> nearest postcode. `status: "unsupported"` means the pin is outside Nigeria. */
export const resolvePostcode = async (
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<{ status: PostcodeStatus; data: ResolveResult | null }> => {
  try {
    const res = await axiosClient.post("/postcode/resolve", { lat, lng }, { signal });
    return { status: "ok", data: res.data.data as ResolveResult };
  } catch (error: any) {
    if (error?.name === "CanceledError") return { status: "unavailable", data: null };
    logger.warn("postcode resolve failed:", error?.response?.data || error?.message);
    return { status: classify(error), data: null };
  }
};

/**
 * Country, state / LGA / area names and (Nigeria) the nearest postcode for a pin.
 * Null when the viewer is signed out or the service is down: callers hide the panel.
 */
export const locatePin = async (
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<LocateResult | null> => {
  try {
    const res = await axiosClient.post("/postcode/locate", { lat, lng }, { signal });
    return res.data.data as LocateResult;
  } catch (error: any) {
    if (error?.name !== "CanceledError") logger.warn("locate failed:", error?.response?.data || error?.message);
    return null;
  }
};

/** Search-box suggestions: postcode prefixes ("LA 11 U") or place names ("Westl"). No auth needed. */
export const suggestLocations = async (
  q: string,
  signal?: AbortSignal
): Promise<LocationSuggestion[]> => {
  try {
    const res = await axiosClient.get("/property/locations/suggest", { params: { q }, signal });
    return (res.data.suggestions as LocationSuggestion[]) ?? [];
  } catch (error: any) {
    if (error?.name !== "CanceledError") logger.warn("location suggest failed:", error?.message);
    return [];
  }
};

/** Typed postcode vs dropped pin. */
export const verifyPostcode = async (
  code: string,
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<VerifyResult | null> => {
  try {
    const res = await axiosClient.post("/postcode/verify", { code, lat, lng }, { signal });
    return res.data.data as VerifyResult;
  } catch (error: any) {
    if (error?.name !== "CanceledError") logger.warn("postcode verify failed:", error?.message);
    return null;
  }
};

/** Segment-aware suggestions for a partial code such as "LA 11 U". No auth needed. */
export const autocompletePostcode = async (
  q: string,
  signal?: AbortSignal
): Promise<AutocompleteResult | null> => {
  try {
    const res = await axiosClient.get("/postcode/autocomplete", { params: { q }, signal });
    return res.data.data as AutocompleteResult;
  } catch (error: any) {
    if (error?.name !== "CanceledError") logger.warn("postcode autocomplete failed:", error?.message);
    return null;
  }
};

/**
 * Records that the viewer contacted the agent (tap on Call / Email / Chat) and returns the
 * full postcode for Nigerian listings. Fire-and-forget from the UI: never blocks the tel:/mailto: link.
 */
export const recordPropertyContact = async (
  propertyId: string,
  channel: "call" | "email" | "chat"
): Promise<string | null> => {
  try {
    const res = await axiosClient.post(`/property/${propertyId}/contact`, { channel });
    return (res.data.postcode as string | null) ?? null;
  } catch (error: any) {
    logger.warn("record contact failed:", error?.response?.data || error?.message);
    return null;
  }
};

/** Full postcode if the viewer owns the listing or has already contacted the agent; null otherwise. */
export const getFullPostcode = async (propertyId: string): Promise<string | null> => {
  try {
    const res = await axiosClient.get(`/property/${propertyId}/postcode`);
    return (res.data.postcode as string | null) ?? null;
  } catch {
    return null; // 401 (signed out) or 403 (contact_required)
  }
};

/** Browser event fired after a contact tap so the postcode row can update in place. */
export const POSTCODE_REVEALED_EVENT = "proptriz:postcode-revealed";

/** Fired by "Get exact address": StickyAgent opens its primary contact link and records the contact. */
export const REQUEST_CONTACT_EVENT = "proptriz:request-contact";
