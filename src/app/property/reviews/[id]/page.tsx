'use client';

import React, { use, useEffect, useState } from "react";
import { ReviewCard } from "@/components/shared/Cards";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { PropertyType } from "@/types/property";
import { ReviewType } from "@/types";
import Popup from "@/components/shared/Popup";
import ReplyReview from "@/components/ReplyReview";
import { getPropertyReviewsApi } from "@/services/reviewApi";
import logger from "../../../../../logger.config.mjs";
import { getPropertyById } from "@/services/propertyApi";
import Link from "next/link";
import { AddReview } from "@/components/AddReview";
import { BackButton } from "@/components/shared/buttons";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

// ─── Star display (read-only) ─────────────────────────────────────────────────
const RatingSummary = ({ rating, count }: { rating: number; count: number }) => (
  <div className="flex items-center gap-2 px-4 py-3"
       style={{ background: "#f5f7f9", borderBottom: "1px solid #e5e7eb" }}>
    <span
      className="text-3xl font-extrabold leading-none"
      style={{ color: "#f0a500", fontFamily: "'Raleway', sans-serif" }}
    >
      {rating?.toFixed(1) || "—"}
    </span>
    <div>
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className="text-sm"
            style={{ color: i < Math.floor(rating) ? "#f0a500" : "#e5e7eb" }}
          >
            ★
          </span>
        ))}
      </div>
      <p className="text-[11px] text-[#9ca3af] mt-0.5">
        {count} {count === 1 ? "review" : "reviews"}
      </p>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

const PropertyReviews = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id: propertyId } = use(params);
  const { t } = useLanguage();

  const [property, setProperty]               = useState<PropertyType | null>(null);
  const [reviews, setReviews]                 = useState<ReviewType[]>([]);
  const [nextCursor, setNextCursor]           = useState<string | undefined>(undefined);
  const [refreshReviews, setRefreshReviews]   = useState(false);
  const [isReplyPop, setIsReplyPop]           = useState(false);
  const [replyReview, setReplyReview]         = useState<ReviewType | null>(null);
  const [reviewPopup, setReviewPopup]         = useState(false);

  const showReply = (review: ReviewType) => {
    setReplyReview(review);
    setIsReplyPop(true);
  };

  // ── Fetch property ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!propertyId) return;
    (async () => {
      try {
        const data = await getPropertyById(propertyId);
        if (data) setProperty(data);
      } catch (err) {
        logger.error("Error fetching property", err);
      }
    })();
  }, [propertyId]);

  // ── Fetch reviews ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!propertyId) return;
    setRefreshReviews(false);
    (async () => {
      try {
        const data = await getPropertyReviewsApi(propertyId, nextCursor);
        if (data?.reviews?.length) {
          setReviews(data.reviews);
          setNextCursor(data.nextCursor);
        }
      } catch (err) {
        logger.error("Error fetching reviews", err);
      }
    })();
  }, [propertyId, refreshReviews]);

  return (
    <>
      <div className="h-screen flex flex-col overflow-hidden" style={{ background: "#f5f7f9" }}>

        {/* ── Hero header ─────────────────────────────────────────────── */}
        <div
          className="relative flex items-center px-4 pt-12 pb-4 flex-shrink-0"
          style={{ background: "linear-gradient(160deg,#143d4d,#1e5f74)" }}
        >
          {/* Back button */}
          <div className="absolute left-4 top-4 z-10">
            <BackButton />
          </div>

          {/* Title */}
          <p
            className="w-full text-center text-white font-bold text-[15px]"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            Property Reviews
          </p>

          {/* Curve into content */}
          <div
            className="absolute bottom-0 left-0 right-0 h-4 bg-[#f5f7f9]"
            style={{ borderRadius: "20px 20px 0 0" }}
          />
        </div>

        {/* ── Property card ────────────────────────────────────────────── */}
        <Link
          href={`/property/details/${propertyId}`}
          className="flex-shrink-0"
        >
          <div
            className="mx-4 mb-1 rounded-2xl overflow-hidden"
            style={{
              background: "white",
              border: "1px solid #e5e7eb",
              boxShadow: "0 2px 12px rgba(30,95,116,0.06)",
            }}
          >
            {property && (
              <>
                <div className="px-3 pt-3 pb-2">
                  <HorizontalCard
                    id={property._id}
                    name={property.title}
                    price={property.price}
                    currency={property.currency}
                    category={property.category}
                    listed_for={property.listed_for}
                    address={property.address}
                    image={property.banner}
                    period={property.period ?? "monthly"}
                    rating={property.average_rating ?? 4.5}
                  />
                </div>
                <RatingSummary
                  rating={property.average_rating ?? 0}
                  count={reviews.length}
                />
              </>
            )}
          </div>
        </Link>

        {/* ── Reviews list ─────────────────────────────────────────────── */}
        <div className="flex-1 overflow-hidden flex flex-col px-4 pt-2">
          {/* Section header + CTA */}
          <div className="flex items-center justify-between mb-3 flex-shrink-0">
            <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                          flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
              Reviews
            </p>

            <button
              type="button"
              onClick={() => setReviewPopup(true)}
              className="flex items-center gap-1.5 text-[12px] font-bold
                         text-white px-3 py-1.5 rounded-xl
                         transition-all duration-200 active:scale-95"
              style={{
                background: "linear-gradient(135deg,#143d4d,#1e5f74)",
                boxShadow: "0 3px 12px rgba(30,95,116,0.3)",
              }}
            >
              ✏️ Add Review
            </button>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto space-y-3 pb-6">
            {reviews.length > 0 ? (
              reviews.map((review) => (
                <ReviewCard
                  key={review._id}
                  review={review}
                  showReply={showReply}
                />
              ))
            ) : (
              <div className="flex flex-col items-center py-12 text-center">
                <span className="text-4xl mb-3">⭐</span>
                <p className="text-[14px] font-semibold text-[#4b5563]">No reviews yet</p>
                <p className="text-[12px] text-[#9ca3af] mt-1">
                  Be the first to leave a review for this property
                </p>
                <button
                  type="button"
                  onClick={() => setReviewPopup(true)}
                  className="mt-4 px-5 py-2 rounded-xl text-white text-[13px] font-bold
                             transition-all active:scale-95"
                  style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
                >
                  Write a Review
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Reply popup ───────────────────────────────────────────────── */}
      {replyReview && (
        <Popup
          header={t("rev_replies_header")}
          toggle={isReplyPop}
          setToggle={setIsReplyPop}
          useMask
          hideReset
        >
          <ReplyReview review={replyReview} />
        </Popup>
      )}

      {/* ── Add review popup ──────────────────────────────────────────── */}
      {property && (
        <Popup
          header={t("rev_write_header")}
          toggle={reviewPopup}
          setToggle={setReviewPopup}
          useMask
          hideReset
        >
          <AddReview
            propertyId={propertyId}
            setRefreshReviews={setRefreshReviews}
            propOwner={property.user.user_id}
          />
        </Popup>
      )}
    </>
  );
};

export default PropertyReviews;
