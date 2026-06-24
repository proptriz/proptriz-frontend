// /app/explore/page.tsx
'use client';

import React, { useState, useCallback, useMemo, useEffect } from "react";
import NavigationTabs from "@/components/shared/NavigationTabs";
import Footer from "@/components/shared/Footer";
import SearchBar from "@/components/shared/SearchBar";
import { getNearestProperties } from "@/services/propertyApi";
import { CategoryEnum, ListForEnum, PropertyFilterPayload, PropertyType, RenewalEnum } from "@/types/property";
import Header from "@/components/shared/Header";
import { VerticalPropertyCardSkeleton } from "@/components/skeletons/VerticalPropertyCardSkeleton";
import Link from "next/link";
import { VerticalCard } from "@/components/shared/VerticalCard";
import HorizontalCard from "@/components/shared/HorizontalCard";
import getUserPosition from "@/utils/getUserPosition";
import { useLanguage } from "@/i18n/LanguageContext";
import { useInfiniteCursorScroll } from "@/components/shared/useInfiniteCursorScroll";
import { CursorResponse } from "@/types";
import { Translations } from "@/i18n/translations";

// ─── Constants ────────────────────────────────────────────────────────────────

/**
 * Cards 0–FEATURED_AFTER_INDEX render above the Featured strip.
 * Cards FEATURED_AFTER_INDEX+1 onwards render below the Promo banners.
 * i.e. first 4 cards (2 rows × 2 cols) sit above the injected sections.
 */
const FEATURED_AFTER_INDEX = 3; // 0-based
const BANNERS_AFTER_INDEX   = 7;  // last 0-based index shown before Promo banners

// ─── Sub-components ───────────────────────────────────────────────────────────

function FeaturedStrip({
  properties,
  loading,
  t,
}: {
  properties: PropertyType[];
  loading: boolean;
  t: (key: keyof Translations) => string;
}) {
  return (
    <section className="mb-10">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[15px] font-bold text-[#111827]">{t("home_featured")}</h2>
        {properties.length > 0 && (
          <span className="text-[13px] font-semibold text-[#1e5f74]">
            {t("home_see_all")} →
          </span>
        )}
      </div>
      {/* Skeleton while first load */}
      {loading && properties.length === 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[180px] h-[120px] rounded-2xl bg-[#e5e7eb] animate-pulse"
            />
          ))}
        </div>
      ) : properties.length > 0 ? (
        <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
          {properties.slice(0, 5).map((property) => (
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
      ) : (
        /* Empty: category has no results — show a quiet placeholder row */
        <p className="text-[13px] text-[#9ca3af]">{'Empty Properties'}</p>
      )}
    </section>
  );
}

function PromoBanners({
  loading,
  hasContent,
  t,
}: {
  loading: boolean;
  hasContent: boolean;
  t: (key: keyof Translations) => string;
}) {
  return (
    <section className="my-10">
      {/* Skeleton while first batch hasn't arrived yet */}
      {loading && !hasContent ? (
        <div className="flex gap-3">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 h-[90px] rounded-2xl bg-[#e5e7eb] animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-3">
          <div
            className="flex-1 h-[90px] rounded-2xl relative overflow-hidden flex items-end p-3"
            style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
          >
            <div className="text-white text-xs font-bold leading-snug">
              🎃 {t("home_Announce")}
              <br />
              <span className="opacity-75 font-normal">{t("home_discover")}</span>
            </div>
            <span
              className="absolute top-2 right-2 bg-[#f0a500] text-[#143d4d] text-[9px]
                         font-extrabold px-2 py-0.5 rounded-md"
            >
              {t("home_sale")}
            </span>
          </div>
          <div
            className="flex-1 h-[90px] rounded-2xl relative overflow-hidden flex items-end p-3"
            style={{ background: "linear-gradient(135deg,#a06500,#f0a500)" }}
          >
            <div className="text-white text-xs font-bold leading-snug">
              ☀️ {t("home_Announce")}
              <br />
              <span className="opacity-80 font-normal">{t("home_discover")}</span>
            </div>
            <span
              className="absolute top-2 right-2 bg-white text-[#143d4d] text-[9px]
                         font-extrabold px-2 py-0.5 rounded-md"
            >
              {t("home_new")}
            </span>
          </div>
        </div>
      )}
    </section>
  );
}

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
  const [isLocationReady, setIsLocationReady] = useState(false);

  // ── Location ─────────────────────────────────────────────────────────────
  useEffect(() => {
    getUserPosition().then(([lat, lng]) => {
      setCenterLat(lat);
      setCenterLng(lng);
      setIsLocationReady(true);
    });
  }, []);

  // ── Filter handler ───────────────────────────────────────────────────────
  const onFilter = useCallback(
    (filters: PropertyFilterPayload) => {
      setListedFor(filters.listedFor);
      setMinPriceBudget(filters.priceMin ?? 0);
      setMaxPriceBudget(filters.priceMax ?? 900_000_000_000);
      setCategory(filters.propertyType);
      setSearchQuery(filters.description ?? searchQuery);
      setCenterLat(filters.location?.lat ?? null);
      setCenterLng(filters.location?.lng ?? null);
    },
    [searchQuery]
  );

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

  // ── Infinite scroll ───────────────────────────────────────────────────────
  const {
    items: listedProperties,
    loading,
    hasMore,
    setObserverTarget,
  } = useInfiniteCursorScroll<PropertyType>({
    fetcher: async (cursor, signal): Promise<CursorResponse<PropertyType[]>> => {
      const res = await getNearestProperties(
        `${queryString}&cursor=${cursor ?? ""}`,
        { signal }
      );
      if (!res) return { items: [], nextCursor: null };
      return { items: res.properties, nextCursor: res.nextCursor };
    },
    enabled: isLocationReady,
    deps: [
      isLocationReady,
      searchQuery,
      category,
      listedFor,
      minPriceBudget,
      maxPriceBudget,
      centerLat,
      centerLng,
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa] mb-14">
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
 
      {/* ── Feed ────────────────────────────────────────────────────────── */}
      <div className="flex-1 px-4 pt-5 pb-8">
 
        {/*
         * Five-zone feed layout
         *
         *  Zone 1  — cards [0–3]      Nearby grid          (2-col, 2 rows)
         *  Zone 2  — Featured strip   Always rendered       (skeleton → cards → empty)
         *  Zone 3a — cards [4–7]      Mid grid             (2-col, 2 rows)
         *  Zone 4  — Promo banners    Always rendered       (skeleton → banners)
         *  Zone 3b — cards [8+]       Infinite remainder   (2-col, load-more)
         *
         * Both interstitial sections (Zone 2 + Zone 4) live outside the grids
         * so they always mount regardless of list length.
         *
         * Observer rule: setObserverTarget attaches to whichever card is the
         * true last item in listedProperties across all three grid zones.
         */}
 
        {(() => {
          // Helper so each zone's map stays clean
          const isLastCard = (globalIndex: number) =>
            globalIndex === listedProperties.length - 1;
 
          return (
            <>
              {/* ── Zone 1: Nearby — cards 0–3 ─────────────────────────── */}
              <section className="mb-8">
                <h2 className="text-[15px] font-bold text-[#111827] mb-3">
                  {t("home_nearby")}
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {loading && listedProperties.length === 0 &&
                    Array.from({ length: 4 }).map((_, i) => (
                      <VerticalPropertyCardSkeleton key={`sk-init-${i}`} />
                    ))
                  }
                  {listedProperties.slice(0, FEATURED_AFTER_INDEX + 1).map((property, i) => (
                    <div key={property._id} ref={isLastCard(i) ? setObserverTarget : undefined}>
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
                  ))}
                </div>
              </section>
 
              {/* ── Zone 2: Featured strip — always visible ─────────────── */}
              <FeaturedStrip properties={listedProperties} loading={loading} t={t} />
 
              {/* ── Zone 3a: Mid cards — cards 4–7 ─────────────────────── */}
              {listedProperties.length > FEATURED_AFTER_INDEX + 1 && (
                <section className="mb-0">
                  <div className="grid grid-cols-2 gap-3">
                    {listedProperties
                      .slice(FEATURED_AFTER_INDEX + 1, BANNERS_AFTER_INDEX + 1)
                      .map((property, i) => {
                        const globalIndex = FEATURED_AFTER_INDEX + 1 + i;
                        return (
                          <div
                            key={property._id}
                            ref={isLastCard(globalIndex) ? setObserverTarget : undefined}
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
                                period={property.period ?? RenewalEnum.yearly}
                                listed_for={property.listed_for ?? ListForEnum.rent}
                                rating={property.average_rating ?? 4.9}
                                distance={property.distance ?? undefined}
                              />
                            </Link>
                          </div>
                        );
                      })}
                    {/* Skeleton shown here while Zone 3a is still filling */}
                    {loading &&
                      listedProperties.length > FEATURED_AFTER_INDEX &&
                      listedProperties.length <= BANNERS_AFTER_INDEX + 1 &&
                      Array.from({ length: 2 }).map((_, i) => (
                        <VerticalPropertyCardSkeleton key={`sk-mid-${i}`} />
                      ))
                    }
                  </div>
                </section>
              )}
 
              {/* ── Zone 4: Promo banners — always visible ──────────────── */}
              <PromoBanners
                loading={loading}
                hasContent={listedProperties.length > FEATURED_AFTER_INDEX + 1}
                t={t}
              />
 
              {/* ── Zone 3b: Infinite remainder — cards 8+ ──────────────── */}
              {listedProperties.length > BANNERS_AFTER_INDEX + 1 && (
                <section>
                  <div className="grid grid-cols-2 gap-3">
                    {listedProperties.slice(BANNERS_AFTER_INDEX + 1).map((property, i) => {
                      const globalIndex = BANNERS_AFTER_INDEX + 1 + i;
                      return (
                        <div
                          key={property._id}
                          ref={isLastCard(globalIndex) ? setObserverTarget : undefined}
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
                              period={property.period ?? RenewalEnum.yearly}
                              listed_for={property.listed_for ?? ListForEnum.rent}
                              rating={property.average_rating ?? 4.9}
                              distance={property.distance ?? undefined}
                            />
                          </Link>
                        </div>
                      );
                    })}
                    {/* Load-more skeleton at the bottom of Zone 3b */}
                    {loading && listedProperties.length > BANNERS_AFTER_INDEX + 1 &&
                      Array.from({ length: 2 }).map((_, i) => (
                        <VerticalPropertyCardSkeleton key={`sk-more-${i}`} />
                      ))
                    }
                  </div>
                </section>
              )}
 
              {/* ── End-of-feed ─────────────────────────────────────────── */}
              {!hasMore && !loading && listedProperties.length > 0 && (
                <p className="text-center text-sm text-[#9ca3af] py-4">
                  {t("home_seen_all")}
                </p>
              )}
 
              {/* ── Empty state ──────────────────────────────────────────── */}
              {!loading && listedProperties.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <p className="text-[#9ca3af] text-sm">{t("home_no_results")}</p>
                </div>
              )}
            </>
          );
        })()}
 
      </div>
 
      <Footer />
    </div>
  );
}