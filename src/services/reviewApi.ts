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
      toast.success(res.data.message || "Review added successfully");
      logger.info("Review added:", res.data);
      return res.data;
    }

    return null;

  } catch (error) {
    handleApiError(error, "Failed to update settings");
    return null;
  }
}