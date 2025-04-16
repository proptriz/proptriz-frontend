'use client';

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import RecentSearchCard from "../search/RecentSearchCard";

interface SearchProps {
    disable?: boolean;
    filter?: string
}
const SearchBar: React.FC<SearchProps> = ({disable=false, filter=''}) => {
  const router = useRouter()

  const handleSearch = () => {
    router.push(`/search/result?filter=${filter}&query=${query}`)
  }

  const [showRecentSeach, setShowRecentSeach] = useState(false);
  const [query, setQuery] = useState<string>('');

  return (
    <div className="px-4 mt-2 relative">
        <div className="flex bg-white p-3 rounded-full shadow-md">
          <input
            type="text"
            value={query}
            onChange={(e)=>setQuery(e.target.value)}
            placeholder="Search House, Apartment, etc"
            onFocus={()=>setShowRecentSeach(true)}
            className="w-full outline-none text-gray-500"
            disabled={disable}
          />
          
          <button 
            className="text-gray-500 text-lg px-3" 
            disabled={disable} 
            onClick={()=>handleSearch()}
          >
            <FiSearch className="font-bold"/>
          </button>
                   
        </div>
        
        {showRecentSeach && <div className="absolute z-10">
          <RecentSearchCard />
        </div>}
    </div>
  );
};

export default SearchBar;
