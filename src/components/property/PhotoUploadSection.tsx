"use client";
import React from "react";
import { IoClose } from "react-icons/io5";
import ToggleCollapse from "@/components/shared/ToggleCollapse";

interface PhotoUploadSectionProps {
  photos: File[];
  maxPhotos: number;
  handlePhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removePhoto: (index: number) => void;
}

const PhotoUploadSection: React.FC<PhotoUploadSectionProps> = ({
  photos,
  maxPhotos,
  handlePhotoUpload,
  removePhoto,
}) => {
  return (
    <ToggleCollapse header="Upload Photos" open={false}>
      <h3 className="mt-10 font-semibold mb-2">Listing photos</h3>
      <div className="mb-6">
        <label
          htmlFor="photo-upload"
          className="block w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500"
        >
          {photos.length < maxPhotos ? (
            <span className="text-gray-500 text-xs">
              Click to upload photos (Max {maxPhotos})
            </span>
          ) : (
            <span className="text-red-500 text-xs">
              Maximum {maxPhotos} photos reached
            </span>
          )}
        </label>
        <input
          type="file"
          id="photo-upload"
          accept="image/jpeg, image/png"
          multiple
          className="hidden"
          onChange={handlePhotoUpload}
          disabled={photos.length >= maxPhotos}
        />
      </div>

      {/* Uploaded Photos */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(photo)}
              alt={`Photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              onClick={() => removePhoto(index)}
            >
              <IoClose size={16} />
            </button>
          </div>
        ))}
      </div>
    </ToggleCollapse>
  );
};

export default PhotoUploadSection;
