"use client";

import { useState, useRef, useEffect } from "react";
import { CurrencyEnum } from "../types/property";

interface CurrencySelectorProps {
  value: CurrencyEnum;
  onChange: (val: CurrencyEnum) => void;
}

const CURRENCY_OPTIONS = [
  { value: CurrencyEnum.naira,  label: "Naira (₦)"  },
  { value: CurrencyEnum.dollar, label: "Dollar ($)" },
  { value: CurrencyEnum.euro,   label: "Euro (€)"   },
  { value: CurrencyEnum.pound,  label: "Pound (£)"  },
];

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-white rounded-xl
                   px-3.5 py-[11px] text-sm font-bold whitespace-nowrap"
        style={{ background: "linear-gradient(135deg,#143d4d,#1e5f74)" }}
      >
        {value} <span className="text-[10px] opacity-80">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#e5e7eb]
                        rounded-xl shadow-xl z-50 overflow-hidden min-w-[140px]">
          {CURRENCY_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className="w-full text-left px-4 py-2.5 text-sm transition-colors"
              style={value === opt.value
                ? { background: "#e0f0f5", color: "#1e5f74", fontWeight: 700 }
                : { color: "#4b5563" }}
              onMouseEnter={(e) => { if (value !== opt.value) { (e.currentTarget as HTMLButtonElement).style.background = "#e0f0f5"; (e.currentTarget as HTMLButtonElement).style.color = "#1e5f74"; } }}
              onMouseLeave={(e) => { if (value !== opt.value) { (e.currentTarget as HTMLButtonElement).style.background = ""; (e.currentTarget as HTMLButtonElement).style.color = "#4b5563"; } }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}