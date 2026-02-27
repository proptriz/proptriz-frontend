'use client';

import React, { useContext, useState } from "react";
import { RatingScaleEnum } from "@/types";
import { TextareaInput } from "./shared/Input";
import { StarRatingSelector } from "./StarRatingSelector";
import { addReviewApi } from "@/services/reviewApi";
import { AppContext } from "@/context/AppContextProvider";
import Splash from "./shared/Splash";
import { toast } from "react-toastify";
import logger from "../../logger.config.mjs";
import Image from "next/image";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

export function AddReview({
  propertyId,
  setRefreshReviews,
  propOwner,
}: {
  propertyId: string;
  setRefreshReviews: React.Dispatch<React.SetStateAction<boolean>>;
  propOwner: string;
}) {
  const { authUser } = useContext(AppContext);

  const [rating, setRating]           = useState<RatingScaleEnum>(RatingScaleEnum.HAPPY);
  const [comment, setComment]         = useState("");
  const [photo, setPhoto]             = useState<File | undefined>();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/png", "image/jpeg", "image/jpg"].includes(file.type)) {
      toast.error("Invalid file type. Please select a PNG or JPG image.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File is too large. Maximum size is 2 MB.");
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
    toast.success("Photo added to review.");
  };

  const removePhoto = () => {
    setPhoto(undefined);
    setPhotoPreview(null);
  };

  const resetForm = () => {
    setRating(RatingScaleEnum.HAPPY);
    setComment("");
    setPhoto(undefined);
    setPhotoPreview(null);
  };

  const handleSubmit = async () => {
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

    if (!newReview) {
      toast.error("Failed to submit review. Please try again.");
      setIsSubmitting(false);
      return;
    }

    toast.success("Review submitted successfully!");
    resetForm();
    setIsSubmitting(false);
    setRefreshReviews(true);
  };

  if (!authUser) return <Splash />;

  return (
    <div className="flex flex-col gap-5 px-1 pb-4">

      {/* ── Star rating ──────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl p-4"
        style={{ background: "#f5f7f9", border: "1px solid #e5e7eb" }}
      >
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5 mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#f0a500] inline-block" />
          Your Rating
        </p>
        <StarRatingSelector
          value={rating}
          onChange={(newRating) => setRating(newRating)}
        />
      </div>

      {/* ── Comment ──────────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
          Comment <span className="normal-case font-normal text-[#9ca3af]">(optional)</span>
        </p>
        <TextareaInput
          label=""
          id="comment"
          name="comment"
          value={comment}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
          placeholder="Share your experience with this property…"
          className="w-full outline-none"
        />
      </div>

      {/* ── Photo upload ─────────────────────────────────────────────────── */}
      <div>
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5 mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
          Photo <span className="normal-case font-normal text-[#9ca3af]">(optional)</span>
        </p>

        {photoPreview ? (
          /* Preview with remove button */
          <div className="relative w-28 h-28">
            <Image
              src={photoPreview}
              fill
              sizes="112px"
              alt="Review photo"
              className="rounded-2xl object-cover"
              style={{ border: "1.5px solid #e5e7eb" }}
            />
            <button
              type="button"
              onClick={removePhoto}
              className="absolute -top-2 -right-2 w-6 h-6 rounded-full
                         flex items-center justify-center text-white text-[11px]
                         font-bold shadow-md"
              style={{ background: "#ef4444" }}
            >
              ✕
            </button>
          </div>
        ) : (
          /* Upload slot */
          <label
            className="flex flex-col items-center justify-center w-28 h-28
                       rounded-2xl cursor-pointer transition-all duration-200"
            style={{
              border: "2px dashed #d1d5db",
              background: "#f9fafb",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLLabelElement).style.borderColor = "#1e5f74";
              (e.currentTarget as HTMLLabelElement).style.background  = "#e0f0f5";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLLabelElement).style.borderColor = "#d1d5db";
              (e.currentTarget as HTMLLabelElement).style.background  = "#f9fafb";
            }}
          >
            <span className="text-3xl leading-none" style={{ color: "#9ca3af" }}>📷</span>
            <span className="text-[10px] mt-1.5 font-medium" style={{ color: "#9ca3af" }}>
              Add photo
            </span>
            <input
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/jpg"
              className="sr-only"
              onChange={handleUpload}
            />
          </label>
        )}
      </div>

      {/* ── Submit ───────────────────────────────────────────────────────── */}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleSubmit}
        className="w-full py-4 rounded-2xl text-white text-[15px] font-bold
                   flex items-center justify-center gap-2
                   transition-all duration-200 active:scale-[0.98]
                   disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: "linear-gradient(135deg,#143d4d,#1e5f74)",
          boxShadow: "0 4px 18px rgba(30,95,116,0.35)",
          fontFamily: "'Raleway', sans-serif",
        }}
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Submitting…
          </>
        ) : (
          "✓ Submit Review"
        )}
      </button>
    </div>
  );
}