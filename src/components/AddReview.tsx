'use client';

import React, { useContext, useState } from "react";
import { RatingScaleEnum } from "@/types";
import { TextareaInput } from "./shared/Input";
import { StarRatingSelector } from "./StarRatingSelector";
import { addReviewApi } from "@/services/reviewApi";
import { AppContext } from "@/context/AppContextProvider";
import Splash from "./shared/Splash";
import { toast } from "react-toastify";
import logger from "../../logger.config.mjs"
import Image from "next/image";

export function AddReview({
  propertyId, 
  setRefreshReviews,
  propOwner
} : {
  propertyId: string, 
  setRefreshReviews: React.Dispatch<React.SetStateAction<boolean>>,
  propOwner: string  
}) {
  const { authUser } = useContext(AppContext);

  const [rating, setRating] = useState<RatingScaleEnum>(RatingScaleEnum.HAPPY);
  const [comment, setComment] = useState<string>("");
  const [photo, setPhoto] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];

      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please select a PNG or JPG image.');
        // logger.error('Invalid file type selected', { type: file.type });

        return;
      }
  
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 5 MB.');
        logger.error('File too large', { size: file.size });
        return;
      }
  
      setPhoto(file);
      toast.success('Profile photo selected');
      logger.info('Profile photo selected', { name: file.name, size: file.size });
    } catch (err) {
      logger.error('Error handling photo upload', err);
      toast.error('Unable to upload photo.');
    }
  };

  const resetForm = () => {
    setRating(RatingScaleEnum.HAPPY);
    setComment("");
    setPhoto(undefined);
  }

  const handleSubmit = async () => {
    // Handle review submission logic here
    if (!authUser) {
      toast.error("You must be logged in to submit a review.");
      return;
    }

    if (propOwner === authUser._id) {
      toast.warn("You cannot rate your own property.");
      return;
    }

    setIsSubmitting(true);

    const newReview = await addReviewApi(propertyId, rating, comment, photo);
    // logger.info("Submitted review:", newReview);
    
    if (!newReview) {
      toast.error("Failed to submit review. Please try again.");
      setIsSubmitting(false);
      return
    }

    toast.success("Review submitted successfully!");
    resetForm();
    setIsSubmitting(false);
    setRefreshReviews(true);
  }

  if (!authUser) {
    return <Splash />;
  }

  return (
    <div className="mt-7">
      <div className="mb-5">
        <StarRatingSelector
          value={rating}
          onChange={(newRating) => setRating(newRating)}
        />
      </div>

      <div>
        <TextareaInput
          label="Review comment (optional)"
          id='comment'
          name="comment"
          value={comment}
          onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Enter comment here"
          className="w-full outline-none card-bg"
        />
      </div>

      {/* Photo Upload */}
      <div className="flex flex-col items-center my-6">
        <div className="relative w-full">
          <label
            htmlFor="photo-upload"
            className="block w-1/2 h-40 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 mx-auto bg-gray-100 "
          >  

            {!photo ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                <span className="text-4xl sm:text-5xl">+</span>
                <span className="text-[10px] sm:text-xs mt-1">Add review image</span>
              </div>
            ) : 
            <Image 
              src={ URL.createObjectURL(photo)}
              height={60}
              width={60}
              alt="profile"
              className="w-full h-full object-cover"
            /> }

            <input
              type="file"
              name="image"
              accept="image/png, image/jpeg, image/jpg"
              className="absolute top-0 left-0 w-1/2 h-full mx-auto opacity-0 cursor-pointer"
              onChange={handleUpload} 
            />

          </label>
        </div>
      </div>

      {/* Submit Buttons */}
      <button
        disabled={isSubmitting}
        onClick={handleSubmit}
        className={`px-4 py-2 rounded-md w-full text-white 
          ${isSubmitting ? "bg-gray-400" : "bg-green"}`} 
      >
        Submit Review
      </button>
    </div>
  );
  
}