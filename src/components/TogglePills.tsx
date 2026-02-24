"use client";

interface TogglePillsProps<T extends string> {
  label?: string;
  options: { label: string; value: T; icon?: string }[];
  value: T;
  onChange: (val: T) => void;
}

export default function TogglePills<T extends string>({
  label,
  options,
  value,
  onChange,
}: TogglePillsProps<T>) {
  return (
    <div>
      {label && (
        <p className="text-xs font-semibold text-[#111827] mb-1.5">{label}</p>
      )}
      <div className="flex gap-1.5">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 py-2.5 rounded-[10px] border-[1.5px] text-sm font-medium transition-all duration-200 ${
              value === opt.value
                ? "bg-[#1a7a4a] text-white border-[#1a7a4a] font-semibold"
                : "bg-transparent text-[#4b5563] border-[#e5e7eb] hover:border-[#2ea06a]"
            }`}
          >
            {opt.icon && <span className="mr-1">{opt.icon}</span>}
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
