"use client";

import { useLanguage } from "@/i18n/LanguageContext";

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
  const hasCoords  = lat !== 6.4281 || lng !== 3.4219;

  return (
    <div className="flex flex-col gap-2">
      <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]">
        {/* SVG map visual */}
        <div
          className="h-28 relative flex items-center justify-center cursor-pointer select-none"
          style={{ background: "linear-gradient(160deg,#143d4d 0%,#1e5f74 60%,#2d8ba8 100%)" }}
          onClick={onChangeLocation}
        >
          {/* Grid overlay */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.15]"
            viewBox="0 0 390 112" preserveAspectRatio="none"
          >
            <line x1="0"   y1="37"  x2="390" y2="37"  stroke="white" strokeWidth="1"/>
            <line x1="0"   y1="74"  x2="390" y2="74"  stroke="white" strokeWidth="1"/>
            <line x1="78"  y1="0"   x2="78"  y2="112" stroke="white" strokeWidth="1"/>
            <line x1="156" y1="0"   x2="156" y2="112" stroke="white" strokeWidth="1"/>
            <line x1="234" y1="0"   x2="234" y2="112" stroke="white" strokeWidth="1"/>
            <line x1="312" y1="0"   x2="312" y2="112" stroke="white" strokeWidth="1"/>
            {/* Gold roads */}
            <path d="M0 58 Q100 44 200 62 Q300 76 390 52" stroke="#f0a500" strokeWidth="3.5" fill="none" opacity="0.6"/>
            <path d="M130 0 Q140 56 128 112" stroke="#f0a500" strokeWidth="3" fill="none" opacity="0.5"/>
            <path d="M260 0 Q250 56 265 112" stroke="#f0a500" strokeWidth="2" fill="none" opacity="0.3"/>
          </svg>

          {/* Gold pin */}
          <div
            className="w-8 h-8 rounded-tl-full rounded-tr-full rounded-br-none rounded-bl-full
                       rotate-[-45deg] relative z-10 shadow-[0_4px_14px_rgba(240,165,0,0.55)]"
            style={{
              background: hasCoords ? "#f0a500" : "rgba(240,165,0,0.5)",
              transition: "background 0.3s",
            }}
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-3 h-3 bg-white rounded-full" />
          </div>

          {/* "No pin yet" overlay */}
          {!hasCoords && (
            <div
              className="absolute inset-0 flex flex-col items-center justify-center gap-1.5"
              style={{ background: "rgba(20,61,77,0.5)" }}
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
                ? `${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E`
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
