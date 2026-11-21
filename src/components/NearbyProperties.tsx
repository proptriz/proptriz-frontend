"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { VerticalCard } from "@/components/shared/VerticalCard";
import { getCollocatedByTier, type CollocatedTier } from "@/services/propertyApi";
import { PropertyType, RenewalEnum } from "@/types/property";
import { useLanguage } from "@/i18n/LanguageContext";
import { sameTierKey } from "@/utils/locationLabels";

type Tier = Exclude<CollocatedTier, "auto">;

// Tabs offered when the listing supports them, in this order.
const TAB_ORDER: Tier[] = ["area", "subregion", "distance"];

/**
 * "Nearby properties" with tabs: Same area / Same LGA / Nearest (Nigeria uses postcode levels,
 * other countries use neighbourhood and region names). Opens on the most specific tab that has results.
 */
export default function NearbyProperties({ property }: { property: PropertyType }) {
  const { t } = useLanguage();
  const propertyId = property._id;
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [active, setActive] = useState<Tier | null>(null);
  const [items, setItems] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);

  // First load: let the server pick the most specific tier that has listings
  useEffect(() => {
    if (!propertyId) return;
    let alive = true;
    setLoading(true);
    getCollocatedByTier(propertyId, "auto").then((res) => {
      if (!alive) return;
      setTiers(res.tiers);
      setActive(res.match_tier);
      setItems(res.properties);
      setLoading(false);
    });
    return () => { alive = false; };
  }, [propertyId]);

  const pick = async (tier: Tier) => {
    if (tier === active) return;
    setActive(tier);
    setLoading(true);
    const res = await getCollocatedByTier(propertyId, tier);
    setItems(res.properties);
    setLoading(false);
  };

  const tabs = TAB_ORDER.filter((tier) => tiers.includes(tier) || tier === active);
  if (!loading && items.length === 0 && tabs.length <= 1) return null; // nothing nearby at all

  return (
    <div className="bg-white rounded-2xl border border-[#e5e7eb] p-4">
      <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                    flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#1e5f74] inline-block" />
        {t("detail_nearby")}
      </p>

      {tabs.length > 1 && (
        <div className="flex flex-wrap gap-1.5 mb-3" role="tablist">
          {tabs.map((tier) => (
            <button
              key={tier}
              type="button"
              role="tab"
              aria-selected={active === tier}
              onClick={() => pick(tier)}
              className={`px-3 py-1.5 rounded-full text-[11px] border-[1.5px] transition-all duration-200 ${
                active === tier
                  ? "bg-[#143d4d] border-[#143d4d] text-white font-bold"
                  : "bg-white text-[#4b5563] border-[#e5e7eb] font-medium hover:border-[#1e5f74]"
              }`}
            >
              {t(sameTierKey(tier, property.country))}
            </button>
          ))}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map((i) => (
            <div key={i} className="h-40 rounded-2xl bg-[#f3f4f6] animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="text-[12px] text-[#6b7280] py-3">{t("loc_none_in_tier")}</p>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {items.slice(0, 4).map((item) => (
            <Link key={item._id} href={`/property/details/${item._id}`}>
              <VerticalCard
                id={item._id}
                name={item.title}
                currency={item.currency}
                price={item.price}
                category={item.category}
                listed_for={item.listed_for}
                address={item.address}
                image={item.banner}
                period={item.period ?? RenewalEnum.yearly}
                distance={item.distance ?? undefined}
                rating={item.average_rating ?? 4.9}
              />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
