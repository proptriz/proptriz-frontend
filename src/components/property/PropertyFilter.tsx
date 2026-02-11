import React, { useEffect, useRef, useState } from "react";
import { AppButton as Button } from "@/components/shared/buttons";
import { FiSearch, FiMapPin } from "react-icons/fi";
import ToggleButtons from "../ToggleButtons";
import { CategoryEnum, PropertyFilterPayload } from "@/types";
import { styles } from "@/constant";

const PRICE_LIMITS = {
  rent: 1_000_000_000,
  sale: 900_000_000_000,
};

const getPriceMax = (listedFor: string) =>
  listedFor === "rent"
    ? PRICE_LIMITS.rent
    : PRICE_LIMITS.sale;

const getBudgetPresets = (listedFor: string, PRICE_MAX: number) => {
  if (listedFor === "rent") {
    return [
      { label: "Any", min: 0, max: PRICE_MAX },
      { label: "Under ₦100k", min: 0, max: 100_000 },
      { label: "Under ₦500k", min: 100_000, max: 500_000 },
      { label: "₦500k – ₦2M", min: 500_000, max: 2_000_000 },
      { label: "₦2M – ₦5M", min: 2_000_000, max: 5_000_000 },
      { label: "₦5M+", min: 5_000_000, max: PRICE_MAX },
    ];
  }

  // sale
  return [
    { label: "Any", min: 0, max: PRICE_MAX },
    { label: "Under ₦5M", min: 0, max: 5_000_000 },
    { label: "₦5M – ₦20M", min: 5_000_000, max: 20_000_000 },
    { label: "₦20M – ₦100M", min: 20_000_000, max: 100_000_000 },
    { label: "₦100M+", min: 100_000_000, max: PRICE_MAX },
  ];
};

interface FilterProps {
  onFilter: (filters: PropertyFilterPayload) => void;
  setTogglePopup?: (value: boolean) => void;
}

const PropertyFilter: React.FC<FilterProps> = ({ onFilter, setTogglePopup }) => {
  const abortRef = useRef<AbortController | null>(null);

  const [locationQuery, setLocationQuery] = useState("");
  const [locationResult, setLocationResult] = useState<any>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  const [filters, setFilters] = useState({
    propertyType: CategoryEnum.house,
    listedFor: "all" as "all" | "sale" | "rent",
    price: [0, PRICE_LIMITS.sale] as [number, number],
    description: "",
  });

  /* ---------------- Location Search (Forward + Reverse) ---------------- */

  useEffect(() => {
    if (!locationQuery || locationQuery.length < 3) return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    const fetchLocation = async () => {
      try {
        setLoadingLocation(true);

        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
            new URLSearchParams({
              q: locationQuery,
              format: "json",
              addressdetails: "1",
              countrycodes: "ng",
              limit: "1",
            }),
          {
            signal: controller.signal,
            headers: { "Accept-Language": "en" },
          }
        );

        const data = await res.json();
        if (!data?.length) return;

        const item = data[0];

        setLocationResult({
          query: locationQuery,
          lat: Number(item.lat),
          lng: Number(item.lon),
          name: item.display_name.split(",")[0],
          lga: item.address?.county || item.address?.city_district,
          state: item.address?.state,
        });
      } catch (err) {
        if ((err as any).name !== "AbortError") {
          // console.error("Geocoding failed", err);
        }
      } finally {
        setLoadingLocation(false);
      }
    };

    const debounce = setTimeout(fetchLocation, 500);
    return () => {
      clearTimeout(debounce);
      controller.abort();
    };
  }, [locationQuery]);

  /* ---------------- Price Handlers ---------------- */
  
  const PRICE_MAX = getPriceMax(filters.listedFor);
  const BUDGET_PRESETS = getBudgetPresets(filters.listedFor, PRICE_MAX);

  useEffect(() => {
    setFilters((f) => ({
      ...f,
      price: [
        Math.min(f.price[0], PRICE_MAX),
        Math.min(f.price[1], PRICE_MAX),
      ],
    }));
  }, [filters.listedFor]);

  const formatMoneyInput = (v: string) =>
    v.replace(/[^\d]/g, "");

  const handleMinChange = (raw: string) => {
    const n = Number(formatMoneyInput(raw) || 0);
    setFilters((f) => ({
      ...f,
      price: [Math.min(n, f.price[1]), f.price[1]],
    }));
  };

  const handleMaxChange = (raw: string) => {
    const n = Number(formatMoneyInput(raw) || PRICE_MAX);
    setFilters((f) => ({
      ...f,
      price: [f.price[0], Math.min(Math.max(n, f.price[0]), PRICE_MAX)],
    }));
  };

  /* ---------------- Submit ---------------- */

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onFilter({
      location: locationResult || undefined,
      propertyType: filters.propertyType,
      listedFor: filters.listedFor,
      priceMin: filters.price[0],
      priceMax: filters.price[1],
      description: filters.description || undefined,
    });

    setTogglePopup?.(false);
  };

  const handleResetFilter = () => {
    // clear location
    setLocationQuery("");
    setLocationResult(null);

    // reset filters
    setFilters({
      propertyType: CategoryEnum.house,
      listedFor: "all" as "all" | "sale" | "rent",
      price: [0, PRICE_LIMITS.sale] as [number, number],
      description: ""
    });

    // optional: immediately trigger refresh with cleared filters
    onFilter({
      location: undefined,
      propertyType: CategoryEnum.house,
      listedFor: "all",
      priceMin: null,
      priceMax: null,
      description: undefined,
    });

    // optional — only if you WANT popup closed on reset
    // setTogglePopup?.(false);
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-lg p-4 space-y-6"
    >
      {/* ---------------- Location ---------------- */}
      <div>
        <label className={styles.H2}>
          Location Search
        </label>
        
        <div className="relative">
          <FiMapPin className="absolute left-3 top-3 text-gray-400" />
          
          <input
            value={locationQuery}
            onChange={(e) => setLocationQuery(e.target.value)}
            placeholder="Search city, area or landmark"
            className="w-full pl-10 pr-3 py-2 border rounded-md focus:ring-estate-primary"
          />
        </div>

        {loadingLocation && (
          <p className="text-xs text-gray-500 mt-1">Searching location…</p>
        )}

        {locationResult && (
          <div className="mt-2 p-3 rounded-md card-bg border text-sm">
            <div className="flex items-center w-full">
              <img
                src={`https://static-maps.yandex.ru/1.x/?lang=en_US&ll=${locationResult.lng},${locationResult.lat}&z=12&size=200,100&l=map&pt=${locationResult.lng},${locationResult.lat},pm2rdm`}
                alt="Location Map"
                className="w-24 h-12 rounded-md mr-3 border"
              />
              
              <div className="w-full">
                {/* <div className="text-xs font-small text-blue-700">Location identified</div> */}
                <div className="text-md font-medium">{locationResult.name}</div>
                
                <div className="text-gray-700">
                  {locationResult.lga && `${locationResult.lga}, `}
                  {locationResult.state}
                </div>

                <div className="text-right text-xs text-gray-500">
                  {Math.abs(locationResult.lat).toFixed(4)}° {locationResult.lat >= 0 ? 'N' : 'S'}, {Math.abs(locationResult.lng).toFixed(4)}° {locationResult.lng >= 0 ? 'E' : 'W'}
                </div>
              </div>              
            </div>            
          </div>
        )}
      </div>

      {/* ---------------- Property Type ---------------- */}
      <div>        
        <div className="overflow-x-auto">
          <ToggleButtons<CategoryEnum>
            label={"Property Type"}
            options={Object.values(CategoryEnum)}
            selected={filters.propertyType as CategoryEnum}
            onChange={(value) =>
              setFilters((f) => ({ ...f, propertyType: value as CategoryEnum }))
            }
          />
        </div>
      </div>

      {/* ---------------- Sale / Rent ---------------- */}
      <div className="">
        {/* <label htmlFor="listedFor">Listed For</label> */}
        <ToggleButtons
          label="Listed For"
          options={["all", "sale", "rent"]}
          selected={filters.listedFor}
          onChange={(value) =>
            setFilters((f) => ({ ...f, listedFor: value as "all" | "sale" | "rent" }))
          }
        />
      </div>

      {/* ---------------- Price (Modern UX) ---------------- */}
      <div>
        <label className={styles.H2}>
          Price Budget (₦ / {filters.listedFor === "rent" ? "year" : "total"})
        </label>

        {/* Presets */}
        <div className="flex flex-wrap gap-2 mb-3 mt-2">
          {BUDGET_PRESETS.map((p) => {
            const active =
              filters.price[0] === p.min &&
              filters.price[1] === p.max;

            return (
              <button
                key={p.label}
                type="button"
                onClick={() =>
                  setFilters((f) => ({ ...f, price: [p.min, p.max] }))
                }
                className={`px-3 py-1.5 rounded-full text-xs border transition
                ${
                  active
                    ? "bg-primary text-white border-primary"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-2 gap-3">
          <input
            inputMode="numeric"
            value={filters.price[0] || ""}
            onChange={(e) => handleMinChange(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="Min"
          />

          <input
            inputMode="numeric"
            value={
              filters.price[1] >= PRICE_MAX
                ? ""
                : filters.price[1]
            }
            onChange={(e) => handleMaxChange(e.target.value)}
            className="w-full p-2 border rounded-md"
            placeholder="No limit"
          />
        </div>

        <div className="text-xs text-gray-600 mt-2">
          Selected: ₦{filters.price[0].toLocaleString()} —{" "}
          {filters.price[1] >= PRICE_MAX
            ? "No limit"
            : `₦${filters.price[1].toLocaleString()}`}
        </div>
      </div>

      {/* ---------------- Description Query ---------------- */}
      <div>
        <label className={styles.H2}>
          Describe what you need
        </label>
        <input
          value={filters.description}
          onChange={(e) =>
            setFilters((f) => ({ ...f, description: e.target.value }))
          }
          placeholder="e.g. furnished, fenced, parking lot"
          className="w-full p-2 border rounded-md mt-2"
        />
      </div>

      {/* ---------------- Actions ---------------- */}
      <div className="flex justify-between gap-2 pt-2">
        <Button type="button" 
          className={`px-3 py-1.5 rounded-lg border transition bg-gray-50 text-gray-700 border-gray-400 hover:bg-gray-100`}
          onClick={handleResetFilter}
        >
          Reset
        </Button>

        <Button 
        type="submit" 
        className="bg-primary text-white"
        onClick={handleSubmit}
        >
          <FiSearch className="mr-2" />
          Apply Filters
        </Button>
      </div>
    </form>
  );
};

export default PropertyFilter;
