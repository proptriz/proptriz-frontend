'use client';

import Link from "next/link";
import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import RecentSearchCard from "../search/RecentSearchCard";

const SearchBar: React.FC = () => {
  const [showRecentSeach, setShowRecentSeach] = useState(false);

  return (
    <div className="px-4 mt-2 relative">
        <div className="flex bg-white p-3 rounded-full shadow-md">
          <input
            type="text"
            placeholder="Search House, Apartment, etc"
            onFocus={()=>setShowRecentSeach(true)}
            className="w-full outline-none text-gray-500"
          />
          <Link href="/search/result">
            <button className="text-gray-500 text-lg px-3"><FiSearch className="font-bold"/></button>
          </Link>          
        </div>
        
        {showRecentSeach && <div className="absolute z-10">
          <RecentSearchCard />
        </div>}
    </div>
  );
};

export default SearchBar;
