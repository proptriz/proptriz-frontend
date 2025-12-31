'use client';

import React, { use, useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { ReviewCard } from "@/components/shared/Cards";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { PropertyType } from "@/types";
import { ReviewType } from "@/types/property";
import Popup from "@/components/shared/Popup";
import ReplyReview from "@/components/ReplyReview";

const PropertyReviews = ({
  params
}: {
  params: Promise<{ id: string }> ;
}) => {
  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;
  const [property, setProperty] = useState<PropertyType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [isReplyPop, setIsReplyPop] = useState<boolean>(false);
  const [replyId, setReplyId] = useState<string>('');

  const showReply = (id:string)=>{
    setIsReplyPop(!isReplyPop)
    setReplyId(id)
  }

  return (
    <>
    <div className="flex flex-col p-6 pb-7">
      {/* Header Section */}
      <header className="flex w-full mb-7">
        <BackButton />
        <h1 className="text-center w-full">Reviews</h1>
      </header>
      
      {/* Property Card */}
      {property && (
        <HorizontalCard 
          id={''}
          name={property.title} 
          price={30} 
          currency={property.currency}
          category={property.category} 
          listed_for={property.listed_for}
          address={property.address} 
          image={property.banner} 
          period={property.period ?? 'monthly'} 
          rating={property.rating ?? 5.0}
        />
      )}
      
      {/* Reviews */}
      <div className="px-5 mt-7">
        <h2 className="text-lg font-bold mb-3">Property Reviews</h2>
                
        <div className="space-y-6 max-h-[470px] overflow-y-auto pb-14">
            {/* Review Item */}
          <ReviewCard 
            review={{
              id:'01',
              reviewer:"Kurt Mullins", 
              image:"/avatar.png", 
              ratings:4.0,
              text:"Lorem ipsum dolor sit amet, consectetur \
                adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              review_images:[],
              review_date:"2025-01-01T10:00:00Z" // Example ISO 8601 date string
            }}
          />
          <ReviewCard
            review={{
              id:'02',
              reviewer:"Kurt Mullins",
              image:"/avatar.png",
              ratings:2.5,
              text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              review_images:[
                "/apartment.png",
                "/home/building3.png",
                "/home/building4.png",
                "/home/house-with-pool.png", // This will not be shown because only 3 are displayed
            ],
              review_date:"2025-01-01T03:04:20Z", // Example ISO 8601 date string
              replies_count: 0,
            }}

          />
          <ReviewCard 
            review={{
              id:'02', 
              reviewer:"Kurt Mullins", 
              image:"/avatar.png", 
              ratings:4.0,
              text:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              review_date:"2025-01-01T10:00:00Z", // Example ISO 8601 date string
              replies_count: 3,
              review_images: [],
            }}
            showReply={showReply}
          />
          {/* Add more reviews here */}
        </div>
      </div>
    </div>

    {/* Reply Review Popup */}
    <Popup
      header="Reply Review"
      toggle={isReplyPop}
      setToggle={setIsReplyPop}
      useMask={true}
      hideReset={true}
    >
      <ReplyReview id={replyId} />
    </Popup>
    </>
  );
};

export default PropertyReviews;
