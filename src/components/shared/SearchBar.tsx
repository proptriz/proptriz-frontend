'use client';

import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { AiOutlineMenuUnfold } from "react-icons/ai";
import RecentSearchCard from "../search/RecentSearchCard";
import Popup from "./Popup";
import PropertyFilter from "../property/PropertyFilter";
import { PropertyFilterPayload } from "@/types";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onSearch: () => void;
  onFilter: (filters: PropertyFilterPayload) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  onSearch,
  onFilter
}) => {
  // const [showRecentSearch, setShowRecentSearch] = useState(false);
  const [togglePopup, setTogglePopup] = useState(false);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onSearch();
    }
  };

  const handleFilter = (filters: any) => {
    console.log("Applied filters:", filters);
  };

  return (
    <>
      <div className="w-full md:max-w-[75%] lg:max-w-[50%] mx-auto lg:ml-0 relative">
        <div className="flex mx-auto">
          <div className="flex bg-white rounded-l-full shadow-md p-2 w-full">
            <input
              type="text"
              placeholder="Search House, Apartment, etc"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={handleKeyDown}
              // onFocus={() => setShowRecentSearch(true)}
              // onBlur={() => setShowRecentSearch(false)}
              className="w-full outline-none text-gray-500"
            />

            <button
              type="button"
              className="text-primary text-lg p-1 rounded card-bg"
              onClick={() => setTogglePopup(prev => !prev)}
            >
              <AiOutlineMenuUnfold />
            </button>
          </div>

          <button
            type="button"
            className="ml-1 text-secondary bg-primary px-6 rounded-r-full"
            onClick={onSearch}
          >
            <FiSearch className="text-xl" />
          </button>
        </div>

        {/* {showRecentSearch && (
          <div className="absolute z-10">
            <RecentSearchCard />
          </div>
        )} */}
      </div>

      <Popup
        header="Filter Properties"
        toggle={togglePopup}
        setToggle={setTogglePopup}
        useMask
        hideReset={true}
      >
        <PropertyFilter onFilter={onFilter} setTogglePopup={setTogglePopup} />
      </Popup>
    </>
  );
};

export default SearchBar;
