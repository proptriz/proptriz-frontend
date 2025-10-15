'use client';

import React, { SetStateAction, useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import RecentSearchCard from "../search/RecentSearchCard";
import Popup from "./Popup";
import { PropertyType } from "@/types/property";
import { mockProperties } from "@/data/mockData";
import PropertyFilter from "../property/PropertyFilter";

type SearchBarProps = {
  setQuery: React.Dispatch<SetStateAction<string>>;
  onSearch: ()=> void;
};

const SearchBar: React.FC<SearchBarProps> = ({ setQuery, onSearch }) => {
  const [showRecentSeach, setShowRecentSeach] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(mockProperties);

  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
    setFilteredProperties(mockProperties);
  };

  return (
    <>
      <div className="relative w-full md:max-w-[75%] lg:max-w-[50%] mx-auto lg:ml-0">
        <div className="flex mx-auto">
          <div className="flex bg-white rounded-l-full shadow-md p-2 w-full">
            <input
              type="text"
              placeholder="Search House, Apartment, etc"
              onFocus={() => setShowRecentSeach(true)}
              onBlur={() => setShowRecentSeach(false)}
              onChange={(e)=>setQuery(e.target.value)}
              className="w-full outline-none text-gray-500"
            />
            <button
              className="text-gray-500 text-lg p-1 rounded bg-gray-100"
              onClick={() => setTogglePopup(!togglePopup)}
            >
              <AiOutlineMenuUnfold className="font-bold" />
            </button>
          </div>

          <button 
          className="ml-1 text-white bg-[#61AF74] px-6 rounded-r-full" 
          onClick={()=>onSearch()}
          >
            <FiSearch className="text-xl" />
          </button>
        </div>

        {showRecentSeach && (
          <div className="absolute z-10">
            <RecentSearchCard />
          </div>
        )}
      </div>

      {/* filter popup */}
      <Popup header="Filter" toggle={togglePopup} setToggle={setTogglePopup} useMask={true}>
        <PropertyFilter onFilter={handleFilter} />
      </Popup>
    </>
  );
};

export default SearchBar;
