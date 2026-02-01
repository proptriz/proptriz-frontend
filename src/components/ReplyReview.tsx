'use client';

import { useContext, useEffect, useState } from "react";
import { ReplyCard, ReviewCard } from "./shared/Cards";
import { TbSend2 } from "react-icons/tb";
import { toast } from "react-toastify";
import { ReviewType } from "@/types";
import logger from "../../logger.config.mjs"
import { addReplyReviewApi, getPropertyReviewReplyApi } from "@/services/reviewApi";
import Splash from "./shared/Splash";
import { AppContext } from "@/context/AppContextProvider";

const ReplyReview = ({ review }: { review: ReviewType }) => {
  const { authUser } = useContext(AppContext);
  
  const [replies, setReplies] = useState([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [refreshReplies, setRefreshReplies] = useState<boolean>(false);
  const [comment, setComment] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch review replies
  useEffect(() => {
    if (!review._id) return
    setRefreshReplies(false);
    
    const fetchReview = async () => {
      try {
        const data = await getPropertyReviewReplyApi(review._id, nextCursor);

        if (data && data.replies) {
          setReplies(data.replies);
          setNextCursor(data.nextCursor);
          logger.info("fetched replies: ", data.replies.length);
        } else {
          logger.info("unable to fetch property reviews ");
        }

      } catch (error:any){
        logger.info("error fetching property reviews ");
      }
    };

    fetchReview()
  }, [review, refreshReplies]);

  const sendReply = async () => {
    // Handle review submission logic here
    setIsSubmitting(true);
    
    try {
      if (comment.trim() === "") {
        toast.error("Reply comment cannot be empty.");
        setIsSubmitting(false);
        return;
      }

      const newReply = await addReplyReviewApi(review._id, comment);
      // logger.info("Submitted reply:", newReply);

      if (!newReply) {
        toast.error("Failed to submit reply. Please try again.");
        setIsSubmitting(false);

      } else {
        toast.success("Reply submitted successfully!");
        setComment("");
        setIsSubmitting(false);
        setRefreshReplies(true);
      }

    } catch (error) {
      logger.error("Error submitting reply:", error);
      // toast.error("An error occurred while submitting your reply.");
      setIsSubmitting(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendReply();
    }
  };
  
  if (!authUser) {
    return <Splash />;
  }

  return (
    <div className="relative h-full">
      {/* Review */}
      <div>
        <h2 className="text-xl font-semibold px-4 pt-4 pb-2">Review Details</h2>
        
        <ReviewCard
          review={review}
        />
      </div>
      
      {/* Replies */}
      <div className="px-4 space-y-4 relative">
        <h2 className="text-lg font-semibold pt-4 pb-2">Replies</h2>

        {replies.length === 0 && (
          <p className="text-gray-500">No replies yet.</p>
        )}

        {replies.map((reply: any) => (
          <ReplyCard
            key={reply._id}
            id={reply._id}
            sender={reply.sender?.username || "Owner"}
            comment={reply.comment}
            senderAvatar={reply.sender?.image || '/avatar.png'}
            reviewDate={reply.createdAt}
          />
        ))}
        
      </div>
      {/* Reply Input */}
        <div className="sticky bottom-0 left-0 right-0 border-t bg-white p-2 space-y-1 text-primary">
          <p>Reply:</p>
          <div className="flex space-x-2 ">
            <input
              type="text" 
              className="w-full rounded-md bg-gray-100 p-2 outline outline-primary" 
              onKeyDown={handleKeyDown}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your reply here..."
            />

            <button 
              className={`bg-primary px-2 py-1 rounded-md text-white focus:text-secondary ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`} 
              onClick={sendReply}
              disabled={isSubmitting}
            >
              <TbSend2 className="text-2xl" />
            </button>
          </div>
          
        </div>
    </div>
  )
};

export default ReplyReview;