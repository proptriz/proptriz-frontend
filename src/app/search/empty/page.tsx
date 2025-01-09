'use client';

import React, { useState } from "react";
import { BackButton } from "@/components/shared/buttons";
import { FaFilter } from "react-icons/fa";
import SearchBar from "@/components/shared/SearchBar";
import { MdCalendarViewDay } from "react-icons/md";
import { HiViewGrid } from "react-icons/hi";
import Image from "next/image";

const EmptySearch = () => {
  const [propCount, setPropCount] = useState<number>(4);

  return (
    <div className="flex flex-col justify-between p-6 min-h-screen">
        {/* Header */}
        <div>
            <div className="flex items-center justify-between mb-5">
                <BackButton />
                <h2 className="font-bold text-lg">Search Results</h2>
                <button className="p-3 text-xl rounded-full card-bg">
                    <FaFilter />
                </button>
            </div>
            <SearchBar />
            <div className="flex items-center justify-between mt-4 mb-6">
                <p className="font-[Raleway]">
                    Found <span className="font-bold">{propCount}</span> properties
                </p>
                <button className="flex items-center gap-1 px-4 py-2 rounded-full card-bg">
                    <HiViewGrid className="text-lg" />
                    <MdCalendarViewDay className="text-lg" />
                </button>
            </div>
        </div>

        {/* Info Section */}
        <div>       
            <div className="flex flex-col items-center mt-12">
            <Image
                src="/icon/alert-caution.png"
                width={150}
                height={150}
                alt="search not found icon"
                className="mx-auto"
            />
            <p className="text-2xl font-semibold text-center mt-4">
                Search <span className="font-bold">not Found</span>
            </p>
            <h4 className="text-center text-gray-600 mt-2">
                Sorry, we can’t find the real estates you are looking for. Maybe, a
                little spelling mistake?
            </h4>
            </div>
        </div>
        {/* footer section */}
        <div className="mt-auto"></div>
    </div>
  );
};

export default EmptySearch;
