"use client";

import { useState, useContext, useCallback, useEffect, use } from "react";
import { useRouter }       from "next/navigation";
import { toast }           from "react-toastify";
import { IoClose }         from "react-icons/io5";
import { FaPlus }          from "react-icons/fa";

import {
  CategoryEnum, CurrencyEnum, ListForEnum, NegotiableEnum,
  PropertyStatusEnum, RenewalEnum,
  type Feature, type PropertyType,
} from "@/types";

import TogglePills  from "@/components/TogglePills";
import Counter      from "@/components/Counter";
import PriceInput   from "@/components/PriceInput";
import MapPreview   from "@/components/MapPreview";
import ImageManager from "@/components/ImageManager";

import { AppContext }           from "@/context/AppContextProvider";
import PropertyLocationModal    from "@/components/property/PropertyLocationSection";
import { getPropertyById, updateProperty, deleteUserProperty } from "@/services/propertyApi";
import getUserPosition           from "@/utils/getUserPosition";
import logger                    from "../../../../../logger.config.mjs";

// ─── Facility data ────────────────────────────────────────────────────────────

const FACILITY_ICONS: Record<string, string> = {
  "Parking Lot":       "🅿️",
  "Pet Allowed":       "🐾",
  "Garden":            "🌿",
  "Gym":               "🏋️",
  "Park":              "🏞️",
  "Home Theatre":      "🎬",
  "Kid's Friendly":    "👶",
  "Electricity":       "⚡",
  "Water Supply":      "💧",
  "Drainage System":   "🚿",
  "Security Services": "🔒",
};
const DEFAULT_FACILITIES = Object.keys(FACILITY_ICONS);

const CATEGORIES = [
  { value: CategoryEnum.house,    icon: "🏠", label: "House"    },
  { value: CategoryEnum.shortlet, icon: "🛎️", label: "Shortlet" },
  { value: CategoryEnum.hotel,    icon: "🏨", label: "Hotel"    },
  { value: CategoryEnum.office,   icon: "🏢", label: "Office"   },
  { value: CategoryEnum.land,     icon: "🏘️", label: "Land"    },
  { value: CategoryEnum.shop,     icon: "🏪", label: "Shop"     },
  { value: CategoryEnum.others,   icon: "🏗️", label: "Others"  },
];

// ─── Focus helpers ────────────────────────────────────────────────────────────

const onFocusTeal = (el: HTMLElement) => {
  el.style.borderColor = "#1e5f74";
  el.style.background  = "white";
  el.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.1)";
};
const onBlurTeal = (el: HTMLElement) => {
  el.style.borderColor = "#e5e7eb";
  el.style.background  = "#f9fafb";
  el.style.boxShadow   = "none";
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function EditSection({ icon, title, children }: {
  icon: string; title: string; children: React.ReactNode;
}) {
  return (
    <div
      className="bg-white rounded-2xl border border-[#e5e7eb] overflow-hidden"
      style={{ boxShadow: "0 2px 12px rgba(30,95,116,0.06)" }}
    >
      <div
        className="flex items-center gap-2 px-4 py-3 border-b border-[#f0f0f0]"
        style={{ background: "#f5f7f9" }}
      >
        <span className="text-base">{icon}</span>
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]">
          {title}
        </p>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function Spinner({ size = 16, color = "white" }: { size?: number; color?: string }) {
  return (
    <div
      className="rounded-full border-2 animate-spin flex-shrink-0"
      style={{
        width: size, height: size,
        borderColor: `${color}40`,
        borderTopColor: color,
      }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function EditPropertyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: propertyId } = use(params);
  const router             = useRouter();
  const { authUser }       = useContext(AppContext);

  // ── Fetched data ─────────────────────────────────────────────────────────
  const [property,   setProperty]   = useState<PropertyType | null>(null);
  const [isFetching, setIsFetching] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // ── Editable fields ──────────────────────────────────────────────────────
  const [formData,    setFormData]    = useState<Partial<PropertyType>>({});
  const [currency,    setCurrency]    = useState<CurrencyEnum>(CurrencyEnum.naira);
  const [negotiable,  setNegotiable]  = useState<NegotiableEnum>(NegotiableEnum.Negotiable);
  const [features,    setFeatures]    = useState<Feature[]>([]);
  const [facilities,  setFacilities]  = useState<string[]>([]);
  const [propCoordinates, setPropCoordinates] = useState<[number, number]>([9.0820, 8.6753]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);

  // ── UI flags ─────────────────────────────────────────────────────────────
  const [isSaving,          setIsSaving]          = useState(false);
  const [isDeleting,        setIsDeleting]        = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [openLocPicker,     setOpenLocPicker]     = useState(false);

  const updateForm = useCallback((key: keyof PropertyType, value: unknown) =>
    setFormData((prev) => ({ ...prev, [key]: value })),
  []);

  // ── GPS lazy-fetch ───────────────────────────────────────────────────────
  const openLocationPicker = useCallback(async () => {
    try {
      const coords = await getUserPosition();
      setUserCoordinates(coords);
    } catch (err) {
      logger.warn("getUserPosition failed:", err);
    }
    setOpenLocPicker(true);
  }, []);

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    setPropCoordinates([lat, lng]);
    toast.success(`Location updated: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, []);

  // ── Fetch property ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!propertyId) return;
    let mounted = true;
    setIsFetching(true);
    setFetchError(null);

    (async () => {
      try {
        const res = await getPropertyById(propertyId);
        if (!mounted) return;
        if (!res?._id) { setFetchError("Property not found."); return; }

        setProperty(res);
        setFormData(res);
        if (typeof res.latitude === "number" && typeof res.longitude === "number")
          setPropCoordinates([res.latitude, res.longitude]);
        setCurrency(res.currency ?? CurrencyEnum.naira);
        setNegotiable(res.negotiable ? NegotiableEnum.Negotiable : NegotiableEnum.NonNegotiable);
        setFeatures(res.features       ?? []);
        setFacilities(res.env_facilities ?? []);
      } catch (err: unknown) {
        if (mounted) {
          logger.error("getPropertyById failed:", err);
          setFetchError("Failed to load property. Please go back and try again.");
        }
      } finally {
        if (mounted) setIsFetching(false);
      }
    })();

    return () => { mounted = false; };
  }, [propertyId]);

  // ── Feature helpers ──────────────────────────────────────────────────────
  const updateFeatureName = (i: number, name: string) => {
    const next = [...features]; next[i] = { ...next[i], name }; setFeatures(next);
  };
  const updateFeatureQty = (i: number, qty: number) => {
    const next = [...features]; next[i] = { ...next[i], quantity: Math.max(1, qty) }; setFeatures(next);
  };
  const removeFeature = (i: number) => setFeatures((p) => p.filter((_, idx) => idx !== i));
  const addFeature    = ()          => setFeatures((p) => [...p, { name: "", quantity: 1 }]);

  // ── Facility helpers ─────────────────────────────────────────────────────
  const toggleFacility       = (l: string)                => setFacilities((p) => p.includes(l) ? p.filter((f) => f !== l) : [...p, l]);
  const addCustomFacility    = ()                          => setFacilities((p) => [...p, `__custom_${Date.now()}`]);
  const updateCustomFacility = (old: string, val: string) => setFacilities((p) => p.map((f) => f === old ? val : f));
  const removeCustomFacility = (val: string)               => setFacilities((p) => p.filter((f) => f !== val));
  const customFacilities     = facilities.filter((f) => !DEFAULT_FACILITIES.includes(f));

  // ── Save (text fields only — photos handled by ImageManager) ────────────
  //
  //  This is the key architectural improvement: handleSave sends ONLY the
  //  property metadata. Photos are never bundled here. ImageManager handles
  //  each photo as a separate, independently compressed API call — so a
  //  slow photo upload can never block or fail the property text update.
  //
  const handleSave = useCallback(async () => {
    if (!authUser) {
      toast.error("Please log in on Pi Browser to update this property.");
      return;
    }
    if (!formData.title?.trim())                     { toast.warn("Please enter a property title."); return; }
    if (!formData.price || Number(formData.price) <= 0) { toast.warn("Please enter a valid price."); return; }
    if (!formData.address?.trim())                   { toast.warn("Please enter the property address."); return; }

    const payload: Partial<PropertyType> = {
      ...formData,
      currency,
      negotiable:     negotiable === NegotiableEnum.Negotiable,
      latitude:       propCoordinates[0],
      longitude:      propCoordinates[1],
      features,
      env_facilities: facilities.filter((f) => f && !f.startsWith("__custom_")),
      period:         formData.listed_for === ListForEnum.rent ? formData.period : undefined,
      user:           undefined, // never overwrite ownership
      images:         undefined, // never overwrite images via this endpoint
    };

    try {
      setIsSaving(true);
      const updated = await updateProperty(propertyId, payload);

      if (updated) {
        toast.success("Property details updated! ✅");
        setProperty(updated);
        setFormData(updated);
        setCurrency(updated.currency ?? CurrencyEnum.naira);
        setNegotiable(updated.negotiable ? NegotiableEnum.Negotiable : NegotiableEnum.NonNegotiable);
        setFeatures(updated.features       ?? []);
        setFacilities(updated.env_facilities ?? []);
        if (typeof updated.latitude === "number" && typeof updated.longitude === "number")
          setPropCoordinates([updated.latitude, updated.longitude]);
        logger.info("Property updated:", updated._id);
      }
    } catch (err: unknown) {
      logger.error("updateProperty failed:", err);
      toast.error(err instanceof Error ? err.message : "Unexpected error occurred.");
    } finally {
      setIsSaving(false);
    }
  }, [authUser, formData, currency, negotiable, propCoordinates, features, facilities, propertyId]);

  // ── Delete ───────────────────────────────────────────────────────────────
  const handleDelete = useCallback(async () => {
    if (!authUser) { toast.error("Please log in on Pi Browser to delete this property."); return; }
    try {
      setIsDeleting(true);
      await deleteUserProperty(propertyId);
      toast.success("Listing deleted.");
      router.replace("/profile");
    } catch (err: unknown) {
      logger.error("deleteProperty failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to delete property.");
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  }, [authUser, propertyId, router]);

  // ── Loading / error screens ──────────────────────────────────────────────
  if (isFetching) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4"
           style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}>
        <div className="w-12 h-12 rounded-full border-4 border-[#e0f0f5] animate-spin"
             style={{ borderTopColor: "#1e5f74" }} />
        <p className="text-[13px] text-[#9ca3af]">Loading property…</p>
      </div>
    );
  }

  if (fetchError || !property) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6"
           style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}>
        <span className="text-4xl">🏚️</span>
        <p className="text-[14px] font-semibold text-[#4b5563] text-center">
          {fetchError ?? "Property not found."}
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-5 py-2.5 rounded-xl text-white text-sm font-bold"
          style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const isExpired = !!property.expired_by && new Date(property.expired_by) < new Date();

  const statusOrder: PropertyStatusEnum[] = [
    PropertyStatusEnum.available,
    PropertyStatusEnum.rented,
    PropertyStatusEnum.sold,
  ];

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="min-h-screen pb-12"
        style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── Hero header ───────────────────────────────────────────────── */}
        <div
          className="relative px-4 pt-12 pb-6"
          style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
            <div style={{ position:"absolute", top:-50, right:-50, width:180, height:180, borderRadius:"50%", border:"1px solid rgba(240,165,0,0.12)" }} />
            <div style={{ position:"absolute", bottom:-30, left:-30, width:120, height:120, borderRadius:"50%", border:"1px solid rgba(255,255,255,0.07)" }} />
          </div>

          <div className="flex items-center gap-3.5 relative z-10">
            <button
              type="button"
              onClick={() => router.back()}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                         text-white bg-white/15 border border-white/25 hover:bg-white/25
                         active:scale-95 transition-all"
              aria-label="Go back"
            >
              ←
            </button>

            <div className="flex-1 min-w-0">
              <h1 className="text-white text-[20px] font-black leading-tight"
                  style={{ fontFamily: "'Raleway', sans-serif" }}>
                Edit Property
              </h1>
              <p className="text-white/65 text-[12px] mt-0.5 truncate">
                {formData.title ?? property.title ?? "Update your listing"}
              </p>
            </div>

            {/* Status pill — tap to cycle */}
            <button
              type="button"
              onClick={() => {
                const idx = statusOrder.indexOf(formData.status as PropertyStatusEnum);
                updateForm("status", statusOrder[(idx + 1) % statusOrder.length]);
              }}
              className="px-3 py-1.5 rounded-full text-[11px] font-bold flex-shrink-0
                         border border-white/20 transition-all active:scale-95"
              style={{ background: "rgba(255,255,255,0.12)", color: "white" }}
              title="Tap to change status"
            >
              {formData.status === PropertyStatusEnum.available ? "✅" :
               formData.status === PropertyStatusEnum.rented    ? "⏳" : "❌"}
              {" "}{formData.status ?? property.status}
            </button>
          </div>

          {isExpired && (
            <div
              className="relative z-10 mt-3 flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: "rgba(239,68,68,0.18)", border: "1px solid rgba(239,68,68,0.3)" }}
            >
              <span className="text-sm">⚠️</span>
              <p className="text-[12px] text-red-200 font-semibold">
                This listing has expired. Extend the duration below to reactivate it.
              </p>
            </div>
          )}

          <div className="absolute bottom-0 left-0 right-0 h-4 bg-[#f5f7f9]"
               style={{ borderRadius: "20px 20px 0 0" }} />
        </div>

        {/* ── Sections ──────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-4 px-4 pt-2">

          {/* Category */}
          <EditSection icon="🏷️" title="Property Type">
            <div className="grid grid-cols-4 gap-2">
              {CATEGORIES.map((cat) => {
                const active = formData.category === cat.value;
                return (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => updateForm("category", cat.value)}
                    className="flex flex-col items-center gap-1 py-2.5 rounded-xl
                               border-[1.5px] text-[10px] font-medium transition-all cursor-pointer"
                    style={active
                      ? { borderColor:"#1e5f74", background:"#e0f0f5", color:"#1e5f74", fontWeight:700 }
                      : { borderColor:"#e5e7eb", color:"#4b5563" }}
                    onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"; }}
                    onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
                  >
                    <span className="text-lg">{cat.icon}</span>
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </EditSection>

          {/* Title */}
          <EditSection icon="✏️" title="Property Title">
            <div
              className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                         rounded-xl px-3.5 py-3 transition-all"
              onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
              onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
            >
              <span className="text-[#9ca3af] flex-shrink-0">🏠</span>
              <input
                type="text"
                placeholder="e.g. Modern 3-Bed Duplex in Lekki"
                value={formData.title ?? ""}
                onChange={(e) => updateForm("title", e.target.value)}
                className="w-full outline-none bg-transparent text-sm text-[#111827]
                           placeholder:text-[#9ca3af]"
              />
            </div>
          </EditSection>

          {/* Pricing */}
          <EditSection icon="💰" title="Pricing">
            <div className="flex flex-col gap-3.5">
              <TogglePills<ListForEnum>
                label="Listed For *"
                options={[
                  { label: "For Rent", value: ListForEnum.rent, icon: "🔑" },
                  { label: "For Sale", value: ListForEnum.sale, icon: "🏷️" },
                ]}
                value={(formData.listed_for ?? ListForEnum.rent) as ListForEnum}
                onChange={(val) => updateForm("listed_for", val)}
              />
              <PriceInput
                label={formData.listed_for === ListForEnum.rent ? "Rent Price" : "Sell Price"}
                value={String(formData.price ?? "0")}
                onChange={(val) => updateForm("price", val)}
                currency={currency}
                onCurrencyChange={setCurrency}
              />
              {formData.listed_for === ListForEnum.rent && (
                <TogglePills<RenewalEnum>
                  label="Tenancy Period"
                  options={[
                    { label: "Daily",   value: RenewalEnum.daily   },
                    { label: "Weekly",  value: RenewalEnum.weekly  },
                    { label: "Monthly", value: RenewalEnum.monthly },
                    { label: "Yearly",  value: RenewalEnum.yearly  },
                  ]}
                  value={(formData.period ?? RenewalEnum.yearly) as RenewalEnum}
                  onChange={(val) => updateForm("period", val)}
                />
              )}
              {/* Negotiable toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-[#e5e7eb]">
                <div>
                  <p className="text-sm font-semibold text-[#111827]">
                    {negotiable === NegotiableEnum.Negotiable ? "✅ Negotiable" : "🔒 Fixed Price"}
                  </p>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    {negotiable === NegotiableEnum.Negotiable
                      ? "Buyers can propose a different price"
                      : "The listed price is final"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setNegotiable((p) =>
                      p === NegotiableEnum.Negotiable
                        ? NegotiableEnum.NonNegotiable
                        : NegotiableEnum.Negotiable
                    )
                  }
                  className="w-12 h-6 rounded-full relative transition-colors duration-200 flex-shrink-0"
                  style={{ background: negotiable === NegotiableEnum.Negotiable ? "#1e5f74" : "#d1d5db" }}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow
                                 transition-all duration-200
                                 ${negotiable === NegotiableEnum.Negotiable ? "right-1" : "left-1"}`}
                  />
                </button>
              </div>
            </div>
          </EditSection>

          {/* Duration */}
          <EditSection icon="📅" title="Listing Duration">
            {isExpired && (
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-xl mb-3"
                style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}
              >
                <span>⏰</span>
                <p className="text-[11px] text-amber-700 font-semibold">
                  Increase the duration to extend your listing&apos;s active period.
                </p>
              </div>
            )}
            <Counter
              label="Duration"
              value={formData.duration ?? 4}
              min={1} max={52}
              suffix="weeks"
              onIncrement={() => updateForm("duration", Math.min(52, (formData.duration ?? 4) + 1))}
              onDecrement={() => updateForm("duration", Math.max(1,  (formData.duration ?? 4) - 1))}
            />
            <div className="flex justify-between mt-2">
              {[1, 4, 12, 26, 52].map((w) => (
                <button
                  key={w}
                  type="button"
                  onClick={() => updateForm("duration", w)}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-bold border-[1.5px] transition-all"
                  style={formData.duration === w
                    ? { borderColor:"#1e5f74", background:"#e0f0f5", color:"#1e5f74" }
                    : { borderColor:"#e5e7eb", background:"#f9fafb", color:"#6b7280" }}
                >
                  {w === 52 ? "1yr" : w === 26 ? "6mo" : w === 12 ? "3mo" : w === 4 ? "4wk" : "1wk"}
                </button>
              ))}
            </div>
          </EditSection>

          {/* Status */}
          <EditSection icon="📋" title="Availability Status">
            <TogglePills<PropertyStatusEnum>
              options={Object.values(PropertyStatusEnum)
                .filter((s) => s !== PropertyStatusEnum.expired)
                .map((s) => ({
                  label: s.charAt(0).toUpperCase() + s.slice(1),
                  value: s,
                  icon:  s === PropertyStatusEnum.available ? "✅"
                       : s === PropertyStatusEnum.rented    ? "⏳"
                       : "❌",
                }))}
              value={(formData.status ?? PropertyStatusEnum.available) as PropertyStatusEnum}
              onChange={(val) => updateForm("status", val)}
            />
          </EditSection>

          {/* Location */}
          <EditSection icon="📍" title="Property Location">
            <div
              className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                         rounded-xl px-3.5 py-3 mb-3 transition-all"
              onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
              onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
            >
              <span className="text-[#9ca3af] flex-shrink-0">🗺️</span>
              <input
                type="text"
                placeholder="Street address, area, city…"
                value={formData.address ?? ""}
                onChange={(e) => updateForm("address", e.target.value)}
                className="w-full outline-none bg-transparent text-sm text-[#111827]
                           placeholder:text-[#9ca3af]"
              />
            </div>
            <MapPreview
              address={formData.address ?? ""}
              coordinates={propCoordinates}
              onChangeLocation={openLocationPicker}
              hint="📌 Update the pin if your property's map location has changed — buyers search by proximity."
            />
          </EditSection>

          {/* Description */}
          <EditSection icon="📝" title="Description">
            <div
              className="flex items-start gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                         rounded-xl px-3.5 py-3 transition-all"
              onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
              onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
            >
              <span className="text-[#9ca3af] pt-0.5 flex-shrink-0">📝</span>
              <textarea
                rows={4}
                placeholder="Describe the property, its features and neighbourhood…"
                value={formData.description ?? ""}
                onChange={(e) => updateForm("description", e.target.value)}
                className="w-full outline-none bg-transparent text-sm text-[#111827]
                           placeholder:text-[#9ca3af] resize-none"
              />
            </div>
          </EditSection>

          {/* Features */}
          <EditSection icon="🛏️" title="Property Features">
            <div className="flex flex-col gap-2">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2.5 bg-[#f9fafb]
                             border-[1.5px] border-[#e5e7eb] rounded-xl transition-all"
                  onFocusCapture={(e) => { e.currentTarget.style.borderColor="#1e5f74"; e.currentTarget.style.background="white"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(30,95,116,0.08)"; }}
                  onBlurCapture={(e)  => { e.currentTarget.style.borderColor="#e5e7eb"; e.currentTarget.style.background="#f9fafb"; e.currentTarget.style.boxShadow="none"; }}
                >
                  <span className="text-[#d1d5db] select-none flex-shrink-0 cursor-grab">⠿</span>
                  <input
                    type="text"
                    placeholder="Feature name"
                    value={feature.name}
                    onChange={(e) => updateFeatureName(index, e.target.value)}
                    className="flex-1 bg-transparent outline-none text-sm
                               text-[#111827] placeholder:text-[#9ca3af] min-w-0"
                  />
                  <div className="flex items-center border-[1.5px] border-[#e5e7eb] rounded-lg overflow-hidden flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => updateFeatureQty(index, feature.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center transition-colors"
                      style={{ background:"#e0f0f5", color:"#1e5f74" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background="#1e5f74"; (e.currentTarget as HTMLButtonElement).style.color="white"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background="#e0f0f5"; (e.currentTarget as HTMLButtonElement).style.color="#1e5f74"; }}
                    >−</button>
                    <span className="w-7 text-center text-[13px] font-bold text-[#111827]">
                      {feature.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateFeatureQty(index, feature.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center transition-colors"
                      style={{ background:"#e0f0f5", color:"#1e5f74" }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background="#1e5f74"; (e.currentTarget as HTMLButtonElement).style.color="white"; }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background="#e0f0f5"; (e.currentTarget as HTMLButtonElement).style.color="#1e5f74"; }}
                    >+</button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className="w-6 h-6 rounded-full bg-red-50 text-red-400 flex items-center
                               justify-center flex-shrink-0 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <IoClose size={12} />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addFeature}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5
                         rounded-xl border-[1.5px] border-dashed text-[12px] font-semibold
                         bg-transparent transition-all"
              style={{ borderColor:"#1e5f74", color:"#1e5f74" }}
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.background = "#e0f0f5"}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.background = "transparent"}
            >
              <FaPlus size={10} /> Add Feature
            </button>
          </EditSection>

          {/* Facilities */}
          <EditSection icon="🌿" title="Environment & Facilities">
            <div className="flex flex-wrap gap-2 mb-3">
              {DEFAULT_FACILITIES.map((facility) => {
                const selected = facilities.includes(facility);
                return (
                  <button
                    key={facility}
                    type="button"
                    onClick={() => toggleFacility(facility)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                               border-[1.5px] text-[11px] font-medium transition-all"
                    style={selected
                      ? { borderColor:"#1e5f74", background:"#e0f0f5", color:"#1e5f74", fontWeight:700 }
                      : { borderColor:"#e5e7eb", background:"#f9fafb", color:"#4b5563" }}
                    onMouseEnter={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor="#1e5f74"; }}
                    onMouseLeave={(e) => { if (!selected) (e.currentTarget as HTMLButtonElement).style.borderColor="#e5e7eb"; }}
                  >
                    <span>{FACILITY_ICONS[facility]}</span>
                    {facility}
                  </button>
                );
              })}
            </div>

            {customFacilities.map((fac) => (
              <div
                key={fac}
                className="flex items-center gap-2 mt-2 px-3 py-2.5 bg-[#fffbeb]
                           border-[1.5px] border-dashed border-[#f0a500] rounded-xl transition-all"
                onFocusCapture={(e) => { e.currentTarget.style.borderStyle="solid"; e.currentTarget.style.boxShadow="0 0 0 3px rgba(240,165,0,0.12)"; }}
                onBlurCapture={(e)  => { e.currentTarget.style.borderStyle="dashed"; e.currentTarget.style.boxShadow="none"; }}
              >
                <span className="text-[#d97706] text-sm flex-shrink-0">✏️</span>
                <input
                  type="text"
                  placeholder="Custom facility name…"
                  value={fac.startsWith("__custom_") ? "" : fac}
                  onChange={(e) => updateCustomFacility(fac, e.target.value)}
                  className="flex-1 bg-transparent outline-none text-sm
                             text-[#111827] placeholder:text-[#d97706]"
                />
                <button
                  type="button"
                  onClick={() => removeCustomFacility(fac)}
                  className="text-[#f59e0b] hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <IoClose size={14} />
                </button>
              </div>
            ))}

            <button
              type="button"
              onClick={addCustomFacility}
              className="w-full mt-3 flex items-center justify-center gap-2 py-2.5
                         rounded-xl border-[1.5px] border-dashed text-[12px] font-semibold transition-all"
              style={{ borderColor:"#f0a500", color:"#c88400", background:"#fffbeb" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background="#fef3c7"; (e.currentTarget as HTMLButtonElement).style.borderStyle="solid"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background="#fffbeb"; (e.currentTarget as HTMLButtonElement).style.borderStyle="dashed"; }}
            >
              <FaPlus size={10} /> Add Custom Facility
            </button>
          </EditSection>

          {/* ── Photos via ImageManager ──────────────────────────────────── */}
          {/*
              Photos are fully decoupled from the Save Changes button.
              ImageManager uploads each photo immediately and independently,
              with compression applied before every upload.
              No photo bytes ever travel through handleSave.
          */}
          {property._id && (
            <EditSection icon="📸" title="Property Photos">
              <div
                className="flex items-start gap-2 px-3 py-2.5 rounded-xl mb-3"
                style={{ background: "#e0f0f5", border: "1px solid rgba(30,95,116,0.12)" }}
              >
                <span className="text-sm flex-shrink-0">ℹ️</span>
                <p className="text-[11px] text-[#1e5f74] font-medium leading-relaxed">
                  Photos save instantly when added or removed — independent of the
                  &ldquo;Save Changes&rdquo; button below. Each photo is auto-optimised before upload.
                </p>
              </div>
              <ImageManager
                propertyId={property._id}
                images={property.images ?? []}
              />
            </EditSection>
          )}

          {/* ── Save Changes ─────────────────────────────────────────────── */}
          {authUser ? (
            <button
              type="button"
              disabled={isSaving}
              onClick={handleSave}
              className="w-full py-4 rounded-2xl text-white text-[15px] font-bold
                         flex items-center justify-center gap-2.5 mt-2
                         transition-all duration-200 active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background: "linear-gradient(135deg,#143d4d,#1e5f74)",
                boxShadow:  isSaving ? "none" : "0 4px 20px rgba(30,95,116,0.38)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {isSaving ? <><Spinner /> Saving…</> : "✓ Save Changes"}
            </button>
          ) : (
            <button
              disabled
              className="w-full py-4 rounded-2xl text-white text-[15px] font-bold
                         flex items-center justify-center gap-2.5 mt-2
                         opacity-60 cursor-not-allowed"
              style={{ background: "#9ca3af", fontFamily: "'Raleway', sans-serif" }}
            >
              🔒 Login on Pi Browser to Save
            </button>
          )}

          {/* ── Danger zone ───────────────────────────────────────────────── */}
          <div
            className="rounded-2xl border border-red-100 p-4 text-center"
            style={{ background: "#fff5f5" }}
          >
            <p className="text-[12px] text-red-400 mb-3">
              Permanently remove this listing and all its data. This cannot be undone.
            </p>
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="text-[13px] font-bold text-red-500 px-5 py-2 rounded-xl
                         border border-red-200 bg-white transition-all active:scale-95
                         hover:bg-red-500 hover:text-white hover:border-red-500"
            >
              🗑️ Delete Listing
            </button>
          </div>
        </div>
      </div>

      {/* ── Location modal ────────────────────────────────────────────────── */}
      <PropertyLocationModal
        isOpen={openLocPicker}
        onClose={() => setOpenLocPicker(false)}
        userCoordinates={propCoordinates}
        fallbackCoordinates={userCoordinates}
        onLocationSelect={handleLocationSelect}
      />

      {/* ── Delete confirmation sheet ────────────────────────────────────── */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-10 h-1 bg-[#e5e7eb] rounded-full mx-auto mb-5" />
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3"
                   style={{ background: "#fff5f5" }}>
                🗑️
              </div>
              <h2 className="text-[17px] font-black text-[#111827] mb-1"
                  style={{ fontFamily: "'Raleway', sans-serif" }}>
                Delete this listing?
              </h2>
              <p className="text-[13px] text-[#6b7280] leading-relaxed max-w-xs">
                <strong className="text-[#111827]">{property.title}</strong> will be
                permanently removed. This action cannot be undone.
              </p>
            </div>
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDelete}
                className="w-full py-3.5 rounded-xl text-white font-bold text-sm
                           flex items-center justify-center gap-2 transition-all
                           disabled:opacity-60"
                style={{ background: "#ef4444" }}
              >
                {isDeleting
                  ? <><Spinner color="white" size={16} /> Deleting…</>
                  : "Yes, Delete Listing"}
              </button>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="w-full py-3.5 rounded-xl text-[#4b5563] font-semibold text-sm
                           border border-[#e5e7eb] bg-white transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}