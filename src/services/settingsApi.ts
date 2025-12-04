import axiosClient from "@/config/client";
import { UserSettingsType } from "@/types";
import logger from "../../logger.config.mjs"
import { toast } from "react-toastify";
import { handleApiError } from "@/utils/errorHandler"; 

export const addOrUpdateUserSettings = async (settings: Partial<UserSettingsType>, image?:File) => {
  const formData = new FormData();
  if (image) {
    formData.append("image", image);
  }
  for (const key in settings) {
    if (settings.hasOwnProperty(key) && settings[key as keyof UserSettingsType] !== undefined) {
      formData.append(key, String(settings[key as keyof UserSettingsType]));
    }
  }

  try {
    const res = await axiosClient.post(`/settings/add`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    if (res.status===200){
      toast.success(res.data.message || "Settings updated successfully");
      logger.info("User settings updated:", res.data);
      return res.data;
    }
    return null;
  } catch (error) {
    handleApiError(error, "Failed to update settings");
    return null;
  }
}

export const getUserSettings = async (): Promise<UserSettingsType | null> => {
  try {
    const res = await axiosClient.get(`/settings`);
    return res.data as UserSettingsType;
  } catch (error) {
    handleApiError(error, "Failed to load user settings");
    return null;
  }
}