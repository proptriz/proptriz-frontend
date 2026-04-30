"use client";

import { useState, useCallback, useRef }  from "react";
import { toast }                           from "react-toastify";

import type { PropertyFormData }           from "@/types/property";
import SectionCard                         from "@/components/SectionCard";
import MapPreview                          from "@/components/MapPreview";
import PhotoUploadSection                  from "@/components/PhotoUploadSection";
import ExtractionModal, { ExtractionPhase } from "@/components/property/ExtractionModal";
import { extractPropertyApi }              from "@/services/extractPropertyApi";
import logger                              from "../../../logger.config.mjs";
import { useLanguage }                     from "@/i18n/LanguageContext";

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface ListWithAIProps {
  onExtracted:          (data: Omit<PropertyFormData, "photos">, photos: File[]) => void;
  onOpenLocationPicker: () => void;
  pinnedCoordinates:    [number, number];
}

// ─────────────────────────────────────────────────────────────────────────────
// NOMINATIM GEOCODING
// Resolve an address string → [lat, lng] using the public Nominatim API.
// Returns null when the address cannot be resolved so the caller can fall back
// to pinnedCoordinates.
// ─────────────────────────────────────────────────────────────────────────────

async function geocodeAddress(
  address: string,
  signal:  AbortSignal,
): Promise<[number, number] | null> {
  if (!address.trim()) return null;
  try {
    const params = new URLSearchParams({
      q:      address.trim(),
      format: "json",
      limit:  "1",
    });
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params}`,
      {
        signal,
        headers: { "Accept-Language": "en", "Accept": "application/json" },
      },
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    const lat = parseFloat(data[0].lat);
    const lng = parseFloat(data[0].lon);
    if (isNaN(lat) || isNaN(lng)) return null;
    return [lat, lng];
  } catch {
    return null; // AbortError or network failure — caller handles fallback
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// FOCUS HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const onFocusTeal = (el: HTMLElement) => {
  el.style.borderColor = "#1e5f74";
  el.style.background  = "white";
  el.style.boxShadow   = "0 0 0 3px rgba(30,95,116,0.08)";
};
const onBlurTeal = (el: HTMLElement) => {
  el.style.borderColor = "#e5e7eb";
  el.style.background  = "#f9fafb";
  el.style.boxShadow   = "none";
};

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function ListWithAI({
  onExtracted,
  onOpenLocationPicker,
  pinnedCoordinates,
}: ListWithAIProps) {
  const { t } = useLanguage();

  const HOW_STEPS = [
    { n: "1", label: t("ai_how_describe")  },
    { n: "2", label: t("ai_how_photos")    },
    { n: "3", label: t("ai_how_location")  },
    { n: "4", label: t("ai_how_extract")   },
  ];

  const [description, setDescription] = useState("");
  const [photos,      setPhotos]      = useState<File[]>([]);
  const [address,     setAddress]     = useState("");

  // Modal state
  const [modalOpen, setModalOpen]       = useState(false);
  const [phase,     setPhase]           = useState<ExtractionPhase>("idle");
  const [errorMsg,  setErrorMsg]        = useState("");

  // Paste feedback
  const [pasted, setPasted]             = useState(false);

  // AbortController so Cancel stops in-flight requests
  const abortRef = useRef<AbortController | null>(null);

  // ── Paste from clipboard ────────────────────────────────────────────────────

  const handlePaste = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text.trim()) {
        setDescription(text.trim());
        setPasted(true);
        setTimeout(() => setPasted(false), 1800);
      } else {
        toast.info("Clipboard is empty.");
      }
    } catch {
      toast.warn("Clipboard access denied. Paste manually using long-press.");
    }
  }, []);

  // ── Cancel ───────────────────────────────────────────────────────────────────

  const handleCancel = useCallback(() => {
    abortRef.current?.abort();
    setModalOpen(false);
    setPhase("idle");
    setErrorMsg("");
  }, []);

  // ── Extract ───────────────────────────────────────────────────────────────────

  const handleExtract = useCallback(async () => {
    if (!description.trim()) {
      toast.warn(t("ai_err_empty"));
      return;
    }

    // Abort any previous in-flight requests
    abortRef.current?.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;

    setModalOpen(true);
    setErrorMsg("");

    try {
      // ── Step 1: Geocode the address ──────────────────────────────────────
      // We try to resolve coordinates from the user-typed address (or the
      // AI-extracted address) before the AI call so we can pass good coords
      // to the form.  This takes ~1 s and gives much better location accuracy
      // than relying on the LLM alone.
      let resolvedCoords: [number, number] | null = null;

      const addressToGeocode = address.trim();
      if (addressToGeocode) {
        setPhase("geocoding");
        resolvedCoords = await geocodeAddress(addressToGeocode, ctrl.signal);
        if (ctrl.signal.aborted) return; // user cancelled
      }

      // ── Step 2: AI extraction ────────────────────────────────────────────
      setPhase("extracting");
      const ai = await extractPropertyApi(description.trim(), { signal: ctrl.signal });
      if (ctrl.signal.aborted) return;

      // ── Step 3: Resolve final coordinates ────────────────────────────────
      // Priority:
      //   1. Geocoded coords from user-typed address (most accurate — deliberate)
      //   2. Coords from AI extraction (if non-zero)
      //   3. Geocode the AI-extracted address (address AI found, not user-typed)
      //   4. Parent's pinnedCoordinates (user explicitly pinned on map)
      let finalCoords: [number, number] = pinnedCoordinates;

      if (resolvedCoords) {
        finalCoords = resolvedCoords;
      } else if (ai.coordinates) {
        finalCoords = ai.coordinates;
      } else if (ai.address && ai.address !== addressToGeocode) {
        // Try geocoding the AI-extracted address as a last attempt
        const aiCoords = await geocodeAddress(ai.address, ctrl.signal);
        if (!ctrl.signal.aborted && aiCoords) finalCoords = aiCoords;
      }

      if (ctrl.signal.aborted) return;

      setPhase("done");

      const filled: Omit<PropertyFormData, "photos"> = {
        title:       ai.title        || "",
        description: ai.description  || description.trim(),
        address:     ai.address      || address.trim(),
        price:       ai.price        || "0",
        currency:    ai.currency     as PropertyFormData["currency"],
        listedFor:   ai.listedFor    as PropertyFormData["listedFor"],
        category:    ai.category     as PropertyFormData["category"],
        status:      ai.status       as PropertyFormData["status"],
        renewPeriod: ai.renewPeriod  as PropertyFormData["renewPeriod"],
        negotiable:  ai.negotiable   as PropertyFormData["negotiable"],
        duration:    ai.duration,
        features:    ai.features,
        coordinates: finalCoords,
      };

      // Brief "done" display, then hand off to parent
      await new Promise((r) => setTimeout(r, 900));
      if (ctrl.signal.aborted) return;

      setModalOpen(false);
      setPhase("idle");
      onExtracted(filled, photos);

    } catch (err: unknown) {
      if (ctrl.signal.aborted) return; // user cancelled — don't show error
      logger.error("[ListWithAI] extraction failed:", err);
      const msg = err instanceof Error ? err.message : "Something went wrong. Please try again.";
      setPhase("error");
      setErrorMsg(msg);
    }
  }, [description, photos, address, pinnedCoordinates, onExtracted]);

  // ── Retry ────────────────────────────────────────────────────────────────────

  const handleRetry = useCallback(() => {
    setPhase("idle");
    setErrorMsg("");
    setModalOpen(false);
    // Small tick so state settles before re-opening
    setTimeout(handleExtract, 80);
  }, [handleExtract]);

  // ─────────────────────────────────────────────────────────────────────────────
  return (
    <>
      <div className="flex flex-col gap-4">

        {/* ── How-it-works strip ───────────────────────────────────────────── */}
        <div
          className="flex items-center rounded-2xl"
          style={{
            background: "linear-gradient(135deg,#e0f0f5 0%,#f0f9fc 100%)",
            border:     "1.5px solid rgba(30,95,116,0.12)",
            padding:    "10px 14px",
          }}
        >
          {HOW_STEPS.map((s, i) => (
            <div key={s.n} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black"
                  style={{ background: "#f0a500", color: "#143d4d" }}
                >
                  {s.n}
                </div>
                <span className="text-[10px] font-semibold mt-0.5 text-center leading-tight"
                  style={{ color: "#1e5f74" }}>
                  {s.label}
                </span>
              </div>
              {i < HOW_STEPS.length - 1 && (
                <div className="flex-shrink-0 mb-3"
                  style={{ width: 16, height: 1, background: "rgba(30,95,116,0.2)" }} />
              )}
            </div>
          ))}
        </div>

        {/* ① Description ──────────────────────────────────────────────────── */}
        <SectionCard icon="✍️" title={t("ai_describe")}>
          <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
            {t("ai_describe_sub")}
          </p>

          {/* Textarea wrapper */}
          <div
            className="bg-[#f9fafb] border-[1.5px] border-[#e5e7eb] rounded-xl
                       px-3.5 py-3 transition-all duration-200"
            onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
            onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
          >
            <div className="flex items-start gap-2.5">
              <span className="text-[#9ca3af] text-base pt-0.5 flex-shrink-0">📝</span>
              <textarea
                rows={6}
                placeholder={t("ai_describe_ph")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full outline-none bg-transparent text-sm
                           text-[#111827] placeholder:text-[#9ca3af] resize-none"
              />
            </div>

            {/* ── Paste button ─────────────────────────────────────────────── */}
            <div className="flex items-center justify-between mt-2 pt-2
                            border-t border-[#e5e7eb]">
              <span className="text-[10px] text-[#9ca3af]">
                {t("ai_chars").replace("{n}", String(description.length))}
                {description.length >= 80 && (
                  <span style={{ color: "#1e5f74" }}> {t("ai_chars_good")}</span>
                )}
              </span>
              <button
                type="button"
                onClick={handlePaste}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg
                           text-[11px] font-semibold transition-all active:scale-95"
                style={{
                  background: pasted ? "#e0f0f5" : "#f3f4f6",
                  color:      pasted ? "#1e5f74" : "#6b7280",
                  border:     pasted ? "1px solid rgba(30,95,116,0.3)" : "1px solid #e5e7eb",
                }}
              >
                {pasted ? (
                  <>
                    {/* Check icon */}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <path d="M5 13l4 4L19 7" stroke="#1e5f74"
                        strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Pasted!
                  </>
                ) : (
                  <>
                    {/* Clipboard icon */}
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                      <rect x="8" y="2" width="8" height="4" rx="1" stroke="currentColor" strokeWidth="1.8"/>
                      <path d="M8 4H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-2"
                        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                    </svg>
                    Paste
                  </>
                )}
              </button>
            </div>
          </div>
        </SectionCard>

        {/* ② Photos ───────────────────────────────────────────────────────── */}
        <SectionCard icon="📸" title={t("ai_photos")}>
          <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
            {t("ai_photos_sub")}
          </p>
          <PhotoUploadSection
            photos={photos}
            maxPhotos={5}
            onUpload={(files) => setPhotos((prev) => [...prev, ...files])}
            onRemove={(i)     => setPhotos((prev) => prev.filter((_, idx) => idx !== i))}
          />
        </SectionCard>

        {/* ③ Location ─────────────────────────────────────────────────────── */}
        <SectionCard icon="📍" title={t("ai_location")}>
          <p className="text-[11px] text-[#9ca3af] mb-2.5 leading-relaxed">
            {t("ai_location_sub")}
          </p>

          {/* Address field */}
          <div
            className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                       rounded-xl px-3.5 py-2.5 mb-3 transition-all duration-200"
            onFocusCapture={(e) => onFocusTeal(e.currentTarget)}
            onBlurCapture={(e)  => onBlurTeal(e.currentTarget)}
          >
            <span className="text-[#9ca3af] text-base flex-shrink-0">🏘️</span>
            <input
              type="text"
              placeholder={t("ai_location_ph")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="flex-1 outline-none bg-transparent text-sm
                         text-[#111827] placeholder:text-[#9ca3af]"
            />
          </div>

          <MapPreview
            address={address || "No address typed yet"}
            coordinates={pinnedCoordinates}
            onChangeLocation={onOpenLocationPicker}
            hint="Tap to pin exact location on the map. We'll also geocode your typed address automatically."
          />
        </SectionCard>

        {/* Tips ───────────────────────────────────────────────────────────── */}
        <div
          className="flex items-start gap-3 px-4 py-3.5 rounded-2xl"
          style={{
            background: "linear-gradient(135deg,#fffbeb,#fef3c7)",
            border:     "1.5px solid rgba(240,165,0,0.3)",
          }}
        >
          <span className="text-xl flex-shrink-0">💡</span>
          <div>
            <p className="text-[12px] font-bold text-[#92400e] mb-1">{t("ai_tips_title")}</p>
            <ul className="text-[11px] text-[#92400e] space-y-0.5 leading-relaxed list-none">
              <li>{t("ai_tip_1")}</li>
              <li>{t("ai_tip_2")}</li>
              <li>{t("ai_tip_3")}</li>
              <li>{t("ai_tip_4")}</li>
            </ul>
          </div>
        </div>

        {/* ── Extract CTA ──────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={handleExtract}
          className="w-full py-[14px] rounded-xl text-[15px] font-bold
                     flex items-center justify-center gap-2.5
                     transition-all duration-200 active:scale-[0.98]"
          style={{
            background: "linear-gradient(135deg,#c88400 0%,#f0a500 100%)",
            boxShadow:  "0 4px 20px rgba(240,165,0,0.45)",
            color:      "#143d4d",
            fontFamily: "'Raleway', sans-serif",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 6px 24px rgba(240,165,0,0.6)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 20px rgba(240,165,0,0.45)";
          }}
        >
          {/* Sparkle */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
              fill="#143d4d" />
            <path d="M19 16L19.9 18.9L22 20L19.9 21.1L19 24L18.1 21.1L16 20L18.1 18.9L19 16Z"
              fill="#143d4d" opacity="0.6" />
          </svg>
          {t("ai_extract_btn")}
        </button>
      </div>

      {/* ── Extraction progress modal (portal) ─────────────────────────────── */}
      <ExtractionModal
        isOpen={modalOpen}
        phase={phase}
        address={address.trim()}
        error={errorMsg}
        onRetry={handleRetry}
        onCancel={handleCancel}
      />
    </>
  );
}

