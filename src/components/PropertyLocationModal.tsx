"use client";

import React, { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import type { LatLngExpression } from "leaflet";
import {
  FiSearch, FiMapPin, FiNavigation,
  FiChevronRight, FiChevronLeft,
  FiX, FiCheck, FiPlus, FiList, FiMap,
  FiEdit2, FiTrash2, FiRefreshCw, FiAlertCircle,
} from "react-icons/fi";
import Popup from "./shared/Popup";
import {
  searchLandmarks,
  createLandmark,
  updateLandmark,
} from "@/services/landmarkApi";
import type { LocalLandmark, ExternalLandmark } from "@/components/LandmarksPickerMap";
import { useLanguage } from "@/i18n/LanguageContext";

const LocationPickerMap = dynamic(
  () => import("@/components/LocationPickerMap"),
  { ssr: false }
);
const LandmarksPickerMap = dynamic(
  () => import("@/components/LandmarksPickerMap"),
  { ssr: false }
);

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────

export interface Landmark {
  id:       string;
  name:     string;
  lat:      number;
  lng:      number;
  category: LandmarkCategory;
  dbId?:    string;
}

export type LandmarkCategory =
  | "school" | "hospital" | "market"  | "transport"
  | "mall"   | "bank"     | "restaurant" | "park"
  | "place_of_worship"    | "other";

export const LANDMARK_CATEGORIES: {
  value: LandmarkCategory; label: string; emoji: string;
}[] = [
  { value: "school",           label: "School",           emoji: "🎓" },
  { value: "hospital",         label: "Hospital",         emoji: "🏥" },
  { value: "market",           label: "Market",           emoji: "🛒" },
  { value: "transport",        label: "Bus / Transport",  emoji: "🚌" },
  { value: "mall",             label: "Mall",             emoji: "🏬" },
  { value: "bank",             label: "Bank / ATM",       emoji: "🏦" },
  { value: "restaurant",       label: "Restaurant",       emoji: "🍽️" },
  { value: "park",             label: "Park",             emoji: "🌳" },
  { value: "place_of_worship", label: "Place of Worship", emoji: "⛪" },
  { value: "other",            label: "Other",            emoji: "📍" },
];

// ─────────────────────────────────────────────────────────────────────────────
// PROPS
// ─────────────────────────────────────────────────────────────────────────────

interface PropertyLocationModalProps {
  isOpen:              boolean;
  onClose:             () => void;
  userCoordinates:     LatLngExpression | null;
  fallbackCoordinates: [number, number];
  onLocationSelect:    (lat: number, lng: number) => void;
  onLandmarksSelect?:  (landmarks: Landmark[]) => void;
  initialLandmarks?:   Landmark[];
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const StepIndicator: React.FC<{ step: 1 | 2 }> = ({ step }) => {
  const { t } = useLanguage();
  return (
    <div className="flex items-center gap-2 shrink-0">
      <div className="flex items-center gap-1.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center
                         text-[11px] font-bold transition-all duration-200
                         ${step === 1 ? "bg-[#1e5f74] text-white shadow-sm" : "bg-[#e0f0f5] text-[#1e5f74]"}`}>
          1
        </div>
        <span className={`text-xs font-semibold ${step === 1 ? "text-[#1e5f74]" : "text-[#9ca3af]"}`}>
          {t("lm_step_location")}
        </span>
      </div>
      <FiChevronRight size={12} className="text-[#d1d5db]" />
      <div className="flex items-center gap-1.5">
        <div className={`w-6 h-6 rounded-full flex items-center justify-center
                         text-[11px] font-bold transition-all duration-200
                         ${step === 2 ? "bg-[#1e5f74] text-white shadow-sm" : "bg-[#e0f0f5] text-[#1e5f74]"}`}>
          2
        </div>
        <span className={`text-xs font-semibold ${step === 2 ? "text-[#1e5f74]" : "text-[#9ca3af]"}`}>
          {t("lm_step_facilities")}
        </span>
      </div>
    </div>
  );
};

const CategoryPills: React.FC<{
  selected: LandmarkCategory;
  onChange: (v: LandmarkCategory) => void;
}> = ({ selected, onChange }) => (
  <div className="flex flex-wrap gap-1.5">
    {LANDMARK_CATEGORIES.map(cat => (
      <button key={cat.value} type="button" onClick={() => onChange(cat.value)}
        className={`flex items-center gap-1 px-2.5 py-1.5 rounded-full
                    text-[11px] font-semibold border transition-all active:scale-95
                    ${selected === cat.value
                      ? "bg-[#1e5f74] text-white border-[#1e5f74] shadow-sm"
                      : "bg-white text-[#4b5563] border-[#e5e7eb] hover:border-[#1e5f74] hover:text-[#1e5f74]"}`}>
        <span className="text-sm leading-none">{cat.emoji}</span>
        <span>{cat.label}</span>
      </button>
    ))}
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
// LANDMARK FORM BODY
// ─────────────────────────────────────────────────────────────────────────────

const LandmarkFormBody: React.FC<{
  mode:           "add" | "edit";
  lat:            number;
  lng:            number;
  name:           string;
  category:       LandmarkCategory;
  error:          string;
  saving:         boolean;
  onNameChange:   (v: string) => void;
  onCatChange:    (v: LandmarkCategory) => void;
  onSubmit:       () => void;
  searchResults:  ExternalLandmark[];
  searchLoading:  boolean;
}> = ({
  mode, lat, lng, name, category, error, saving,
  onNameChange, onCatChange, onSubmit,
  searchResults, searchLoading,
}) => {
  const { t } = useLanguage();
  return (
    <div className="space-y-4">

      {/* Selected pin chip (add mode) */}
      {mode === "add" && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        bg-[#e0f0f5] border border-[#1e5f74]/30">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#1e5f74] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#a8d8e8]" />
            <span className="text-[11px] font-bold text-white leading-none">
              {name.trim() ? name.trim().slice(0, 14) : t("lm_new_pin")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#1e5f74] font-semibold uppercase tracking-wide mb-0.5">
              {t("lm_pinned_location")}
            </p>
            <p className="text-xs font-mono text-[#374151]">
              {lat.toFixed(5)},&nbsp;{lng.toFixed(5)}
            </p>
          </div>
        </div>
      )}

      {/* Coordinates (edit mode) */}
      {mode === "edit" && (
        <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                        bg-[#f5f7f9] border border-[#e5e7eb]">
          <FiMapPin size={13} className="text-[#1e5f74] shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-[#9ca3af] font-semibold uppercase tracking-wide mb-0.5">
              {t("map_gps")}
            </p>
            <p className="text-xs font-mono text-[#374151]">
              {lat.toFixed(6)},&nbsp;{lng.toFixed(6)}
            </p>
          </div>
        </div>
      )}

      {/* Live search results — "Already in DB nearby" (add mode) */}
      {mode === "add" && (searchLoading || searchResults.length > 0) && (
        <div className="rounded-xl border border-[#e5e7eb] overflow-hidden">
          <div className="flex items-center gap-2 px-3 py-2 bg-[#f9fafb] border-b border-[#e5e7eb]">
            <span className="text-sm">📌</span>
            <p className="text-[11px] font-bold text-[#374151] uppercase tracking-wide">
              {t("lm_already_tagged")}
            </p>
            {searchLoading
              ? <FiRefreshCw size={10} className="ml-auto text-[#9ca3af] animate-spin" />
              : <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5
                                 rounded-full bg-[#e5e7eb] text-[#6b7280]">
                  {searchResults.length}
                </span>
            }
          </div>

          {!searchLoading && (
            <ul className="divide-y divide-[#f3f4f6] max-h-[148px] overflow-y-auto">
              {searchResults.map((lm) => {
                const cat = LANDMARK_CATEGORIES.find(c => c.value === lm.category);
                const dist = lm.distanceM != null
                  ? lm.distanceM < 1000
                    ? `${Math.round(lm.distanceM)} m`
                    : `${(lm.distanceM / 1000).toFixed(1)} km`
                  : null;
                return (
                  <li key={lm.id}
                    className="flex items-center gap-2.5 px-3 py-2.5 hover:bg-[#f9fafb] transition-colors">
                    <span className="text-base leading-none shrink-0">{cat?.emoji ?? "📍"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#111827] truncate">{lm.name}</p>
                      <p className="text-[10px] text-[#9ca3af]">{cat?.label ?? t("lm_other")}</p>
                    </div>
                    <div className="shrink-0 flex flex-col items-end gap-0.5">
                      {dist && (
                        <span className="text-[10px] font-semibold text-[#1e5f74]
                                         bg-[#e0f0f5] px-1.5 py-0.5 rounded-full">
                          {dist}
                        </span>
                      )}
                      <span className="text-[9px] text-[#9ca3af]">
                        ✓{lm.verifiedCount}
                      </span>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="px-3 py-2 bg-[#fffbeb] border-t border-[#fde68a]">
            <p className="text-[10px] text-[#92400e] leading-relaxed">
              {t("lm_duplicate_hint")}
            </p>
          </div>
        </div>
      )}

      {/* Name field */}
      <div>
        <label className="block text-xs font-semibold text-[#374151] mb-1.5">
          {t("lm_name_label")} <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder={t("lm_name_ph")}
          value={name}
          onChange={(e) => onNameChange(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); onSubmit(); } }}
          autoFocus
          disabled={saving}
          className={`w-full text-sm px-3 py-2.5 rounded-xl border outline-none
                      bg-white text-[#111827] placeholder:text-[#9ca3af] transition-colors
                      disabled:opacity-50
                      ${error
                        ? "border-red-400 ring-1 ring-red-200"
                        : "border-[#d1d5db] focus:border-[#1e5f74] focus:ring-1 focus:ring-[#e0f0f5]"}`}
        />
        {error && (
          <p className="mt-1.5 text-[11px] text-red-500 flex items-center gap-1">
            <FiAlertCircle size={10} /> {error}
          </p>
        )}
      </div>

      {/* Category picker */}
      <div>
        <label className="block text-xs font-semibold text-[#374151] mb-2">
          {t("lm_category_label")}
        </label>
        <CategoryPills selected={category} onChange={onCatChange} />
      </div>

      {/* Submit */}
      <button
        type="button"
        onClick={onSubmit}
        disabled={saving}
        className="w-full py-3 rounded-xl bg-[#1e5f74] hover:bg-[#143d4d]
                   text-white text-sm font-bold flex items-center justify-center
                   gap-2 shadow-sm active:scale-95 transition-all disabled:opacity-60">
        {saving
          ? <><FiRefreshCw size={14} className="animate-spin" /> {t("lm_saving")}</>
          : mode === "add"
            ? <><FiPlus size={14} /> {t("lm_add_btn")}</>
            : <><FiCheck size={14} /> {t("lm_save_changes")}</>}
      </button>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// DELETE CONFIRM BODY
// ─────────────────────────────────────────────────────────────────────────────

const DeleteConfirmBody: React.FC<{
  landmark: LocalLandmark;
  onConfirm: () => void;
  onCancel:  () => void;
}> = ({ landmark, onConfirm, onCancel }) => {
  const { t } = useLanguage();
  const cat = LANDMARK_CATEGORIES.find(c => c.value === landmark.category);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl
                      bg-[#fef2f2] border border-red-100">
        <span className="text-2xl leading-none shrink-0">{cat?.emoji ?? "📍"}</span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-[#111827] truncate">{landmark.name}</p>
          <p className="text-xs text-[#9ca3af] mt-0.5">
            {cat?.label ?? t("lm_other")} ·{" "}
            <span className="font-mono">{landmark.lat.toFixed(4)}, {landmark.lng.toFixed(4)}</span>
          </p>
        </div>
      </div>
      <p className="text-sm text-[#4b5563] leading-relaxed text-center">
        {t("lm_delete_desc")}
      </p>
      <div className="flex gap-3">
        <button type="button" onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-[#e5e7eb] bg-[#f9fafb]
                     text-sm font-semibold text-[#6b7280]
                     hover:border-[#9ca3af] active:scale-95 transition-all">
          {t("lm_keep_btn")}
        </button>
        <button type="button" onClick={onConfirm}
          className="flex-[2] py-3 rounded-xl bg-red-500 hover:bg-red-600
                     text-white text-sm font-bold flex items-center justify-center
                     gap-2 shadow-sm active:scale-95 transition-all">
          <FiTrash2 size={14} /> {t("lm_remove_btn")}
        </button>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// LANDMARK CHIP
// ─────────────────────────────────────────────────────────────────────────────

const LandmarkChip: React.FC<{
  landmark: LocalLandmark;
  index:    number;
  onEdit:   (id: string) => void;
  onDelete: (id: string) => void;
}> = ({ landmark, index, onEdit, onDelete }) => {
  const { t } = useLanguage();
  const cat = LANDMARK_CATEGORIES.find(c => c.value === landmark.category);
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl
                    bg-white border border-[#e5e7eb] shadow-sm hover:border-[#c5dde6] transition-colors">
      <div className="w-5 h-5 rounded-full bg-[#1e5f74] flex items-center justify-center
                      text-white text-[10px] font-bold shrink-0">
        {index + 1}
      </div>
      <span className="text-base leading-none shrink-0">{cat?.emoji ?? "📍"}</span>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-bold text-[#111827] truncate">{landmark.name}</p>
        <p className="text-[10px] text-[#9ca3af]">{cat?.label ?? t("lm_other")}</p>
      </div>
      <button onClick={() => onEdit(landmark.id)}
        aria-label={t("lm_edit_aria")}
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-[#6b7280] hover:text-[#1e5f74] hover:bg-[#e0f0f5]
                   active:scale-95 transition-all shrink-0">
        <FiEdit2 size={12} />
      </button>
      <button onClick={() => onDelete(landmark.id)}
        aria-label={t("lm_delete_aria")}
        className="w-7 h-7 flex items-center justify-center rounded-lg
                   text-[#6b7280] hover:text-red-500 hover:bg-red-50
                   active:scale-95 transition-all shrink-0">
        <FiTrash2 size={12} />
      </button>
    </div>
  );
};

const LandmarkList: React.FC<{
  landmarks: LocalLandmark[];
  onEdit:    (id: string) => void;
  onDelete:  (id: string) => void;
  onGoToMap?: () => void;
}> = ({ landmarks, onEdit, onDelete, onGoToMap }) => {
  const { t } = useLanguage();
  if (landmarks.length === 0) {
    return (
      <div className="flex flex-col items-center py-8 gap-2 opacity-60">
        <span className="text-4xl">📍</span>
        <p className="text-sm font-semibold text-[#6b7280]">{t("lm_empty_title")}</p>
        <p className="text-xs text-[#9ca3af] text-center">{t("lm_empty_sub")}</p>
        {onGoToMap && (
          <button onClick={onGoToMap}
            className="mt-2 flex items-center gap-1.5 px-3 py-2 rounded-xl
                       bg-[#1e5f74] text-white text-xs font-bold active:scale-95 transition-all">
            <FiMap size={12} /> {t("lm_go_to_map")}
          </button>
        )}
      </div>
    );
  }
  return (
    <div className="space-y-2">
      {landmarks.map((lm, i) => (
        <LandmarkChip key={lm.id} landmark={lm} index={i} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const PropertyLocationModal: React.FC<PropertyLocationModalProps> = ({
  isOpen,
  onClose,
  userCoordinates,
  fallbackCoordinates,
  onLocationSelect,
  onLandmarksSelect,
  initialLandmarks = [],
}) => {
  const { t } = useLanguage();

  // ── Step 1 ──────────────────────────────────────────────────────────────────
  const [step, setStep]                     = useState<1 | 2>(1);
  const [searchValue, setSearchValue]       = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");
  const [searchLoading, setSearchLoading]   = useState(false);

  // ── Step 2 — local session landmarks ────────────────────────────────────────
  const [landmarks, setLandmarks] = useState<LocalLandmark[]>(
    initialLandmarks.map(lm => ({
      id: lm.id, name: lm.name, lat: lm.lat, lng: lm.lng, category: lm.category,
    }))
  );
  const [lmSearchValue, setLmSearchValue]       = useState("");
  const [lmSubmittedQuery, setLmSubmittedQuery] = useState("");
  const [lmSearchLoading, setLmSearchLoading]   = useState(false);
  const [mobileView, setMobileView]             = useState<"map" | "list">("map");
  const [selectedId, setSelectedId]             = useState<string | null>(null);

  // ── DB search results ─────────────────────────────────────────────────────
  const [dbSearchResults, setDbSearchResults]     = useState<ExternalLandmark[]>([]);
  const [dbSearchLoading, setDbSearchLoading]     = useState(false);
  const [externalLandmarks, setExternalLandmarks] = useState<ExternalLandmark[]>([]);

  // ── ADD popup state ──────────────────────────────────────────────────────────
  const [pendingPin, setPendingPin]   = useState<{ lat: number; lng: number } | null>(null);
  const [addName, setAddName]         = useState("");
  const [addCategory, setAddCategory] = useState<LandmarkCategory>("other");
  const [addError, setAddError]       = useState("");
  const [addSaving, setAddSaving]     = useState(false);

  // ── EDIT popup state ─────────────────────────────────────────────────────────
  const [editTarget, setEditTarget]     = useState<LocalLandmark | null>(null);
  const [editName, setEditName]         = useState("");
  const [editCategory, setEditCategory] = useState<LandmarkCategory>("other");
  const [editError, setEditError]       = useState("");
  const [editSaving, setEditSaving]     = useState(false);

  // ── DELETE popup state ───────────────────────────────────────────────────────
  const [deleteTarget, setDeleteTarget] = useState<LocalLandmark | null>(null);

  // ── Debounce ref for live search ─────────────────────────────────────────────
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const searchCtrlRef  = useRef<AbortController | null>(null);

  // Sync landmarks when modal reopens
  useEffect(() => {
    if (isOpen) {
      setLandmarks(
        initialLandmarks.map(lm => ({
          id: lm.id, name: lm.name, lat: lm.lat, lng: lm.lng, category: lm.category,
        }))
      );
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch global DB landmarks when step 2 opens
  useEffect(() => {
    if (!isOpen || step !== 2) return;
    const centre = (userCoordinates as [number, number]) ?? fallbackCoordinates;
    const [lat, lng] = Array.isArray(centre) ? centre : [centre as any, 0];

    const ctrl = new AbortController();
    searchLandmarks({ lat, lng, radius: 2000, limit: 50 }, { signal: ctrl.signal })
      .then((results) => {
        if (!results) return;
        setExternalLandmarks(results as ExternalLandmark[]);
      })
      .catch(() => {});

    return () => ctrl.abort();
  }, [isOpen, step]); // eslint-disable-line react-hooks/exhaustive-deps

  // Live search as user types in Add popup
  useEffect(() => {
    if (!pendingPin) { setDbSearchResults([]); return; }

    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(async () => {
      if (searchCtrlRef.current) searchCtrlRef.current.abort();
      searchCtrlRef.current = new AbortController();

      setDbSearchLoading(true);
      const results = await searchLandmarks(
        {
          query:  addName.trim() || undefined,
          lat:    pendingPin.lat,
          lng:    pendingPin.lng,
          radius: 300,
          limit:  8,
        },
        { signal: searchCtrlRef.current.signal }
      );
      setDbSearchLoading(false);
      if (results) setDbSearchResults(results as ExternalLandmark[]);
    }, 500);

    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [addName, pendingPin]);

  // ── Step 1 helpers ───────────────────────────────────────────────────────────

  const triggerSearch = useCallback(() => {
    if (searchValue.trim()) setSubmittedQuery(searchValue.trim());
  }, [searchValue]);

  const triggerLmSearch = useCallback(() => {
    if (lmSearchValue.trim()) setLmSubmittedQuery(lmSearchValue.trim());
  }, [lmSearchValue]);

  // ── Map click → open Add popup ───────────────────────────────────────────────

  const handleLandmarkMapClick = useCallback((lat: number, lng: number) => {
    setEditTarget(null);
    setDeleteTarget(null);
    setSelectedId(null);
    setPendingPin({ lat, lng });
    setAddName("");
    setAddCategory("other");
    setAddError("");
    setDbSearchResults([]);
  }, []);

  // ── ADD handlers ─────────────────────────────────────────────────────────────

  const closeAddPopup = useCallback(() => {
    setPendingPin(null);
    setAddName("");
    setAddError("");
    setDbSearchResults([]);
    setDbSearchLoading(false);
  }, []);

  const confirmAdd = useCallback(async () => {
    if (!pendingPin) return;
    if (!addName.trim()) { setAddError(t("lm_err_name_required")); return; }

    setAddSaving(true);
    setAddError("");
    try {
      const saved = await createLandmark({
        name:     addName.trim(),
        category: addCategory,
        lat:      pendingPin.lat,
        lng:      pendingPin.lng,
      });

      setLandmarks(prev => [
        ...prev,
        {
          id:       saved.id,
          name:     saved.name,
          lat:      saved.lat,
          lng:      saved.lng,
          category: saved.category,
        },
      ]);
      closeAddPopup();
      setMobileView("list");
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? t("lm_err_save_failed");
      setAddError(msg);
    } finally {
      setAddSaving(false);
    }
  }, [pendingPin, addName, addCategory, closeAddPopup, t]);

  // ── EDIT handlers ────────────────────────────────────────────────────────────

  const openEditPopup = useCallback((id: string) => {
    const lm = landmarks.find(l => l.id === id);
    if (!lm) return;
    setPendingPin(null);
    setDeleteTarget(null);
    setEditTarget(lm);
    setEditName(lm.name);
    setEditCategory(lm.category);
    setEditError("");
  }, [landmarks]);

  const handleMarkerClick = useCallback((id: string) => {
    setSelectedId(id);
    openEditPopup(id);
  }, [openEditPopup]);

  const closeEditPopup = useCallback(() => {
    setEditTarget(null);
    setEditName("");
    setEditError("");
    setSelectedId(null);
  }, []);

  const confirmEdit = useCallback(async () => {
    if (!editTarget) return;
    if (!editName.trim()) { setEditError(t("lm_err_name_required")); return; }

    setEditSaving(true);
    setEditError("");
    try {
      const saved = await updateLandmark(editTarget.id, {
        name:     editName.trim(),
        category: editCategory,
      });

      setLandmarks(prev =>
        prev.map(lm =>
          lm.id === editTarget.id
            ? { ...lm, name: saved.name, category: saved.category }
            : lm
        )
      );
      closeEditPopup();
    } catch (err: any) {
      const msg = err?.response?.data?.message ?? t("lm_err_update_failed");
      setEditError(msg);
    } finally {
      setEditSaving(false);
    }
  }, [editTarget, editName, editCategory, closeEditPopup, t]);

  // ── DELETE handlers ──────────────────────────────────────────────────────────

  const openDeletePopup = useCallback((id: string) => {
    const lm = landmarks.find(l => l.id === id);
    if (!lm) return;
    setPendingPin(null);
    setEditTarget(null);
    setDeleteTarget(lm);
  }, [landmarks]);

  const closeDeletePopup = useCallback(() => setDeleteTarget(null), []);

  const confirmDelete = useCallback(() => {
    if (!deleteTarget) return;
    setLandmarks(prev => prev.filter(l => l.id !== deleteTarget.id));
    closeDeletePopup();
  }, [deleteTarget, closeDeletePopup]);

  // ── Confirm / skip ───────────────────────────────────────────────────────────

  const handleConfirm = useCallback(() => {
    onLandmarksSelect?.(
      landmarks.map(lm => ({
        id: lm.id, name: lm.name, lat: lm.lat, lng: lm.lng, category: lm.category,
      }))
    );
    onClose();
  }, [landmarks, onLandmarksSelect, onClose]);

  const handleSkipLandmarks = useCallback(() => {
    onLandmarksSelect?.([]);
    onClose();
  }, [onLandmarksSelect, onClose]);

  if (!isOpen) return null;

  const mapCenter: LatLngExpression = userCoordinates ?? fallbackCoordinates;

  // ── Save button label — computed once, reused in 3 footers ──────────────────
  const saveLabel = landmarks.length > 0
    ? `${t("lm_save_btn")} (${landmarks.length})`
    : t("lm_done_btn");

  return (
    <>
      {/* ════════════════════════════════════════════════════════════
          MODAL SHELL
      ════════════════════════════════════════════════════════════ */}
      <div
        className="fixed inset-0 z-[200] flex flex-col bg-white"
        style={{ overscrollBehavior: "none" }}
      >
        {/* Header */}
        <div className="shrink-0 flex items-center justify-between px-4 py-3
                        border-b border-[#e5e7eb] bg-white">
          <StepIndicator step={step} />
          <button onClick={onClose}
            aria-label={t("common_close")}
            className="w-8 h-8 flex items-center justify-center rounded-xl
                       text-[#9ca3af] hover:text-[#374151] hover:bg-[#f9fafb]
                       active:scale-95 transition-all">
            <FiX size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

          {/* ═══ STEP 1 — Location picker ═══ */}
          {step === 1 && (
            <div className="flex-1 flex flex-col min-h-0">
              {/* Search bar */}
              <div className="shrink-0 px-3 py-2 bg-white border-b border-[#e5e7eb]">
                <div className="flex shadow-sm rounded-full overflow-hidden
                                border border-[#e5e7eb] md:max-w-md md:mx-auto">
                  <div className="flex bg-white px-3 py-2.5 w-full gap-2 items-center">
                    <FiSearch size={13} className="text-[#9ca3af] shrink-0" />
                    <input
                      type="text"
                      placeholder={t("lm_search_address_ph")}
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && triggerSearch()}
                      className="w-full outline-none text-sm text-[#374151]
                                 placeholder:text-[#9ca3af] bg-transparent"
                    />
                    {searchValue && (
                      <button
                        onClick={() => { setSearchValue(""); setSubmittedQuery(""); }}
                        aria-label={t("common_close")}
                        className="text-[#9ca3af] hover:text-[#374151]">
                        <FiX size={12} />
                      </button>
                    )}
                  </div>
                  <button onClick={triggerSearch} disabled={searchLoading}
                    className="bg-[#1e5f74] hover:bg-[#143d4d] px-4 text-white
                               flex items-center justify-center transition-colors shrink-0">
                    {searchLoading
                      ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      : <FiSearch size={15} />}
                  </button>
                </div>
              </div>

              {/* Map */}
              <div className="flex-1 min-h-0">
                <LocationPickerMap
                  initialCenter={mapCenter}
                  onLocationSelect={onLocationSelect}
                  submittedQuery={submittedQuery}
                  setSearchLoading={setSearchLoading}
                />
              </div>

              {/* Step 1 footer */}
              <div className="shrink-0 px-4 py-4 bg-white border-t border-[#e5e7eb]
                              shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                <div className="flex gap-3 max-w-md mx-auto">
                  <button onClick={onClose}
                    className="flex items-center gap-1.5 px-4 py-3 rounded-xl
                               text-sm font-semibold text-[#6b7280]
                               border border-[#e5e7eb] bg-[#f9fafb]
                               hover:border-[#9ca3af] active:scale-95 transition-all">
                    {t("common_cancel")}
                  </button>
                  <button onClick={() => setStep(2)}
                    className="flex-1 py-3 rounded-xl bg-[#1e5f74] hover:bg-[#143d4d]
                               text-white text-sm font-bold flex items-center
                               justify-center gap-2 shadow-md active:scale-95 transition-all">
                    {t("lm_next_step")} <FiChevronRight size={15} />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ STEP 2 — Landmark picker ═══ */}
          {step === 2 && (
            <div className="flex-1 flex min-h-0 overflow-hidden">

              {/* Desktop left panel */}
              <div className="hidden lg:flex flex-col w-[300px] xl:w-[340px] shrink-0
                              border-r border-[#e5e7eb] bg-[#f9fafb] overflow-y-auto z-10">
                <div className="px-4 pt-4 pb-3 border-b border-[#e5e7eb] bg-white shrink-0">
                  <div className="flex items-center gap-2 mb-1">
                    <FiNavigation size={14} className="text-[#1e5f74]" />
                    <h3 className="text-sm font-bold text-[#111827]">{t("lm_panel_title")}</h3>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full
                                     bg-[#e0f0f5] text-[#1e5f74] ml-auto">
                      {t("lm_optional")}
                    </span>
                  </div>
                  <p className="text-xs text-[#6b7280] leading-relaxed">
                    {t("lm_panel_desc")}
                  </p>
                </div>
                <div className="flex-1 px-3 py-3 overflow-y-auto">
                  <LandmarkList landmarks={landmarks} onEdit={openEditPopup} onDelete={openDeletePopup} />
                </div>
                <div className="shrink-0 px-3 py-3 bg-white border-t border-[#e5e7eb]">
                  <div className="flex gap-2">
                    <button onClick={() => setStep(1)}
                      className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl
                                 text-xs font-semibold text-[#6b7280]
                                 border border-[#e5e7eb] bg-[#f9fafb]
                                 hover:border-[#9ca3af] active:scale-95 transition-all">
                      <FiChevronLeft size={13} /> {t("lm_back_btn")}
                    </button>
                    <button onClick={handleSkipLandmarks}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold
                                 text-[#6b7280] border border-[#e5e7eb] bg-[#f9fafb]
                                 hover:border-[#9ca3af] active:scale-95 transition-all">
                      {t("lm_skip_btn")}
                    </button>
                    <button onClick={handleConfirm}
                      className="flex-[2] py-2.5 rounded-xl bg-[#1e5f74] hover:bg-[#143d4d]
                                 text-white text-sm font-bold flex items-center
                                 justify-center gap-2 shadow-sm active:scale-95 transition-all">
                      <FiCheck size={14} />
                      {saveLabel}
                    </button>
                  </div>
                </div>
              </div>

              {/* Map column */}
              <div className={`flex-1 flex flex-col min-h-0 ${mobileView === "list" ? "hidden lg:flex" : "flex"}`}>
                {/* Map search bar */}
                <div className="shrink-0 px-3 py-2 bg-white border-b border-[#e5e7eb]">
                  <div className="flex shadow-sm rounded-full overflow-hidden
                                  border border-[#e5e7eb] md:max-w-md md:mx-auto">
                    <div className="flex bg-white px-3 py-2.5 w-full gap-2 items-center">
                      <FiSearch size={13} className="text-[#9ca3af] shrink-0" />
                      <input
                        type="text"
                        placeholder={t("lm_search_area_ph")}
                        value={lmSearchValue}
                        onChange={(e) => setLmSearchValue(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && triggerLmSearch()}
                        className="w-full outline-none text-sm text-[#374151]
                                   placeholder:text-[#9ca3af] bg-transparent"
                      />
                      {lmSearchValue && (
                        <button
                          onClick={() => { setLmSearchValue(""); setLmSubmittedQuery(""); }}
                          aria-label={t("common_close")}
                          className="text-[#9ca3af] hover:text-[#374151]">
                          <FiX size={12} />
                        </button>
                      )}
                    </div>
                    <button onClick={triggerLmSearch} disabled={lmSearchLoading}
                      className="bg-[#1e5f74] hover:bg-[#143d4d] px-4 text-white
                                 flex items-center justify-center transition-colors shrink-0">
                      {lmSearchLoading
                        ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        : <FiSearch size={15} />}
                    </button>
                  </div>
                </div>

                {/* Map */}
                <div className="flex-1 min-h-0">
                  <LandmarksPickerMap
                    initialCenter={mapCenter}
                    localLandmarks={landmarks}
                    selectedId={selectedId}
                    pendingPin={pendingPin}
                    externalLandmarks={externalLandmarks}
                    onMapClick={handleLandmarkMapClick}
                    onMarkerClick={handleMarkerClick}
                    submittedQuery={lmSubmittedQuery}
                    setSearchLoading={setLmSearchLoading}
                  />
                </div>

                {/* Map footer */}
                <div className="shrink-0 px-4 py-3 bg-white border-t border-[#e5e7eb]
                                shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                  <div className="flex gap-2 max-w-md mx-auto">
                    <button onClick={() => setStep(1)}
                      className="flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl
                                 text-xs font-semibold text-[#6b7280]
                                 border border-[#e5e7eb] bg-[#f9fafb]
                                 hover:border-[#9ca3af] active:scale-95 transition-all">
                      <FiChevronLeft size={14} /> {t("lm_back_btn")}
                    </button>
                    <button onClick={handleSkipLandmarks}
                      className="flex-1 py-2.5 rounded-xl text-xs font-semibold
                                 text-[#6b7280] border border-[#e5e7eb] bg-[#f9fafb]
                                 hover:border-[#9ca3af] active:scale-95 transition-all">
                      {t("lm_skip_btn")}
                    </button>
                    <button onClick={handleConfirm}
                      className="flex-[2] py-2.5 rounded-xl bg-[#1e5f74] hover:bg-[#143d4d]
                                 text-white text-sm font-bold flex items-center
                                 justify-center gap-2 shadow-sm active:scale-95 transition-all">
                      <FiCheck size={14} />
                      {saveLabel}
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile list view */}
              {mobileView === "list" && (
                <div className="flex lg:hidden flex-col flex-1 min-h-0
                                bg-[#f9fafb] overflow-hidden">
                  <div className="px-4 pt-4 pb-3 bg-white border-b border-[#e5e7eb] shrink-0">
                    <div className="flex items-center gap-2">
                      <FiNavigation size={14} className="text-[#1e5f74]" />
                      <h3 className="text-sm font-bold text-[#111827]">{t("lm_mobile_list_title")}</h3>
                      {landmarks.length > 0 && (
                        <span className="ml-auto text-[10px] font-bold px-2 py-0.5
                                         rounded-full bg-[#e0f0f5] text-[#1e5f74]">
                          {t("lm_added_count").replace("{n}", String(landmarks.length))}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#6b7280] mt-1">{t("lm_mobile_list_hint")}</p>
                  </div>
                  <div className="flex-1 overflow-y-auto px-4 py-3">
                    <LandmarkList
                      landmarks={landmarks}
                      onEdit={openEditPopup}
                      onDelete={openDeletePopup}
                      onGoToMap={() => setMobileView("map")}
                    />
                  </div>
                  <div className="shrink-0 px-4 py-4 bg-white border-t border-[#e5e7eb]
                                  shadow-[0_-4px_16px_rgba(0,0,0,0.06)]">
                    <div className="flex gap-2">
                      <button onClick={() => setStep(1)}
                        className="flex items-center gap-1.5 px-3 py-3 rounded-xl
                                   text-xs font-semibold text-[#6b7280]
                                   border border-[#e5e7eb] bg-[#f9fafb]
                                   hover:border-[#9ca3af] active:scale-95 transition-all">
                        <FiChevronLeft size={13} /> {t("lm_back_btn")}
                      </button>
                      <button onClick={handleSkipLandmarks}
                        className="flex-1 py-3 rounded-xl text-xs font-semibold
                                   text-[#6b7280] border border-[#e5e7eb] bg-[#f9fafb]
                                   hover:border-[#9ca3af] active:scale-95 transition-all">
                        {t("lm_skip_btn")}
                      </button>
                      <button onClick={handleConfirm}
                        className="flex-[2] py-3 rounded-xl bg-[#1e5f74] hover:bg-[#143d4d]
                                   text-white text-sm font-bold flex items-center
                                   justify-center gap-2 shadow-md active:scale-95 transition-all">
                        <FiCheck size={15} />
                        {saveLabel}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile map/list toggle */}
              <div className="lg:hidden fixed bottom-[80px] right-4 z-[210]">
                <button
                  onClick={() => setMobileView(v => v === "map" ? "list" : "map")}
                  className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl
                             bg-white shadow-lg border border-[#e5e7eb]
                             text-xs font-bold text-[#1e5f74] active:scale-95 transition-all">
                  {mobileView === "map"
                    ? <><FiList size={13} /> {t("lm_toggle_list").replace("{n}", String(landmarks.length))}</>
                    : <><FiMap size={13} /> {t("lm_toggle_map")}</>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ════ ADD POPUP ════ */}
      <Popup
        header={t("lm_popup_add_title")}
        toggle={!!pendingPin}
        setToggle={(v) => { if (!v) closeAddPopup(); }}
        onClose={closeAddPopup}
        hideReset
        useMask
      >
        {pendingPin && (
          <LandmarkFormBody
            mode="add"
            lat={pendingPin.lat}
            lng={pendingPin.lng}
            name={addName}
            category={addCategory}
            error={addError}
            saving={addSaving}
            onNameChange={(v) => { setAddName(v); if (addError) setAddError(""); }}
            onCatChange={setAddCategory}
            onSubmit={confirmAdd}
            searchResults={dbSearchResults}
            searchLoading={dbSearchLoading}
          />
        )}
      </Popup>

      {/* ════ EDIT POPUP ════ */}
      <Popup
        header={t("lm_popup_edit_title")}
        toggle={!!editTarget}
        setToggle={(v) => { if (!v) closeEditPopup(); }}
        onClose={closeEditPopup}
        hideReset
        useMask
      >
        {editTarget && (
          <LandmarkFormBody
            mode="edit"
            lat={editTarget.lat}
            lng={editTarget.lng}
            name={editName}
            category={editCategory}
            error={editError}
            saving={editSaving}
            onNameChange={(v) => { setEditName(v); if (editError) setEditError(""); }}
            onCatChange={setEditCategory}
            onSubmit={confirmEdit}
            searchResults={[]}
            searchLoading={false}
          />
        )}
      </Popup>

      {/* ════ DELETE POPUP ════ */}
      <Popup
        header={t("lm_popup_delete_title")}
        toggle={!!deleteTarget}
        setToggle={(v) => { if (!v) closeDeletePopup(); }}
        onClose={closeDeletePopup}
        hideReset
        useMask
      >
        {deleteTarget && (
          <DeleteConfirmBody
            landmark={deleteTarget}
            onConfirm={confirmDelete}
            onCancel={closeDeletePopup}
          />
        )}
      </Popup>
    </>
  );
};

export default PropertyLocationModal;