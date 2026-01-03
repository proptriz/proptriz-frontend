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
    <ToggleCollapse header="Upload photo" open={true}>
      <div className="mb-6">
        <label
          htmlFor="photo-upload"
          className="block w-1/2 h-40 border-2 border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500 mx-auto bg-gray-100 "
        >
          {photos.length < maxPhotos ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 pointer-events-none">
                <span className="text-4xl sm:text-5xl">+</span>
                <span className="text-[10px] sm:text-xs mt-1">Add property image (max {maxPhotos})</span>
              </div>
            
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
