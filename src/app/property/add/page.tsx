'use client';

import { BackButton } from "@/components/shared/buttons";
import { SelectButton } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaNairaSign } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";

export default function AddPropertyPage() {
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(180000);
  const [rentType, setRentType] = useState<string>("Monthly");
  const [listedFor, setListedFor] = useState<string>("");
  const [category, setCategory] = useState<string>("");

  const categories = [
    { title: "House", value: "house" },
    { title: "Land", value: "land" },
    { title: "Shop", value: "shop" },
    { title: "Office", value: "office" },
    { title: "Hotel", value: "hotel" },
  ];

  const listingTypes = [
    { title: "Sell", value: "sell" },
    { title: "Rent", value: "rent" },
  ];

  useEffect(() => {
    console.log("Selected value:", listedFor);
    console.log("Selected value:", category);
  }, [listedFor, category]);

  return (
    <div className="p-6 pb-16 min-h-screen">
      {/* Back button */}
      <header className="flex w-full mb-16">
        <BackButton />
        <h1 className="text-center w-full">Add Property</h1>
      </header>

      <h2 className="text-3xl mb-7">
        Hi User, Fill Details of your <span className="font-semibold">property</span>
      </h2>
      <div>
        {/* Property Title */}
        <div className="flex card-bg p-3 rounded-full shadow-md">
          <input
            name="tittle"
            value={propertyTitle}
            onChange={(e) => setPropertyTitle(e.target.value)}
            type="text"
            placeholder="Property title Here"
            className="w-full outline-none card-bg"
          />
          <button className="text-gray-500 text-lg px-3" disabled>
            <IoHomeOutline className="font-bold" />
          </button>
        </div>

        {/* Listed For */}
        <h3 className="mt-10 text-lg font-semibold">Listed For</h3>
        <SelectButton list={listingTypes} setValue={setListedFor} name="listedFor" />

        {/* Listing Price */}
        <div className="my-4">
          <label className="block mb-2 mt-10 text-lg font-semibold">
            {listedFor === "rent" ? "Rent Price" : "Sell Price"}
          </label>
          <div className="flex card-bg p-3 rounded-lg shadow-md">
            <input
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              type="number"
              placeholder="Property price here"
              className="w-full outline-none card-bg"
            />
            <button className="text-gray-500 text-lg px-3">
              <FaNairaSign className="font-bold" />
            </button>
          </div>
        </div>

        {listedFor === "rent" && (
          <div className="my-4">
            <ToggleButtons
              options={["Monthly", "Yearly"]}
              selected={rentType}
              onChange={setRentType}
            />
          </div>
        )}

        {/* Property Category */}
        <h3 className="mt-10 text-lg font-semibold">Property Category</h3>
        <SelectButton list={categories} setValue={setCategory} name="category" />

        {/* Navigation Buttons */}
        <div className="w-full mx-auto">
          <div className="flex mt-16 gap-5 bottom-3">
            <button className="px-2 py-2 bg-white rounded-full flex items-center shadow-md">
              <FaArrowLeft className="text-xl" />
            </button>
            <Link href={'/property/add/location'} className="flex-grow">
              <button className="px-4 py-2 bg-green text-white rounded-md w-full">Next</button>
            </Link>
          </div>
        </div>
        
      </div>
    </div>
  );
}
