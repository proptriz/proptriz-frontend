"use client";

import { CategoryEnum } from "@/types";
import type { PropertyFormData } from "@/types/property";
import PhotoUploadSection from "./PhotoUploadSection";
import SectionCard from "./SectionCard";

const CATEGORIES: { value: CategoryEnum; icon: string; label: string }[] = [
  { value: CategoryEnum.house, icon: "🏠", label: "Apartment" },
  { value: CategoryEnum.land, icon: "🏢", label: "Land" },
  { value: CategoryEnum.hotel, icon: "🏪", label: "Hotel" },
  { value: CategoryEnum.shortlet, icon: "🏡", label: "Shortlet" },
  { value: CategoryEnum.office, icon: "🏘️", label: "Office" },
  { value: CategoryEnum.shop, icon: "🏨", label: "Shop" },
  { value: CategoryEnum.others, icon: "🏨", label: "Others" },
];

interface Step1Props {
  data: PropertyFormData;
  onUpdate: (partial: Partial<PropertyFormData>) => void;
}

export default function Step1Basics({ data, onUpdate }: Step1Props) {
  const handlePhotoUpload = (files: File[]) => {
    onUpdate({ photos: [...data.photos, ...files] });
  };

  const handlePhotoRemove = (index: number) => {
    onUpdate({ photos: data.photos.filter((_, i) => i !== index) });
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Photos */}
      <PhotoUploadSection
        photos={data.photos}
        maxPhotos={5}
        onUpload={handlePhotoUpload}
        onRemove={handlePhotoRemove}
      />

      {/* Property type */}
      <SectionCard icon="🏷️" title="Property Type">
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              type="button"
              onClick={() => onUpdate({ category: cat.value })}
              className={`flex flex-col items-center gap-1 py-2.5 rounded-[10px] border-[1.5px]
                          text-[11px] font-medium transition-all duration-200 cursor-pointer
                          ${
                            data.category === cat.value
                              ? "border-[#1a7a4a] bg-[#e8f5ee] text-[#1a7a4a] font-semibold"
                              : "border-[#e5e7eb] text-[#4b5563] hover:border-[#2ea06a]"
                          }`}
            >
              <span className="text-xl">{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Title */}
      <SectionCard icon="✏️" title="Property Title">
        <div
          className="flex items-center gap-2.5 bg-[#f9fafb] border-[1.5px] border-[#e5e7eb]
                     rounded-[10px] px-3.5 py-3 transition-all duration-200
                     focus-within:border-[#1a7a4a] focus-within:bg-white
                     focus-within:shadow-[0_0_0_3px_rgba(26,122,74,0.1)]"
        >
          <span className="text-[#9ca3af] text-base flex-shrink-0">🏠</span>
          <input
            type="text"
            placeholder="e.g. Modern 3-Bed Duplex in Lekki"
            value={data.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            className="w-full outline-none bg-transparent text-sm text-[#111827] placeholder:text-[#9ca3af]"
          />
        </div>
        <p className="text-[11px] text-red-400 mt-1">
          {!data.title && "* Required"}
        </p>
      </SectionCard>
    </div>
  );
}
