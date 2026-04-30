import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { ReviewType } from "@/types";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

dayjs.extend(relativeTime);

// ─── Star renderer ────────────────────────────────────────────────────────────
const Stars = ({ rating, size = 12 }: { rating: number; size?: number }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) =>
      i < Math.floor(rating) ? (
        <FaStar key={i} size={size} style={{ color: "#f0a500" }} />
      ) : (
        <FaRegStar key={i} size={size} style={{ color: "#d1d5db" }} />
      )
    )}
  </div>
);

// ─── ReviewCard ───────────────────────────────────────────────────────────────
export const ReviewCard: React.FC<{
  review: ReviewType;
  showReply?: (review: ReviewType) => void;
  showPropDetails?: boolean;
}> = ({ review, showReply, showPropDetails = false }) => {
  const { t } = useLanguage();
  const [relativeTimeString, setRelativeTimeString] = useState("");

  useEffect(() => {
    const update = () => setRelativeTimeString(dayjs(review.createdAt).fromNow());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [review]);

  if (!review) return null;

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        border: "1px solid #e5e7eb",
        boxShadow: "0 2px 12px rgba(30,95,116,0.06)",
        background: "white",
      }}
    >
      {/* Optional property context strip */}
      {showPropDetails && (
        <div
          className="flex items-center gap-3 px-3 py-2.5"
          style={{ background: "#f5f7f9", borderBottom: "1px solid #e5e7eb" }}
        >
          <div
            className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0"
            style={{ border: "1.5px solid #e5e7eb" }}
          >
            <Image
              src={review.property.banner || "/logo.png"}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              alt="property"
            />
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-bold text-[#111827] truncate">
              {review.property.title}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Stars rating={review.property.average_rating ?? 4.9} size={10} />
              <span
                className="text-[11px] font-bold"
                style={{ color: "#f0a500" }}
              >
                {review.property.average_rating?.toFixed(1)}
              </span>
              <span className="text-[#d1d5db]">·</span>
              <HiOutlineLocationMarker
                size={11}
                style={{ color: "#9ca3af", flexShrink: 0 }}
              />
              <p className="text-[11px] text-[#9ca3af] truncate">
                {review.property.address}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Review body */}
      <div className="p-3.5">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div
            className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0"
            style={{ border: "2px solid #e0f0f5" }}
          >
            <img
              src={review.sender?.avatar || "/avatar.png"}
              alt={review.sender?.display_name || "Reviewer"}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Name + stars row */}
            <div className="flex items-center justify-between mb-1">
              <p className="text-[13px] font-bold text-[#111827] truncate">
                {review.sender?.display_name}
              </p>
              <Stars rating={review.rating} />
            </div>

            {/* Comment */}
            <p className="text-[13px] text-[#4b5563] leading-relaxed">
              {review.comment}
            </p>

            {/* Review image */}
            {review.image && (
              <div className="mt-2.5">
                <img
                  src={review.image}
                  alt="Review photo"
                  className="w-20 h-20 rounded-xl object-cover"
                  style={{ border: "1px solid #e5e7eb" }}
                />
              </div>
            )}

            {/* Footer: date + reply */}
            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px]" style={{ color: "#9ca3af" }}>
                {relativeTimeString}
              </span>

              {showReply && (
                <button
                  onClick={() => showReply(review)}
                  className="flex items-center gap-1 text-[11px] font-bold
                             px-2.5 py-1 rounded-full transition-all duration-150
                             active:scale-95"
                  style={{ background: "#e0f0f5", color: "#1e5f74" }}
                >
                  💬 {t("rev_reply")} ({review.reply_count ?? 0})
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── ReplyCard ────────────────────────────────────────────────────────────────
interface ReplyCardProps {
  id: string;
  sender: string;
  comment: string;
  senderAvatar: string;
  reviewDate: string;
}

export const ReplyCard: React.FC<ReplyCardProps> = ({
  id,
  sender,
  comment,
  senderAvatar,
  reviewDate,
}) => {
  const [relativeTimeString, setRelativeTimeString] = useState("");

  useEffect(() => {
    const update = () => setRelativeTimeString(dayjs(reviewDate).fromNow());
    update();
    const id = setInterval(update, 60_000);
    return () => clearInterval(id);
  }, [reviewDate]);

  return (
    <div
      key={id}
      className="flex items-start gap-2.5 p-3 rounded-xl"
      style={{ background: "#f5f7f9", border: "1px solid #e5e7eb" }}
    >
      {/* Avatar with teal accent border */}
      <div
        className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0 mt-0.5"
        style={{ border: "1.5px solid #e0f0f5" }}
      >
        <img
          src={senderAvatar || "/avatar.png"}
          alt={sender}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 min-w-0">
        {/* Sender + thread indicator */}
        <div className="flex items-center gap-1.5 mb-0.5">
          <span
            className="w-1.5 h-1.5 rounded-full inline-block flex-shrink-0"
            style={{ background: "#1e5f74" }}
          />
          <p className="text-[12px] font-bold text-[#111827]">{sender}</p>
        </div>

        <p className="text-[12px] text-[#4b5563] leading-relaxed">{comment}</p>

        <p className="text-[10px] mt-1.5" style={{ color: "#9ca3af" }}>
          {relativeTimeString}
        </p>
      </div>
    </div>
  );
};