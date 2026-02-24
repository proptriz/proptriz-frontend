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
  label,
  value,
  min = 0,
  max = 99,
  onIncrement,
  onDecrement,
  suffix,
}: CounterProps) {
  return (
    <div className="flex items-center gap-2">
      {label && (
        <span className="text-xs font-semibold text-[#4b5563] min-w-[70px]">
          {label}
        </span>
      )}
      <div className="flex items-center flex-1 rounded-[10px] border-[1.5px] border-[#e5e7eb] overflow-hidden bg-[#f9fafb]">
        <button
          type="button"
          onClick={onDecrement}
          disabled={value <= min}
          className="w-11 h-11 flex items-center justify-center text-xl text-[#1a7a4a]
                     bg-[#e8f5ee] border-r border-[#e5e7eb]
                     hover:bg-[#2ea06a] hover:text-white transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="flex-1 text-center text-[13px] font-semibold text-[#111827]">
          {value}
          {suffix ? ` ${suffix}` : ""}
        </span>
        <button
          type="button"
          onClick={onIncrement}
          disabled={value >= max}
          className="w-11 h-11 flex items-center justify-center text-xl text-[#1a7a4a]
                     bg-[#e8f5ee] border-l border-[#e5e7eb]
                     hover:bg-[#2ea06a] hover:text-white transition-colors
                     disabled:opacity-40 disabled:cursor-not-allowed"
        >
          +
        </button>
      </div>
    </div>
  );
}
