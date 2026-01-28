import React, { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { ReviewType } from "@/types";

// Enable the relativeTime plugin
dayjs.extend(relativeTime);

export const ReviewCard: React.FC<{
  review: ReviewType;
  showReply?: (review:ReviewType) => void;
  showPropDetails?: boolean
}> = ({ 
  review, 
  showReply, 
  showPropDetails = false
}) => {
  const [relativeTimeString, setRelativeTimeString] = useState("");

  useEffect(() => {
    // Update the relative time string every minute
    const updateRelativeTime = () => {
      setRelativeTimeString(dayjs(review.createdAt).fromNow());
    };  

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);
    
    return () => clearInterval(interval); 
  }, [review]);

  if (!review) {
    return <div> Missing Review </div>
  }

  return (
    <div className="border border-[#DCDFD9] rounded-2xl">
      {showPropDetails && <div className="p-3 rounded-lg flex items-center h-16 bg-white">
        <Image 
          src={review.property.banner || '/logo.png'}
          width={50} 
          height={50} 
          className="rounded-lg" 
          alt={'property'}
        />

        <div className="ml-2 space-y-1"> 
          <p className="font-bold">{review.property.title}</p>                                
          
          <div  className="flex items-center">
            <span className="font-bold mr-2">{review.property.average_rating}</span>
            <HiOutlineLocationMarker />
            <p className="text-gray-500 text-sm"> {review.property.address}</p>
          </div>
        </div>
      </div>}
      
      <div className="flex flex-col space-y-3 card-bg p-3 text-sm rounded-xl mt-3" key={review._id} >
        <div className="flex items-start space-x-3">
          <img
            src={review.sender?.image || '/avatar.png'}
            alt="Reviewer"
            className="w-10 h-10 rounded-full"
          />
          
          <div className="flex-1 relative">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold">{review.sender?.username}</h3>
              
              <div className="flex text-yellow-500">
                {Array.from({ length: 5 }).map((_, index) =>
                  index < Math.floor(review.rating) ? (
                  <FaStar key={index} />
                  ) : (
                  <FaRegStar key={index} />
                  )
                )}
              </div>
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>

            {/* Review Images */}
            {review.image && (
              <div className="flex space-x-3 mt-2">
                <img
                  src={review.image}
                  alt="Review Image"
                  className="w-16 h-16 rounded-lg object-cover"
                />
              </div>
            )}

            {/* Date-Time */}
            <div className="text-xs text-gray-400 my-4 flex relative">
              <span>Reviewed {relativeTimeString}</span>

              <button 
                className="ms-auto text-primary" 
                onClick={() => showReply && showReply(review)}
              >
                Reply ({review.replies_count || 0})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
  );
};

interface ReplyCardProps {
  id: string;
  sender: string;
  comment: string;
  senderAvatar: string;
  reviewDate: string; // ISO 8601 date string
}
export const ReplyCard: React.FC<ReplyCardProps> = ({
  id,
  sender,
  comment,
  senderAvatar,
  reviewDate
}) => {
  const [relativeTimeString, setRelativeTimeString] = useState("");

  useEffect(() => {
    // Update the relative time string every minute
    const updateRelativeTime = () => {
        setRelativeTimeString(dayjs(reviewDate).fromNow());
    };  

    updateRelativeTime();
    const interval = setInterval(updateRelativeTime, 60000);
    
    return () => clearInterval(interval); 
  }, [reviewDate]);

  return (
    <div className="flex flex-col space-y-3 card-bg p-3 text-sm rounded-xl mt-5" key={id}>
      <div className="flex items-start space-x-3">
        <img
          src={senderAvatar || '/avatar.png'}
          alt="Reviewer"
          className="w-7 h-7 rounded-full"
        />
        
        <div className="flex-1 relative">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-bold">{sender}</h3>
          </div>
          
          <p className="text-sm text-gray-700">{comment}</p>
          
          {/* Date-Time */}
          <div className="text-xs text-gray-500 my-4 flex relative">
            <span>Reviewed {relativeTimeString}</span>
          </div>
        </div>
      </div>
            
    </div>
  );
};
