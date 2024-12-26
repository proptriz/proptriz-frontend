'use client';

import { useState } from "react";
import Counter from "@/components/Counter";
import ToggleButtons from "@/components/ToggleButtons";
import TagSelector from "@/components/TagSelector";

export default function AddListing() {
  const [sellPrice, setSellPrice] = useState("$ 180,000");
  const [rentPrice, setRentPrice] = useState("$ 315");
  const [rentType, setRentType] = useState("Monthly");
  const [bedroom, setBedroom] = useState(3);
  const [bathroom, setBathroom] = useState(2);
  const [balcony, setBalcony] = useState(2);
  const [totalRooms, setTotalRooms] = useState("< 4");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);

  const facilities = [
    "Parking Lot",
    "Pet Allowed",
    "Garden",
    "Gym",
    "Park",
    "Home theatre",
    "Kid’s Friendly",
  ];

  const handleToggleFacility = (facility: string) => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        <span className="text-green-600">Almost finish</span>, complete the
        listing
      </h1>

      {/* Sell Price */}
      <div className="my-4">
        <label className="block text-gray-700 mb-2">Sell Price</label>
        <input
          type="text"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        />
      </div>

      {/* Rent Price */}
      <div className="my-4">
        <label className="block text-gray-700 mb-2">Rent Price</label>
        <input
          type="text"
          value={rentPrice}
          onChange={(e) => setRentPrice(e.target.value)}
          className="w-full border rounded-md px-4 py-2"
        />
        <ToggleButtons
          options={["Monthly", "Yearly"]}
          selected={rentType}
          onChange={setRentType}
        />
      </div>

      {/* Property Features */}
      <h2 className="text-lg font-semibold mb-2">Property Features</h2>
      <Counter
        label="Bedroom"
        value={bedroom}
        onIncrement={() => setBedroom(bedroom + 1)}
        onDecrement={() => setBedroom(Math.max(0, bedroom - 1))}
      />
      <Counter
        label="Bathroom"
        value={bathroom}
        onIncrement={() => setBathroom(bathroom + 1)}
        onDecrement={() => setBathroom(Math.max(0, bathroom - 1))}
      />
      <Counter
        label="Balcony"
        value={balcony}
        onIncrement={() => setBalcony(balcony + 1)}
        onDecrement={() => setBalcony(Math.max(0, balcony - 1))}
      />

      {/* Total Rooms */}
      <h2 className="text-lg font-semibold mb-2">Total Rooms</h2>
      <ToggleButtons
        options={["< 4", "4", "6"]}
        selected={totalRooms}
        onChange={setTotalRooms}
      />

      {/* Facilities */}
      <h2 className="text-lg font-semibold mb-2">Environment / Facilities</h2>
      <TagSelector
        tags={facilities}
        selectedTags={selectedFacilities}
        onToggle={handleToggleFacility}
      />

      {/* Finish Button */}
      <button className="w-full bg-green-500 text-white py-2 rounded-md mt-6">
        Finish
      </button>
    </div>
  );
}
