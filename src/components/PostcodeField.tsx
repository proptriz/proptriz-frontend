"use client";

import { useEffect, useRef, useState } from "react";
import {
  autocompletePostcode,
  locatePin,
  verifyPostcode,
  type LocateResult,
  type VerifyResult,
} from "@/services/postcodeApi";
import { useLanguage } from "@/i18n/LanguageContext";
import { interpolate } from "@/i18n/translations";
import { addressMentionsPlace, adminLabels } from "@/utils/locationLabels";

// ─── Brand palette ────────────────────────────────────────────────────────────
// Teal dark:#143d4d  Teal:#1e5f74  Teal-light:#e0f0f5  Gold:#f0a500
// ─────────────────────────────────────────────────────────────────────────────

interface PostcodeFieldProps {
  /** [lat, lng] of the dropped pin (the add/edit form keeps it in this order). */
  coordinates: [number, number];
  /** Address typed in the form. Outside Nigeria it is checked against the pin's area. */
  address?: string;
  /** Postcode typed by the agent (Nigeria only); sent to the API as `postcode_input`. */
  value: string;
  onChange: (code: string) => void;
}

const isPlaceholderPin = (lat: number, lng: number) =>
  !Number.isFinite(lat) || !Number.isFinite(lng) ||
  (lat === 0 && lng === 0) || (lat === 9.082 && lng === 8.6753) || (lat === 6.4281 && lng === 3.4219);

function Badge({ ok, okText, noText, sub }: { ok: boolean; okText: string; noText: string; sub?: string }) {
  return (
    <span className="flex flex-col items-end flex-shrink-0 text-right">
      <span
        className="text-[11px] font-bold px-2.5 py-1 rounded-full whitespace-nowrap"
        style={ok ? { background: "#dcfce7", color: "#166534" } : { background: "#fef3c7", color: "#92400e" }}
      >
        {ok ? `✓ ${okText}` : noText}
      </span>
      {sub && <span className="text-[10px] text-[#6b7280] mt-1">{sub}</span>}
    </span>
  );
}

function Tile({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex-1 min-w-0 rounded-xl bg-[#f1f6f8] px-3 py-2">
      <p className="text-[10px] text-[#6b7280]">{label}</p>
      <p className="text-[13px] font-semibold text-[#143d4d] truncate">{value || "—"}</p>
    </div>
  );
}

/**
 * Location summary under the map in the Property Location section.
 *  - Nigeria: postcode found from the pin, Verified badge, State and LGA, optional typed postcode.
 *  - Elsewhere: area and region from the map, "Location verified" when the address matches the pin.
 * Renders nothing until a pin is dropped, or if the viewer is signed out / the service is down.
 */
export default function PostcodeField({ coordinates, address, value, onChange }: PostcodeFieldProps) {
  const { t } = useLanguage();
  const [lat, lng] = coordinates;
  const placeholder = isPlaceholderPin(lat, lng);

  const [loading, setLoading] = useState(false);
  const [info, setInfo] = useState<LocateResult | null>(null);
  const [verify, setVerify] = useState<VerifyResult | null>(null);
  const [suggestions, setSuggestions] = useState<{ code: string; label: string }[]>([]);
  const [editing, setEditing] = useState(!!value);
  const abortRef = useRef<AbortController | null>(null);

  // Pin -> country, names and (Nigeria) postcode. Debounced so dragging the pin makes one call.
  useEffect(() => {
    if (placeholder) { setInfo(null); return; }
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    const timer = setTimeout(async () => {
      setLoading(true);
      const data = await locatePin(lat, lng, controller.signal);
      if (controller.signal.aborted) return;
      setLoading(false);
      setInfo(data);
      setVerify(null);
    }, 400);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [lat, lng, placeholder]);

  // Typed code -> suggestions for the next segment, then a check against the pin once complete
  useEffect(() => {
    if (!info?.supported || !editing || value.trim().length < 2) { setSuggestions([]); setVerify(null); return; }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      if (value.replace(/[\s-]/g, "").length >= 11) {
        setSuggestions([]);
        const v = await verifyPostcode(value, lat, lng, controller.signal);
        if (!controller.signal.aborted) setVerify(v);
      } else {
        setVerify(null);
        const r = await autocompletePostcode(value, controller.signal);
        if (!controller.signal.aborted) setSuggestions(r?.suggestions.slice(0, 6) ?? []);
      }
    }, 250);
    return () => { clearTimeout(timer); controller.abort(); };
  }, [value, editing, lat, lng, info?.supported]);

  if (placeholder) return null;
  if (!info) {
    return loading ? (
      <p className="mt-3 text-[12px] text-[#6b7280] flex items-center gap-2">
        <span className="w-3 h-3 border-2 border-[#e5e7eb] border-t-[#1e5f74] rounded-full animate-spin" />
        {t("loc_finding")}
      </p>
    ) : null;
  }

  const labels = adminLabels(info.country);
  const place = info.place;

  // ── Outside Nigeria: area + region, verified when the address mentions where the pin is ──
  if (!info.supported) {
    const verified = addressMentionsPlace(address, place);
    const headline = [place.area ?? place.subregion, place.region].filter(Boolean).join(", ");
    const nearest = place.area ?? place.subregion ?? place.region;
    return (
      <div className="mt-3 flex flex-col gap-2">
        <div
          className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3"
          style={{ background: "#e0f0f5", border: "1px solid rgba(30,95,116,0.15)" }}
        >
          <div className="min-w-0">
            <p className="text-[10px] font-bold" style={{ color: "#1e5f74" }}>{t("loc_location_label")}</p>
            <p className="text-[15px] font-bold text-[#143d4d] truncate">{headline || place.country_name || "—"}</p>
          </div>
          <Badge
            ok={verified}
            okText={t("loc_location_verified")}
            noText={t("loc_location_unverified")}
            sub={verified ? t("loc_pin_matches") : undefined}
          />
        </div>
        <div className="flex gap-2">
          <Tile label={t("loc_country")} value={place.country_name ?? info.country} />
          <Tile label={t(labels.region)} value={place.region} />
        </div>
        {!verified && nearest && (
          <p className="rounded-xl bg-[#fff6dc] px-3 py-2 text-[11px] leading-relaxed text-[#7a5a00]">
            {interpolate(t("loc_pin_mismatch_note"), { place: nearest })}
          </p>
        )}
      </div>
    );
  }

  // ── Nigeria: postcode from the pin (or the typed one), State and LGA ──
  const typedOk = !!verify?.valid && !!verify.postcode;
  const code = typedOk ? verify!.postcode : info.postcode?.found ? info.postcode.postcode : undefined;
  const distance = typedOk ? verify!.distanceM : info.postcode?.distanceM;
  const verified = typedOk ? verify!.verified : !!info.postcode?.found && (info.postcode.distanceM ?? Infinity) <= 100;
  const stateName = (typedOk && verify!.state_name) || place.region;
  const lgaName = (typedOk && verify!.lga_name) || place.subregion;

  return (
    <div className="mt-3 flex flex-col gap-2">
      <div
        className="flex items-center justify-between gap-3 rounded-xl px-3.5 py-3"
        style={{ background: "#e0f0f5", border: "1px solid rgba(30,95,116,0.15)" }}
      >
        <div className="min-w-0">
          <p className="text-[10px] font-bold" style={{ color: "#1e5f74" }}>{t("loc_postcode_label")}</p>
          {code ? (
            <p className="text-[15px] font-bold tracking-[0.5px] text-[#143d4d]">{code}</p>
          ) : (
            <p className="text-[13px] text-[#6b7280]">{loading ? t("loc_finding") : t("loc_no_postcode")}</p>
          )}
        </div>
        {code && (
          <Badge
            ok={verified}
            okText={t("loc_verified")}
            noText={t("loc_unverified")}
            sub={distance !== undefined ? interpolate(t("loc_m_from_pin"), { n: Math.round(distance) }) : undefined}
          />
        )}
      </div>

      <div className="flex gap-2">
        <Tile label={t(labels.region)} value={stateName} />
        <Tile label={t(labels.subregion)} value={lgaName} />
      </div>

      {verify && !verify.valid && (
        <p className="text-[11px] text-red-500">{t("loc_code_invalid")}</p>
      )}
      {verify && verify.valid && !verify.matched && (
        <p className="text-[11px] text-amber-600">{t("loc_code_far")}</p>
      )}
      {!code && !loading && (
        <p className="rounded-xl bg-[#fff6dc] px-3 py-2 text-[11px] leading-relaxed text-[#7a5a00]">
          {t("loc_no_postcode_note")}
        </p>
      )}

      {/* Typed postcode (optional) */}
      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="self-start text-[11px] font-bold"
          style={{ color: "#1e5f74" }}
        >
          {code ? t("loc_type_different") : t("loc_type_instead")}
        </button>
      ) : (
        <div className="relative">
          <input
            type="text"
            autoCapitalize="characters"
            autoComplete="off"
            aria-label={t("loc_postcode_label")}
            placeholder={t("loc_type_ph")}
            value={value}
            onChange={(e) => onChange(e.target.value.toUpperCase())}
            className="w-full rounded-xl border-[1.5px] border-[#e5e7eb] bg-[#f9fafb] px-3.5 py-3
                       text-sm tracking-[0.5px] text-[#111827] placeholder:text-[#9ca3af] outline-none
                       focus:border-[#1e5f74] focus:bg-white"
          />
          {suggestions.length > 0 && (
            <div className="absolute left-0 right-0 top-full mt-1 z-20 rounded-xl border border-[#e5e7eb]
                            bg-white shadow-lg overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.code}
                  type="button"
                  onClick={() => {
                    // Replace the segment being typed with the chosen one
                    const parts = value.trim().split(/[\s-]+/).filter(Boolean);
                    parts[Math.max(parts.length - 1, 0)] = s.code;
                    onChange(parts.join(" ") + " ");
                  }}
                  className="w-full flex items-center justify-between px-3.5 py-2.5 text-left text-[13px]
                             hover:bg-[#f3f7f9] border-b border-[#f1f5f9] last:border-0"
                >
                  <span className="font-bold text-[#143d4d]">{s.code}</span>
                  <span className="text-[#6b7280] text-[12px] truncate ml-3">{s.label}</span>
                </button>
              ))}
            </div>
          )}
          <p className="text-[11px] text-[#9ca3af] mt-1.5">{t("loc_type_hint")}</p>
        </div>
      )}
    </div>
  );
}
