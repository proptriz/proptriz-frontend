"use client";

import { useRef } from "react";

interface PhotoUploadSectionProps {
  photos: File[];
  maxPhotos?: number;
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function PhotoUploadSection({
  photos, maxPhotos = 8, onUpload, onRemove,
}: PhotoUploadSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files).filter(
      (f) => f.type.startsWith("image/") && f.size <= 5 * 1024 * 1024
    );
    if (photos.length + files.length > maxPhotos) {
      alert(`Max ${maxPhotos} photos allowed.`);
      return;
    }
    onUpload(files);
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-[#e5e7eb]">
      <p className="text-[11px] font-bold text-[#4b5563] uppercase tracking-[0.7px] mb-3
                    flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: "#1e5f74" }} />
        <span>📸</span> Property Photos
      </p>

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
                className="absolute top-1 left-1 text-[9px] font-extrabold
                           px-1.5 py-0.5 rounded"
                style={{ background: "#f0a500", color: "#143d4d" }}
              >
                COVER
              </span>
            )}
            {/* Remove button */}
            <button
              type="button"
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-black/55 text-white rounded-full w-5 h-5
                         text-xs flex items-center justify-center
                         opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </div>
        ))}

        {/* Upload slot */}
        {photos.length < maxPhotos && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-xl border-2 border-dashed border-[#d1d5db]
                       flex flex-col items-center justify-center gap-1
                       text-[#9ca3af] text-[10px] bg-[#f9fafb] transition-colors"
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#1e5f74"; (e.currentTarget as HTMLButtonElement).style.color = "#1e5f74"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "#d1d5db"; (e.currentTarget as HTMLButtonElement).style.color = "#9ca3af"; }}
          >
            <span className="text-2xl leading-none">+</span>
            <span>Add photo</span>
          </button>
        )}
      </div>

      <p className="text-[11px] text-[#9ca3af] mt-2.5 flex items-center gap-1">
        <span>ℹ️</span> First photo is cover · Max {maxPhotos} photos · 5 MB each
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