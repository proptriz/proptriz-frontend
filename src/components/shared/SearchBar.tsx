import React from "react";
import { FiSearch } from "react-icons/fi";
import { BsMic } from "react-icons/bs";

const SearchBar: React.FC = () => {
  return (
    <div className="px-4 mt-2">
        <div className="flex bg-white p-3 rounded-full shadow-md">
          <input
            type="text"
            placeholder="Search House, Apartment, etc"
            className="w-full outline-none text-gray-500"
          />
          <button className="text-gray-500 text-lg px-3"><FiSearch className="font-bold"/></button>
        </div>
    </div>
  );
};

export default SearchBar;
