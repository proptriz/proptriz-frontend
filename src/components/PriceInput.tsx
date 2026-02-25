"use client";

import { useState, useRef, useEffect } from "react";
import { CurrencyEnum } from "../types/property";
import CurrencySelector from "./CurrencySelector";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Strip everything except digits and a single decimal point */
const stripForInput = (s: string) => s.replace(/[^0-9.]/g, "");

/** Format a raw numeric string with comma separators (view-only) */
const formatComma = (raw: string): string => {
  if (!raw || raw === "0") return "";
  const [int, dec] = raw.split(".");
  const formatted = Number(int.replace(/\D/g, "")).toLocaleString("en-US");
  return dec !== undefined ? `${formatted}.${dec}` : formatted;
};

/** Parse display string back to plain numeric string */
const toNumericString = (s: string) => s.replace(/,/g, "");

// ─── Multiplier config ────────────────────────────────────────────────────────

const MULTIPLIERS = [
  { label: "100",  short: "100", factor: 100         },
  { label: "1K",   short: "1K",  factor: 1_000       },
  { label: "10K",  short: "10K", factor: 10_000      },
  { label: "100K", short: "100K",factor: 100_000     },
  { label: "1M",   short: "1M",  factor: 1_000_000   },
  { label: "10M",  short: "10M", factor: 10_000_000  },
  { label: "100M", short: "100M",factor: 100_000_000 },
  { label: "1B",   short: "1B",  factor: 1_000_000_000 },
] as const;

// ─── Props ────────────────────────────────────────────────────────────────────

interface PriceInputProps {
  /** Raw numeric string value (e.g. "1500000") */
  value: string;
  onChange: (val: string) => void;
  currency: CurrencyEnum;
  onCurrencyChange: (val: CurrencyEnum) => void;
  label?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function PriceInput({
  value,
  onChange,
  currency,
  onCurrencyChange,
  label = "Price",
}: PriceInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [localRaw, setLocalRaw]   = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync when parent changes value externally
  useEffect(() => {
    if (!isFocused) setLocalRaw(value);
  }, [value, isFocused]);

  const numericValue = Number(toNumericString(localRaw || "0"));

  // ── Input handlers ──────────────────────────────────────────────────────
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // While focused, only allow digits + decimal
    const cleaned = stripForInput(e.target.value);
    setLocalRaw(cleaned);
    onChange(cleaned || "0");
  };

  const handleBlur = () => {
    setIsFocused(false);
    // Remove trailing decimal on blur
    const trimmed = localRaw.replace(/\.$/, "");
    setLocalRaw(trimmed || "0");
    onChange(trimmed || "0");
  };

  // ── Multiplier tap ──────────────────────────────────────────────────────
  const applyMultiplier = (factor: number) => {
    // If no meaningful value yet, start from 1
    const base = numericValue > 0 ? numericValue : 1;
    const next  = base * factor;
    const str   = String(next);
    setLocalRaw(str);
    onChange(str);
    // Refocus for quick corrections
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  /** Shorthand display label for the current value */
  const getShortLabel = (n: number): string => {
    if (n === 0) return "";
    if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(n % 1_000_000_000 === 0 ? 0 : 1)}B`;
    if (n >= 1_000_000)     return `${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M`;
    if (n >= 1_000)         return `${(n / 1_000).toFixed(n % 1_000 === 0 ? 0 : 1)}K`;
    return String(n);
  };

  const displayShort  = getShortLabel(numericValue);
  const displayComma  = formatComma(toNumericString(localRaw));

  return (
    <div className="flex flex-col gap-2">
      {/* Label row */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.5px]">
          {label} *
        </p>
        {numericValue > 0 && (
          <span
            className="text-[11px] font-bold px-2.5 py-0.5 rounded-full"
            style={{ background: "#e0f0f5", color: "#1e5f74" }}
          >
            {currency}{displayShort}
          </span>
        )}
      </div>

      {/* Currency + input row */}
      <div className="flex items-center gap-2">
        <CurrencySelector value={currency} onChange={onCurrencyChange} />

        <div
          className="flex-1 flex items-center gap-2 bg-[#f9fafb] border-[1.5px]
                     border-[#e5e7eb] rounded-xl px-3.5 py-[11px]
                     transition-all duration-200"
          style={isFocused ? {
            borderColor: "#1e5f74",
            background: "white",
            boxShadow: "0 0 0 3px rgba(30,95,116,0.1)",
          } : {}}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="decimal"
            placeholder="0"
            value={isFocused ? localRaw : displayComma}
            onChange={handleChange}
            onFocus={() => { setIsFocused(true); setLocalRaw(toNumericString(localRaw)); }}
            onBlur={handleBlur}
            className="w-full outline-none bg-transparent text-sm font-medium
                       text-[#111827] placeholder:text-[#9ca3af]"
          />
          {/* Live shorthand suffix */}
          {!isFocused && numericValue > 0 && (
            <span
              className="text-[11px] font-bold flex-shrink-0"
              style={{ color: "#9ca3af" }}
            >
              {currency}{displayShort}
            </span>
          )}
        </div>
      </div>

      {/* Multiplier buttons */}
      <div className="flex gap-1.5 flex-wrap">
        {MULTIPLIERS.map(({ label: lbl, short, factor }) => {
          // Highlight the button that matches current magnitude
          const isActive = numericValue > 0 && numericValue % factor === 0 &&
            factor === MULTIPLIERS.reduce((acc, m) =>
              numericValue % m.factor === 0 && m.factor > acc ? m.factor : acc, 0);

          return (
            <button
              key={lbl}
              type="button"
              onClick={() => applyMultiplier(factor)}
              className="flex-1 min-w-[40px] py-1.5 rounded-lg text-[11px] font-bold
                         border-[1.5px] transition-all duration-150 active:scale-95"
              style={isActive
                ? { borderColor: "#1e5f74", background: "#e0f0f5", color: "#1e5f74" }
                : { borderColor: "#e5e7eb", background: "#f9fafb", color: "#6b7280" }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74";
                  (e.currentTarget as HTMLButtonElement).style.color = "#1e5f74";
                  (e.currentTarget as HTMLButtonElement).style.background = "#e0f0f5";
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb";
                  (e.currentTarget as HTMLButtonElement).style.color = "#6b7280";
                  (e.currentTarget as HTMLButtonElement).style.background = "#f9fafb";
                }
              }}
            >
              ×{short}
            </button>
          );
        })}
      </div>

      {/* Formatted display */}
      {numericValue > 0 && (
        <div
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl"
          style={{ background: "#f5f7f9", border: "1px solid #e5e7eb" }}
        >
          <span className="text-[12px] text-[#9ca3af]">Preview:</span>
          <span className="text-[13px] font-bold" style={{ color: "#1e5f74" }}>
            {currency}{Number(toNumericString(localRaw)).toLocaleString("en-US")}
          </span>
        </div>
      )}
    </div>
  );
}
