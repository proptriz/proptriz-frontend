'use client';

import { BackButton } from "@/components/shared/buttons";
import Link from "next/link";
import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

export default function AddPropertyPhotosPage() {
  const [photos, setPhotos] = useState<File[]>([]);
  const maxPhotos = 5;

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const uploadedFiles = Array.from(event.target.files);
    const validFiles = uploadedFiles.filter(
      (file) =>
        file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // Max size 5MB
    );

    if (photos.length + validFiles.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    setPhotos((prevPhotos) => [...prevPhotos, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  return (
    <div className="p-6 pb-16 min-h-screen">
      {/* Back button */}
      <header className="flex w-full mb-16">
        <BackButton />
        <h1 className="text-center w-full">Add Property</h1>
      </header>

      <h2 className="text-3xl mb-7">
        Add property <span className="font-semibold">photos</span> to your listing
      </h2>

      {/* Photo Upload Section */}
      <div className="mb-6">
        <label
          htmlFor="photo-upload"
          className="block w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500"
        >
          {photos.length < maxPhotos ? (
            <span className="text-gray-500">Click to upload photos (Max {maxPhotos})</span>
          ) : (
            <span className="text-gray-500">Maximum {maxPhotos} photos reached</span>
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

      {/* Uploaded Photos Grid */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {photos.map((photo, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(photo)}
              alt={`Photo ${index + 1}`}
              className="w-full h-32 object-cover rounded-lg"
            />
            <button
              className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
              onClick={() => removePhoto(index)}
            >
              <IoClose size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Navigation Buttons */}
      <div className="w-full mx-auto">
        <div className="flex mt-16 gap-5 bottom-3">
          <button className="px-2 py-2 bg-white rounded-full flex items-center shadow-md">
            <FaArrowLeft className="text-xl" />
          </button>
          <Link href={photos.length > 0 ? "/property/add/details" : "#"} className="flex-grow">
            <button
              className={`px-4 py-2 text-white rounded-md w-full ${
                photos.length > 0 ? "bg-green" : "bg-gray-300 cursor-not-allowed"
              }`}
              disabled={photos.length === 0}
            >
              Next
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
