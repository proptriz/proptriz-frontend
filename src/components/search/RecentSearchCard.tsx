'use client';

import React, { useState } from "react";

const RecentSearchCard = () => {
  const [searches, setSearches] = useState([
    { id: 1, text: "Modern house", icon: "⏰" },
    { id: 2, text: "Semarang", icon: "⏰" },
    { id: 3, text: "Sky Dandelions Apartment", icon: "/images/apartment-icon.png" },
  ]);

  const removeSearch = (id: number) => {
    setSearches(searches.filter((search) => search.id !== id));
  };

  const clearSearches = () => {
    setSearches([]);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-80">
      <header className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold text-gray-800">Recent Search</h2>
        <button
          onClick={clearSearches}
          className="text-blue-600 hover:underline text-sm font-medium"
        >
          Clear
        </button>
      </header>
      <ul>
        {searches.map((search) => (
          <li
            key={search.id}
            className="flex items-center justify-between py-2 border-b border-gray-200 last:border-0"
          >
            <div className="flex items-center">
              {typeof search.icon === "string" && search.icon.startsWith("/")
                ? (
                  <img
                    src={search.icon}
                    alt={search.text}
                    className="w-6 h-6 rounded-full mr-3"
                  />
                )
                : (
                  <span className="text-gray-500 mr-3">{search.icon}</span>
                )}
              <span className="text-gray-800">{search.text}</span>
            </div>
            <button
              onClick={() => removeSearch(search.id)}
              className="text-gray-400 hover:text-red-500"
            >
              ✖
            </button>
          </li>
        ))}
        {searches.length === 0 && (
          <p className="text-gray-500 text-sm text-center">No recent searches</p>
        )}
      </ul>
    </div>
  );
};

export default RecentSearchCard;
