"use client";

interface TogglePillsProps<T extends string> {
  label?: string;
  options: { label: string; value: T; icon?: string }[];
  value: T;
  onChange: (val: T) => void;
}

export default function TogglePills<T extends string>({
  label, options, value, onChange,
}: TogglePillsProps<T>) {
  return (
    <div>
      {label && (
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.5px] mb-1.5">
          {label}
        </p>
      )}
      <div className="flex gap-1.5">
        {options.map((opt) => {
          const active = value === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className="flex-1 py-2.5 rounded-xl border-[1.5px] text-sm font-medium
                         transition-all duration-200"
              style={active
                ? { background: "linear-gradient(135deg,#143d4d,#1e5f74)", color: "white", borderColor: "#1e5f74", fontWeight: 700 }
                : { background: "transparent", color: "#4b5563", borderColor: "#e5e7eb" }}
              onMouseEnter={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"; }}
              onMouseLeave={(e) => { if (!active) (e.currentTarget as HTMLButtonElement).style.borderColor = "#e5e7eb"; }}
            >
              {opt.icon && <span className="mr-1">{opt.icon}</span>}
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}