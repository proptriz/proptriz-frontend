// /app/explore/page.tsx
'use client';

import React, { useState, useCallback, useRef, useMemo, useEffect } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { getNearestProperties } from "@/services/propertyApi";
import { CategoryEnum, ListForEnum, PropertyFilterPayload, PropertyType, RenewalEnum} from "@/types/property";
import Header from "@/components/shared/Header";
import { VerticalPropertyCardSkeleton } from "@/components/skeletons/VerticalPropertyCardSkeleton";
import Link from "next/link";
import { VerticalCard } from "@/components/shared/VerticalCard";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { topLocation } from "@/constant";
import Image from "next/image";
import getUserPosition from "@/utils/getUserPosition";
import { useLanguage } from "@/i18n/LanguageContext";

// ─── Constants ────────────────────────────────────────────────────────────────

const PREVIEW_COUNT = 4; // 2 rows × 2 cols

// ─── Page ────────────────────────────────────────────────────────────────────

export default function Page() {
  const { t } = useLanguage();

  const [draftQuery, setDraftQuery]           = useState("");
  const [searchQuery, setSearchQuery]         = useState("");
  const [category, setCategory]               = useState<CategoryEnum>(CategoryEnum.house);
  const [listedFor, setListedFor]             = useState<string>("all");
  const [minPriceBudget, setMinPriceBudget]   = useState<number>(0);
  const [maxPriceBudget, setMaxPriceBudget]   = useState<number>(900_000_000_000);
  const [centerLat, setCenterLat]             = useState<number | null>(null);
  const [centerLng, setCenterLng]             = useState<number | null>(null);
  const [listedProperties, setListedProperties] = useState<PropertyType[]>([]);
  const [cursor, setCursor]                   = useState<string | null>(null);
  const [loading, setLoading]                 = useState(false);
  const [hasMore, setHasMore]                 = useState(true);
  const [showAll, setShowAll]                 = useState(false);
  const [isLocationReady, setIsLocationReady] = useState(false);

  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const visibleProperties = showAll
    ? listedProperties
    : listedProperties.slice(0, PREVIEW_COUNT);

  // ── Location ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getUserPosition().then(([lat, lng]) => {
      setCenterLat(lat);
      setCenterLng(lng);
      setIsLocationReady(true);
    });
  }, []);

  // ── Filter handler ───────────────────────────────────────────────────────
  const onFilter = useCallback((filters: PropertyFilterPayload) => {
    setListedFor(filters.listedFor);
    setMinPriceBudget(filters.priceMin ?? 0);
    setMaxPriceBudget(filters.priceMax ?? 900_000_000_000);
    setCategory(filters.propertyType);
    setSearchQuery(filters.description ?? searchQuery);
    setCenterLat(filters.location?.lat ?? null);
    setCenterLng(filters.location?.lng ?? null);
  }, [searchQuery]);

  // ── Query string ─────────────────────────────────────────────────────────
  const queryString = useMemo(() => {
    const params: Record<string, string> = {
      query:      searchQuery,
      category:   category ?? "",
      listed_for: listedFor === "all" ? "" : listedFor,
      min_price:  minPriceBudget.toString(),
      max_price:  maxPriceBudget.toString(),
    };
    if (centerLat != null && centerLng != null) {
      params.lat = centerLat.toString();
      params.lng = centerLng.toString();
    }
    return new URLSearchParams(params).toString();
  }, [searchQuery, category, listedFor, minPriceBudget, maxPriceBudget, centerLat, centerLng]);

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchProperties = useCallback(
    async (reset = false) => {
      if (loading || (!hasMore && !reset)) return;
      setLoading(true);
      try {
        const res = await getNearestProperties(
          `${queryString}&cursor=${reset ? "" : (cursor ?? "")}`
        );
        if (!res) { setHasMore(false); return; }
        setListedProperties((prev) => reset ? res.properties : [...prev, ...res.properties]);
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

  // Reset + refetch when deps change
  useEffect(() => {
    if (!isLocationReady) return;
    setListedProperties([]);
    setCursor(null);
    setHasMore(true);
    fetchProperties(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLocationReady, searchQuery, category, listedFor, minPriceBudget, maxPriceBudget, centerLat, centerLng]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;
    observerRef.current?.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchProperties(); },
      { rootMargin: "200px" }
    );
    observerRef.current.observe(loadMoreRef.current);
    return () => observerRef.current?.disconnect();
  }, [fetchProperties]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
      <Header />

      {/* ── Hero header ─────────────────────────────────────────────────── */}
      <div
        className="px-5 pt-14 pb-5"
        style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
      >
        <p className="text-white/75 text-xs mb-1">{t("home_good_day")}</p>
        <h2
          className="text-white text-[22px] font-extrabold leading-tight mb-4"
          style={{ fontFamily: "'Raleway', sans-serif" }}
        >
          {t("home_subtitle")}
        </h2>
        <SearchBar
          value={draftQuery}
          onChange={setDraftQuery}
          onSearch={() => setSearchQuery(draftQuery)}
          onFilter={onFilter}
        />
      </div>
    
      {/* ── Category tabs ───────────────────────────────────────────────── */}
      <div className="bg-white border-b border-[#e5e7eb] sticky top-0 z-30">
        <NavigationTabs onChange={setCategory} value={category} />
      </div>

      <div className="flex-1">

        {/* ── Nearby Properties ─────────────────────────────────────────── */}
        <section className="px-4 pt-5 mb-8">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] font-bold text-[#111827]">{t("home_nearby")}</h2>
            {!showAll && listedProperties.length > PREVIEW_COUNT && (
              <button
                onClick={() => setShowAll(true)}
                className="text-[13px] font-semibold text-[#1e5f74]"
              >
                {t("home_see_all")} →
              </button>
            )}
          </div>

          <div
            className={`grid grid-cols-2 gap-3 ${
              showAll ? "max-h-[72vh] overflow-y-auto pr-1" : ""
            }`}
          >
            {loading && !listedProperties.length
              ? Array.from({ length: 4 }).map((_, i) => (
                  <VerticalPropertyCardSkeleton key={i} />
                ))
              : visibleProperties.map((property, index) => {
                  const isLast = showAll && index === visibleProperties.length - 1;
                  return (
                    <div key={property._id} ref={isLast ? loadMoreRef : undefined}>
                      <Link href={`/property/details/${property._id}?slug=${property.slug}`}>
                        <VerticalCard
                          id={property._id}
                          name={property.title}
                          price={property.price}
                          currency={property.currency}
                          category={property.category}
                          address={property.address}
                          image={property.banner}
                          period={property.period ?? RenewalEnum.yearly}
                          listed_for={property.listed_for ?? ListForEnum.rent}
                          rating={property.average_rating ?? 4.9}
                          distance={property.distance ?? undefined}
                        />
                      </Link>
                    </div>
                  );
                })
            }

            {showAll && loading && Array.from({ length: 4 }).map((_, i) => (
              <VerticalPropertyCardSkeleton key={`sk-${i}`} />
            ))}

            {showAll && !hasMore && !loading && (
              <p className="col-span-2 text-center text-sm text-[#9ca3af] py-4">
                {t("home_seen_all")}
              </p>
            )}
          </div>
        </section>

        {/* ── Featured Properties ───────────────────────────────────────── */}
        {listedProperties.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between px-4 mb-3">
              <h2 className="text-[15px] font-bold text-[#111827]">{t("home_featured")}</h2>
              <span className="text-[13px] font-semibold text-[#1e5f74]">{t("home_see_all")} →</span>
            </div>
            <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-hide">
              {listedProperties.slice(0, 5).map((property) => (
                <div key={property._id} className="flex-shrink-0 w-[180px]">
                  <HorizontalCard
                    id={property._id}
                    name={property.title}
                    price={property.price}
                    currency={property.currency}
                    category={property.category}
                    listed_for={property.listed_for ?? ListForEnum.rent}
                    address={property.address}
                    image={property.banner}
                    period={property.period ?? RenewalEnum.yearly}
                    rating={property.average_rating ?? 5.0}
                  />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Promotional Banners ───────────────────────────────────────── */}
        <section className="px-4 mb-8">
          <div className="flex gap-3">
            <div
              className="flex-1 h-[90px] rounded-2xl relative overflow-hidden flex items-end p-3"
              style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
            >
              <div className="text-white text-xs font-bold leading-snug">
                🎃 End of Year<br />
                <span className="opacity-75 font-normal">Up to 66% off</span>
              </div>
              <span className="absolute top-2 right-2 bg-[#f0a500] text-[#143d4d] text-[9px]
                               font-extrabold px-2 py-0.5 rounded-md">SALE</span>
            </div>
            <div
              className="flex-1 h-[90px] rounded-2xl relative overflow-hidden flex items-end p-3"
              style={{ background: "linear-gradient(135deg,#a06500,#f0a500)" }}
            >
              <div className="text-white text-xs font-bold leading-snug">
                ☀️ Summer Deals<br />
                <span className="opacity-80 font-normal">Discounts await</span>
              </div>
              <span className="absolute top-2 right-2 bg-white text-[#143d4d] text-[9px]
                               font-extrabold px-2 py-0.5 rounded-md">NEW</span>
            </div>
          </div>
        </section>

        {/* ── Top Locations ─────────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-[15px] font-bold text-[#111827]">{t("home_top_locations")}</h2>
            <Link href="/location/list">
              <span className="text-[13px] font-semibold text-[#1e5f74]">{t("home_more")}</span>
            </Link>
          </div>
          <div className="flex gap-3 px-4 overflow-x-auto pb-1 scrollbar-hide">
            {topLocation.map((location, key) => (
              <Link href="#" key={key}>
                <div className="flex items-center gap-2 bg-white rounded-full
                                px-3 py-2 shadow-[0_1px_6px_rgba(0,0,0,0.08)]
                                flex-shrink-0 cursor-pointer
                                hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-[#e0f0f5] overflow-hidden flex-shrink-0">
                    <Image
                      src={location.image}
                      width={32}
                      height={32}
                      alt={location.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  <p className="text-[12px] font-semibold text-[#111827] whitespace-nowrap">
                    {location.name}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Top Agents ────────────────────────────────────────────────── */}
        <section className="mb-8">
          <div className="flex items-center justify-between px-4 mb-3">
            <h2 className="text-[15px] font-bold text-[#111827]">{t("home_top_agents")}</h2>
            <Link href="/agent/list">
              <span className="text-[13px] font-semibold text-[#1e5f74]">{t("home_view_all")}</span>
            </Link>
          </div>
          <div className="flex gap-5 px-4 overflow-x-auto pb-1 scrollbar-hide">
            {[
              { name: "Mr. Yusuf",      rating: 4.9 },
              { name: "Mrs. Oladosu",   rating: 4.8 },
              { name: "Engr. Kola",     rating: 4.7 },
              { name: "Arc. Bisi",      rating: 5.0 },
            ].map((agent) => (
              <div key={agent.name} className="text-center flex-shrink-0">
                <div
                  className="w-14 h-14 rounded-full bg-white mx-auto mb-1
                             border-2 border-[#e0f0f5]
                             shadow-[0_2px_10px_rgba(0,0,0,0.1)] overflow-hidden
                             flex items-center justify-center"
                >
                  <img
                    src="https://placehold.co/56"
                    alt={agent.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-[11px] font-semibold text-[#111827]">{agent.name}</p>
                <p className="text-[10px] text-[#9ca3af]">⭐ {agent.rating}</p>
              </div>
            ))}
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
}