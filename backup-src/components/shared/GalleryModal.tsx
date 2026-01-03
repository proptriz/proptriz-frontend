"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { IoClose } from "react-icons/io5";

interface GalleryModalProps {
  images: string[];
  show: boolean;
  startIndex?: number;
  onClose: () => void;
}

const GalleryModal: React.FC<GalleryModalProps> = ({
  images = [],
  show,
  startIndex = 0,
  onClose,
}) => {
  // Hooks are declared first — always
  const [currentIndex, setCurrentIndex] = useState(startIndex);

  // Reset index when reopened
  useEffect(() => {
    if (show) setCurrentIndex(startIndex);
  }, [show, startIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Keyboard navigation
  useEffect(() => {
    if (!show) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [show, onClose]);

  // ✅ Render after all hooks
  if (!show || images.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 text-white text-3xl p-2 hover:text-gray-300"
      >
        <IoClose />
      </button>

      {/* Image Viewer */}
      <div className="relative w-full max-w-5xl h-[90vh] flex items-center justify-center">
        <button
          onClick={handlePrev}
          className="absolute left-5 text-white text-4xl bg-black bg-opacity-40 hover:bg-opacity-60 p-2 rounded-full"
        >
          &#8249;
        </button>

        <Image
          src={images[currentIndex]}
          alt={`Property image ${currentIndex + 1}`}
          fill
          className="object-contain rounded-lg transition-all duration-300"
          sizes="100vw"
          priority
        />

        <button
          onClick={handleNext}
          className="absolute right-5 text-white text-4xl bg-black bg-opacity-40 hover:bg-opacity-60 p-2 rounded-full"
        >
          &#8250;
        </button>
      </div>

      {/* Dots */}
      <div className="absolute bottom-8 flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryModal;
