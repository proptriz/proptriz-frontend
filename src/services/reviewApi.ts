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
    const query = {
      property_id: propertyId,
      cursor: cursor || ""
    }
    const res = await axiosClient.get(`/property-review/property?${query}`);

    if (res.status !== 200) {
      return [];
    }

    logger.info("property reviews: ", res.data);
    return res.data;

  } catch (error){
    handleApiError(error, "Failed to get property reviews")
    return null
  }
}