"use client";

import React, { useState, useEffect, useRef } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(startIndex);
  const [isLoading, setIsLoading] = useState(true);

  // Touch swipe tracking
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const SWIPE_THRESHOLD_X = 50; // swipe left/right
  const SWIPE_THRESHOLD_Y = 80; // swipe down close

  const handlePrev = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setIsLoading(true);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Reset index when reopened
  useEffect(() => {
    if (show) {
      setCurrentIndex(startIndex);
      setIsLoading(true);
    }
  }, [show, startIndex]);

  // Disable background scrolling when modal is open
  useEffect(() => {
    if (!show) return;

    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = "hidden";
    document.body.style.touchAction = "none";

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, [show]);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);

  // Touch handlers (Swipe left/right + swipe down close)
  const handleTouchStart = (e: React.TouchEvent) => {
    touchEndX.current = null;
    touchEndY.current = null;

    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchStartY.current === null ||
      touchEndX.current === null ||
      touchEndY.current === null
    )
      return;

    const deltaX = touchStartX.current - touchEndX.current;
    const deltaY = touchEndY.current - touchStartY.current;

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Swipe down to close (vertical dominates)
    if (absY > absX && deltaY > SWIPE_THRESHOLD_Y) {
      onClose();
      return;
    }

    // Swipe left/right to navigate (horizontal dominates)
    if (absX > absY && absX > SWIPE_THRESHOLD_X) {
      if (deltaX > 0) handleNext(); // swipe left -> next
      else handlePrev(); // swipe right -> prev
    }
  };

  if (!show || images.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      {/* Overlay that blocks clicks behind */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close Button (easy click target) */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 z-[10002] text-white bg-black/50 hover:bg-black/70 rounded-full p-3 active:scale-95 transition"
        aria-label="Close gallery"
        style={{
          // helps on iPhone notch area
          paddingTop: "max(12px, env(safe-area-inset-top))",
        }}
      >
        <IoClose className="text-3xl" />
      </button>

      {/* Viewer Container */}
      <div
        className="relative z-[10001] w-full max-w-5xl h-[92vh] px-3 md:px-8 flex items-center justify-center select-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Prev Button (always visible) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className="absolute left-3 md:left-6 z-[10003] text-white text-4xl bg-black/40 hover:bg-black/60 p-3 rounded-full active:scale-95 transition"
          aria-label="Previous image"
        >
          &#8249;
        </button>

        {/* Image Wrapper */}
        <div className="relative w-full h-full flex items-center justify-center">
          {/* Loading Indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center z-[10002]">
              <div className="h-12 w-12 rounded-full border-4 border-white/30 border-t-white animate-spin" />
            </div>
          )}

          <Image
            src={images[currentIndex]}
            alt={`Property image ${currentIndex + 1}`}
            fill
            className="object-contain rounded-xl"
            sizes="100vw"
            priority
            onLoadingComplete={() => setIsLoading(false)}
          />
        </div>

        {/* Next Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className="absolute right-3 md:right-6 z-[10003] text-white text-4xl bg-black/40 hover:bg-black/60 p-3 rounded-full active:scale-95 transition"
          aria-label="Next image"
        >
          &#8250;
        </button>
      </div>

      {/* Dots */}
      <div className="fixed bottom-6 z-[10002] flex space-x-2">
        {images.map((_, index) => (
          <span
            key={index}
            className={`h-2 w-2 rounded-full transition ${
              index === currentIndex ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default GalleryModal;