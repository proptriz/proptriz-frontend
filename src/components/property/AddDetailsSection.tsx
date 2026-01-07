'use client';

import { useEffect, useState } from "react";
import Counter from "@/components/Counter";
import ToggleButtons from "@/components/ToggleButtons";
import TagSelector from "@/components/TagSelector";
import { FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import { styles } from "@/constant";
import ToggleCollapse from "../shared/ToggleCollapse";
import { CategoryEnum, Feature, NegotiableEnum } from "@/types";
import { OutlineButton } from "../shared/buttons";

export interface IPropFeatures {
  [key: string]: Feature[];
}

interface AddPropertyDetailsProps {
  listingCategory: CategoryEnum;
  existingFeatures?: Feature[];
  existingFacilities?: string[];
  onNegotiableChange?: (value: NegotiableEnum) => void;
  onFeaturesChange?: (features: Feature[]) => void;
  onFacilitiesChange?: (facilities: string[]) => void;
}

export default function AddPropertyDetails({
  listingCategory,
  existingFeatures = [],
  existingFacilities =[],
  onNegotiableChange,
  onFeaturesChange,
  onFacilitiesChange,
}: AddPropertyDetailsProps) {

  const categoryFeatures: IPropFeatures = {
    house: [
      { name: "Garage", quantity: 1 },
      { name: "Swimming Pool", quantity: 1 },
    ],
    hotel: [
      { name: "Reception Area", quantity: 1 },
      { name: "Conference Room", quantity: 1 },
    ],
    shop: [
      { name: "Storage Room", quantity: 1 },
      { name: "Security System", quantity: 1 },
    ],
    land: [
      { name: "Fenced", quantity: 1 },
      { name: "Survey Plan", quantity: 1 },
      { name: "Registered Title", quantity: 1 },
    ],
  };

  const facilities: string[] = [
    "Parking Lot",
    "Pet Allowed",
    "Garden",
    "Gym",
    "Park",
    "Home Theatre",
    "Kid’s Friendly",
    "Electricity",
    "Water Supply",
    "Drainage System",
    "Security Services",
  ];

  const [negotiableToggle, setNegotiableToggle] = useState<NegotiableEnum>(
    NegotiableEnum.Negotiable
  );
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>(existingFacilities ?? []);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [features, setFeatures] = useState<Feature[]>(existingFeatures.length>0 ? existingFeatures : (categoryFeatures[listingCategory] || []));

  // 🚀 Notify parent when states change
  useEffect(() => {
    onNegotiableChange?.(negotiableToggle);
  }, [negotiableToggle]);

  useEffect(() => {
    onFeaturesChange?.(features);
  }, [features]);

  useEffect(() => {
    const allFacilities = [...selectedFacilities, ...customFacilities];
    onFacilitiesChange?.(allFacilities);
  }, [selectedFacilities, customFacilities]);

  // --- Handlers ---
  const handleToggleFacility = (facility: string): void => {
    setSelectedFacilities((prev) =>
      prev.includes(facility)
        ? prev.filter((item) => item !== facility)
        : [...prev, facility]
    );
  };

  const handleAddCustomFacility = (): void => {
    setCustomFacilities((prev) => [...prev, ""]);
  };

  const handleCustomFacilityChange = (index: number, value: string): void => {
    setCustomFacilities((prev) => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  };

  const handleAddFeature = (): void => {
    setFeatures((prev) => [...prev, { name: "", quantity: 1 }]);
  };

  const handleFeatureChange = (index: number, key: keyof Feature, value: string | number): void => {
    setFeatures((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [key]: value };
      return updated;
    });
  };

  const handleRemoveFeature = (index: number): void => {
    setFeatures((prev) => prev.filter((_, i) => i !== index));
  };

  const incrementFeatureQuantity = (index: number): void => {
    handleFeatureChange(index, "quantity", features[index].quantity + 1);
  };

  const decrementFeatureQuantity = (index: number): void => {
    handleFeatureChange(index, "quantity", Math.max(1, features[index].quantity - 1));
  };

  return (
    <ToggleCollapse header="Other Details" open={true}>
      {/* Negotiable Toggle */}
      <div className="mt-4 mb-7">
        <ToggleButtons
          options={[NegotiableEnum.Negotiable, NegotiableEnum.NonNegotiable]}
          selected={negotiableToggle}
          onChange={setNegotiableToggle}
        />
      </div>

      {/* Property Features */}
      <h3 className={styles.H2}>Property Features</h3>
      {(existingFeatures && existingFeatures.length>0) ? existingFeatures.map((feature, index) => (
        <div key={index} className="flex gap-4 items-center mt-4">
          <div className="flex card-bg px-3 rounded-lg shadow-md w-full">
            <input
              type="text"
              placeholder="Feature Name"
              value={feature.name}
              onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
              className="flex-1 outline-none card-bg text-sm"
            />
            <Counter
              label=""
              value={feature.quantity}
              onIncrement={() => incrementFeatureQuantity(index)}
              onDecrement={() => decrementFeatureQuantity(index)}
            />
          </div>
          <button onClick={() => handleRemoveFeature(index)} className="text-red-500">
            <IoClose size={24} />
          </button>
        </div>
      )): features.map((feature, index) => (
        <div key={index} className="flex gap-4 items-center mt-4">
          <div className="flex card-bg px-3 rounded-lg shadow-md w-full">
            <input
              type="text"
              placeholder="Feature Name"
              value={feature.name}
              onChange={(e) => handleFeatureChange(index, "name", e.target.value)}
              className="flex-1 outline-none card-bg text-sm"
            />
            <Counter
              label=""
              value={feature.quantity}
              onIncrement={() => incrementFeatureQuantity(index)}
              onDecrement={() => decrementFeatureQuantity(index)}
            />
          </div>
          <button onClick={() => handleRemoveFeature(index)} className="text-red-500">
            <IoClose size={24} />
          </button>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <OutlineButton
          style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onClick={handleAddFeature}
        >
          <FaPlus /> Add new
        </OutlineButton>
      </div>

      {/* Facilities */}
      <h2 className={styles.H2}>Environment / Facilities</h2>
      <TagSelector
        tags={[...facilities, ...existingFacilities.filter(f => !facilities.includes(f))]}
        selectedTags={[...existingFacilities, ...selectedFacilities]}
        onToggle={handleToggleFacility}
      />

      {customFacilities.map((facility, index) => (
        <input
          key={index}
          type="text"
          placeholder="Environment facility name"
          value={facility}
          onChange={(e) => handleCustomFacilityChange(index, e.target.value)}
          className="w-full border rounded-md p-2 mt-2 text-sm"
        />
      ))}

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <OutlineButton
          style={{ marginTop: '2rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          onClick={handleAddCustomFacility}
        >
          <FaPlus /> Add Custom Facility
        </OutlineButton>
      </div>      
    </ToggleCollapse>
  );
}
