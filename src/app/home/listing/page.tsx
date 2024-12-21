
import React from "react";
import Header from "@/components/shared/Header";
import SearchBar from "@/components/shared/SearchBar";
import CategoryTabs from "@/components/CategoryTabs";
import Footer from "@/components/shared/Footer";

export default function PropertyListing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-r from-gray-200 via-gray-100 to-gray-300">
      {/* Header */}
      <Header />

      {/* Search */}
      <SearchBar />

      {/* Category Tabs */}
      <CategoryTabs />

      {/* Promotions */}
      <div className="px-4 space-y-4">
        <div className="flex space-x-4">
          <div className="w-1/2 bg-cover bg-center h-40 rounded-xl relative" style={{ backgroundImage: "url('https://placehold.co/300x150')" }}>
            <div className="absolute bottom-2 left-2 text-white font-bold">
              Halloween Sale! <br />
              <span className="text-xs">Up to 66%</span>
            </div>
          </div>
          <div className="w-1/2 bg-cover bg-center h-40 rounded-xl relative" style={{ backgroundImage: "url('https://placehold.co/300x150')" }}>
            <div className="absolute bottom-2 left-2 text-white font-bold">
              Summer Vacation <br />
              <span className="text-xs">Discounts await</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Estates */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-semibold">Featured Estates</h2>
        <div className="flex space-x-4 mt-4 overflow-x-auto">
          {/* Card */}
          <div className="min-w-[60%] bg-white p-3 rounded-lg shadow-md">
            <img
              src="https://placehold.co/300x200"
              alt="Sky Apartment"
              className="w-full rounded-lg"
            />
            <h3 className="text-md font-semibold mt-2">
              Sky Dandelions Apartment
            </h3>
            <p className="text-gray-500 text-sm">Jakarta, Indonesia</p>
            <p className="text-blue-600 font-bold mt-2">$290/month</p>
          </div>
          <div className="min-w-[60%] bg-white p-3 rounded-lg shadow-md">
            <img
              src="https://placehold.co/300x200"
              alt="Mill Sper"
              className="w-full rounded-lg"
            />
            <h3 className="text-md font-semibold mt-2">
              Mill Sper House
            </h3>
            <p className="text-gray-500 text-sm">Jakarta, Indonesia</p>
            <p className="text-blue-600 font-bold mt-2">$271/month</p>
          </div>
        </div>
      </section>

      {/* Top Locations */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-semibold">Top Locations</h2>
        <div className="flex justify-around mt-4">
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
              🏝️
            </div>
            <span className="text-sm mt-2">Bali</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
              🏙️
            </div>
            <span className="text-sm mt-2">Jakarta</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center">
              🕌
            </div>
            <span className="text-sm mt-2">Yogyakarta</span>
          </div>
        </div>
      </section>

      {/* Explore Nearby Estates */}
      <section className="px-4 mt-6">
        <h2 className="text-lg font-semibold">Explore Nearby Estates</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-3 rounded-lg shadow-md">
            <p className="text-md font-semibold">Wings Tower</p>
            <p className="text-blue-600 font-bold mt-2">$220/month</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md">
            <p className="text-md font-semibold">Mill Sper House</p>
            <p className="text-blue-600 font-bold mt-2">$271/month</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md">
            <p className="text-md font-semibold">Bungalow House</p>
            <p className="text-blue-600 font-bold mt-2">$235/month</p>
          </div>
          <div className="bg-white p-3 rounded-lg shadow-md">
            <p className="text-md font-semibold">Sky Dandelions</p>
            <p className="text-blue-600 font-bold mt-2">$290/month</p>
          </div>
        </div>
      </section>

      {/* Bottom Navigation */}
      <Footer />
    </div>
  );
}
