"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  deletePropertyImage,
  updatePropertyImage,
} from "@/services/propertyApi";
import logger from "../../logger.config.mjs";
import { useLanguage } from "@/i18n/LanguageContext";

const MAX_IMAGES = 5;

type ImageSlot = {
  url: string | null;
  preview: string | null;
  isUploading: boolean;
  failed: boolean;
};

export default function ImageManager({
  propertyId,
  images,
}: {
  propertyId: string;
  images: string[];
}) {
  const { t } = useLanguage();

  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array.from({ length: MAX_IMAGES }).map((_, i) => ({
      url: images[i] ?? null,
      preview: null,
      isUploading: false,
      failed: false,
    }))
  );

  const updateSlot = (index: number, updates: Partial<ImageSlot>) => {
    setImageSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...updates } : slot))
    );
  };

  const removeImage = async (index: number) => {
    const slot = imageSlots[index];
    if (!slot.url) return;

    const res = await deletePropertyImage(propertyId, slot.url);

    if (!res.success) {
      toast.error(t("img_remove_failed"));
      return;
    }

    updateSlot(index, { url: null });
    toast.success(t("img_removed"));
  };

  const handleUpload = async (file: File, index: number) => {
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    updateSlot(index, {
      preview: previewURL,
      isUploading: true,
      failed: false,
    });

    try {
      const isReplacing = !!imageSlots[index].url;

      const res = await updatePropertyImage(
        propertyId,
        file,
        isReplacing ? index.toString() : undefined
      );

      if (!res.success) throw new Error("Upload failed");

      updateSlot(index, {
        url: res.image,
        preview: null,
        isUploading: false,
        failed: false,
      });

      toast.success(t("img_upload_success"));
    } catch (err) {
      logger.error("Upload error:", err);

      updateSlot(index, {
        preview: null,
        isUploading: false,
        failed: true,
      });

      toast.error(t("img_upload_failed"));
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">{t("img_upload_title")}</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {imageSlots.map((slot, index) => (
          <div
            key={index}
            className="
              relative aspect-square w-full rounded-xl overflow-hidden
              bg-gray-100 border border-gray-300
              flex items-center justify-center
              cursor-pointer transition-all
              hover:shadow-md hover:border-blue-500
            "
          >
            {slot.url ? (
              <img src={slot.url} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                <span className="text-4xl sm:text-5xl">+</span>
                <span className="text-[10px] sm:text-xs mt-1">{t("img_add_photo")}</span>
              </div>
            )}

            {slot.preview && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <img
                  src={slot.preview}
                  className="w-full h-full object-cover opacity-50"
                  alt="preview"
                />
                {slot.isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center animate-spin">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full" />
                  </div>
                )}
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, index);
              }}
            />

            {slot.url && !slot.isUploading && (
              <button
                onClick={() => removeImage(index)}
                className="
                  absolute top-1 right-1
                  bg-red-600 text-white text-xs
                  rounded-full p-1 shadow-md hover:bg-red-700
                "
              >
                &times;
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}