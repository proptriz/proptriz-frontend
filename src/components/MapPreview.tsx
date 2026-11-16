"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/i18n/LanguageContext";

// Leaflet needs `window`, so the map is loaded on the client only.
// The teal block is what shows while it loads (and what used to be the placeholder).
const MiniMap = dynamic(() => import("./MiniMap"), {
  ssr: false,
  loading: () => (
    <div
      className="h-full w-full animate-pulse"
      style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 60%,#2d8ba8 100%)" }}
    />
  ),
});

// Positions the form starts with before the user picks anything.
const PLACEHOLDER_POSITIONS: [number, number][] = [
  [6.4281, 3.4219],
  [9.082, 8.6753],
  [0, 0],
];

interface MapPreviewProps {
  address: string;
  coordinates: [number, number];
  onChangeLocation: () => void;
  /** Optional hint text shown below the map to guide the user */
  hint?: string;
}

export default function MapPreview({
  address,
  coordinates,
  onChangeLocation,
  hint,
}: MapPreviewProps) {
  const { t } = useLanguage();
  const [lat, lng] = coordinates;
  const validCoords = Number.isFinite(lat) && Number.isFinite(lng);
  const hasCoords   = validCoords && !PLACEHOLDER_POSITIONS.some(([pLat, pLng]) => pLat === lat && pLng === lng);

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]">
        {/* Live map centred on the pin. The whole tile is the button that opens the picker. */}
        <div
          role="button"
          tabIndex={0}
          aria-label={hasCoords ? t("map_preview_change") : t("map_preview_pick")}
          className="h-32 relative cursor-pointer select-none outline-none
                     focus-visible:ring-2 focus-visible:ring-[#f0a500] focus-visible:ring-inset"
          onClick={onChangeLocation}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onChangeLocation(); }
          }}
        >
          <MiniMap
            lat={validCoords ? lat : 9.082}
            lng={validCoords ? lng : 8.6753}
            zoom={hasCoords ? 16 : 5}
            showPin={hasCoords}
          />

          {/* "No pin yet" overlay */}
          {!hasCoords && (
            <div
              className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-1.5"
              style={{ background: "rgba(20,61,77,0.55)" }}
            >
              <span className="text-2xl">📍</span>
              <p className="text-white text-[12px] font-bold text-center px-4">
                {t("map_preview_tap_hint")}
              </p>
            </div>
          )}

          {/* Change / Pick location button */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChangeLocation(); }}
            className="absolute bottom-2 right-2 text-[11px] font-bold
                       px-3 py-1.5 rounded-full flex items-center gap-1 z-10
                       transition-all active:scale-95"
            style={{ background: "#f0a500", color: "#143d4d" }}
          >
            📍 {hasCoords ? t("map_preview_change") : t("map_preview_pick")}
          </button>
        </div>

        {/* Address info row */}
        <div className="bg-white px-3.5 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-[#111827] truncate">
              {address || t("map_preview_no_address")}
            </p>
            <p className="text-[11px] text-[#9ca3af] mt-0.5 font-mono">
              {hasCoords
                ? `${Math.abs(lat).toFixed(4)}° ${lat >= 0 ? "N" : "S"}, ${Math.abs(lng).toFixed(4)}° ${lng >= 0 ? "E" : "W"}`
                : t("map_preview_no_coords")}
            </p>
          </div>
          <button
            type="button"
            onClick={onChangeLocation}
            className="text-[11px] font-bold flex-shrink-0 transition-colors"
            style={{ color: "#1e5f74" }}
          >
            {t("map_preview_open")}
          </button>
        </div>
      </div>

      {/* Hint text */}
      {hint && (
        <div
          className="flex items-start gap-2 px-3 py-2.5 rounded-xl"
          style={{ background: "#e0f0f5", border: "1px solid rgba(30,95,116,0.15)" }}
        >
          <p className="text-[11px] leading-relaxed" style={{ color: "#1e5f74" }}>
            {hint}
          </p>
        </div>
      )}
    </div>
  );
}
