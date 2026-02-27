"use client";

interface CounterProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onIncrement: () => void;
  onDecrement: () => void;
  suffix?: string;
}

export default function Counter({
  label, value, min = 0, max = 99,
  onIncrement, onDecrement, suffix,
}: CounterProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs font-semibold text-[#4b5563] min-w-[72px]">{label}</span>
      )}
      <div className="flex items-center flex-1 rounded-xl border-[1.5px] border-[#e5e7eb] overflow-hidden bg-[#f9fafb]">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="w-11 h-11 flex items-center justify-center text-xl
                     border-r border-[#e5e7eb] transition-colors
                     hover:text-white disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#e0f0f5", color: "#1e5f74" }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; if (!b.disabled) { b.style.background = "#1e5f74"; b.style.color = "white"; } }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#e0f0f5"; b.style.color = "#1e5f74"; }}
        >−</button>

        <span className="flex-1 text-center text-[13px] font-bold text-[#111827]">
          {value}{suffix ? ` ${suffix}` : ""}
        </span>

        <button
          type="button"
          onClick={onIncrement}
          disabled={value >= max}
          className="w-11 h-11 flex items-center justify-center text-xl
                     border-l border-[#e5e7eb] transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
          style={{ background: "#e0f0f5", color: "#1e5f74" }}
          onMouseEnter={(e) => { const b = e.currentTarget as HTMLButtonElement; if (!b.disabled) { b.style.background = "#1e5f74"; b.style.color = "white"; } }}
          onMouseLeave={(e) => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "#e0f0f5"; b.style.color = "#1e5f74"; }}
        >+</button>
      </div>
    </div>
  );
}