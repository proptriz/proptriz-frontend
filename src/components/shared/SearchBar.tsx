import Link from "next/link";
import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar: React.FC = () => {
  return (
    <div className="px-4 mt-2">
        <div className="flex bg-white p-3 rounded-full shadow-md">
          <input
            type="text"
            placeholder="Search House, Apartment, etc"
            className="w-full outline-none text-gray-500"
          />
          <Link href="/search/result">
            <button className="text-gray-500 text-lg px-3"><FiSearch className="font-bold"/></button>
          </Link>
          
        </div>
    </div>
  );
};

export default SearchBar;
