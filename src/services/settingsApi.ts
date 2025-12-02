import axiosClient from "@/config/client";
import { UserSettingsType } from "@/types";
import logger from "../../logger.config.mjs"
import { toast } from "react-toastify";

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
  for (const [key, value] of formData) {
      logger.info(`${key}:`, value);
    }
  const res = await axiosClient.post(`/settings/add`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  toast.info(res.data.message);
  return res.data;
}