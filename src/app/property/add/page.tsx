"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

import {
  CategoryEnum, CurrencyEnum, ListForEnum, NegotiableEnum,
  PropertyStatusEnum, RenewalEnum,
  type PropertyFormData, type WizardStep,
} from "@/types/property";

import StepProgress from "@/components/StepProgress";
import Step1Basics  from "@/components/Step1Basics";
import Step2Details from "@/components/Step2Details";
import Step3Preview from "@/components/Step3Preview";

import { AppContext }            from "@/context/AppContextProvider";
import PropertyLocationModal     from "@/components/property/PropertyLocationSection";
import { createProperty }        from "@/services/propertyApi";
import getUserPosition            from "@/utils/getUserPosition";
import logger                     from "../../../../logger.config.mjs";

// ─── Default form state ───────────────────────────────────────────────────────

const DEFAULT_FORM: PropertyFormData = {
  title:       "",
  description: "",
  address:     "",
  price:       "0",
  currency:    CurrencyEnum.naira,
  listedFor:   ListForEnum.rent,
  category:    CategoryEnum.house,
  status:      PropertyStatusEnum.available,
  renewPeriod: RenewalEnum.yearly,
  negotiable:  NegotiableEnum.Negotiable,
  duration:    4,
  features:    [],
  facilities:  [],
  coordinates: [9.0820, 8.6753],   // Nigeria geographic centre
  photos:      [],
};

// ─── Validation ───────────────────────────────────────────────────────────────

function validateStep(step: WizardStep, data: PropertyFormData): string | null {
  if (step === 1) {
    if (!data.title.trim())                     return "Please enter a property title.";
    if (!data.price || Number(data.price) <= 0) return "Please enter a valid price.";
    if (!data.address.trim())                   return "Please enter the property address.";
  }
  if (step === 2) {
    if (data.photos.length === 0) return "Please add at least one property photo.";
  }
  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const router              = useRouter();
  const { authUser }        = useContext(AppContext);

  const [formData, setFormData]         = useState<PropertyFormData>(DEFAULT_FORM);
  const [currentStep, setCurrentStep]   = useState<WizardStep>(1);
  const [isLoading, setIsLoading]       = useState(false);
  const [openLocPicker, setOpenLocPicker] = useState(false);
  // User's own GPS position — used as the map centre when opening the picker
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);

  const update = useCallback((partial: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Lazy-fetch user GPS (only when they first open the location picker) ──
  const openLocationPicker = useCallback(async () => {
    try {
      const coords = await getUserPosition();
      setUserCoordinates(coords);
    } catch (err) {
      logger.warn("getUserPosition failed:", err);
    }
    setOpenLocPicker(true);
  }, []);

  // ── Navigation ──────────────────────────────────────────────────────────
  const goNext = () => {
    const err = validateStep(currentStep, formData);
    if (err) { toast.warn(err); return; }
    if (currentStep < 3) setCurrentStep((p) => (p + 1) as WizardStep);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((p) => (p - 1) as WizardStep);
    else router.back();
  };

  // ── Location selection callback from PropertyLocationModal ──────────────
  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    update({ coordinates: [lat, lng] });
    toast.success(`Location pinned: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, [update]);

  // ── Submit ──────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (!authUser) {
      toast.error("Please log in on Pi Browser to list a property.");
      return;
    }

    const fd = new FormData();
    fd.append("title",       formData.title);
    fd.append("price",       formData.price);
    fd.append("currency",    formData.currency);
    fd.append("address",     formData.address);
    fd.append("listed_for",  formData.listedFor);
    fd.append("category",    formData.category);
    fd.append("description", formData.description);
    fd.append("duration",    formData.duration.toString());
    fd.append("negotiable",  String(formData.negotiable === NegotiableEnum.Negotiable));
    fd.append("status",      formData.status);
    fd.append("latitude",    String(formData.coordinates[0]));
    fd.append("longitude",   String(formData.coordinates[1]));
    fd.append("features",    JSON.stringify(formData.features));
    fd.append("env_facilities", JSON.stringify(
      formData.facilities.filter((f) => f && !f.startsWith("__custom_"))
    ));
    if (formData.listedFor === ListForEnum.rent) {
      fd.append("period", formData.renewPeriod.toLowerCase());
    }
    formData.photos.forEach((photo) => fd.append("images", photo));

    try {
      setIsLoading(true);
      const result = await createProperty(fd);
      logger.info("Property created:", result);
      toast.success("Property successfully listed! 🎉");
      setFormData(DEFAULT_FORM);
      setCurrentStep(1);
      router.push("/properties");
    } catch (err: unknown) {
      logger.error("createProperty failed:", err);
      toast.error(err instanceof Error ? err.message : "Failed to add property.");
    } finally {
      setIsLoading(false);
    }
  };

  // ── CTA label ───────────────────────────────────────────────────────────
  const ctaLabel =
    currentStep === 1 ? "Add Photos & Details →"
    : currentStep === 2 ? "Preview Listing →"
    : isLoading       ? "Publishing…"
    : "Publish Property 🎉";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="min-h-screen pb-10"
        style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Teal hero header ──────────────────────────────────────────── */}
        <div
          className="px-5 pt-14 pb-0"
          style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
        >
          {/* Decorative rings */}
          <div className="absolute inset-x-0 top-0 overflow-hidden h-36 pointer-events-none" aria-hidden>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(240,165,0,0.12)" }} />
            <div style={{ position: "absolute", top: 20, right: 60, width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          <div className="flex items-center gap-3.5 pb-5 relative z-10">
            {/* Back button */}
            <button
              type="button"
              onClick={goBack}
              className="w-9 h-9 rounded-full flex items-center justify-center
                         text-white text-sm flex-shrink-0 transition-colors
                         bg-white/15 border border-white/25 hover:bg-white/25 active:scale-95"
              aria-label="Go back"
            >
              ←
            </button>

            {/* Title */}
            <div className="flex-1 min-w-0">
              <h1
                className="text-white text-[22px] font-black leading-tight"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                Add Property
              </h1>
              <p className="text-white/70 text-[13px] mt-0.5">
                Hi {authUser?.display_name ?? "there"}, let&apos;s list your space
              </p>
            </div>

            {/* Brand mark */}
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-sm font-black"
                style={{ background: "#f0a500", color: "#143d4d", fontFamily: "'Raleway',sans-serif" }}
              >
                P
              </div>
              <span
                className="text-white font-black text-[15px] tracking-tight"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <span style={{ color: "#f0a500" }}>Prop</span>Triz
              </span>
            </div>
          </div>

          {/* Step progress */}
          <StepProgress currentStep={currentStep} />
        </div>

        {/* ── Form body ─────────────────────────────────────────────────── */}
        <div className="px-4 pt-5 pb-4">
          {currentStep === 1 && (
            <Step1Basics
              data={formData}
              onUpdate={update}
              onOpenLocationPicker={openLocationPicker}
            />
          )}
          {currentStep === 2 && (
            <Step2Details data={formData} onUpdate={update} />
          )}
          {currentStep === 3 && (
            <Step3Preview
              data={formData}
              onUpdate={update}
              onOpenLocationPicker={openLocationPicker}
            />
          )}
        </div>

        {/* ── Bottom action bar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 mt-4 pb-6">
          {/* Back circle — steps 2+ */}
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="w-[50px] h-[50px] rounded-full bg-white border-[1.5px] border-[#e5e7eb]
                         flex items-center justify-center text-lg text-[#4b5563] flex-shrink-0
                         shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all active:scale-95"
              onMouseEnter={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"}
              onMouseLeave={(e) => (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"}
              aria-label="Previous step"
            >
              ←
            </button>
          )}

          {/* Primary CTA */}
          {currentStep === 3 && !authUser ? (
            // Not logged in — disabled state with explanation
            <button
              disabled
              className="flex-1 py-[14px] rounded-xl text-white text-[15px] font-bold
                         flex items-center justify-center gap-2 opacity-60 cursor-not-allowed"
              style={{ background: "#9ca3af" }}
            >
              🔒 Login on Pi Browser to Publish
            </button>
          ) : (
            <button
              type="button"
              onClick={currentStep < 3 ? goNext : handleSubmit}
              disabled={isLoading}
              className="flex-1 py-[14px] rounded-xl text-white text-[15px] font-bold
                         flex items-center justify-center gap-2
                         transition-all duration-200 active:scale-[0.98]
                         disabled:opacity-60 disabled:cursor-not-allowed"
              style={{
                background:  isLoading ? "#9ca3af" : "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
                boxShadow:   isLoading ? "none" : "0 4px 20px rgba(30,95,116,0.4)",
                fontFamily:  "'Raleway', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(30,95,116,0.55)";
              }}
              onMouseLeave={(e) => {
                if (!isLoading)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(30,95,116,0.4)";
              }}
            >
              {isLoading && (
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                </svg>
              )}
              {ctaLabel}
            </button>
          )}
        </div>
      </div>

      {/* ── Property Location Modal ───────────────────────────────────────── */}
      <PropertyLocationModal
        isOpen={openLocPicker}
        onClose={() => setOpenLocPicker(false)}
        userCoordinates={formData.coordinates}
        fallbackCoordinates={userCoordinates}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}