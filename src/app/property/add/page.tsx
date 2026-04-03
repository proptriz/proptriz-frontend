"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter }      from "next/navigation";
import { toast }          from "react-toastify";

import {
  CategoryEnum, CurrencyEnum, ListForEnum, NegotiableEnum,
  PropertyStatusEnum, RenewalEnum,
  type PropertyFormData, type WizardStep,
} from "@/types/property";

import StepProgress        from "@/components/StepProgress";
import Step1Basics         from "@/components/Step1Basics";
import Step2Details        from "@/components/Step2Details";
import Step3Preview        from "@/components/Step3Preview";
import ListWithAI          from "@/components/property/ListwithAI";
import PublishSuccessModal from "@/components/property/PublishSuccessModal";
import Splash              from "@/components/shared/Splash";
import BrandLogo           from "@/components/shared/BrandLogo";
import type { Landmark }   from "@/components/PropertyLocationModal";

import { AppContext }          from "@/context/AppContextProvider";
import PropertyLocationModal   from "@/components/PropertyLocationModal";
import { createProperty, updatePropertyImage } from "@/services/propertyApi";
import { compressImage }       from "@/utils/compressImage";
import getUserPosition          from "@/utils/getUserPosition";
import logger                   from "../../../../logger.config.mjs";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

// The wizard view is either the AI inline step or one of the 3 manual steps.
type WizardView  = "ai" | WizardStep;
type UploadStage = "idle" | "creating" | "uploading" | "done";

// ─────────────────────────────────────────────────────────────────────────────
// DEFAULT FORM STATE
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// STEP VALIDATION  (only applies to manual steps 1 and 2)
// ─────────────────────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────

export default function AddPropertyPage() {
  const router       = useRouter();
  const { authUser } = useContext(AppContext);

  // ── Wizard state ─────────────────────────────────────────────────────────
  const [view,      setView]      = useState<WizardView>(1);
  const [formData,  setFormData]  = useState<PropertyFormData>(DEFAULT_FORM);
  const [aiBanner,  setAiBanner]  = useState(false);

  // ── Shared location picker ────────────────────────────────────────────────
  const [openLocPicker,   setOpenLocPicker]   = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);
  const [landmarks,       setLandmarks]       = useState<Landmark[]>([]);

  // ── Upload ────────────────────────────────────────────────────────────────
  const [uploadStage,    setUploadStage]    = useState<UploadStage>("idle");
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });

  // ── Success modal ─────────────────────────────────────────────────────────
  const [successModal,   setSuccessModal]   = useState(false);
  const [publishedId,    setPublishedId]    = useState("");
  const [publishedTitle, setPublishedTitle] = useState("");

  const isSubmitting = uploadStage !== "idle" && uploadStage !== "done";

  // ── Form update ───────────────────────────────────────────────────────────
  const update = useCallback((partial: Partial<PropertyFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Location picker ───────────────────────────────────────────────────────
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
    update({ coordinates: [lat, lng] });
    toast.success(`Location pinned: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, [update]);

  // ── Navigation ────────────────────────────────────────────────────────────

  const goNext = () => {
    if (view === "ai") return;                               // AI step uses its own button
    const err = validateStep(view as WizardStep, formData);
    if (err) { toast.warn(err); return; }
    if ((view as number) < 3) setView((v) => ((v as number) + 1) as WizardStep);
  };

  const goBack = () => {
    if (isSubmitting) return;
    if (view === "ai") { setView(1); return; }              // AI → Step 1  (no router call)
    if (view === 1)    { router.back(); return; }           // Step 1 → previous screen
    setView((v) => ((v as number) - 1) as WizardStep);     // Step N → Step N-1
  };

  // ── AI extraction callback ────────────────────────────────────────────────
  //
  // ListWithAI calls this when extraction succeeds.
  // We merge the normalised data + photos into formData, show the gold banner,
  // and jump straight to Step 3 (Preview) — all in-process with no routing.
  // No sessionStorage, no window.__aiPhotos, no cross-page state.
  const handleExtracted = useCallback(
    (data: Omit<PropertyFormData, "photos">, photos: File[]) => {
      setFormData({ ...DEFAULT_FORM, ...data, photos });
      setAiBanner(true);
      setView(3);
    },
    [],
  );

  // ── Photo upload helper ───────────────────────────────────────────────────
  const uploadPhotosSequentially = async (
    propertyId: string,
    photos:     File[],
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

  // ── Submit ────────────────────────────────────────────────────────────────
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
    fd.append("features",    JSON.stringify(formData.features));
    if (formData.listedFor === ListForEnum.rent) {
      fd.append("period", formData.renewPeriod.toLowerCase());
    }

    let newPropertyId: string;
    try {
      const result  = await createProperty(fd);
      newPropertyId = result._id;
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Failed to create property.");
      setUploadStage("idle");
      return;
    }

    if (formData.photos.length > 0) {
      setUploadStage("uploading");
      setUploadProgress({ current: 0, total: formData.photos.length });
      const { success, failed } = await uploadPhotosSequentially(
        newPropertyId, formData.photos
      );
      if (failed > 0) {
        toast.warn(
          `${success} photo${success !== 1 ? "s" : ""} uploaded. ` +
          `${failed} failed — add via Edit Property.`
        );
      } else {
        toast.success("Property listed with all photos! 🎉");
      }
    } else {
      toast.success("Property successfully listed! 🎉");
    }

    setUploadStage("done");
    await new Promise((r) => setTimeout(r, 600));

    // Capture before reset
    const doneTitle = formData.title;

    // Full wizard reset — wizard is clean when modal closes
    setFormData(DEFAULT_FORM);
    setView(1);
    setAiBanner(false);
    setUploadStage("idle");
    setUploadProgress({ current: 0, total: 0 });

    // Show success modal with four navigation choices
    setPublishedId(newPropertyId);
    setPublishedTitle(doneTitle);
    setSuccessModal(true);
  };

  // ── CTA label ─────────────────────────────────────────────────────────────
  const ctaLabel =
    uploadStage === "creating"    ? "Creating listing…"
    : uploadStage === "uploading" ? `Uploading photo ${uploadProgress.current} of ${uploadProgress.total}…`
    : uploadStage === "done"      ? "Published! ✨"
    : view === 1                  ? "Add Photos & Details →"
    : view === 2                  ? "Preview Listing →"
    : "Publish Property 🎉";

  if (!authUser) return <Splash showFooter />;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="page-scroll pb-10"
        style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ════════════════════════════════════════════════════════════════
            TEAL HERO HEADER
        ════════════════════════════════════════════════════════════════ */}
        <div
          className="px-5 pt-14 pb-0"
          style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
        >
          {/* Decorative rings */}
          <div
            className="absolute inset-x-0 top-0 overflow-hidden h-36 pointer-events-none"
            aria-hidden
          >
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(240,165,0,0.12)" }} />
            <div style={{ position: "absolute", top:  20, right:  60, width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          {/* Top row */}
          <div className="flex items-center gap-3.5 pb-4 relative z-10">
            <button
              type="button"
              onClick={goBack}
              disabled={isSubmitting}
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                         text-white bg-white/15 border border-white/25 transition-all
                         hover:bg-white/25 active:scale-95
                         disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Go back"
            >
              ←
            </button>

            <div className="flex-1 min-w-0">
              {view === "ai" ? (
                <>
                  <div className="flex items-center gap-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="#f0a500" />
                      <path d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z" fill="#f0a500" opacity="0.6" />
                      <path d="M5 3L5.7 5.3L8 6L5.7 6.7L5 9L4.3 6.7L2 6L4.3 5.3L5 3Z" fill="#f0a500" opacity="0.5" />
                    </svg>
                    <h1
                      className="text-white text-[22px] font-black leading-tight"
                      style={{ fontFamily: "'Raleway', sans-serif" }}
                    >
                      List with AI
                    </h1>
                  </div>
                  <p className="text-white/70 text-[13px] mt-0.5">
                    Describe your property — AI fills the form
                  </p>
                </>
              ) : (
                <>
                  <h1
                    className="text-white text-[22px] font-black leading-tight"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    Add Property
                  </h1>
                  <p className="text-white/70 text-[13px] mt-0.5 truncate">
                    Hi {authUser.display_name ?? "there"}, let&apos;s list your space
                  </p>
                </>
              )}
            </div>

            <div className="flex items-center gap-1.5 flex-shrink-0">
              <BrandLogo variant="mark" theme="light" size={36} linkTo="/" />
              <span
                className="text-white font-black text-[15px] tracking-tight hidden md:inline-block"
                style={{ fontFamily: "'Raleway', sans-serif" }}
              >
                <span style={{ color: "#f0a500" }}>Prop</span>Triz
              </span>
            </div>
          </div>

          {/* "List with AI" entry pill — only shown on Step 1 */}
          {view === 1 && (
            <div className="pb-4 relative z-10">
              <button
                type="button"
                onClick={() => setView("ai")}
                className="w-full flex items-center justify-center gap-2.5 py-3 rounded-2xl
                           text-[13px] font-bold transition-all active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg,rgba(240,165,0,0.18),rgba(240,165,0,0.08))",
                  border:     "1.5px solid rgba(240,165,0,0.45)",
                  color:      "#f0a500",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="#f0a500" />
                  <path d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z" fill="#f0a500" opacity="0.6" />
                  <path d="M5 3L5.7 5.3L8 6L5.7 6.7L5 9L4.3 6.7L2 6L4.3 5.3L5 3Z" fill="#f0a500" opacity="0.5" />
                </svg>
                ✨ List with AI — describe it, we fill the form
              </button>
            </div>
          )}

          {/* Step progress bar — handles the "ai" view */}
          <StepProgress currentStep={view} />
        </div>

        {/* ════════════════════════════════════════════════════════════════
            AI PREFILL BANNER  (Step 3 only, after AI extraction)
        ════════════════════════════════════════════════════════════════ */}
        {aiBanner && view === 3 && (
          <div
            className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
              border:     "1.5px solid rgba(240,165,0,0.4)",
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z" fill="#f0a500" />
              <path d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z" fill="#f0a500" opacity="0.6" />
            </svg>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-[#92400e] leading-tight">
                ✨ AI filled your listing
              </p>
              <p className="text-[11px] text-[#b45309] mt-0.5">
                Review the details below — edit anything before publishing.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAiBanner(false)}
              className="text-[#b45309] text-lg flex-shrink-0 leading-none active:scale-90 transition-all"
            >
              ×
            </button>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            UPLOAD PROGRESS BANNER
        ════════════════════════════════════════════════════════════════ */}
        {isSubmitting && (
          <div
            className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg,#143d4d,#1e5f74)",
              boxShadow:  "0 4px 16px rgba(30,95,116,0.28)",
            }}
          >
            <div
              className="w-8 h-8 rounded-full border-[3px] animate-spin flex-shrink-0"
              style={{ borderColor: "rgba(255,255,255,0.2)", borderTopColor: "white" }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-bold leading-tight truncate">
                {uploadStage === "creating"
                  ? "Creating your listing…"
                  : `Uploading photo ${uploadProgress.current} of ${uploadProgress.total}`}
              </p>
              <p className="text-white/55 text-[11px] mt-0.5">
                {uploadStage === "creating"
                  ? "Saving title, price & location — this is fast"
                  : "Photos compressed & sent one by one for reliability"}
              </p>
            </div>
            {uploadStage === "uploading" && uploadProgress.total > 0 && (
              <div className="flex items-center gap-1 flex-shrink-0">
                {Array.from({ length: uploadProgress.total }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-full transition-all duration-300"
                    style={{
                      width:      i < uploadProgress.current ? 8 : 5,
                      height:     i < uploadProgress.current ? 8 : 5,
                      background: i < uploadProgress.current
                        ? "#f0a500"
                        : "rgba(255,255,255,0.25)",
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════════════════════════════
            FORM BODY
        ════════════════════════════════════════════════════════════════ */}
        <div className="px-4 pt-5 pb-4">
          {view === "ai" && (
            <ListWithAI
              onExtracted={handleExtracted}
              onOpenLocationPicker={openLocationPicker}
              pinnedCoordinates={formData.coordinates}
            />
          )}
          {view === 1 && (
            <Step1Basics
              data={formData}
              onUpdate={update}
              onOpenLocationPicker={openLocationPicker}
            />
          )}
          {view === 2 && (
            <Step2Details data={formData} onUpdate={update} />
          )}
          {view === 3 && (
            <Step3Preview
              data={formData}
              onUpdate={update}
              onOpenLocationPicker={openLocationPicker}
            />
          )}
        </div>

        {/* ════════════════════════════════════════════════════════════════
            BOTTOM ACTION BAR
            The AI step renders its own full-width Extract CTA inside
            <ListWithAI> so the bar is hidden when view === "ai".
        ════════════════════════════════════════════════════════════════ */}
        {view !== "ai" && (
          <div className="flex items-center gap-3 px-4 mt-4 pb-6">
            {view > 1 && (
              <button
                type="button"
                onClick={goBack}
                disabled={isSubmitting}
                className="w-[50px] h-[50px] rounded-full bg-white border-[1.5px] border-[#e5e7eb]
                           flex items-center justify-center text-lg text-[#4b5563] flex-shrink-0
                           shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all active:scale-95
                           disabled:opacity-40 disabled:cursor-not-allowed"
                onMouseEnter={(e) => {
                  if (!isSubmitting)
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                }}
                aria-label="Previous step"
              >
                ←
              </button>
            )}

            <button
              type="button"
              onClick={view < 3 ? goNext : handleSubmit}
              disabled={isSubmitting}
              className="flex-1 py-[14px] rounded-xl text-white text-[15px] font-bold
                         flex items-center justify-center gap-2.5
                         transition-all duration-200 active:scale-[0.98]
                         disabled:cursor-not-allowed"
              style={{
                background:  "linear-gradient(135deg,#143d4d 0%,#1e5f74 100%)",
                boxShadow:   isSubmitting ? "none" : "0 4px 20px rgba(30,95,116,0.4)",
                opacity:     isSubmitting ? 0.75 : 1,
                fontFamily:  "'Raleway', sans-serif",
              }}
              onMouseEnter={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 6px 24px rgba(30,95,116,0.55)";
              }}
              onMouseLeave={(e) => {
                if (!isSubmitting)
                  (e.currentTarget as HTMLButtonElement).style.boxShadow =
                    "0 4px 20px rgba(30,95,116,0.4)";
              }}
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-4 w-4 text-white flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
              )}
              <span className="truncate">{ctaLabel}</span>
            </button>
          </div>
        )}
      </div>

      {/* ════════════════════════════════════════════════════════════════
          LOCATION PICKER MODAL  (shared by all views)
      ════════════════════════════════════════════════════════════════ */}
      <PropertyLocationModal
        isOpen={openLocPicker}
        onClose={() => setOpenLocPicker(false)}
        userCoordinates={formData.coordinates}
        fallbackCoordinates={userCoordinates}
        onLocationSelect={handleLocationSelect}
        onLandmarksSelect={(selected) => setLandmarks(selected)}
        initialLandmarks={landmarks}
      />

      {/* ════════════════════════════════════════════════════════════════
          PUBLISH SUCCESS MODAL
      ════════════════════════════════════════════════════════════════ */}
      <PublishSuccessModal
        isOpen={successModal}
        propertyId={publishedId}
        propertyTitle={publishedTitle}
      />
    </>
  );
}