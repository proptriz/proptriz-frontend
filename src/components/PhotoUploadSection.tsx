"use client";

import { useRef } from "react";

interface PhotoUploadSectionProps {
  photos: File[];
  maxPhotos?: number;
  onUpload: (files: File[]) => void;
  onRemove: (index: number) => void;
}

export default function PhotoUploadSection({
  photos,
  maxPhotos = 5,
  onUpload,
  onRemove,
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
      <p className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <span>📸</span> Property Photos
      </p>

      <div className="grid grid-cols-4 gap-2">
        {photos.map((photo, i) => (
          <div
            key={i}
            className="aspect-square rounded-[10px] overflow-hidden relative group"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={URL.createObjectURL(photo)}
              alt={`photo-${i}`}
              className="w-full h-full object-cover"
            />
            {i === 0 && (
              <span className="absolute top-1 left-1 bg-[#f5a623] text-[#111] text-[9px] font-bold px-1.5 py-0.5 rounded">
                COVER
              </span>
            )}
            <button
              onClick={() => onRemove(i)}
              className="absolute top-1 right-1 bg-black/50 text-white rounded-full w-5 h-5 text-xs
                         opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
            >
              ×
            </button>
          </div>
        ))}

        {photos.length < maxPhotos && (
          <button
            onClick={() => inputRef.current?.click()}
            className="aspect-square rounded-[10px] border-2 border-dashed border-[#d1d5db]
                       flex flex-col items-center justify-center gap-1 cursor-pointer
                       text-[#9ca3af] text-[10px] bg-[#f9fafb]
                       hover:border-[#2ea06a] hover:text-[#1a7a4a] transition-colors"
          >
            <span className="text-2xl leading-none">+</span>
            <span>Add more</span>
          </button>
        )}
      </div>

      <p className="text-[11px] text-[#9ca3af] mt-2 flex items-center gap-1">
        <span>ℹ️</span>
        Drag to reorder · First photo is cover · Max 5MB each
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
