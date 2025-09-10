'use client';

import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import RecentSearchCard from "../search/RecentSearchCard";
import Popup from "./Popup";
import { PropertyType } from "@/types/property";
import { mockProperties } from "@/data/mockData";
import PropertyFilter from "../property/PropertyFilter";

type SearchBarProps = {
  query?: string;
  type?: string;
  city?: string;
};

const SearchBar: React.FC<SearchBarProps> = ({ query = "", type = "", city = "" }) => {
  const [showRecentSeach, setShowRecentSeach] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState<PropertyType[]>(mockProperties);

  useEffect(() => {
    console.log(`Searching for: ${query} in ${city}, type: ${type}`);
    setFilteredProperties(mockProperties); // TODO: real filtering later
  }, [query, type, city]);

  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
    setFilteredProperties(mockProperties);
  };

  return (
    <>
      <div className="px-4 mt-2 relative px-6">
        <div className="flex w-full">
          <div className="flex bg-white rounded-l-full shadow-md p-2 w-full">
            <input
              type="text"
              placeholder="Search House, Apartment, etc"
              onFocus={() => setShowRecentSeach(true)}
              className="w-full outline-none text-gray-500"
            />
            <button
              className="text-gray-500 text-lg p-1 rounded bg-gray-100"
              onClick={() => setTogglePopup(!togglePopup)}
            >
              <AiOutlineMenuUnfold className="font-bold" />
            </button>
          </div>

          <button className="ml-1 text-white bg-[#61AF74] px-6 rounded-r-full">
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
