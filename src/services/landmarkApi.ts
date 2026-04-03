// services/landmarkApi.ts
// ─── Landmark API — mirrors the getNearestProperties pattern ──────────────────
// All calls go through axiosClient (same instance used across the app).
// Backend base: /api/landmarks

import axiosClient from "@/config/client";
import logger from "logger.config.mjs";
import { LandmarkCategory } from "@/components/PropertyLocationModal";
import { ApiSuccess } from "@/types";

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE TYPES  (mirrors LandmarkResponse from landmark.service.ts)
// ─────────────────────────────────────────────────────────────────────────────

export interface LandmarkResponse {
  id:             string;
  name:           string;
  category:       LandmarkCategory;
  lat:            number;
  lng:            number;
  createdBy:      string;
  lastUpdatedBy:  string;
  verifiedCount:  number;
  /** Straight-line distance in metres from the query reference point */
  distanceM?:     number;
  createdAt:      string;
  updatedAt:      string;
}



// ─────────────────────────────────────────────────────────────────────────────
// INTERNAL HELPER
// ─────────────────────────────────────────────────────────────────────────────

function buildQuery(params: Record<string, unknown>): string {
  return new URLSearchParams(
    Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => [k, String(v)])
    )
  ).toString();
}

// ─────────────────────────────────────────────────────────────────────────────
// API FUNCTIONS
// ─────────────────────────────────────────────────────────────────────────────

/**
 * GET /api/landmarks/near?lat=&lng=&radius=&category=&limit=
 *
 * Landmarks within `radius` metres of a reference point, sorted nearest-first.
 * Backend attaches `distanceM` (Haversine) to every result.
 *
 * Used by PropertyMap and PropertyDetailMap.
 */
export const getNearLandmarks = async (
  params: {
    lat:       number;
    lng:       number;
    radius?:   number;
    category?: LandmarkCategory;
    limit?:    number;
  },
  config?: { signal?: AbortSignal }
): Promise<LandmarkResponse[]> => {
  try {
    const response = await axiosClient.get<ApiSuccess<LandmarkResponse[]>>(
      `/landmarks/near?${buildQuery(params)}`,
      { signal: config?.signal }
    );
    logger.info(`[landmarkApi] getNearLandmarks: ${response.data.count ?? 0} results`);
    return response.data.data ?? [];
  } catch (error: any) {
    if (error?.name === "CanceledError" || error?.name === "AbortError") return [];
    logger.error("[landmarkApi] getNearLandmarks error:", error);
    return [];
  }
};

/**
 * GET /api/landmarks/search?query=&lat=&lng=&radius=&category=&limit=
 *
 * Name-substring + geo search for the "Add Landmark" modal.
 * Called as the user types to surface existing entries and prevent duplicates.
 */
export const searchLandmarks = async (
  params: {
    query?:    string;
    lat:       number;
    lng:       number;
    radius?:   number;
    category?: LandmarkCategory;
    limit?:    number;
  },
  config?: { signal?: AbortSignal }
): Promise<LandmarkResponse[]> => {
  try {
    const response = await axiosClient.get<ApiSuccess<LandmarkResponse[]>>(
      `/landmarks/search?${buildQuery(params)}`,
      { signal: config?.signal }
    );
    return response.data.data ?? [];
  } catch (error: any) {
    if (error?.name === "CanceledError" || error?.name === "AbortError") return [];
    logger.error("[landmarkApi] searchLandmarks error:", error);
    return [];
  }
};

/**
 * GET /api/landmarks/:landmarkId  — public
 */
export const getLandmarkById = async (
  landmarkId: string,
  config?: { signal?: AbortSignal }
): Promise<LandmarkResponse | null> => {
  try {
    const response = await axiosClient.get<ApiSuccess<LandmarkResponse>>(
      `/landmarks/${landmarkId}`,
      { signal: config?.signal }
    );
    return response.data.data ?? null;
  } catch (error: any) {
    logger.error("[landmarkApi] getLandmarkById error:", error);
    return null;
  }
};

/**
 * POST /api/landmarks  — requires auth
 *
 * Create a new global landmark.
 * Body: { name, category?, lat, lng }
 *
 * Throws on 409 (duplicate) so the caller can surface the error.
 */
export const createLandmark = async (
  body: {
    name:      string;
    category?: LandmarkCategory;
    lat:       number;
    lng:       number;
  },
  config?: { signal?: AbortSignal }
): Promise<LandmarkResponse> => {
  const response = await axiosClient.post<ApiSuccess<LandmarkResponse>>(
    "/landmarks",
    body,
    { signal: config?.signal }
  );
  logger.info(`[landmarkApi] createLandmark: ${response.data.data?.id}`);
  return response.data.data;
};

/**
 * PATCH /api/landmarks/:landmarkId  — requires auth
 *
 * Crowdsource correction.  Any authenticated user may update.
 * Throws on 403 (location-locked) so the caller can surface the message.
 */
export const updateLandmark = async (
  landmarkId: string,
  body: {
    name?:     string;
    category?: LandmarkCategory;
    lat?:      number;
    lng?:      number;
  },
  config?: { signal?: AbortSignal }
): Promise<LandmarkResponse> => {
  const response = await axiosClient.patch<ApiSuccess<LandmarkResponse>>(
    `/landmarks/${landmarkId}`,
    body,
    { signal: config?.signal }
  );
  logger.info(`[landmarkApi] updateLandmark: ${landmarkId}`);
  return response.data.data;
};

/**
 * DELETE /api/landmarks/:landmarkId  — requires auth
 *
 * Admin: unconditional.  Creator: within 1 hour of creation.
 * Throws on 403 so the caller can show the appropriate message.
 */
export const deleteLandmark = async (
  landmarkId: string,
  config?: { signal?: AbortSignal }
): Promise<void> => {
  await axiosClient.delete(
    `/landmarks/${landmarkId}`,
    { signal: config?.signal }
  );
  logger.info(`[landmarkApi] deleteLandmark: ${landmarkId}`);
};

/**
 * POST /api/landmarks/:landmarkId/verify  — requires auth
 *
 * Confirm a landmark is correctly placed.  Increments verifiedCount.
 */
export const verifyLandmark = async (
  landmarkId: string,
  config?: { signal?: AbortSignal }
): Promise<LandmarkResponse | null> => {
  try {
    const response = await axiosClient.post<ApiSuccess<LandmarkResponse>>(
      `/landmarks/${landmarkId}/verify`,
      {},
      { signal: config?.signal }
    );
    logger.info(`[landmarkApi] verifyLandmark: ${landmarkId}`);
    return response.data.data ?? null;
  } catch (error: any) {
    logger.error("[landmarkApi] verifyLandmark error:", error);
    return null;
  }
};