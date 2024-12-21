import React from "react";

const Header: React.FC = () => {
  return (
    <>
    {/* Header */}
    <header className="p-4 flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-gray-500 text-sm">
            📍 Jakarta, Indonesia
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-500 text-xl">🔔</button>
          <img
            src="https://placehold.co/40" // Placeholder for profile image
            alt="profile"
            className="rounded-full w-10 h-10"
          />
        </div>
    </header>
    </>
  );
};

export default Header;
