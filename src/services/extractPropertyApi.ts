// src/services/extractPropertyApi.ts
//
// Thin HTTP client for POST /property/ai/extract.
//
// All enum coercion and normalisation is done server-side in
// runExtractProperty.ts — this file is intentionally dumb.
// It only handles the HTTP call, the 90 s timeout, and basic error surfacing.

import axiosClient from "@/config/client";
import logger      from "../../logger.config.mjs";
import type { PropertyFormData, Feature } from "@/types/property";

// ─── Backend response shape ────────────────────────────────────────────────
// Mirrors NormalisedProperty from runExtractProperty.ts.
// Every field is already the correct enum value — no mapping needed here.

export interface ExtractedPropertyData {
  title:        string;
  description:  string;
  address:      string;
  price:        string;
  currency:     "₦" | "$" | "£" | "€";
  listedFor:    "rent" | "sale";
  category:     "house" | "apartment" | "commercial" | "villa" | "land" | "hotel";
  status:       "available" | "reserved" | "taken" | "expired";
  renewPeriod:  "weekly" | "monthly" | "yearly";
  negotiable:   "negotiable" | "non-negotiable";
  duration:     number;
  features:     string[];
  /** Only present when AI resolved real coordinates (not [0,0]) */
  coordinates?: [number, number];
}

interface BackendResponse {
  success:      boolean;
  propertyData: ExtractedPropertyData;
  message?:     string;
}

// ─────────────────────────────────────────────────────────────────────────────

/**
 * Call the backend AI extraction endpoint.
 *
 * Returns the normalised property data directly — no client-side coercion.
 *
 * If the AI did not resolve coordinates (returned [0,0] or nothing),
 * `propertyData.coordinates` is undefined.  The caller should fall back
 * to the user's pinned map location in that case.
 *
 * Throws with a user-facing message on any failure so the caller can
 * surface it via toast without inspecting the error shape.
 */
export async function extractPropertyApi(
  description: string,
  config?:     { signal?: AbortSignal },
): Promise<ExtractedPropertyData> {
  let res;
  try {
    res = await axiosClient.post<BackendResponse>(
      "/property/ai/extract",
      { description },
      {
        signal: config?.signal,
        // Cloudflare Workers AI (Llama 3 8B) can take 15–45 s on free tier.
        // 90 s gives comfortable headroom without blocking the UI forever.
        timeout: 90_000,
      },
    );
  } catch (err: unknown) {
    // axios throws on network errors, timeouts, and non-2xx status codes
    const msg =
      (err as any)?.response?.data?.message ??
      (err instanceof Error ? err.message : "Network error — please try again.");
    logger.error("[extractPropertyApi] request failed:", msg);
    throw new Error(msg);
  }

  const { success, propertyData, message } = res.data;

  if (!success || !propertyData) {
    logger.error("[extractPropertyApi] backend reported failure:", message);
    throw new Error(message ?? "AI extraction failed — please try again.");
  }

  logger.info("[extractPropertyApi] received normalised data:", propertyData);
  return propertyData;
}