'use client';

import { BackButton } from "@/components/shared/buttons";
import dynamic from 'next/dynamic';
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function AddPropertyLocationPage() {
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [listedFor, setListedFor] = useState<string>("");
  const [category, setCategory] = useState<string>("");

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
            Where is the <span className="font-semibold">location</span>
        </h2>

        <div
            className="rounded-full p-4 border border-[#DCDFD9] my-4 cursor-pointer hover:bg-gray-100 flex items-center"
        >
            <button className="card-bg rounded-full p-3 mr-2 text-2xl" disabled>
                <HiOutlineLocationMarker />
            </button>
            <p className="text-gray-700">
                Opposite Gate-04 Jimeta International Market, Yola
            </p>
        </div>

        <div className="relative h-[350px] max-h-[400px] overflow-hidden rounded-lg border border-gray-200">
            <Map properties={[]} />
        </div>
        <button className="w-full py-4 card-bg" disabled>Select on the map</button>

        {/* Navigation Buttons */}
        <div className="w-full mx-auto">
          <div className="flex mt-16 gap-5 bottom-3">
            <button className="px-2 py-2 bg-white rounded-full flex items-center shadow-md">
              <FaArrowLeft className="text-xl" />
            </button>
            <Link href={'/property/add/photos'} className="flex-grow">
              <button className="px-4 py-2 bg-green text-white rounded-md w-full">Next</button>
            </Link>
          </div>
        </div>
    </div>
  );
}
