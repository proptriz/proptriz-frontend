'use client';

import React, { useState } from "react";

const EditProperty = () => {
  const [listingType, setListingType] = useState("Rent");
  const [propertyCategory, setPropertyCategory] = useState("House");
  const [sellPrice, setSellPrice] = useState(150000);
  const [rentPrice, setRentPrice] = useState(320);
  const [rentDuration, setRentDuration] = useState("Monthly");
  const [bedrooms, setBedrooms] = useState(2);
  const [balconies, setBalconies] = useState(1);
  const [totalRooms, setTotalRooms] = useState("<4");
  const [facilities, setFacilities] = useState([
    "Parking Lot",
    "Pet Allowed",
  ]);

  const toggleFacility = (facility: string) => {
    setFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  const updateProperty = () => {
    // Handle property update logic here
    console.log({
      listingType,
      propertyCategory,
      sellPrice,
      rentPrice,
      rentDuration,
      bedrooms,
      balconies,
      totalRooms,
      facilities,
    });
  };

  return (
    <div className="p-6">
      <header className="mb-4 flex items-center justify-between">
        <button className="text-blue-500 text-lg">←</button>
        <h1 className="text-lg font-bold">Edit Listing</h1>
      </header>

      {/* Property Info */}
      <div className="bg-white shadow-md p-4 rounded-lg">
        <div className="flex items-center mb-4">
          <img
            src="/house-thumbnail.jpg" // Replace with actual property image
            alt="Property"
            className="w-20 h-20 rounded-md object-cover mr-4"
          />
          <div>
            <h2 className="text-lg font-bold">Schoolview House</h2>
            <p className="text-sm text-gray-500">Semarang, Indonesia</p>
          </div>
        </div>

        {/* Listing Title */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Listing Title</label>
          <input
            type="text"
            placeholder="Schoolview House"
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        {/* Listing Type */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Listing Type</label>
          <div className="flex gap-4">
            {["Rent", "Sell"].map((type) => (
              <button
                key={type}
                className={`px-4 py-2 rounded-md ${
                  listingType === type ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
                onClick={() => setListingType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Property Category */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Property Category
          </label>
          <div className="flex gap-2">
            {["House", "Apartment", "Hotel", "Villa", "Cottage"].map(
              (category) => (
                <button
                  key={category}
                  className={`px-4 py-2 rounded-md ${
                    propertyCategory === category
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                  onClick={() => setPropertyCategory(category)}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </div>

        {/* Location */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Location</label>
          <input
            type="text"
            placeholder="Jl. Gerungsari, Bulusan..."
            className="w-full border rounded-md px-4 py-2"
          />
        </div>

        {/* Listing Photos */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Listing Photos
          </label>
          <div className="flex gap-2">
            {/* Mockup photos */}
            <div className="relative">
              <img
                src="/house-photo-1.jpg"
                alt="Photo 1"
                className="w-20 h-20 object-cover rounded-md"
              />
              <button className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                ✖
              </button>
            </div>
            <button className="w-20 h-20 bg-gray-200 rounded-md flex items-center justify-center">
              +
            </button>
          </div>
        </div>

        {/* Pricing */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Sell Price</label>
          <div className="flex items-center">
            <input
              type="number"
              value={sellPrice}
              onChange={(e) => setSellPrice(Number(e.target.value))}
              className="w-full border rounded-md px-4 py-2 mr-2"
            />
            <span className="text-gray-500">$</span>
          </div>
        </div>

        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Rent Price</label>
          <div className="flex items-center mb-2">
            <input
              type="number"
              value={rentPrice}
              onChange={(e) => setRentPrice(Number(e.target.value))}
              className="w-full border rounded-md px-4 py-2 mr-2"
            />
            <span className="text-gray-500">$</span>
          </div>
          <div className="flex gap-4">
            {["Monthly", "Yearly"].map((duration) => (
              <button
                key={duration}
                className={`px-4 py-2 rounded-md ${
                  rentDuration === duration
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => setRentDuration(duration)}
              >
                {duration}
              </button>
            ))}
          </div>
        </div>

        {/* Property Features */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">Property Features</label>
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <label className="text-sm font-medium mr-2">Bedroom</label>
              <button
                className="bg-gray-200 px-2"
                onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}
              >
                -
              </button>
              <span className="mx-2">{bedrooms}</span>
              <button
                className="bg-gray-200 px-2"
                onClick={() => setBedrooms(bedrooms + 1)}
              >
                +
              </button>
            </div>
            <div className="flex items-center">
              <label className="text-sm font-medium mr-2">Balcony</label>
              <button
                className="bg-gray-200 px-2"
                onClick={() => setBalconies(Math.max(0, balconies - 1))}
              >
                -
              </button>
              <span className="mx-2">{balconies}</span>
              <button
                className="bg-gray-200 px-2"
                onClick={() => setBalconies(balconies + 1)}
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Facilities */}
        <div className="mb-4">
          <label className="text-sm font-medium block mb-2">
            Environment / Facilities
          </label>
          <div className="flex gap-2 flex-wrap">
            {[
              "Parking Lot",
              "Pet Allowed",
              "Garden",
              "Gym",
              "Park",
              "Home Theatre",
              "Kid's Friendly",
            ].map((facility) => (
              <button
                key={facility}
                className={`px-4 py-2 rounded-md ${
                  facilities.includes(facility)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200"
                }`}
                onClick={() => toggleFacility(facility)}
              >
                {facility}
              </button>
            ))}
          </div>
        </div>

        {/* Update Button */}
        <button
          className="w-full bg-green-500 text-white rounded-md py-3 font-bold"
          onClick={updateProperty}
        >
          Update
        </button>
      </div>
    </div>
  );
};

export default EditProperty;
