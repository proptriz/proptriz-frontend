'use client';

import React, { useState, useEffect, useCallback } from "react";
import { ReviewCard } from "@/components/shared/Cards";
import { VerticalCard } from "@/components/shared/VerticalCard";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaArrowLeft, FaRegHeart, FaStar } from "react-icons/fa";
import { PropertyStatusEnum, PropertyType, ReviewType } from "@/types";
import Link from "next/link";
import { getCollocatedProperties } from "@/services/propertyApi";
import Price from "@/components/shared/Price";
import GalleryModal from "@/components/shared/GalleryModal";
import StickyAgentInfo from "@/components/StickyAgent";
import PropertyDescription from "@/components/shared/Description";
import ShareButton from "./ShareButton";
import { getPropertyReviewsApi } from "@/services/reviewApi";
import Popup from "./shared/Popup";
import { AddReview } from "./AddReview";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Map known feature names to an emoji for richer display */
const FEATURE_EMOJI: Record<string, string> = {
  bedroom:      "🛏️",
  bedrooms:     "🛏️",
  bathroom:     "🚿",
  bathrooms:    "🚿",
  toilet:       "🚿",
  toilets:      "🚿",
  garage:       "🚗",
  parking:      "🚗",
  pool:         "🏊",
  "swimming pool": "🏊",
  gym:          "🏋️",
  garden:       "🌿",
  balcony:      "🪟",
  floor:        "🏢",
  floors:       "🏢",
  kitchen:      "🍳",
  store:        "📦",
};

const getFeatureEmoji = (name: string) =>
  FEATURE_EMOJI[name.toLowerCase()] ?? "🏠";

const formatDate = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleDateString(undefined, { dateStyle: "medium" })
    : "";

// ─── Component ────────────────────────────────────────────────────────────────

const PropertyDetailsClient = ({ property }: { property: PropertyType }) => {
  const router     = useRouter();
  const propertyId = property._id;

  const [nearbyProperties, setNearbyProperties] = useState<PropertyType[]>([]);
  const [reviews, setReviews]                   = useState<ReviewType[]>([]);
  const [nextCursor, setNextCursor]             = useState<string | undefined>();
  const [refreshReviews, setRefreshReviews]     = useState(false);
  const [showGallery, setShowGallery]           = useState(false);
  const [togglePopup, setTogglePopup]           = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [error, setError]                       = useState<string | null>(null);

  // ── Fetch nearby ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!propertyId || nearbyProperties.length > 0) return;
    getCollocatedProperties(propertyId)
      .then((props) => { if (props?.length) setNearbyProperties(props); })
      .catch(() => {/* silent */});
  }, [propertyId, nearbyProperties.length]);

  // ── Fetch reviews ────────────────────────────────────────────────────────
  const fetchReviews = useCallback(async () => {
    if (!propertyId) return;
    try {
      const data = await getPropertyReviewsApi(propertyId, nextCursor);
      if (data?.reviews?.length) {
        setReviews(data.reviews);
        setNextCursor(data.nextCursor);
      }
    } catch {/* silent */}
  }, [propertyId, nextCursor]);

  useEffect(() => {
    setRefreshReviews(false);
    fetchReviews();
  }, [propertyId, refreshReviews]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Loading / error states ────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#f7f8fa]">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#e5e7eb] border-t-[#1a7a4a]
                          rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-[#4b5563]">Loading property…</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen gap-3 p-6">
        <p className="text-5xl">😕</p>
        <p className="text-[#111827] font-bold text-lg">Couldn't load property</p>
        <p className="text-sm text-[#9ca3af] text-center">{error}</p>
        <button
          onClick={() => router.back()}
          className="mt-2 px-5 py-2.5 rounded-xl bg-[#1a7a4a] text-white text-sm font-bold"
        >
          Go Back
        </button>
      </div>
    );
  }

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="relative bg-[#f7f8fa]">

      {/* ── Scrollable body ───────────────────────────────────────────────── */}
      <div className="flex flex-col pb-[96px]">

        {/* ── Hero image ──────────────────────────────────────────────────── */}
        <div className="relative">
          <Image
            src={property.banner || "/skyscraper.png"}
            alt={property.title}
            width={1000}
            height={700}
            className="w-full h-[300px] object-cover"
            priority
          />

          {/* Gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

          {/* Back button */}
          <button
            onClick={() => router.back()}
            className="absolute top-12 left-4 w-9 h-9 rounded-full bg-white flex items-center
                       justify-center shadow-[0_2px_10px_rgba(0,0,0,0.2)] z-10
                       hover:bg-gray-50 transition-colors"
            aria-label="Back"
          >
            ←
          </button>

          {/* Top-right actions */}
          <div className="absolute top-12 right-4 flex gap-2 z-10">
            <ShareButton
              title={`${property.title} for ${property.listed_for}, located at ${property.address}.`}
              relativeURL={`/property/details/${property._id}`}
            />
            <button
              className="w-9 h-9 rounded-full bg-white flex items-center justify-center
                         shadow-[0_2px_10px_rgba(0,0,0,0.2)] hover:bg-red-50 transition-colors"
              aria-label="Save to wishlist"
            >
              <FaRegHeart className="text-[#4b5563] text-sm" />
            </button>
          </div>

          {/* Bottom-left: rating + listing type */}
          <div className="absolute bottom-4 left-4 flex items-center gap-2 z-10">
            <div className="flex items-center gap-1.5 bg-black/55 backdrop-blur-[3px]
                            text-white text-xs font-semibold px-3 py-1.5 rounded-full">
              <FaStar className="text-[#f5a623]" />
              {property.average_rating} · {property.category}
            </div>
            {property.listed_for && (
              <span className="bg-[#f5a623] text-[#111] text-[11px] font-extrabold
                               px-3 py-1.5 rounded-full capitalize">
                For {property.listed_for}
              </span>
            )}
          </div>

          {/* Bottom-right: gallery thumbnail */}
          {property.images?.length > 0 && (
            <button
              onClick={() => setShowGallery(true)}
              className="absolute bottom-4 right-4 w-14 h-14 rounded-xl overflow-hidden
                         border-2 border-white shadow-[0_2px_10px_rgba(0,0,0,0.3)] z-10
                         hover:opacity-90 transition-opacity"
              aria-label="View gallery"
            >
              <img
                src={property.images[1] ?? property.images[0]}
                alt="More photos"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/45 flex items-center justify-center
                              text-white text-xs font-extrabold">
                +{property.images.length}
              </div>
            </button>
          )}
        </div>

        {/* ── Content ─────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 p-4">

          {/* Meta row: updated date + availability status */}
          <div className="flex items-center justify-between">
            {property.updatedAt && <p className="text-sm text-[#9ca3af]">
              Updated {formatDate(property.updatedAt.toString())}
            </p>}
            <span 
              className={`text-[11px] font-bold px-3 py-1 rounded-full border-[1.5px]
                          ${property.status === PropertyStatusEnum.available
                            ? "bg-[#e8f5ee] text-[#1a7a4a] border-[rgba(26,122,74,0.2)]"
                            : property.status === PropertyStatusEnum.unavailable
                            ? "bg-red-50 text-red-500 border-red-200"
                            : "bg-amber-50 text-amber-600 border-amber-200"
                          }`}
            >
              {property.status === PropertyStatusEnum.available ? "✅ Available"
               : property.status === PropertyStatusEnum.unavailable ? "❌ Unavailable"
               :                                  "⏳ "+ PropertyStatusEnum[property.status]}
            </span>
          </div>

          {/* Title + Price */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h1
                className="text-[20px] font-extrabold text-[#111827] leading-tight"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                {property.title}
              </h1>
              <p className="text-sm text-[#4b5563] flex items-center gap-1 mt-1">
                <span>📍</span>
                <span className="truncate">{property.address}</span>
              </p>
            </div>
            <div className="flex-shrink-0 text-right">
              <Price
                price={property.price}
                currency={property.currency}
                tenancyPeriod={property.period}
              />
            </div>
          </div>

          {/* Feature chips */}
          {property.features && property.features.length > 0 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {property.features.map((feat, i) => (
                <div
                  key={i}
                  className="flex items-center gap-1.5 flex-shrink-0
                             bg-[#e8f5ee] text-[#1a7a4a] border border-[rgba(26,122,74,0.2)]
                             px-3 py-1.5 rounded-full text-[12px] font-semibold"
                >
                  <span>{getFeatureEmoji(feat.name)}</span>
                  {feat.quantity} {feat.name}
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
            <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-2
                          flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] inline-block" />
              Description
            </p>
            <PropertyDescription description={property.description} />
          </div>

          {/* Map thumbnail → links to detail map */}
          <Link href={`/property/detail-map/${propertyId}`}>
            <div className="rounded-2xl overflow-hidden border border-[#e5e7eb] cursor-pointer
                            hover:shadow-md transition-shadow">
              {/* SVG map visual — no /map-image.png dependency */}
              <div
                className="h-[110px] relative flex items-center justify-center"
                style={{ background: "linear-gradient(160deg,#1a3a2a,#0f2d1f)" }}
              >
                <svg
                  className="absolute inset-0 w-full h-full opacity-15"
                  viewBox="0 0 360 110"
                  preserveAspectRatio="none"
                >
                  <line x1="0" y1="37" x2="360" y2="37" stroke="white" strokeWidth=".8"/>
                  <line x1="0" y1="73" x2="360" y2="73" stroke="white" strokeWidth=".8"/>
                  <line x1="72" y1="0" x2="72" y2="110" stroke="white" strokeWidth=".8"/>
                  <line x1="144" y1="0" x2="144" y2="110" stroke="white" strokeWidth=".8"/>
                  <line x1="216" y1="0" x2="216" y2="110" stroke="white" strokeWidth=".8"/>
                  <line x1="288" y1="0" x2="288" y2="110" stroke="white" strokeWidth=".8"/>
                  <path d="M0 55 Q90 42 180 58 Q270 72 360 50" stroke="#2ea06a" strokeWidth="4" fill="none" opacity=".5"/>
                  <path d="M144 0 Q158 55 146 110" stroke="#2ea06a" strokeWidth="3" fill="none" opacity=".4"/>
                </svg>
                <span className="text-3xl relative z-10 drop-shadow-lg">📍</span>
              </div>
              <div className="bg-white px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[13px] font-semibold text-[#111827]">View full map</p>
                  {property.latitude && property.longitude && (
                    <p className="text-[10px] text-[#9ca3af] font-mono">
                      {Number(property.latitude).toFixed(4)}° N,{" "}
                      {Number(property.longitude).toFixed(4)}° E
                    </p>
                  )}
                </div>
                <span className="text-[#1a7a4a] font-bold text-sm">→</span>
              </div>
            </div>
          </Link>

          {/* Reviews */}
          <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
            <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                          flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] inline-block" />
              Reviews
            </p>

            {/* Summary card */}
            <div
              className="rounded-xl p-3 flex items-center gap-3 mb-3"
              style={{ background: "linear-gradient(135deg,#1a7a4a,#2ea06a)" }}
            >
              <div>
                <p className="text-[28px] font-extrabold text-white leading-none">
                  {property.average_rating ?? "—"}
                </p>
                <div className="flex gap-0.5 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={i < Math.round(property.average_rating ?? 0)
                        ? "text-[#f5a623]"
                        : "text-white/30"}
                      size={12}
                    />
                  ))}
                </div>
                <p className="text-[10px] text-white/70 mt-0.5">
                  {reviews.length} review{reviews.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex-1" />
              <button
                onClick={() => setTogglePopup(true)}
                className="px-3 py-2 rounded-xl border-[1.5px] border-white/40
                           bg-white/20 backdrop-blur-sm text-white
                           text-[12px] font-bold hover:bg-white/30 transition-colors"
              >
                + Add Review
              </button>
            </div>

            {/* Review cards */}
            {reviews.length > 0 && (
              <>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  {reviews.slice(0, 6).map((review) => (
                    <div key={review._id} className="flex-shrink-0 w-[220px]">
                      <Link href={`/property/reviews/${propertyId}`}>
                        <ReviewCard review={review} />
                      </Link>
                    </div>
                  ))}
                </div>
                <Link
                  href={`/property/reviews/${propertyId}`}
                  className="text-[12px] font-bold text-[#1a7a4a] block text-right mt-2"
                >
                  View all {reviews.length} reviews →
                </Link>
              </>
            )}
          </div>

          {/* Nearby Properties */}
          {nearbyProperties.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
              <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                            flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1a7a4a] inline-block" />
                Nearby Properties
              </p>
              <div className="grid grid-cols-2 gap-3">
                {nearbyProperties.slice(0, 4).map((item) => (
                  <Link key={item._id} href={`/property/details/${item._id}`}>
                    <VerticalCard
                      id={item._id}
                      name={item.title}
                      currency={item.currency}
                      price={item.price}
                      category={item.category}
                      listed_for={item.listed_for}
                      address={item.address}
                      image={item.banner}
                      period={item.period ?? ""}
                      distance={item.distance ?? undefined}
                      rating={item.average_rating ?? 4.9}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>

      {/* ── Sticky agent bar ────────────────────────────────────────────── */}
      <StickyAgentInfo user={property.user} property={property} />

      {/* ── Gallery modal ────────────────────────────────────────────────── */}
      <GalleryModal
        images={property.images}
        show={showGallery}
        startIndex={0}
        onClose={() => setShowGallery(false)}
      />

      {/* ── Add review popup ─────────────────────────────────────────────── */}
      <Popup
        header="Add a review"
        toggle={togglePopup}
        setToggle={setTogglePopup}
        useMask
        hideReset
      >
        <AddReview
          propertyId={propertyId}
          setRefreshReviews={setRefreshReviews}
          propOwner={property.user?.user_id}
        />
      </Popup>
    </div>
  );
};

export default PropertyDetailsClient;