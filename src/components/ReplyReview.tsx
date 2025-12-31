import { useEffect, useState } from "react";
import { ReplyCard, ReviewCard } from "./shared/Cards";

const ReplyReview = ({ id }: { id: string }) => {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    // Fetch review and replies based on the id if needed
  }, [id]);

  return (
    <div className="relative">
    {/* Review */}
      <ReviewCard
        review={{
          id:'01', 
          reviewer:"Kurt Mullins", 
          image:"/avatar.png", 
          ratings:4.0,
          text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
          review_date:"2025-01-01T10:00:00Z", // Example ISO 8601 date string
          replies_count: 3,
          review_images: [],
        }}
      />
      {/* Replies */}
      <div className="px-4 space-y-4 relative ">
        <ReplyCard
          id={"-reply1"}
          reviewer="Owner"
          text="Thank you for your feedback! We're glad you had a great experience."
          image="/avatar.png"
          reviewDate={new Date().toISOString()}
        />
        <ReplyCard
          id={"-reply2"}
          reviewer="Owner"
          text="Thank you for your feedback! We're glad you had a great experience."
          image={"/logo.png"}
          reviewDate={new Date().toISOString()}
        />
        <ReplyCard 
          id={"-reply3"}
          reviewer="Owner"
          text="Thank you for your feedback! We're glad you had a great experience."
          image={"/avatar.png"}
          reviewDate={new Date().toISOString()}
        />    
        {/* Reply Input */}
        <div className="sticky bottom-0 left-0 right-0 border-t bg-white p-2">
          <p>Reply:</p>
          <input type="text" className="w-full rounded-md card-bg p-2 " />
        </div>
      </div>
    </div>
  )
};

export default ReplyReview;