import React from "react";

const tabs = ["All", "House", "Apartment", "Villa"];

const CategoryTabs: React.FC = () => {
  return (

    <div className="flex justify-around px-4 my-4 overflow-x-auto">
        {tabs.map((tab, index) => (
            <button
            key={index}
            className={`px-4 py-2 rounded-full ${
                tab === "All" ? "bg-blue-900 text-white" : "bg-gray-100 text-gray-700"
            }`}
            >
            {tab}
            </button>))
        }
      </div>
  );
};

export default CategoryTabs;
