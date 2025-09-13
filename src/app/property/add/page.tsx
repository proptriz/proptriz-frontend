'use client';

import AddPropertyDetails from "@/components/property/AddDetailsSection";
import PhotoUploadSection from "@/components/property/PhotoUploadSection";
import PropertyLocationSection from "@/components/property/PropertyLocationSection";
import { BackButton } from "@/components/shared/buttons";
import { SelectButton } from "@/components/shared/Input";
import { ScreenName } from "@/components/shared/LabelCards";
import ToggleButtons from "@/components/ToggleButtons";
import { mockProperties, styles } from "@/constant";
import handleLocationSelect from "@/utils/handleLocationSelect";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaArrowLeft, FaNairaSign } from "react-icons/fa6";
import { IoHomeOutline } from "react-icons/io5";

export default function AddPropertyPage() {
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(180000);
  const [rentType, setRentType] = useState<string>("Monthly");
  const [listedFor, setListedFor] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);

  const maxPhotos = 5;
  const categories = [
    { title: "House", value: "house" },
    { title: "Land", value: "land" },
    { title: "Shop", value: "shop" },
    { title: "Office", value: "office" },
    { title: "Hotel", value: "hotel" },
  ];

  const listingTypes = [
    { title: "Sell", value: "sell" },
    { title: "Rent", value: "rent" },
  ];

  useEffect(() => {
    console.log("Selected value:", listedFor);
    console.log("Selected value:", category);
  }, [listedFor, category]);

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const uploadedFiles = Array.from(event.target.files);
    const validFiles = uploadedFiles.filter(
      (file) =>
        file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024 // Max size 5MB
    );

    if (photos.length + validFiles.length > maxPhotos) {
      alert(`You can only upload up to ${maxPhotos} photos.`);
      return;
    }

    setPhotos((prevPhotos) => [...prevPhotos, ...validFiles]);
  };

  const removePhoto = (index: number) => {
    setPhotos((prevPhotos) => prevPhotos.filter((_, i) => i !== index));
  };

  return (
    <div className="pb-16 mx-auto w-full ">
      <ScreenName title="Add Property" />

      
      <div className="p-6">
        <h2 className="text-xl mb-7">
          Hi User, Fill Details of your <span className="font-semibold">property</span>
        </h2>
        {/* Property Title */}
        <div className="flex card-bg p-3 rounded-full shadow-md">
          <input
            name="tittle"
            value={propertyTitle}
            onChange={(e) => setPropertyTitle(e.target.value)}
            type="text"
            placeholder="Property title Here"
            className="w-full outline-none card-bg"
          />
          <button className="text-gray-500 text-lg px-3" disabled>
            <IoHomeOutline className="font-bold" />
          </button>
        </div>

        {/* Listed For */}
        <h3 className={`${styles.H2} `}>Listed For</h3>
        <SelectButton list={listingTypes} setValue={setListedFor} name="listedFor" />

        {/* Listing Price */}
        <div className="">
          <h3 className={`${styles.H2} `}>
            {listedFor === "rent" ? "Rent Price" : "Sell Price"}
          </h3>
          <div className="flex card-bg p-3 rounded-lg shadow-md">
            <input
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              type="number"
              placeholder="Property price here"
              className="w-full outline-none card-bg"
            />
            <button className="text-gray-500 text-lg px-3">
              <FaNairaSign className="font-bold" />
            </button>
          </div>
        </div>

        {listedFor === "rent" && (
          <ToggleButtons
            options={["Monthly", "Yearly"]}
            selected={rentType}
            onChange={setRentType}
          />
        )}

        {/* Property Category */}
        <h3 className={`${styles.H2} `}>Property Category</h3>
        <SelectButton list={categories} setValue={setCategory} name="category" />

        {/* Proprty Location */}
          <PropertyLocationSection
            userCoordinates={userCoordinates}
            fallbackCoordinates={[mockProperties[0].latitude, mockProperties[0].longitude]}
            onLocationSelect={handleLocationSelect}
          />

          <PhotoUploadSection
            photos={photos}
            maxPhotos={maxPhotos}
            handlePhotoUpload={handlePhotoUpload}
            removePhoto={removePhoto}
          />
          
          {/* Property Details Section */}
          <AddPropertyDetails listingCategory="house"/>

        {/* Navigation Buttons */}
        <div className="w-full mx-auto">
          <div className="flex mt-16 gap-5 bottom-3">
            <button className="px-2 py-2 bg-white rounded-full flex items-center shadow-md">
              <FaArrowLeft className="text-xl" />
            </button>
            
            <button className="px-4 py-2 bg-green text-white rounded-md w-full">Add</button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
