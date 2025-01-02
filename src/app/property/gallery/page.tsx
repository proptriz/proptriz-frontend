'use client';

import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaStar } from "react-icons/fa";

const GalleryPage = () => {
  // Sample data
  const images = [
    { id: 1, src: "/home/building1.png" },
    { id: 2, src: "/home/building2.png" },
    { id: 3, src: "/home/building3.png" },
    { id: 4, src: "/home/building4.png" },
  ];

  const [currentImage, setCurrentImage] = useState(0);

  const handleNext = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="flex flex-col items-center bg-gray-100 h-screen p-4">
      {/* Main Image */}
      <div className="relative w-full h-2/3 rounded-lg overflow-hidden shadow-lg">
        <img
          src={images[currentImage].src}
          alt={`Gallery Image ${currentImage + 1}`}
          className="w-full h-full object-cover"
        />
        {/* Navigation Arrows */}
        <button
          onClick={handlePrev}
          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
        >
          <FaChevronLeft />
        </button>
        <button
          onClick={handleNext}
          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg"
        >
          <FaChevronRight />
        </button>
      </div>

      {/* Thumbnail Carousel */}
      <div className="flex space-x-3 mt-4 overflow-x-auto">
        {images.map((img, index) => (
          <img
            key={img.id}
            src={img.src}
            alt={`Thumbnail ${index + 1}`}
            onClick={() => setCurrentImage(index)}
            className={`w-16 h-16 rounded-lg object-cover cursor-pointer ${
              currentImage === index ? "ring-2 ring-blue-500" : ""
            }`}
          />
        ))}
      </div>

      {/* Reviewer Info */}
      <div className="flex items-center mt-6 space-x-4">
        <img
          src="/avatar.png"
          alt="Reviewer Avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold">Samuel Ella</h3>
          <div className="flex text-yellow-500">
            {[...Array(4)].map((_, i) => (
              <FaStar key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryPage;
