"use client";

import { useState, useContext, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast }     from "react-toastify";
import Link          from "next/link";

import {
  type PropertyFormData,
} from "@/types/property";

import SectionCard        from "@/components/SectionCard";
import MapPreview         from "@/components/MapPreview";
import PhotoUploadSection from "@/components/PhotoUploadSection";
import BrandLogo          from "@/components/shared/BrandLogo";
import Splash             from "@/components/shared/Splash";
import PropertyLocationModal from "@/components/PropertyLocationModal";

import { AppContext }          from "@/context/AppContextProvider";
import { extractPropertyApi }  from "@/services/extractPropertyApi";
import getUserPosition          from "@/utils/getUserPosition";
import logger                   from "../../../../../logger.config.mjs";

// ─────────────────────────────────────────────────────────────────────────────

type ExtractStage = "idle" | "extracting" | "done" | "error";

// ─────────────────────────────────────────────────────────────────────────────

export default function ListWithAIPage() {
  const router       = useRouter();
  const { authUser } = useContext(AppContext);

  // ── Input state ──────────────────────────────────────────────────────────
  const [description,   setDescription]   = useState("");
  const [photos,        setPhotos]         = useState<File[]>([]);
  const [coordinates,   setCoordinates]    = useState<[number, number]>([9.0820, 8.6753]);
  const [address,       setAddress]        = useState("");

  // ── Location picker ──────────────────────────────────────────────────────
  const [openLocPicker,   setOpenLocPicker]   = useState(false);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);

  // ── Extract stage ────────────────────────────────────────────────────────
  const [stage,    setStage]    = useState<ExtractStage>("idle");
  const [progress, setProgress] = useState("");

  const isExtracting = stage === "extracting";

  // ── Handlers ────────────────────────────────────────────────────────────

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
    setCoordinates([lat, lng]);
    toast.success(`Location pinned: (${lat.toFixed(5)}, ${lng.toFixed(5)})`);
  }, []);

  // ── Extract ─────────────────────────────────────────────────────────────

  const handleExtract = useCallback(async () => {
    if (!description.trim()) {
      toast.warn("Please add a description so the AI has something to work with.");
      return;
    }

    setStage("extracting");
    setProgress("Extracting property details — this may take up to 30 seconds…");

    try {
      // Backend normalises all fields before responding — no coercion here.
      // The 90 s timeout is set inside extractPropertyApi.
      const ai = await extractPropertyApi(description.trim());

      // ── Build the form payload ────────────────────────────────────────
      //
      // All enum values match PropertyFormData directly because the backend
      // has already normalised them.
      //
      // coordinates: use AI result if present; fall back to the user's
      // pinned map location so we never stomp a deliberate manual pin.
      //
      // address: prefer AI result; fall back to the typed address field.
      //
      // photos: File[] cannot be JSON-serialised — stored in window.__aiPhotos
      // and recovered by the wizard on mount.
      const filled: Omit<PropertyFormData, "photos"> = {
        title:       ai.title       || "",
        description: ai.description || description.trim(),
        address:     ai.address     || address.trim(),
        price:       ai.price       || "0",
        currency:    ai.currency    as PropertyFormData["currency"],
        listedFor:   ai.listedFor   as PropertyFormData["listedFor"],
        category:    ai.category    as PropertyFormData["category"],
        status:      ai.status      as PropertyFormData["status"],
        renewPeriod: ai.renewPeriod as PropertyFormData["renewPeriod"],
        negotiable:  ai.negotiable  as PropertyFormData["negotiable"],
        duration:    ai.duration,
        features:    ai.features,
        // coordinates is optional on NormalisedProperty — fall back to pinned map
        coordinates: ai.coordinates ?? coordinates,
      };

      sessionStorage.setItem("ai_prefill", JSON.stringify(filled));

      // Photos survive navigation via an in-memory window reference
      if (typeof window !== "undefined") {
        (window as any).__aiPhotos = photos;
      }

      setStage("done");
      toast.success("Details extracted! Review and publish. ✨");

      await new Promise((r) => setTimeout(r, 400));
      router.push("/property/add?ai=1");

    } catch (err: unknown) {
      logger.error("[ListWithAI] extraction failed:", err);
      setStage("error");
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      toast.error(msg);
    }
  }, [description, photos, coordinates, address, router]);

  if (!authUser) return <Splash showFooter />;

  // ───────────────────────────────────────────────────────────────────────
  return (
    <>
      <div
        className="page-scroll pb-10"
        style={{ background: "#f5f7f9", fontFamily: "'DM Sans', sans-serif" }}
      >

        {/* ── Teal hero header ────────────────────────────────────────── */}
        <div
          className="px-5 pt-14 pb-5"
          style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 100%)" }}
        >
          {/* Decorative rings */}
          <div className="absolute inset-x-0 top-0 overflow-hidden h-36 pointer-events-none" aria-hidden>
            <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", border: "1px solid rgba(240,165,0,0.12)" }} />
            <div style={{ position: "absolute", top: 20,  right: 60,  width: 100, height: 100, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.06)" }} />
          </div>

          {/* Top row */}
          <div className="flex items-center gap-3.5 pb-5 relative z-10">
            <Link
              href="/property/add"
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
                         text-white bg-white/15 border border-white/25 transition-all
                         hover:bg-white/25 active:scale-95"
              aria-label="Back to manual listing"
            >
              ←
            </Link>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Sparkle />
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

          {/* How-it-works strip */}
          <div
            className="flex items-center relative z-10"
            style={{
              background:   "rgba(255,255,255,0.07)",
              borderRadius: 14,
              padding:      "10px 14px",
            }}
          >
            {HOW_STEPS.map((s, i) => (
              <div key={s.n} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center
                               text-[11px] font-black"
                    style={{ background: "#f0a500", color: "#143d4d" }}
                  >
                    {s.n}
                  </div>
                  <span className="text-white/70 text-[10px] font-semibold mt-0.5 text-center leading-tight">
                    {s.label}
                  </span>
                </div>
                {i < HOW_STEPS.length - 1 && (
                  <div
                    className="mb-3 flex-shrink-0"
                    style={{ width: 16, height: 1, background: "rgba(255,255,255,0.2)" }}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Extraction progress banner ───────────────────────────────── */}
        {isExtracting && (
          <div
            className="mx-4 mt-3 px-4 py-3 rounded-2xl flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg,#143d4d,#1e5f74)",
              boxShadow:  "0 4px 16px rgba(30,95,116,0.28)",
            }}
          >
            {/* Gold-ring spinner with sparkle centre */}
            <div className="w-8 h-8 flex items-center justify-center flex-shrink-0 relative">
              <div
                className="absolute inset-0 rounded-full border-[2.5px] animate-spin"
                style={{
                  borderColor:    "transparent",
                  borderTopColor: "#f0a500",
                }}
              />
              <Sparkle size={14} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-[13px] font-bold leading-tight">{progress}</p>
              <p className="text-white/55 text-[11px] mt-0.5">
                Powered by Llama 3 · usually 15–30 seconds
              </p>
            </div>
          </div>
        )}

        {/* ── Form body ─────────────────────────────────────────────────── */}
        <div className="px-4 pt-5 pb-4 flex flex-col gap-4">

          {/* ① Description ──────────────────────────────────────────────── */}
          <SectionCard icon="✍️" title="Describe Your Property">
            <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
              Mention type, size, price, location, and standout features.
              The more detail, the better the result.
            </p>
            <div
              className="flex items-start gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                         rounded-xl px-3.5 py-3 transition-all duration-200"
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = "#1e5f74";
                e.currentTarget.style.background  = "white";
                e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.08)";
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background  = "#f9fafb";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              <span className="text-[#9ca3af] text-base pt-0.5 flex-shrink-0">📝</span>
              <textarea
                rows={6}
                placeholder={
                  "e.g. 3 bedroom duplex in Lekki Phase 1, Lagos. ₦4.5M/year for rent. " +
                  "Has 2 bathrooms, boys quarter, spacious compound, 24hr electricity and water. " +
                  "Gated estate, close to Chevron roundabout."
                }
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={isExtracting}
                className="w-full outline-none bg-transparent text-sm
                           text-[#111827] placeholder:text-[#9ca3af] resize-none
                           disabled:opacity-50"
              />
            </div>
            <p className="text-[10px] text-[#9ca3af] mt-1.5 text-right">
              {description.length} chars{" "}
              {description.length >= 80 && (
                <span style={{ color: "#1e5f74" }}>· ✓ good</span>
              )}
            </p>
          </SectionCard>

          {/* ② Photos ───────────────────────────────────────────────────── */}
          <SectionCard icon="📸" title="Property Photos (Optional)">
            <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
              Photos are added to your listing automatically.
              Upload the exterior first — it becomes your cover image.
            </p>
            <PhotoUploadSection
              photos={photos}
              maxPhotos={5}
              onUpload={(files) => setPhotos((prev) => [...prev, ...files])}
              onRemove={(i)     => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
            />
          </SectionCard>

          {/* ③ Location ─────────────────────────────────────────────────── */}
          <SectionCard icon="📍" title="Property Location (Optional)">
            <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
              Type the address or pin it on the map to help AI set coordinates accurately.
            </p>

            {/* Address text field */}
            <div
              className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                         rounded-xl px-3.5 py-2.5 mb-3 transition-all duration-200"
              onFocusCapture={(e) => {
                e.currentTarget.style.borderColor = "#1e5f74";
                e.currentTarget.style.background  = "white";
                e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.08)";
              }}
              onBlurCapture={(e) => {
                e.currentTarget.style.borderColor = "#e5e7eb";
                e.currentTarget.style.background  = "#f9fafb";
                e.currentTarget.style.boxShadow   = "none";
              }}
            >
              <span className="text-[#9ca3af] text-base flex-shrink-0">🏘️</span>
              <input
                type="text"
                placeholder="Type address or area (optional)…"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={isExtracting}
                className="flex-1 outline-none bg-transparent text-sm
                           text-[#111827] placeholder:text-[#9ca3af] disabled:opacity-50"
              />
            </div>

            <MapPreview
              address={address || "No address typed yet"}
              coordinates={coordinates}
              onChangeLocation={openLocationPicker}
              hint="Tap the map to pin the exact location. Helps AI set coordinates accurately."
            />
          </SectionCard>

          {/* Tips ────────────────────────────────────────────────────────── */}
          <div
            className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
            style={{
              background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
              border:     "1.5px solid rgba(240,165,0,0.3)",
            }}
          >
            <span className="text-xl flex-shrink-0">💡</span>
            <div>
              <p className="text-[12px] font-bold text-[#92400e] mb-1">Tips for best results</p>
              <ul className="text-[11px] text-[#92400e] space-y-0.5 leading-relaxed list-none">
                <li>• Mention price, property type, and number of rooms</li>
                <li>• Include the neighbourhood or nearest landmark</li>
                <li>• Photos of the exterior help AI identify property type</li>
                <li>• You can edit all extracted details before publishing</li>
              </ul>
            </div>
          </div>
        </div>

        {/* ── CTA bar ───────────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 px-4 mt-2 pb-6">
          <Link
            href="/property/add"
            className="w-[50px] h-[50px] rounded-full bg-white border-[1.5px] border-[#e5e7eb]
                       flex items-center justify-center text-lg text-[#4b5563] flex-shrink-0
                       shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all active:scale-95"
          >
            ←
          </Link>

          <button
            type="button"
            onClick={handleExtract}
            disabled={isExtracting}
            className="flex-1 py-[14px] rounded-xl text-[15px] font-bold
                       flex items-center justify-center gap-2.5
                       transition-all duration-200 active:scale-[0.98] disabled:cursor-not-allowed"
            style={{
              background:  isExtracting
                ? "linear-gradient(135deg,#143d4d,#1e5f74)"
                : "linear-gradient(135deg,#c88400 0%,#f0a500 100%)",
              boxShadow:   isExtracting ? "none" : "0 4px 20px rgba(240,165,0,0.45)",
              color:       isExtracting ? "white" : "#143d4d",
              opacity:     isExtracting ? 0.75 : 1,
              fontFamily:  "'Raleway', sans-serif",
            }}
            onMouseEnter={(e) => {
              if (!isExtracting)
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 6px 24px rgba(240,165,0,0.6)";
            }}
            onMouseLeave={(e) => {
              if (!isExtracting)
                (e.currentTarget as HTMLButtonElement).style.boxShadow =
                  "0 4px 20px rgba(240,165,0,0.45)";
            }}
          >
            {isExtracting ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 flex-shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25" cx="12" cy="12" r="10"
                    stroke="currentColor" strokeWidth="4"
                  />
                  <path
                    className="opacity-75" fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Extracting…</span>
              </>
            ) : (
              <>
                <Sparkle color="#143d4d" />
                ✨ Extract Information
              </>
            )}
          </button>
        </div>
      </div>

      {/* Location picker modal */}
      <PropertyLocationModal
        isOpen={openLocPicker}
        onClose={() => setOpenLocPicker(false)}
        userCoordinates={coordinates}
        fallbackCoordinates={userCoordinates}
        onLocationSelect={handleLocationSelect}
      />
    </>
  );
}

// ─── Shared constants / micro-components ─────────────────────────────────────

const HOW_STEPS = [
  { n: "1", label: "Describe it"  },
  { n: "2", label: "Add photos"   },
  { n: "3", label: "Pin location" },
  { n: "4", label: "Extract ✨"   },
];

function Sparkle({ size = 18, color = "#f0a500" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
        fill={color}
      />
      <path
        d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z"
        fill={color} opacity="0.6"
      />
      <path
        d="M5 3L5.7 5.3L8 6L5.7 6.7L5 9L4.3 6.7L2 6L4.3 5.3L5 3Z"
        fill={color} opacity="0.5"
      />
    </svg>
  );
}