"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import {
  deletePropertyImage,
  updatePropertyImage,
} from "@/services/propertyApi";
import logger from "../../logger.config.mjs";

const MAX_IMAGES = 5;

// -----------------------------
// Correct TypeScript Model
// -----------------------------
type ImageSlot = {
  url: string | null;        // stored image URL
  preview: string | null;    // local preview while uploading
  isUploading: boolean;      // spinner overlay
  failed: boolean;           // upload error state
};

export default function ImageManager({
  propertyId,
  images,
}: {
  propertyId: string;
  images: string[];
}) {
  // -------------------------------------------
  // Initialize slots (always 5)
  // -------------------------------------------
  const [imageSlots, setImageSlots] = useState<ImageSlot[]>(
    Array.from({ length: MAX_IMAGES }).map((_, i) => ({
      url: images[i] ?? null,
      preview: null,
      isUploading: false,
      failed: false,
    }))
  );

  // -------------------------------------------
  // Helper to update a specific slot cleanly
  // -------------------------------------------
  const updateSlot = (index: number, updates: Partial<ImageSlot>) => {
    setImageSlots((prev) =>
      prev.map((slot, i) => (i === index ? { ...slot, ...updates } : slot))
    );
  };

  // -------------------------------------------
  // REMOVE Existing Image
  // -------------------------------------------
  const removeImage = async (index: number) => {
    const slot = imageSlots[index];
    if (!slot.url) return;

    const res = await deletePropertyImage(propertyId, slot.url);

    if (!res.success) {
      toast.error("Failed to remove image");
      return;
    }

    updateSlot(index, { url: null });
    toast.success("Image removed");
  };

  // -------------------------------------------
  // UPLOAD / REPLACE image with preview overlay
  // -------------------------------------------
  const handleUpload = async (file: File, index: number) => {
    if (!file) return;

    const previewURL = URL.createObjectURL(file);

    // Step 1: show masked preview + spinner
    updateSlot(index, {
      preview: previewURL,
      isUploading: true,
      failed: false,
    });

    try {
      // Determine if replacing or adding new
      const isReplacing = !!imageSlots[index].url;

      // Only send index if replacing
      const res = await updatePropertyImage(
        propertyId,
        file,
        isReplacing ? index.toString() : undefined
      );

      if (!res.success) throw new Error("Upload failed");

      // Step 2: apply final image + remove preview
      updateSlot(index, {
        url: res.image,
        preview: null,
        isUploading: false,
        failed: false,
      });

      toast.success("Image uploaded successfully");
    } catch (err) {
      logger.error("Upload error:", err);

      // Step 3: revert preview and keep original URL
      updateSlot(index, {
        preview: null,
        isUploading: false,
        failed: true,
      });

      toast.error("Failed to upload image");
    }
  };


  // -------------------------------------------
  // UI Rendering
  // -------------------------------------------
  return (
    <div className="space-y-4">
      <h3 className="font-semibold">Property Images</h3>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {imageSlots.map((slot, index) => (
          <div
            key={index}
            className="
              relative 
              aspect-square 
              w-full 
              rounded-xl 
              overflow-hidden 
              bg-gray-100 
              border border-gray-300 
              flex items-center justify-center 
              cursor-pointer 
              transition-all 
              hover:shadow-md 
              hover:border-blue-500
            "
          >
            {/* Base Image OR empty slot */}
            {slot.url ? (
              <img
                src={slot.url}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                <span className="text-4xl sm:text-5xl">+</span>
                <span className="text-[10px] sm:text-xs mt-1">Add Photo</span>
              </div>
            )}

            {/* PREVIEW overlay (during upload) */}
            {slot.preview && (
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <img
                  src={slot.preview}
                  className="w-full h-full object-cover opacity-50"
                  alt="preview"
                />

                {slot.isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center animate-spin">
                    <div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full"></div>
                  </div>
                )}
              </div>
            )}

            {/* Invisible File Input (click/tap to upload) */}
            <input
              type="file"
              accept="image/*"
              className="absolute inset-0 opacity-0 cursor-pointer"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleUpload(file, index);
              }}
            />

            {/* DELETE Button */}
            {slot.url && !slot.isUploading && (
              <button
                onClick={() => removeImage(index)}
                className="
                  absolute top-1 right-1 
                  bg-red-600 
                  text-white 
                  text-xs 
                  rounded-full 
                  p-1 
                  shadow-md
                  hover:bg-red-700
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
