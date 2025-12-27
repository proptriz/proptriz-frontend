'use client';

import React, { useContext, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/shared/SearchBar";
import { useRouter } from "next/navigation";
import NavigationTabs from "@/components/shared/NavigationTabs";
import propertyService from "@/services/propertyApi";
import { PropertyType } from "@/types";
import { AppContext } from "@/context/AppContextProvider";
import logger from "../../../../logger.config.mjs"
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

export default function PropertyListPage() {
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [ searchQuery, setSearchQuery ] = useState<string>('');
    const [ filterBy, setFilterBy ] = useState<string>('house');

  const fetchProperties = async () => {
    setLoading(true);
    setProperties([]);

    try {
      const query = new URLSearchParams({
        query: searchQuery,
        page: "1",
        limit: "50",
        category: filterBy,
        listed_for: "",
        // Add other filters as needed
      }).toString();

      const response = await propertyService.getAllProperties(query);

      if (response.success) {
        setProperties(response.data);
        logger.info("Listed properties: ", response.data);

      } else {
        setError(response.message);
        logger.error("error fetching all properties: ", response.message);

      }
      setLoading(false);
    } catch (error:any) {
      setError(error.message);
      logger.error("error fetching all properties: ", error.message)

    } finally {
      setLoading(false);
    }

    
  };

  return (
    <div className="flex flex-col pt-5 pb-16">
      {/* Header */}
      <Header />

      <div className="z-10 lg:flex px-6 py-6 space-y-4 lg:space-y-0  w-full">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={fetchProperties} />
        <NavigationTabs setValue={setFilterBy}/>
      </div>

      {/* Explore Nearby Property List */}
      <section className="px-4 my-6">
        <h2 className="text-lg font-semibold">Properties</h2>
        <div className="grid grid-cols-2 gap-4 mt-4">
          {properties.map((item, key) => (
            <Link href={"/property/details"} key={key}>
              <div className="bg-white p-3 rounded-2xl shadow-md">
                <div
                  className="w-full bg-cover bg-center h-48 rounded-xl relative"
                  style={{ backgroundImage: `url(${item.banner})` }}
                >
                  <div className="absolute bottom-2 right-2 bg-gray-700 text-white font-bold p-1 rounded-xl">
                    N{item.price}
                    <span className="text-xs">{item.period}</span>
                  </div>
                </div>
                <div>
                  <p className="text-md font-semibold my-2">{item.title}</p>
                  <div className="flex space-x-2">
                    <span className="text-yellow-500">★</span>
                    <span className="text-gray-500 text-sm">{0}</span>
                    <p className="text-gray-500 text-sm">{item.address}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
