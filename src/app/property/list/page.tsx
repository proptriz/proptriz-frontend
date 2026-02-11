'use client';

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/shared/SearchBar";
import NavigationTabs from "@/components/shared/NavigationTabs";
import propertyService from "@/services/propertyApi";
import { CategoryEnum, PropertyFilterPayload, PropertyType } from "@/types";
import logger from "../../../../logger.config.mjs"
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { VerticalPropertyCardSkeleton } from "@/components/skeletons/VerticalPropertyCardSkeleton";
import { VerticalCard } from "@/components/shared/VerticalCard";

export default function PropertyListPage() {
    const [properties, setProperties] = useState<PropertyType[]>([]);
    const [loadingProp, setLoadingProp] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.house);
    const [listedFor, setListedFor] = useState<string>('all');
    const [minPriceBudget, setMinPriceBudget] = useState<number>(0); 
    const [maxPriceBudget, setMaxPriceBudget] = useState<number>(900000000000);
    const [searchQuery, setSearchQuery ] = useState<string>('');
    const [nextCursor, setNextCursor] = useState<string | undefined>(undefined)
    const [centerLat, setCenterLat] = useState<number| null>(null)
    const [centerLng, setCenterLng] = useState<number| null>(null)

  const fetchProperties = async () => {
    if (loadingProp) return

    setLoadingProp(true);

    try {
      const query = new URLSearchParams({
        query: searchQuery,
        category: category ?? "",
        listed_for: listedFor == "all" ? "" : listedFor,
        min_price: minPriceBudget.toString(),
        max_price: maxPriceBudget.toString(),
        cursor: nextCursor ?? ""
        // Add other filters as needed
      }).toString();

      const result = await propertyService.getAllProperties(query);

      if (result.success) {
        setProperties(result.properties);
        logger.info("Listed properties: ", result.properties);
        setNextCursor(result.nextCursor)

      } else {
        setError(result.message);
        logger.error("error fetching all properties: ", result.message);

      }
      setLoadingProp(false);
    } catch (error:any) {
      setError(error.message);
      logger.error("error fetching all properties: ", error.message)

    } finally {
      setLoadingProp(false);
    }

    
  };

  useEffect(() => {
    fetchProperties();
  
  }, [category, listedFor, minPriceBudget, maxPriceBudget]);
  
  useEffect(() => {
    if (searchQuery.trim() !== '') return;
    fetchProperties();
  }, [searchQuery]);

  const onFilter = useCallback((filters: PropertyFilterPayload) => {
    setProperties([]);  
    setListedFor(filters.listedFor);
    setMinPriceBudget(filters.priceMin || 0);
    setMaxPriceBudget(filters.priceMax || 100000000);
    setCategory(filters.propertyType);
    setSearchQuery(filters.description || searchQuery);
    setCenterLat(filters.location ? filters.location.lat : null);
    setCenterLng(filters.location ? filters.location.lng : null); 
  }, [searchQuery, listedFor, category, minPriceBudget, maxPriceBudget]);

  return (
    <div className="flex flex-col pt-5 pb-16">
      {/* Header */}
      <Header />

      <div className="relative z-50 lg:flex px-6 py-6 space-y-4 lg:space-y-0  w-full">
        <SearchBar value={searchQuery} onChange={setSearchQuery} onSearch={fetchProperties} onFilter={onFilter} />
        <NavigationTabs onChange={setCategory} value={category}/>
      </div>

      {/* Explore Nearby Property List */}
      <section className="px-4 my-6">
        <h2 className="text-lg font-semibold">Properties</h2>

        <div className="grid grid-cols-2 gap-4 mt-4">
          {properties.map((item, key) => (
            <Link href={`/property/details/${item._id}`} key={key}>
              {/* Property Card */}
              <VerticalCard
                id={item._id}
                name={item.title}
                price={item.price}
                currency={item.currency}
                category={item.category || ""}
                address={item.address}
                image={item.banner}
                period={item.period || ""}
                listed_for={item.listed_for || ""}
                rating={item.average_rating || 4.9}
              />
            </Link>
          ))}

          {loadingProp &&
            Array.from({ length: 6 }).map((_, i) => (
              <VerticalPropertyCardSkeleton key={i} />
            ))
          }
        </div>
        
        {/* {!hasMoreProp && <p>No more listed properties</p>} */}
      </section>
      <Footer />
    </div>
  );
}
