'use client';

import React, { use, useEffect, useState } from "react";
import { ReviewCard } from "@/components/shared/Cards";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { PropertyType, ReviewType } from "@/types";
import Popup from "@/components/shared/Popup";
import ReplyReview from "@/components/ReplyReview";
import { getPropertyReviewsApi } from "@/services/reviewApi";
import logger from "../../../../../logger.config.mjs";
import { getPropertyById } from "@/services/propertyApi";
import { ScreenName } from "@/components/shared/LabelCards";
import { styles } from "@/constant";
import Link from "next/link";
import { AddReview } from "@/components/AddReview";
import { OutlineButton } from "@/components/shared/buttons";
import { set } from "zod/v4";

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
  const [replyReview, setReplyReview] = useState<ReviewType | null>(null);
  const [reviewPopup, setReviewPopup] = useState(false);

  const showReply = (review: ReviewType)=>{
    setIsReplyPop(!isReplyPop)
    setReplyReview(review)
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
      <Link href={`/property/details/${propertyId}`}>
        <div className="flex justify-center px-4 mb-2 border-b">
          {property && (
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
          )}
        </div>
      </Link>

      {/* Reviews (Scrollable Area) */}
      <div className="flex-1 overflow-hidden px-5">
        <div className="flex justify-between items-center px-4">
          <h2 className={styles.H2}>Reviews</h2>
          
          <button 
            className={`text-white text-sm bg-primary z-10 pointer-events-auto p-2 shadow-lg hover:shadow-xl transition-shadow duration-300 outline-none ring-2 ring-offset-2 ring-secondary focus:text-secondary rounded-md`}
            onClick={()=>setReviewPopup(!reviewPopup)}
          > 
            Add review
          </button>
        </div>

        <div className="h-full overflow-y-auto space-y-5 pb-24">
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
    {replyReview && <Popup
      header="Reply Review"
      toggle={isReplyPop}
      setToggle={setIsReplyPop}
      useMask={true}
      hideReset={true}
    >
      <ReplyReview review={replyReview} />
    </Popup>}

    {property && <Popup header="Add review to property" toggle={reviewPopup} setToggle={setReviewPopup} useMask={true} hideReset >
      <AddReview propertyId={propertyId} setRefreshReviews={setRefreshReviews} propOwner={property?.user.user_id} />
    </Popup>}
  </>

  );
};

export default PropertyReviews;
