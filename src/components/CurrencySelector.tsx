"use client";

import { useState, useRef, useEffect } from "react";
import { CurrencyEnum } from "@/types/property";

interface CurrencySelectorProps {
  value: CurrencyEnum;
  onChange: (val: CurrencyEnum) => void;
}

const CURRENCY_OPTIONS: { key: string; value: CurrencyEnum; label: string }[] = [
  { key: "naira", value: CurrencyEnum.naira, label: "Naira (₦)" },
  { key: "dollars", value: CurrencyEnum.dollars, label: "Dollar ($)" },
  { key: "euros", value: CurrencyEnum.euros, label: "Euro (€)" },
  { key: "pounds", value: CurrencyEnum.pounds, label: "Pound (£)" },
];

export default function CurrencySelector({ value, onChange }: CurrencySelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 bg-[#1a7a4a] text-white rounded-[10px]
                   px-3.5 py-[11px] text-sm font-semibold whitespace-nowrap"
      >
        {value} <span className="text-xs">▾</span>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 bg-white border border-[#e5e7eb]
                        rounded-xl shadow-xl z-50 overflow-hidden min-w-[140px]">
          {CURRENCY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                          hover:bg-[#e8f5ee] hover:text-[#1a7a4a]
                          ${value === opt.value ? "bg-[#e8f5ee] text-[#1a7a4a] font-semibold" : "text-[#4b5563]"}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
