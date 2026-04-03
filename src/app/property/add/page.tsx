"use client";

import { useState, useContext, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast }          from "react-toastify";
import Link               from "next/link";

import {
  CategoryEnum, CurrencyEnum, ListForEnum, NegotiableEnum,
  PropertyStatusEnum, RenewalEnum,
  type PropertyFormData, type WizardStep,
} from "@/types/property";

import StepProgress      from "@/components/StepProgress";
import Step1Basics       from "@/components/Step1Basics";
import Step2Details      from "@/components/Step2Details";
import Step3Preview      from "@/components/Step3Preview";
import Splash            from "@/components/shared/Splash";
import BrandLogo         from "@/components/shared/BrandLogo";
import type { Landmark } from "@/components/PropertyLocationModal";

import { AppContext }          from "@/context/AppContextProvider";
import PropertyLocationModal   from "@/components/PropertyLocationModal";
import { createProperty, updatePropertyImage } from "@/services/propertyApi";
import { compressImage }       from "@/utils/compressImage";
import getUserPosition          from "@/utils/getUserPosition";
import logger                   from "../../../../logger.config.mjs";

type UploadStage = "idle" | "creating" | "uploading" | "done";

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
  coordinates: [9.0820, 8.6753],
  photos:      [],
};

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

export default function AddPropertyPage() {
  const router        = useRouter();
  const searchParams  = useSearchParams();
  const { authUser }  = useContext(AppContext);

  const [formData,    setFormData]    = useState<PropertyFormData>(DEFAULT_FORM);
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [openLocPicker, setOpenLocPicker] = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);
  const [landmarks,   setLandmarks]   = useState<Landmark[]>([]);
  const [aiBanner,    setAiBanner]    = useState(false);

  const [uploadStage,    setUploadStage]    = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  const isSubmitting = uploadStage !== "idle" && uploadStage !== "done";

  // ── Read AI prefill from sessionStorage when ?ai=1 ─────────────────────
  useEffect(() => {
    if (searchParams.get("ai") !== "1") return;

    const raw = sessionStorage.getItem("ai_prefill");
    if (!raw) return;

    try {
      const prefilled = JSON.parse(raw) as PropertyFormData;
      setFormData({ ...DEFAULT_FORM, ...prefilled, photos: [] });
      // AI lands user on Step 3 (Preview) so they review before publishing
      setCurrentStep(3);
      setAiBanner(true);
      sessionStorage.removeItem("ai_prefill");
    } catch (err) {
      logger.warn("AI prefill parse failed:", err);
    }
  }, [searchParams]);

  const update = useCallback((partial: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const openLocationPicker = useCallback(async () => {
    try {
      const coords = await getUserPosition();
      setUserCoordinates(coords);
    } catch (err) {
      logger.warn("getUserPosition failed:", err);
    }
    setOpenLocPicker(true);
  }, []);

  const goNext = () => {
    const err = validateStep(currentStep, formData);
    if (err) { toast.warn(err); return; }
    if (currentStep < 3) setCurrentStep((p) => (p + 1) as WizardStep);
  };

  const goBack = () => {
    if (currentStep > 1) setCurrentStep((p) => (p - 1) as WizardStep);
    else router.back();
  };

  const goProfile = () => {
    router.push("/profile");
  };

  const handleLocationSelect = useCallback((lat: number, lng: number) => {
    update({ coordinates: [lat, lng] });
    toast.success(`Location pinned: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, [update]);

  const uploadPhotosSequentially = async (
    propertyId: string,
    photos: File[]
  ): Promise<{ success: number; failed: number }> => {
    let success = 0, failed = 0;
    for (let i = 0; i < photos.length; i++) {
      setUploadProgress({ current: i + 1, total: photos.length });
      try {
        const compressed = await compressImage(photos[i]);
        const res = await updatePropertyImage(propertyId, compressed);
        if (!res?.success) throw new Error("Upload rejected by server");
        success++;
      } catch (err) {
        failed++;
        logger.warn(`Photo ${i + 1}/${photos.length} failed:`, err);
      }
    }
    return { success, failed };
  };

  const handleSubmit = async () => {
    if (!authUser) { toast.error("Please login to list a property."); return; }

    setUploadStage("creating");

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
    fd.append("features",    JSON.stringify(formData.features.filter((f) => f && !f.startsWith("__custom_"))));
    if (formData.listedFor === ListForEnum.rent) {
      fd.append("period", formData.renewPeriod.toLowerCase());
    }

    let newPropertyId: string;
    try {
      const result = await createProperty(fd);
      newPropertyId = result._id;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create property.");
      setUploadStage("idle");
      return;
    }

    if (formData.photos.length > 0) {
      setUploadStage("uploading");
      setUploadProgress({ current: 0, total: formData.photos.length });
      const { success, failed } = await uploadPhotosSequentially(newPropertyId, formData.photos);
      if (failed > 0) {
        toast.warn(`${success} photo${success !== 1 ? "s" : ""} uploaded. ${failed} failed — add via Edit Property.`);
      } else {
        toast.success("Property listed with all photos! 🎉");
      }
    } else {
      toast.success("Property successfully listed! 🎉");
    }

    setUploadStage("done");
    await new Promise((r) => setTimeout(r, 700));
    setFormData(DEFAULT_FORM);
    setCurrentStep(1);
    setUploadStage("idle");
    setUploadProgress({ current: 0, total: 0 });
    router.push("/property/add");
  };

  const ctaLabel =
    uploadStage === "creating"  ? "Creating listing…"
    : uploadStage === "uploading" ? `Uploading photo ${uploadProgress.current} of ${uploadProgress.total}…`
    : uploadStage === "done"      ? "Done! Redirecting…"
    : currentStep === 1           ? "Add Photos & Details →"
    : currentStep === 2           ? "Preview Listing →"
    : "Publish Property 🎉";

  if (!authUser) return <Splash showFooter />;

  return (
    <>
      <div className="page-scroll pb-10" style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}>

        {/* ── Teal hero header ──────────────────────────────────────────── */}
        <div className="px-5 pt-14 pb-0" style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}>
          <div className="absolute inset-x-0 top-0 overflow-hidden h-36 pointer-events-none" aria-hidden>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(240,165,0,0.12)" }} />
            <div style={{ position: "absolute", top: 20,  right: 60,  width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          <div className="flex items-center gap-3.5 pb-4 relative z-10">
            <button type="button" onClick={goProfile} disabled={isSubmitting}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                         text-white bg-white/15 border border-white/25 transition-all
                         hover:bg-white/25 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Go back">←</button>

            <div className="flex-1 min-w-0">
              <h1 className="text-white text-[22px] font-black leading-tight" style={{ fontFamily: "'Raleway', sans-serif" }}>
                Add Property
              </h1>
              <p className="text-white/70 text-[13px] mt-0.5 truncate">
                Hi {authUser.display_name ?? "there"}, let&apos;s list your space
              </p>
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <BrandLogo variant="mark" theme="light" size={36} linkTo="/" />
              <span className="text-white font-black text-[15px] tracking-tight hidden md:inline-block"
                style={{ fontFamily: "'Raleway', sans-serif" }}>
                <span style={{ color: "#f0a500" }}>Prop</span>Triz
              </span>
            </div>
          </div>

          {/* List with AI button — only on Step 1, hidden after AI prefill */}
          {currentStep === 1 && !aiBanner && (
            <div className="pb-4 relative z-10">
              <Link
                href="/property/add/ai"
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl
                           text-[13px] font-bold transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,rgba(240,165,0,0.18),rgba(240,165,0,0.08))",
                  border: "1.5px solid rgba(240,165,0,0.45)",
                  color: "#f0a500",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="#f0a500"/>
                  <path d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z" fill="#f0a500" opacity="0.6"/>
                  <path d="M5 3L5.7 5.3L8 6L5.7 6.7L5 9L4.3 6.7L2 6L4.3 5.3L5 3Z" fill="#f0a500" opacity="0.5"/>
                </svg>
                ✨ List with AI — describe it, we fill the form
              </Link>
            </div>
          )}

          <StepProgress currentStep={currentStep} />
        </div>

        {/* ── AI prefill notice banner ────────────────────────────────────── */}
        {aiBanner && (
          <div className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
              border: "1.5px solid rgba(240,165,0,0.4)",
            }}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="#f0a500"/>
              <path d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z" fill="#f0a500" opacity="0.6"/>
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#92400e] leading-tight">
                ✨ AI filled your listing
              </p>
              <p className="text-[11px] text-[#b45309] mt-0.5">
                Review the details below — edit anything before publishing.
              </p>
            </div>
            <button type="button" onClick={() => setAiBanner(false)}
              className="text-[#b45309] text-lg flex-shrink-0 leading-none active:scale-90 transition-all">
              ×
            </button>
          </div>
        )}

        {/* ── Upload progress banner ─────────────────────────────────────── */}
        {isSubmitting && (
          <div className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)", boxShadow: "0 4px 16px rgba(30,95,116,0.28)" }}>
            <div className="w-8 h-8 rounded-full border-[3px] animate-spin flex-shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }} />
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-bold leading-tight truncate">
                {uploadStage === "creating" ? "Creating your listing…" : `Uploading photo ${uploadProgress.current} of ${uploadProgress.total}`}
              </p>
              <p className="text-white/55 text-[11px] mt-0.5">
                {uploadStage === "creating" ? "Saving title, price & location — this is fast" : "Photos compressed & sent one by one for reliability"}
              </p>
            </div>
            {uploadStage === "uploading" && uploadProgress.total > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {Array.from({ length: uploadProgress.total }).map((_, i) => (
                  <div key={i} className="rounded-full transition-all duration-300"
                    style={{
                      width: i < uploadProgress.current ? 8 : 5,
                      height: i < uploadProgress.current ? 8 : 5,
                      background: i < uploadProgress.current ? "#f0a500" : "rgba(255,255,255,0.25)",
                    }} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Form body ─────────────────────────────────────────────────── */}
        <div className="px-4 pt-5 pb-4">
          {currentStep === 1 && <Step1Basics data={formData} onUpdate={update} onOpenLocationPicker={openLocationPicker} />}
          {currentStep === 2 && <Step2Details data={formData} onUpdate={update} />}
          {currentStep === 3 && <Step3Preview data={formData} onUpdate={update} onOpenLocationPicker={openLocationPicker} />}
        </div>

        {/* ── Bottom action bar ──────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 mt-4 pb-6">
          {currentStep > 1 && (
            <button type="button" onClick={goBack} disabled={isSubmitting}
              className="w-[50px] h-[50px] rounded-full bg-white border-[1.5px] border-[#e5e7eb]
                         flex items-center justify-center text-lg text-[#4b5563] flex-shrink-0
                         shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed"
              onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
              aria-label="Previous step">←</button>
          )}

          <button type="button" onClick={currentStep < 3 ? goNext : handleSubmit} disabled={isSubmitting}
            className="flex-1 py-[14px] rounded-xl text-white text-[15px] font-bold
                       flex items-center justify-center gap-2.5
                       transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
            style={{
              background: "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
              boxShadow: isSubmitting ? "none" : "0 4px 20px rgba(30,95,116,0.4)",
              opacity: isSubmitting ? 0.75 : 1,
              fontFamily: "'Raleway', sans-serif",
            }}
            onMouseEnter={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 24px rgba(30,95,116,0.55)"; }}
            onMouseLeave={(e) => { if (!isSubmitting) (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(30,95,116,0.4)"; }}
          >
            {isSubmitting && (
              <svg className="animate-spin h-4 w-4 text-white flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
            )}
            <span className="truncate">{ctaLabel}</span>
          </button>
        </div>
      </div>

      <PropertyLocationModal
        isOpen={openLocPicker}
        onClose={() => setOpenLocPicker(false)}
        userCoordinates={formData.coordinates}
        fallbackCoordinates={userCoordinates}
        onLocationSelect={handleLocationSelect}
        onLandmarksSelect={(selected) => setLandmarks(selected)}
        initialLandmarks={landmarks}
      />
    </>
  );
}