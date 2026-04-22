'use client';

import { useContext, useEffect, useRef, useState } from "react";
import { ReplyCard, ReviewCard } from "./shared/Cards";
import { TbSend2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { ReviewType } from "@/types";
import logger from "../../logger.config.mjs";
import { addReplyReviewApi, getPropertyReviewReplyApi } from "@/services/reviewApi";
import Splash from "./shared/Splash";
import { AppContext } from "@/context/AppContextProvider";
import { ReplyCardSkeleton } from "./skeletons/ReplyCardSkeleton";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

const ReplyReview = ({ review }: { review: ReviewType }) => {
  const { authUser } = useContext(AppContext);
  const { t } = useLanguage();

  const [replies, setReplies]         = useState<any[]>([]);
  const [cursor, setCursor]           = useState<string | null>(null);
  const [hasMore, setHasMore]         = useState(true);
  const [loading, setLoading]         = useState(false);
  const [comment, setComment]         = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const observerRef      = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────
  const fetchReplies = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;
    setLoading(true);
    try {
      const res = await getPropertyReviewReplyApi({
        reviewId: review._id,
        nextCursor: reset ? null : cursor,
      });
      if (!res) return;
      setReplies(prev => (reset ? res.replies : [...prev, ...res.replies]));
      setCursor(res.cursor);
      setHasMore(Boolean(res.cursor));
    } catch (err) {
      logger.error("Failed to fetch replies:", err);
    } finally {
      setLoading(false);
    }
  };

  // ── Infinite scroll observer ───────────────────────────────────────────
  useEffect(() => {
    if (!observerRef.current) return;
    observerInstance.current?.disconnect();
    observerInstance.current = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasMore && !loading) fetchReplies();
    });
    observerInstance.current.observe(observerRef.current);
    return () => observerInstance.current?.disconnect();
  }, [hasMore, loading]);

  useEffect(() => {
    if (review?._id) {
      setReplies([]);
      setCursor(null);
      setHasMore(true);
      fetchReplies(true);
    }
  }, [review?._id]);

  // ── Send reply ─────────────────────────────────────────────────────────
  const sendReply = async () => {
    if (!comment.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const newReply = await addReplyReviewApi(review._id, comment.trim());
      if (!newReply) { toast.error(t("rev_reply_failed")); return; }
      toast.success(t("rev_reply_success"));
      setReplies(prev => [{ ...newReply, __optimistic: true }, ...prev]);
      setComment("");
    } catch (err) {
      logger.error("Reply error:", err);
      toast.error(t("rev_reply_error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) return <Splash />;

  return (
    <div className="relative h-full flex flex-col" style={{ background: "#f5f7f9" }}>

      {/* ── Original review ───────────────────────────────────────────── */}
      <div className="px-4 pt-4 pb-3">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5 mb-2.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500] inline-block" />
          Review
        </p>
        <ReviewCard review={review} />
      </div>

      {/* ── Divider ───────────────────────────────────────────────────── */}
      <div
        className="mx-4 mb-3"
        style={{ height: 1, background: "linear-gradient(to right,transparent,rgba(30,95,116,0.15),transparent)" }}
      />

      {/* ── Replies list ──────────────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
{t("rev_replies_header")} {replies.length > 0 && `(${replies.length})`}
        </p>

        {!loading && replies.length === 0 && (
          <div className="flex flex-col items-center py-8 text-center">
            <span className="text-3xl mb-2">💬</span>
<p className="text-[13px] text-[#9ca3af]">{t("rev_reply_placeholder")}</p>
          </div>
        )}

        <div className="space-y-2.5">
          {replies.map((reply) => (
            <div
              key={reply._id}
              className={reply.__optimistic ? "animate-in fade-in slide-in-from-bottom-2 duration-300" : ""}
            >
              <ReplyCard
                id={reply._id}
                sender={reply.reply_from?.username || t("rev_owner")}
                comment={reply.comment}
                senderAvatar={reply.reply_from?.image || "/logo.png"}
                reviewDate={reply.createdAt}
              />
            </div>
          ))}
        </div>

        {loading && (
          <div className="space-y-2.5 mt-2.5">
            {Array.from({ length: 2 }).map((_, i) => <ReplyCardSkeleton key={i} />)}
          </div>
        )}

        {hasMore && <div ref={observerRef} />}

        {!hasMore && replies.length > 0 && (
          <p className="text-center text-[11px] text-[#9ca3af] py-4">{t("profile_no_more")}</p>
        )}
      </div>

      {/* ── Reply composer ────────────────────────────────────────────── */}
      <div
        className="sticky bottom-0 px-4 pt-3 pb-4"
        style={{
          background: "white",
          borderTop: "1px solid #e5e7eb",
          boxShadow: "0 -4px 20px rgba(0,0,0,0.06)",
        }}
      >
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
          {t("rev_reply_placeholder").replace("…", "")}
        </p>

        <div className="flex items-center gap-2">
          <input
            type="text"
            disabled={isSubmitting}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendReply()}
            placeholder={t("rev_reply_placeholder")}
            className="flex-1 text-[13px] rounded-xl px-3.5 py-2.5
                       transition-all duration-200 disabled:opacity-50 outline-none"
            style={{
              background: "#f5f7f9",
              border: "1.5px solid #e5e7eb",
              color: "#111827",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#1e5f74";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(30,95,116,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e5e7eb";
              e.currentTarget.style.boxShadow = "none";
            }}
          />

          <button
            type="button"
            disabled={isSubmitting || !comment.trim()}
            onClick={sendReply}
            className="w-10 h-10 rounded-xl flex items-center justify-center
                       text-white transition-all duration-200 active:scale-95
                       disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
            style={{
              background: "linear-gradient(135deg,#143d4d,#1e5f74)",
              boxShadow: comment.trim() ? "0 3px 12px rgba(30,95,116,0.35)" : "none",
            }}
          >
            {isSubmitting ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <TbSend2 size={18} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyReview;
