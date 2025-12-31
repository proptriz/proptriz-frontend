import { useEffect, useState } from "react";
import { ReplyCard, ReviewCard } from "./shared/Cards";
import { TbSend2 } from "react-icons/tb";
import { toast } from "react-toastify";

const ReplyReview = ({ id }: { id: string }) => {
  const [replies, setReplies] = useState([]);

  useEffect(() => {
    // Fetch review and replies based on the id if needed
  }, [id]);

  const sendReply = async () => {
    // Logic to send reply
    toast.success("Reply sent");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      sendReply();
    }
  };

  return (
    <div className="relative h-full">
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
      <div className="px-4 space-y-4 relative">
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
        
      </div>
      {/* Reply Input */}
        <div className="sticky bottom-0 left-0 right-0 border-t bg-white p-2 space-y-1 text-primary">
          <p>Reply:</p>
          <div className="flex space-x-2 ">
            <input
              type="text" 
              className="w-full rounded-md bg-gray-100 p-2 outline outline-primary" 
              onKeyDown={handleKeyDown}
              onClick={sendReply}
            />
            <button 
              className="bg-primary px-2 py-1 rounded-md text-white focus:text-secondary" 
            >
              <TbSend2 className="text-2xl" />
            </button>
          </div>
          
        </div>
    </div>
  )
};

export default ReplyReview;