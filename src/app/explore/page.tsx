'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { getNearestProperties } from "@/services/propertyApi";
import { CategoryEnum, PropertyFilterPayload, PropertyType } from "@/types";
// import logger from "../../../logger.config.mjs"
import Header from "@/components/shared/Header";
import { VerticalPropertyCardSkeleton } from "@/components/skeletons/VerticalPropertyCardSkeleton";
import Link from "next/link";
import { VerticalCard } from "@/components/shared/VerticalCard";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { topLocation } from "@/constant";
import Image from "next/image";
import getUserPosition from "@/utils/getUserPosition";

export default function Page() {
  const [draftQuery, setDraftQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.house);
  const [listedFor, setListedFor] = useState<string>('all');
  const [minPriceBudget, setMinPriceBudget] = useState<number>(0); 
  const [maxPriceBudget, setMaxPriceBudget] = useState<number>(900000000000);
  const [centerLat, setCenterLat] = useState<number| null>(null);
  const [centerLng, setCenterLng] = useState<number| null>(null);
  const [listedProperties, setListedProperties] = useState<PropertyType[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [showAllProperties, setShowAllProperties] = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);


  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const PREVIEW_ROWS = 2;
  const ITEMS_PER_ROW = 2;

  const previewCount = PREVIEW_ROWS * ITEMS_PER_ROW;

  const visibleProperties = showAllProperties
    ? listedProperties
    : listedProperties.slice(0, previewCount);

  // Get user location
  const fetchLocation = async () => {
    const [lat, lng] = await getUserPosition();
    setCenterLat(lat);
    setCenterLng(lng);
    setIsLocationReady(true);
  };


  useEffect(() => {
    fetchLocation();
  }, []);

  const onFilter = useCallback((filters: PropertyFilterPayload) => { 
    setListedFor(filters.listedFor);
    setMinPriceBudget(filters.priceMin || 0);
    setMaxPriceBudget(filters.priceMax || 90000000000);
    setCategory(filters.propertyType);
    setSearchQuery(filters.description || searchQuery);
    setCenterLat(filters.location ? filters.location.lat : null);
    setCenterLng(filters.location ? filters.location.lng : null); 
  }, [searchQuery]);

  const queryString = useMemo(() => {
    return new URLSearchParams({
      query: searchQuery,
      category: category ?? "",
      listed_for: listedFor === "all" ? "" : listedFor,
      min_price: minPriceBudget.toString(),
      max_price: maxPriceBudget.toString(),
      ...(centerLat != null && centerLng != null && {
        lat: centerLat.toString(),
        lng: centerLng.toString(),
      }),
    }).toString();
  }, [
    searchQuery,
    category,
    listedFor,
    minPriceBudget,
    maxPriceBudget,
    centerLat,
    centerLng
  ]);

  const fetchProperties = useCallback(
    async (reset = false) => {
      if (loading) return;
      if (!hasMore && !reset) return;

      setLoading(true);

      try {
        const res = await getNearestProperties(
          `${queryString}&cursor=${reset ? "" : cursor ?? ""}`
        );

        if (!res) {
          setHasMore(false);
          return;
        }

        setListedProperties(prev =>
          reset ? res.properties : [...prev, ...res.properties]
        );

        setCursor(res.nextCursor);
        setHasMore(Boolean(res.nextCursor));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    },
    [queryString, cursor, loading, hasMore]
  );

  // Listed properties lazy loading
  useEffect(() => {
    if (!isLocationReady) return;

    setListedProperties([]);
    setCursor(null);
    setHasMore(true);
    fetchProperties(true);
  }, [
    isLocationReady,
    searchQuery,
    category,
    listedFor,
    minPriceBudget,
    maxPriceBudget,
    centerLat,
    centerLng
  ]);

  useEffect(() => {
    if (!loadMoreRef.current) return;

    observerRef.current?.disconnect();

    observerRef.current = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          fetchProperties();
        }
      },
      { rootMargin: "200px" } // smoother UX
    );

    observerRef.current.observe(loadMoreRef.current);

    return () => observerRef.current?.disconnect();
  }, [fetchProperties]);

  return (
    <div className="flex flex-col pt-5 pb-16">
      {/* Header */}
      <Header />

      <div className="relative top-0 z-50 lg:flex px-6 space-y-4 lg:space-y-0 lg:space-x-3 w-full lg:items-center justify-center pt-4 lg:pt-6 pb-2 bg-transparent">
        <SearchBar
          value={draftQuery}
          onChange={setDraftQuery}
          onSearch={() => setSearchQuery(draftQuery)} // ✅ trigger fetch
          onFilter={onFilter}
        />
        
        <NavigationTabs onChange={setCategory} value={category} />
      </div>

      <div className="relative flex-1">
        <div className="relative">
            {/* Explore Nearby Property */}
            <section className="px-4 mb-10">
              <h2 className="text-lg font-semibold">Explore Nearby Property</h2>
              <div
                className={`
                  grid grid-cols-2 gap-4 mt-4
                  ${showAllProperties ? "max-h-[70vh] overflow-y-auto pr-1" : ""}
                `}
              >
                {visibleProperties.map((property, index) => {
                  const isLast =
                    showAllProperties && index === visibleProperties.length - 1;

                  return (
                    <div
                      key={property._id}
                      ref={isLast ? loadMoreRef : undefined}
                    >
                      <Link href={`/property/details/${property._id}?slug=${property.slug}`}>
                        <VerticalCard
                          id={property._id}
                          name={property.title}
                          price={property.price}
                          currency={property.currency}
                          category={property.category}
                          address={property.address}
                          image={property.banner}
                          period={property.period ?? ""}
                          listed_for={property.listed_for ?? ""}
                          rating={property.average_rating ?? 4.9}
                          distance={property.distance || undefined}
                        />
                      </Link>
                    </div>
                  );
                })}

                {showAllProperties && loading &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <VerticalPropertyCardSkeleton key={i} />
                  ))
                }

                {showAllProperties && !hasMore && !loading && (
                  <p className="col-span-2 text-center text-sm text-gray-500 mt-4">
                    No more properties
                  </p>
                )}
              </div>

              {!showAllProperties && (
                <button
                  onClick={() => setShowAllProperties(true)}
                  className="mt-4 text-green"
                >
                  View all properties
                </button>
              )}

                    
            </section>
        
            {/* Featured Estates */}
            <section className="px-4 mb-10">
              <h2 className="text-lg font-semibold">Featured Properties</h2>
              <div className="flex space-x-4 mt-4 overflow-x-auto">
        
                {/* Card */}
                {listedProperties.slice(0,3).map(((property, key) => (
                  <HorizontalCard 
                    id={property._id}
                    name={property.title} 
                    price={30} 
                    currency={property.currency}
                    category={property.category} 
                    listed_for={property.listed_for}
                    address={property.address} 
                    image={property.banner} 
                    period={property.period ?? ''} 
                    rating={property.average_rating ?? 5.0}
                    key={key}
                  />
                )))}
              </div>
            </section>
        
            {/* Top Locations */}
            <section className="px-4 mb-10">
              <h2 className="text-lg font-semibold">Top Locations</h2>
              <div className="flex mt-4 overflow-x-auto space-x-6">
                        
                {topLocation.map(((location, key)=>(
                  <Link href={'/location/list'} key={key}>
                    <div className="flex items-center bg-[#DCDFD9] space-x-2 rounded-full p-2" key={key}>
                      <div className="w-14 h-14 rounded-full bg-gray-300 flex items-center justify-center ">
                        <Image src={location.image} width={14} height={14} alt={'image button'} className="w-full h-full object-cover rounded-full"/>
                      </div>
                      <p className="text-sm no-wrap">{location.name}</p>
                    </div>
                  </Link>
                )))}
              </div>
              <Link href={'/location/list'}>
                <button className="mt-4 text-green">More locations</button>
              </Link>
            </section>
        
            {/* Promotions */}
            <div className="px-4 mb-10">
              <div className="flex space-x-4">
                <div className="w-1/2 bg-cover bg-center h-40 rounded-xl relative" style={{ backgroundImage: "url('/cover-1.png')" }}>
                  <div className="absolute bottom-2 left-2 text-white font-bold">
                    Halloween Sale! <br />
                    <span className="text-xs">Up to 66%</span>
                  </div>
                </div>
                  <div className="w-1/2 bg-cover bg-center h-40 rounded-xl relative" style={{ backgroundImage: "url('/apartment.png')" }}>
                    <div className="absolute bottom-2 left-2 text-white font-bold">
                      Summer Vacation <br />
                      <span className="text-xs">Discounts await</span>
                    </div>
                  </div>
              </div>
            </div>
        
            {/* Estate Agents */}
            <section className="px-4 mb-10">
              <h2 className="text-lg font-semibold">Top Estate Agents</h2>
              <div className="overflow-x-auto text-sm text-center text-gray-500">
                <div className="flex space-x-8">
                  <div>
                    <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                      <img
                        src="https://placehold.co/40"
                        alt="profile"
                        className="rounded-full w-full h-full object-cover"
                      />                    
                    </div>
                    <p className="mt-1">Mr. Yusuf</p>
                  </div>                
                  <div>
                    <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                      <img
                        src="https://placehold.co/40"
                        alt="profile"
                        className="rounded-full w-full h-full object-cover"
                      />                    
                    </div>
                    <p className="mt-1">Mrs. Oladosu</p>
                  </div>
                  <div>
                    <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                        <img
                            src="https://placehold.co/40"
                            alt="profile"
                            className="rounded-full w-full h-full object-cover"
                        />                    
                    </div>
                    <p className="mt-1">Engr. Kola</p>
                  </div>
                  <div>
                    <div className="bg-white w-20 h-20 rounded-full p-1 mt-4">
                      <img
                        src="https://placehold.co/40"
                        alt="profile"
                        className="rounded-full w-full h-full object-cover"
                      />                    
                    </div>
                    <p className="mt-1">Engr. Kola</p>
                  </div>
                </div>
              </div>
              <Link href={'/agent/list'}>
                <button className="mt-4 text-green">View all agents</button>
              </Link>            
            </section>
          </div>
      </div>

      {/* Footer Navigation */}
      <Footer />
    </div>
  );
};


