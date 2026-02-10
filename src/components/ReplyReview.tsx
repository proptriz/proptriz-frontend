'use client';

import { useContext, useEffect, useRef, useState } from "react";
import { ReplyCard, ReviewCard } from "./shared/Cards";
import { TbSend2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { ReviewType } from "@/types";
import logger from "../../logger.config.mjs";
import {
  addReplyReviewApi,
  getPropertyReviewReplyApi
} from "@/services/reviewApi";
import Splash from "./shared/Splash";
import { AppContext } from "@/context/AppContextProvider";
import { ReplyCardSkeleton } from "./skeletons/ReplyCardSkeleton";

const PAGE_LIMIT = 10;

const ReplyReview = ({ review }: { review: ReviewType }) => {
  const { authUser } = useContext(AppContext);

  const [replies, setReplies] = useState<any[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);
  const observerInstance = useRef<IntersectionObserver | null>(null);

  /* ---------------- FETCH REPLIES ---------------- */

  const fetchReplies = async (reset = false) => {
    if (loading || (!hasMore && !reset)) return;

    setLoading(true);

    try {
      const res = await getPropertyReviewReplyApi({
        reviewId: review._id,
        nextCursor: reset ? null : cursor,
      });

      if (!res) return;

      setReplies(prev =>
        reset ? res.replies : [...prev, ...res.replies]
      );
      setCursor(res.cursor);
      setHasMore(Boolean(res.cursor));
    } catch (err) {
      logger.error("Failed to fetch replies:", err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- OBSERVER ---------------- */

  useEffect(() => {
    if (!observerRef.current) return;

    observerInstance.current?.disconnect();

    observerInstance.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        fetchReplies();
      }
    });

    observerInstance.current.observe(observerRef.current);

    return () => observerInstance.current?.disconnect();
  }, [hasMore, loading]);

  /* ---------------- INITIAL LOAD ---------------- */

  useEffect(() => {
    if (review?._id) {
      setReplies([]);
      setCursor(null);
      setHasMore(true);
      fetchReplies(true);
    }
  }, [review?._id]);

  /* ---------------- SEND REPLY ---------------- */

  const sendReply = async () => {
    if (!comment.trim() || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const newReply = await addReplyReviewApi(review._id, comment.trim());

      if (!newReply) {
        toast.error("Failed to submit reply.");
        return;
      }

      toast.success("Reply sent");

      // 🔥 Optimistic prepend with animation
      setReplies(prev => [
        { ...newReply, __optimistic: true },
        ...prev
      ]);

      setComment("");
    } catch (err) {
      logger.error("Reply error:", err);
      toast.error("Something went wrong.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authUser) return <Splash />;

  return (
    <div className="relative h-full flex flex-col">
      {/* Review */}
      <div className="px-4 pt-4">
        <h2 className="text-xl font-semibold pb-2">Review Details</h2>
        <ReviewCard review={review} />
      </div>

      {/* Replies */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pt-6">
        <h2 className="text-lg font-semibold">Replies</h2>

        {!loading && replies.length === 0 && (
          <p className="text-gray-500">No replies yet.</p>
        )}

        {replies.map(reply => (
          <div
            key={reply._id}
            className={`transition-all duration-300 ${
              reply.__optimistic ? "animate-slide-in" : ""
            }`}
          >
            <ReplyCard
              id={reply._id}
              sender={reply.reply_from?.username || "Owner"}
              comment={reply.comment}
              senderAvatar={reply.reply_from?.image || "/logo.png"}
              reviewDate={reply.createdAt}
            />
          </div>
        ))}

        {loading &&
          Array.from({ length: 2 }).map((_, i) => (
            <ReplyCardSkeleton key={i} />
          ))}

        {hasMore && <div ref={observerRef} />}

        {!hasMore && replies.length > 0 && (
          <p className="text-center text-gray-400 py-4">
            No more replies
          </p>
        )}
      </div>

      {/* Reply Input */}
      <div className="sticky bottom-0 bg-white border-t p-3 space-y-1">
        <p className="font-medium">Reply</p>

        <div className="flex gap-2">
          <input
            type="text"
            disabled={isSubmitting}
            value={comment}
            onChange={e => setComment(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendReply()}
            placeholder="Write your reply..."
            className="flex-1 rounded-md bg-gray-100 p-2 outline-primary disabled:opacity-50"
          />

          <button
            disabled={isSubmitting}
            onClick={sendReply}
            className="bg-primary px-3 rounded-md text-white disabled:opacity-50"
          >
            <TbSend2 className="text-xl" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplyReview;
