"use client";

import { useRef, useState } from "react";
import { toast }            from "react-toastify";
import { compressImage, MAX_RAW_SIZE_BYTES, MAX_RAW_SIZE_MB } from "@/utils/compressImage";

interface PhotoUploadSectionProps {
  photos:     File[];
  maxPhotos?: number;
  onUpload:   (files: File[]) => void;
  onRemove:   (index: number) => void;
}

export default function PhotoUploadSection({
  photos,
  maxPhotos = 8,
  onUpload,
  onRemove,
}: PhotoUploadSectionProps) {
  const inputRef                      = useRef<HTMLInputElement>(null);
  const [compressing, setCompressing] = useState(false);

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    // ── Validate raw files ──────────────────────────────────────────────
    const raw = Array.from(e.target.files).filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.warn(`"${f.name}" is not an image — skipped.`);
        return false;
      }
      if (f.size > MAX_RAW_SIZE_BYTES) {
        toast.warn(`"${f.name}" exceeds ${MAX_RAW_SIZE_MB} MB — skipped.`);
        return false;
      }
      return true;
    });

    if (raw.length === 0) return;

    if (photos.length + raw.length > maxPhotos) {
      toast.warn(`Max ${maxPhotos} photos allowed.`);
      return;
    }

    // ── Compress sequentially (non-blocking via Web Worker) ────────────
    setCompressing(true);
    try {
      const compressed: File[] = [];
      for (const file of raw) {
        compressed.push(await compressImage(file));
      }
      onUpload(compressed);
    } finally {
      setCompressing(false);
      e.target.value = ""; // allow re-selecting same file
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e5e7eb]">

      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px]
                      flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#1e5f74" }} />
          <span>📸</span> Property Photos
        </p>
        <span
          className="text-[11px] font-bold px-2 py-0.5 rounded-full"
          style={{
            background: photos.length > 0 ? "#e0f0f5" : "#f3f4f6",
            color:      photos.length > 0 ? "#1e5f74"  : "#9ca3af",
          }}
        >
          {photos.length}/{maxPhotos}
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-2">
        {photos.map((photo, i) => (
          <div key={i} className="aspect-square rounded-xl overflow-hidden relative group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(photo)}
              alt={`photo-${i}`}
              className="w-full h-full object-cover"
            />

            {/* Cover badge */}
            {i === 0 && (
              <span
                className="absolute top-1 left-1 text-[9px] font-extrabold px-1.5 py-0.5 rounded"
                style={{ background: "#f0a500", color: "#143d4d" }}
              >
                COVER
              </span>
            )}

            {/* Remove */}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-black/55 text-white rounded-full
                         w-5 h-5 text-xs flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        {/* Add slot */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            disabled={compressing}
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#d1d5db]
                       flex flex-col items-center justify-center gap-1
                       text-[#9ca3af] text-[10px] bg-[#f9fafb] transition-colors
                       disabled:cursor-wait"
            onMouseEnter={(e) => {
              if (!compressing) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74";
                (e.currentTarget as HTMLButtonElement).style.color       = "#1e5f74";
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db";
              (e.currentTarget as HTMLButtonElement).style.color       = "#9ca3af";
            }}
          >
            {compressing ? (
              <>
                <div
                  className="w-5 h-5 rounded-full border-2 border-[#e5e7eb] animate-spin"
                  style={{ borderTopColor: "#1e5f74" }}
                />
                <span style={{ color: "#1e5f74" }}>Optimising…</span>
              </>
            ) : (
              <>
                <span className="text-2xl leading-none">+</span>
                <span>Add photo</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Footer hint */}
      <p className="text-[11px] text-[#9ca3af] mt-2.5 flex items-center gap-1">
        <span>ℹ️</span>
        First photo is cover · Max {maxPhotos} · Up to {MAX_RAW_SIZE_MB} MB · Auto-optimised
      </p>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}