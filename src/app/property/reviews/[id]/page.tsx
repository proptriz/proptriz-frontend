'use client';

import React, { use, useEffect, useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { ReviewCard } from "@/components/shared/Cards";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { PropertyType, ReviewType } from "@/types";
import Popup from "@/components/shared/Popup";
import ReplyReview from "@/components/ReplyReview";
import { getPropertyReviewsApi } from "@/services/reviewApi";
import logger from "../../../../../logger.config.mjs";
import { getPropertyById } from "@/services/propertyApi";
import { ScreenName } from "@/components/shared/LabelCards";

const PropertyReviews = ({
  params
}: {
  params: Promise<{ id: string }> ;
}) => {

  const resolvedParams = use(params);
  const propertyId = resolvedParams.id;

  const [property, setProperty] = useState<PropertyType | null>(null);
  const [reviews, setReviews] = useState<ReviewType[]>([]);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [refreshReviews, setRefreshReviews] = useState<boolean>(false);
  const [isReplyPop, setIsReplyPop] = useState<boolean>(false);
  const [replyId, setReplyId] = useState<string>('');

  const showReply = (id:string)=>{
    setIsReplyPop(!isReplyPop)
    setReplyId(id)
  }

  useEffect(() => {
      if (!propertyId) return
      
      const fetchProperty = async () => {
        try {
          const data = await getPropertyById(propertyId);
          
          if (data) {
            setProperty(data);
            logger.info("fetched property: ", data);
  
          } else {
            logger.info("unable to fetch nearest properties ");
          }
  
        } catch (error:any){
          logger.info("error fetching nearest properties ");
        }
      };
  
      fetchProperty()
    }, [propertyId,]);

  // Fetch property reviews
  useEffect(() => {
    if (!propertyId) return
    setRefreshReviews(false);
    
    const fetchReview = async () => {
      try {
        const data = await getPropertyReviewsApi(propertyId, nextCursor);
        
        if (data && data.reviews && data.reviews.length>0) {
          setReviews(data.reviews);
          setNextCursor(data.nextCursor);
          logger.info("fetched reviews: ", data.reviews);
        } else {
          logger.info("unable to fetch property reviews ");
        }

      } catch (error:any){
        logger.info("error fetching property reviews ");
      }
    };

    fetchReview()
  }, [propertyId, refreshReviews]);

  return (
    <>
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header Section (Fixed) */}
      <ScreenName title="Property Reviews" />

      {/* Property Card (Fixed) */}
      <div className="flex justify-center px-4 py-4 border-b">
        {property && (
          <HorizontalCard
            id={property.id}
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
        )}
      </div>

      {/* Reviews (Scrollable Area) */}
      <div className="flex-1 overflow-hidden px-5 py-4">
        <h2 className="text-lg font-bold mb-3">Property Reviews</h2>

        <div className="h-full overflow-y-auto space-y-3 pb-24">
          {reviews && reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id}>
                <ReviewCard review={review} showReply={showReply} />
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No reviews yet.</p>
          )}
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
