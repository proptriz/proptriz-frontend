"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

// ─── Types ───────────────────────────────────────────────────────────────────
import {
  CategoryEnum,
  CurrencyEnum,
  ListForEnum,
  NegotiableEnum,
  PropertyStatusEnum,
  RenewalEnum,
  type PropertyFormData,
  type WizardStep,
} from "@/types/property";

// ─── Components ──────────────────────────────────────────────────────────────
import StepProgress from "@/components/StepProgress";
import Step1Basics from "@/components/Step1Basics";
import Step2Details from "@/components/Step2Details";
import Step3Preview from "@/components/Step3Preview";

// ─── Services / Context ──────────────────────────────────────────────────────
// Adjust these imports to match your actual project paths:
import { AppContext } from "@/context/AppContextProvider";
import { createProperty } from "@/services/propertyApi";
import LocationPickerMap from "@/components/LocationPickerMap";

// ─── Default form state ──────────────────────────────────────────────────────
const DEFAULT_FORM: PropertyFormData = {
  title: "",
  description: "",
  address: "",
  price: "0.00",
  currency: CurrencyEnum.naira,
  listedFor: ListForEnum.rent,
  category: CategoryEnum.house,
  status: PropertyStatusEnum.available,
  renewPeriod: RenewalEnum.yearly,
  negotiable: NegotiableEnum.Negotiable,
  duration: 4,
  features: [],
  facilities: [],
  coordinates: [6.4281, 3.4219], // Lagos default
  photos: [],
};

// ─── Step validation ─────────────────────────────────────────────────────────
function validateStep(step: WizardStep, data: PropertyFormData): string | null {
  if (step === 1) {
    if (!data.title.trim()) return "Please enter a property title.";
    if (data.photos.length === 0) return "Please upload at least one photo.";
  }
  if (step === 2) {
    if (!data.price || Number(data.price) <= 0) return "Please enter a valid price.";
  }
  if (step === 3) {
    if (!data.address.trim()) return "Please enter the property address.";
  }
  return null;
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function AddPropertyPage() {
  const router = useRouter();
  const { authUser } = useContext(AppContext);  // uncomment when wired up

  const [formData, setFormData] = useState<PropertyFormData>(DEFAULT_FORM);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [openLocPicker, setOpenLocPicker] = useState(false);

  const update = useCallback((partial: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Navigation ─────────────────────────────────────────────────────────────
  const goNext = () => {
    const error = validateStep(currentStep, formData);
    if (error) {
      toast.warn(error);
      return;
    }
    if (currentStep < 3) setCurrentStep((prev) => (prev + 1) as WizardStep);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((prev) => (prev - 1) as WizardStep);
    else router.back();
  };

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const error = validateStep(3, formData);
    if (error) { toast.warn(error); return; }

    const fd = new FormData();
    fd.append("title", formData.title);
    fd.append("price", formData.price);
    fd.append("currency", formData.currency);
    fd.append("address", formData.address);
    fd.append("listed_for", formData.listedFor);
    fd.append("category", formData.category);
    fd.append("description", formData.description);
    fd.append("duration", formData.duration.toString());
    fd.append("negotiable", (formData.negotiable === NegotiableEnum.Negotiable).toString());
    fd.append("status", formData.status);
    fd.append("latitude", String(formData.coordinates[0]));
    fd.append("longitude", String(formData.coordinates[1]));
    fd.append("features", JSON.stringify(formData.features));
    fd.append("env_facilities", JSON.stringify(formData.facilities));
    if (formData.listedFor === ListForEnum.rent) {
      fd.append("period", formData.renewPeriod.toLowerCase());
    }
    formData.photos.forEach((photo) => fd.append("images", photo));

    try {
      setIsLoading(true);
      await createProperty(fd);  // uncomment when wired up
      await new Promise((r) => setTimeout(r, 1200)); // remove: demo delay
      toast.success("Property successfully listed! 🎉");
      setFormData(DEFAULT_FORM);
      setCurrentStep(1);
      router.push("/properties");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to add property. Please try again.";
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  // ── Location picker callback ───────────────────────────────────────────────
  const handleLocationSelect = (lat: number, lng: number) => {
    update({ coordinates: [lat, lng] });
    toast.success(`Location pinned: (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
  };

  // ── CTA label ─────────────────────────────────────────────────────────────
  const ctaLabel =
    currentStep === 1
      ? "Continue to Details →"
      : currentStep === 2
      ? "Review Listing →"
      : isLoading
      ? "Publishing…"
      : "Publish Property 🎉";

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="min-h-screen pb-8"
        style={{ background: "#f7f8fa", fontFamily: "'DM Sans', sans-serif" }}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="bg-[#1a7a4a] px-5 pt-14 pb-0">
          <div className="flex items-center gap-3.5 pb-4">
            <button
              type="button"
              onClick={goBack}
              className="w-9 h-9 bg-white/20 rounded-full flex items-center justify-center
                         text-white text-sm border-none cursor-pointer hover:bg-white/30 transition-colors"
            >
              ←
            </button>
            <div>
              <h1
                className="text-white text-[22px] font-bold leading-tight"
                style={{ fontFamily: "'Playfair Display', serif" }}
              >
                Add Property
              </h1>
              <p className="text-white/75 text-[13px] mt-0.5">
                {/* Replace with: Hi {authUser?.display_name || "User"}, let's list your space */}
                Let&apos;s get your property listed
              </p>
            </div>
          </div>

          {/* ── Step progress ──────────────────────────────────────────── */}
          <StepProgress currentStep={currentStep} />
        </div>

        {/* ── Form body ───────────────────────────────────────────────────── */}
        <div className="px-4 pt-5">
          {currentStep === 1 && (
            <Step1Basics data={formData} onUpdate={update} />
          )}
          {currentStep === 2 && (
            <Step2Details data={formData} onUpdate={update} />
          )}
          {currentStep === 3 && (
            <Step3Preview
              data={formData}
              onUpdate={update}
              onOpenLocationPicker={() => setOpenLocPicker(true)}
            />
          )}
        </div>

        {/* ── Bottom action bar ───────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 mt-8">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={goBack}
              className="w-[50px] h-[50px] rounded-full bg-white border-[1.5px] border-[#e5e7eb]
                         flex items-center justify-center text-lg text-[#4b5563] cursor-pointer
                         shadow-[0_2px_8px_rgba(0,0,0,0.08)] flex-shrink-0
                         hover:border-[#2ea06a] transition-colors"
            >
              ←
            </button>
          )}

          <button
            type="button"
            onClick={currentStep < 3 ? goNext : handleSubmit}
            disabled={isLoading}
            className={`flex-1 py-[14px] rounded-[10px] text-white text-[15px] font-semibold
                        flex items-center justify-center gap-2 transition-all duration-200
                        shadow-[0_4px_20px_rgba(26,122,74,0.4)]
                        ${
                          isLoading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-gradient-to-br from-[#1a7a4a] to-[#2ea06a] hover:-translate-y-0.5 hover:shadow-[0_6px_24px_rgba(26,122,74,0.5)]"
                        }`}
          >
            {isLoading && (
              <svg
                className="animate-spin h-4 w-4 text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                />
              </svg>
            )}
            {ctaLabel}
          </button>
        </div>
      </div>

      {/* ── Location picker modal (wire up your actual component) ────────── */}
      {openLocPicker && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-end"
          onClick={() => setOpenLocPicker(false)}
        >
          <div
            className="bg-white w-full rounded-t-3xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold text-[#111827] mb-4">Pick Location</p>
            <p className="text-sm text-[#9ca3af] mb-6">
              Replace this placeholder with your{" "}
              <code className="bg-[#f3f4f6] px-1 rounded text-xs">LocationPickerMap</code>{" "}
              component.
            </p>
            {/* Demo: tap to set a sample coordinate */}
            <button
              type="button"
              onClick={() => {
                handleLocationSelect(6.5244, 3.3792);
                setOpenLocPicker(false);
              }}
              className="w-full py-3 bg-[#1a7a4a] text-white rounded-xl font-semibold text-sm"
            >
              Confirm Lagos Island
            </button>
          </div>
        </div>
      )}
    </>
  );
}
