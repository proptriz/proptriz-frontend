'use client';

import React, { use, useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Link from "next/link";
import {
  FiArrowLeft, FiMapPin, FiNavigation, FiShare2,
  FiExternalLink, FiCheckCircle, FiRefreshCw,
} from "react-icons/fi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { getPropertyById }                   from "@/services/propertyApi";
import { getNearLandmarks, verifyLandmark }  from "@/services/landmarkApi";
import { PropertyType }                       from "@/types/property";
import logger                                 from "logger.config.mjs";
import Price                                  from "@/components/shared/Price";
import { LANDMARK_CATEGORIES }               from "@/components/PropertyLocationModal";
import type { LandmarkWithDistance }          from "@/components/PropertyDetailMap";

// ─── Lazy map (Leaflet is SSR-incompatible) ───────────────────────────────────
const PropertyDetailMap = dynamic(
  () => import("@/components/PropertyDetailMap"),
  { ssr: false, loading: () => <div className="w-full h-full bg-[#e0f0f5] animate-pulse" /> }
);

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

function fmtDist(m: number): string {
  return m < 1000 ? `${Math.round(m)} m` : `${(m / 1000).toFixed(1)} km`;
}

const FEATURE_EMOJI: Record<string, string> = {
  bedroom: "🛏️", bedrooms: "🛏️",
  bathroom: "🚿", bathrooms: "🚿",
  toilet: "🚽", toilets: "🚽",
  garage: "🚗", parking: "🚗",
  pool: "🏊", "swimming pool": "🏊",
  gym: "🏋️", garden: "🌿",
  balcony: "🪟", floor: "🏢", floors: "🏢",
};
const getFeatureEmoji = (n: string) => FEATURE_EMOJI[n.toLowerCase()] ?? "✨";

type SheetSnap = "peek" | "half" | "full";
const SNAP_H: Record<SheetSnap, string> = { peek: "100px", half: "52%", full: "88%" };

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function PropertyMap({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router         = useRouter();
  const { id: propId } = use(params);

  const [property,       setProperty]       = useState<PropertyType | null>(null);
  const [landmarks,      setLandmarks]      = useState<LandmarkWithDistance[]>([]);
  const [loading,        setLoading]        = useState(true);
  const [lmLoading,      setLmLoading]      = useState(false);
  const [error,          setError]          = useState<string | null>(null);
  const [saved,          setSaved]          = useState(false);
  const [snap,           setSnap]           = useState<SheetSnap>("peek");
  const [activeTab,      setActiveTab]      = useState<"facilities" | "details">("facilities");
  /** id of a landmark being verified — shows a spinner on that row */
  const [verifyingId,    setVerifyingId]    = useState<string | null>(null);

  // ── 1. Fetch property ────────────────────────────────────────────────────
  useEffect(() => {
    if (!propId) return;
    setLoading(true);
    getPropertyById(propId)
      .then((p) => {
        if (!p?._id) { setError("Property not found."); return; }
        setProperty(p);
        logger.info("PropertyMap: loaded property", p._id);
      })
      .catch((e) => {
        logger.error("PropertyMap: property fetch error", e);
        setError("Failed to load property.");
      })
      .finally(() => setLoading(false));
  }, [propId]);

  // ── 2. Fetch landmarks from API once property coords are known ───────────
  useEffect(() => {
    if (!property) return;
    const ctrl = new AbortController();
    setLmLoading(true);

    getNearLandmarks(
      { lat: property.latitude, lng: property.longitude, radius: 2000, limit: 20 },
      { signal: ctrl.signal }
    )
      .then((data) => {
        if (!data) return;
        // Cast to LandmarkWithDistance — backend always returns distanceM on /near
        setLandmarks(data as LandmarkWithDistance[]);
        logger.info(`PropertyMap: ${data.length} landmarks loaded`);
      })
      .catch((e) => {
        if (e?.name !== "CanceledError") logger.error("PropertyMap: landmark fetch error", e);
      })
      .finally(() => setLmLoading(false));

    return () => ctrl.abort();
  }, [property]);

  // ── Verify handler — any user can confirm a landmark ─────────────────────
  const handleVerify = useCallback(async (lmId: string) => {
    if (verifyingId) return;          // prevent double-tap
    setVerifyingId(lmId);
    try {
      const updated = await verifyLandmark(lmId);
      if (updated) {
        setLandmarks(prev =>
          prev.map(lm =>
            lm.id === lmId
              ? { ...lm, verifiedCount: updated.verifiedCount }
              : lm
          )
        );
      }
    } catch (e) {
      logger.error("PropertyMap: verify error", e);
    } finally {
      setVerifyingId(null);
    }
  }, [verifyingId]);

  const cycleSnap = useCallback(() => {
    setSnap(prev => prev === "peek" ? "half" : prev === "half" ? "full" : "peek");
  }, []);

  // ── Loading / error ────────────────────────────────────────────────────────
  if (loading) return (
    <div className="flex flex-col h-screen-safe items-center justify-center gap-3 bg-[#f5f7f9]">
      <div className="w-10 h-10 border-4 border-[#1e5f74] border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-[#4b5563] font-medium">Loading map…</p>
    </div>
  );

  if (error || !property) return (
    <div className="flex flex-col h-screen-safe items-center justify-center gap-4 bg-[#f5f7f9] px-6">
      <span className="text-5xl">📍</span>
      <p className="text-base font-bold text-[#111827]">{error ?? "Property not found"}</p>
      <button onClick={() => router.back()}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#1e5f74] text-white text-sm font-bold">
        <FiArrowLeft size={14} /> Go Back
      </button>
    </div>
  );

  const propLoc: [number, number] = [property.latitude, property.longitude];
  const listedFor = property.listed_for ?? "rent";

  return (
    <div className="relative flex flex-col h-screen-safe overflow-hidden bg-[#f5f7f9]">

      {/* ════ MAP — full screen ════ */}
      <div className="absolute inset-0 z-0">
        <PropertyDetailMap
          property={property}
          landmarks={landmarks}
          mapCenter={propLoc}
        />
      </div>

      {/* ════ TOP BAR ════ */}
      <div className="relative z-20 flex items-center gap-3 px-4 pt-safe pt-3 pb-3">
        <button onClick={() => router.back()}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-white shadow-md border border-[#e5e7eb] text-[#111827]
                     hover:bg-[#f9fafb] active:scale-95 transition-all">
          <FiArrowLeft size={16} />
        </button>

        <div className="flex-1 min-w-0 flex items-center gap-2 px-3 py-2
                        bg-white rounded-xl shadow-md border border-[#e5e7eb]">
          <FiMapPin size={13} className="text-[#1e5f74] shrink-0" />
          <span className="text-xs font-bold text-[#111827] truncate">
            {property.title ?? property.address}
          </span>
        </div>

        <button onClick={() => setSaved(s => !s)}
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-white shadow-md border border-[#e5e7eb] active:scale-95 transition-all">
          {saved
            ? <FaHeart size={15} className="text-red-500" />
            : <FaRegHeart size={15} className="text-[#9ca3af]" />}
        </button>

        <button
          className="w-9 h-9 flex items-center justify-center rounded-xl
                     bg-white shadow-md border border-[#e5e7eb] text-[#9ca3af] active:scale-95 transition-all"
          onClick={() => navigator.share?.({ title: property.title, url: window.location.href })}>
          <FiShare2 size={15} />
        </button>
      </div>

      {/* ════ FEATURE PILLS ════ */}
      {property.features &&property.features?.length > 0 && (
        <div className="relative z-20 flex gap-2 px-4 overflow-x-auto scrollbar-none pb-1 -mt-1">
          {property.features.map((feat, i) => (
            <div key={i}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                         bg-white shadow-sm border border-[#e5e7eb] shrink-0">
              <span className="text-sm leading-none">{getFeatureEmoji(feat)}</span>
              <span className="text-xs font-semibold text-[#374151] whitespace-nowrap">{feat}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* ════ CENTRE BUTTON ════ */}
      <button
        className="absolute right-4 z-20 w-11 h-11 flex items-center justify-center
                   rounded-xl bg-white shadow-lg border border-[#e5e7eb]
                   text-[#1e5f74] active:scale-95 transition-all"
        style={{ bottom: `calc(${SNAP_H[snap]} + 16px)` }}
        title="Centre on property">
        <FiNavigation size={17} />
      </button>

      {/* ════ BOTTOM SHEET ════ */}
      <div
        className="absolute left-0 right-0 bottom-0 z-30 flex flex-col
                   bg-white rounded-t-[24px] shadow-[0_-8px_40px_rgba(0,0,0,0.15)]
                   transition-all duration-300 ease-out"
        style={{ height: SNAP_H[snap] }}
      >
        {/* Gradient accent */}
        <div className="h-[3px] rounded-t-[24px] bg-gradient-to-r from-[#143d4d] via-[#1e5f74] to-[#f0a500] shrink-0" />

        {/* Handle */}
        <button onClick={cycleSnap}
          className="flex flex-col items-center pt-2 pb-1 w-full shrink-0 focus:outline-none"
          aria-label="Resize panel">
          <div className="w-10 h-[5px] rounded-full bg-[#e5e7eb]" />
          <span className="mt-1 text-[10px] text-[#9ca3af] font-medium select-none">
            {snap === "peek" ? "Expand ↑" : snap === "half" ? "Show more ↑" : "Collapse ↓"}
          </span>
        </button>

        {/* Summary row */}
        <div className="shrink-0 px-4 pb-3 border-b border-[#e5e7eb]">
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-[Raleway] font-black text-[22px] text-[#1e5f74] tracking-tight leading-none">
                  <Price price={property.price} currency={property.currency} />
                </span>
                {listedFor === "rent"     && <span className="text-[11px] text-[#9ca3af] font-medium">/yr</span>}
                {listedFor === "shortlet" && <span className="text-[11px] text-[#9ca3af] font-medium">/night</span>}
              </div>
              <span className={`inline-flex items-center mt-1 px-2.5 py-0.5 rounded-full
                              text-[10px] font-bold uppercase tracking-wide
                              ${listedFor === "sale" ? "bg-[#fef3c7] text-[#c88400]" : "bg-[#e0f0f5] text-[#1e5f74]"}`}>
                {listedFor === "rent" ? "For Rent" : listedFor === "sale" ? "For Sale" : "Shortlet"}
              </span>
            </div>
            <Link href={`/property/details/${propId}`}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl shrink-0
                         bg-[#1e5f74] text-white text-xs font-bold
                         hover:bg-[#143d4d] active:scale-95 transition-all shadow-sm">
              View Details <FiExternalLink size={11} />
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            <FiMapPin size={11} className="text-[#9ca3af] shrink-0" />
            <span className="text-xs text-[#6b7280] truncate">{property.address}</span>
          </div>
        </div>

        {/* Tab bar */}
        <div className="shrink-0 flex border-b border-[#e5e7eb]">
          {(["facilities", "details"] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 text-xs font-bold transition-colors relative
                          ${activeTab === tab ? "text-[#1e5f74]" : "text-[#9ca3af] hover:text-[#374151]"}`}>
              {tab === "facilities" ? "📍 Nearby Facilities" : "🏠 Property Details"}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/4 right-1/4 h-0.5
                                  bg-[#f0a500] rounded-full" />
              )}
            </button>
          ))}
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">

          {/* ═══ LANDMARKS TAB ═══ */}
          {activeTab === "facilities" && (
            <div className="px-4 py-3 space-y-2">

              {/* Loading skeleton */}
              {lmLoading && (
                <div className="space-y-2">
                  {[1,2,3].map(i => (
                    <div key={i} className="h-14 rounded-xl bg-[#f3f4f6] animate-pulse" />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!lmLoading && landmarks.length === 0 && (
                <div className="flex flex-col items-center py-8 gap-2 opacity-60">
                  <span className="text-4xl">🗺️</span>
                  <p className="text-sm font-semibold text-[#6b7280]">No facilities nearby</p>
                  <p className="text-xs text-[#9ca3af] text-center">
                    No facilities have been added within 2 km of this property yet.
                  </p>
                </div>
              )}

              {/* Landmark rows — sorted by distanceM (backend already sorts, preserve order) */}
              {!lmLoading && landmarks.map((lm, i) => {
                const cat     = LANDMARK_CATEGORIES.find(c => c.value === lm.category);
                const isClose = lm.distanceM < 500;
                const isHighVerified = lm.verifiedCount >= 5;
                const isVerifying    = verifyingId === lm.id;

                return (
                  <div key={lm.id}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl
                               bg-[#f9fafb] border border-[#e5e7eb]
                               hover:border-[#c5dde6] hover:bg-[#f0f9fc] transition-colors">

                    {/* Rank */}
                    <div className="w-6 h-6 rounded-full flex items-center justify-center
                                   text-[10px] font-bold shrink-0 text-white"
                      style={{ background: i < 3 ? "#1e5f74" : "#9ca3af" }}>
                      {i + 1}
                    </div>

                    {/* Emoji */}
                    <span className="text-xl leading-none shrink-0">{cat?.emoji ?? "📍"}</span>

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-[#111827] truncate">{lm.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-[10px] text-[#9ca3af]">{cat?.label ?? "Landmark"}</p>
                        {/* verifiedCount badge */}
                        <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full
                                          ${isHighVerified
                                            ? "bg-[#e0f0f5] text-[#1e5f74]"
                                            : "bg-[#f9fafb] text-[#9ca3af] border border-[#e5e7eb]"}`}>
                          ✓{lm.verifiedCount}
                        </span>
                      </div>
                    </div>

                    {/* Right column: distance + verify */}
                    <div className="shrink-0 flex flex-col items-end gap-1">
                      {/* Distance from backend distanceM */}
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full
                                        ${isClose
                                          ? "bg-[#e0f0f5] text-[#1e5f74]"
                                          : "bg-[#f9fafb] text-[#6b7280] border border-[#e5e7eb]"}`}>
                        {fmtDist(lm.distanceM)}
                      </span>
                      {isClose && (
                        <span className="text-[9px] text-[#1e5f74] font-semibold">nearby</span>
                      )}

                      {/* Verify button */}
                      <button
                        onClick={() => handleVerify(lm.id)}
                        disabled={!!verifyingId}
                        title={isHighVerified ? "Location verified by community" : "Confirm this landmark"}
                        className={`flex items-center gap-1 text-[10px] font-semibold
                                    px-2 py-0.5 rounded-full transition-all active:scale-95
                                    ${isHighVerified
                                      ? "bg-[#e0f0f5] text-[#1e5f74] cursor-default"
                                      : "bg-white border border-[#e5e7eb] text-[#9ca3af] hover:border-[#1e5f74] hover:text-[#1e5f74]"}`}
                      >
                        {isVerifying
                          ? <FiRefreshCw size={9} className="animate-spin" />
                          : <FiCheckCircle size={9} />}
                        {isHighVerified ? "Verified" : "Confirm"}
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Road access */}
              {!lmLoading && property.features && property.features?.length > 0 && (
                <div className="mt-2 pt-3 border-t border-[#e5e7eb]">
                  <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2">
                    Road Access & Environment
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {property.features.map((ft: string, i: number) => (
                      <span key={i}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full
                                   bg-white border border-[#e5e7eb] text-xs font-semibold text-[#374151]">
                        🛣️ {ft}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ DETAILS TAB ═══ */}
          {activeTab === "details" && (
            <div className="px-4 py-3 space-y-4">

              {property.features && property.features?.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-[#9ca3af] uppercase tracking-wider mb-2">
                    Property Features
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    {property.features.map((feat, i) => (
                      <div key={i}
                        className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                                   bg-[#f9fafb] border border-[#e5e7eb]">
                        <span className="text-lg leading-none shrink-0">{getFeatureEmoji(feat)}</span>
                        <div className="min-w-0">
                          <p className="text-[10px] text-[#9ca3af] truncate">{feat}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 px-3 py-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
                <FiMapPin size={14} className="text-[#1e5f74] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#9ca3af] font-semibold uppercase tracking-wide mb-0.5">
                    Full Address
                  </p>
                  <p className="text-sm font-semibold text-[#374151]">{property.address}</p>
                </div>
              </div>

              <div className="flex gap-3 px-3 py-3 rounded-xl bg-[#f9fafb] border border-[#e5e7eb]">
                <FiNavigation size={14} className="text-[#1e5f74] shrink-0 mt-0.5" />
                <div>
                  <p className="text-[10px] text-[#9ca3af] font-semibold uppercase tracking-wide mb-0.5">
                    GPS Coordinates
                  </p>
                  <p className="text-xs font-mono text-[#374151]">
                    {property.latitude.toFixed(6)}, {property.longitude.toFixed(6)}
                  </p>
                </div>
              </div>

              <a
                href={`https://maps.google.com/?q=${property.latitude},${property.longitude}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-3 rounded-xl
                           border border-[#1e5f74] text-[#1e5f74] text-sm font-bold
                           hover:bg-[#e0f0f5] active:scale-95 transition-all">
                Open in Google Maps <FiExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}