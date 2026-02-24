"use client";

interface MapPreviewProps {
  address: string;
  coordinates: [number, number];
  onChangeLocation: () => void;
}

export default function MapPreview({
  address,
  coordinates,
  onChangeLocation,
}: MapPreviewProps) {
  const [lat, lng] = coordinates;

  return (
    <div className="rounded-2xl overflow-hidden border border-[#e5e7eb]">
      {/* Map visual */}
      <div
        className="h-24 relative flex items-center justify-center cursor-pointer"
        style={{
          background: "linear-gradient(135deg, #1a3a2a 0%, #0f2d1f 40%, #1e4d32 100%)",
        }}
        onClick={onChangeLocation}
      >
        {/* Grid overlay */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.15]"
          viewBox="0 0 390 96"
          preserveAspectRatio="none"
        >
          <line x1="0" y1="32" x2="390" y2="32" stroke="white" strokeWidth="1" />
          <line x1="0" y1="64" x2="390" y2="64" stroke="white" strokeWidth="1" />
          <line x1="78" y1="0" x2="78" y2="96" stroke="white" strokeWidth="1" />
          <line x1="156" y1="0" x2="156" y2="96" stroke="white" strokeWidth="1" />
          <line x1="234" y1="0" x2="234" y2="96" stroke="white" strokeWidth="1" />
          <line x1="312" y1="0" x2="312" y2="96" stroke="white" strokeWidth="1" />
          <path
            d="M0 50 Q100 40 200 55 Q300 65 390 48"
            stroke="#2ea06a"
            strokeWidth="4"
            fill="none"
            opacity="0.5"
          />
          <path
            d="M130 0 Q140 48 128 96"
            stroke="#2ea06a"
            strokeWidth="3"
            fill="none"
            opacity="0.4"
          />
        </svg>

        {/* Pin */}
        <div
          className="w-8 h-8 rounded-tl-full rounded-tr-full rounded-br-none rounded-bl-full
                     bg-[#f5a623] rotate-[-45deg] relative z-10
                     shadow-[0_4px_12px_rgba(245,166,35,0.5)]"
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full" />
        </div>

        {/* Change button */}
        <button
          type="button"
          onClick={onChangeLocation}
          className="absolute bottom-2 right-2 bg-[#f5a623] text-[#111] text-[11px] font-bold
                     px-3 py-1.5 rounded-full flex items-center gap-1 z-10"
        >
          📍 Change Location
        </button>
      </div>

      {/* Info row */}
      <div className="bg-white px-3.5 py-3">
        <p className="text-[13px] font-medium text-[#111827] truncate">{address || "No address selected"}</p>
        <p className="text-[11px] text-[#9ca3af] mt-0.5 font-mono">
          {lat.toFixed(4)}° N, {lng.toFixed(4)}° E
        </p>
      </div>
    </div>
  );
}
