import axiosClient from "@/config/client";
import { RatingScaleEnum } from "@/types";
import { toast } from "react-toastify";
import logger from "../../logger.config.mjs";
import { handleApiError } from "@/utils/errorHandler";

export const addReviewApi = async (
  property_id:string,
  ratings: RatingScaleEnum, 
  comment: string, 
  image?:File
) => {
  const formData = new FormData();

  if (image) {
    formData.append("image", image);
  }

  formData.append("property_id", property_id)
  formData.append("rating", String(ratings));
  formData.append("comment", comment);

  try {
    const res = await axiosClient.post(`/property-review/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (res.status===200){
      // logger.info("Review added:", res.data);
      return res.data;
    }

    return null;

  } catch (error) {
    handleApiError(error, "Failed to update settings");
    return null;
  }
}

export const getPropertyReviewsApi = async (propertyId: string, cursor?: string) => {
  try {
    const query = new URLSearchParams({
      property_id: propertyId,
      cursor: cursor || ""
    });
    
    const res = await axiosClient.get(`/property-review/property?${query.toString()}`);

    if (res.status !== 200) {
      return [];
    }

    // logger.info("property reviews: ", res.data);
    return res.data;

  } catch (error){
    handleApiError(error, "Failed to get property reviews")
    return null
  }
}

export const addReplyReviewApi = async (
  review_id:string, 
  comment: string, 
) => {
  logger.info("Adding reply to review:", review_id, comment);
  const formData = new FormData();

  formData.append("review_id", review_id);
  formData.append("comment", comment);

  try {
    const res = await axiosClient.post(`/property-review/reply/add`, {review_id, comment});

    if (res.status===200){
      logger.info("Reply added:", res.data);
      return res.data;
    }

    return null;

  } catch (error) {
    handleApiError(error, "Failed to update settings");
    return null;
  }
}

export const getPropertyReviewReplyApi = async (reviewId: string, cursor?: string) => {
  try {
    const query = new URLSearchParams({
      review_id: reviewId,
      cursor: cursor || ""
    });

    const res = await axiosClient.get(`/property-review/reply?${query.toString()}`);

    if (res.status !== 200) {
      return [];
    }

    logger.info("property review replies: ", res.data);

    return res.data;
  } catch (error){
    handleApiError(error, "Failed to get property review replies")
    return null
  }
}

export const getPropertyUserReviewApi = async (sentCursor?: string, receivedCursor?: string) => {
  try {
    const query = new URLSearchParams({
      sent_cursor: sentCursor || "",
      received_cursor: receivedCursor || ""
    });

    const res = await axiosClient.get(`/property-review/user/review?${query.toString()}`);

    if (res.status !== 200) {
      return [];
    }

    logger.info("user reviews data: ", res.data);

    return res.data;
  } catch (error){
    handleApiError(error, "Failed to get property review replies")
    return null
  }
}