'use client';

import { useEffect, useState } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaArrowLeft, FaNairaSign } from "react-icons/fa6";
import { ScreenName } from "@/components/shared/LabelCards";
import { SelectButton } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import PropertyLocationSection from "@/components/property/PropertyLocationSection";
import PhotoUploadSection from "@/components/property/PhotoUploadSection";
import AddPropertyDetails from "@/components/property/AddDetailsSection";
import { mockProperties, styles } from "@/constant";
import { createProperty } from "@/services/propertyApi";
import { CategoryEnum, ListForEnum, RenewalEnum } from "@/types";
import { toast } from "react-toastify";

export default function AddPropertyPage() {
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [price, setPrice] = useState<number>(180000);
  const [renewPeriod, setRenewPeriod] = useState<RenewalEnum>(RenewalEnum.yearly);
  const [listedFor, setListedFor] = useState<ListForEnum>(ListForEnum.rent);
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.house);
  const [photos, setPhotos] = useState<File[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  const [propCoordinates, setPropCoordinates] = useState<[number, number]  | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const maxPhotos = 5;
  const categories = [
    { title: "House", value: "house" },
    { title: "Land", value: "land" },
    { title: "Shop", value: "shop" },
    { title: "Office", value: "office" },
    { title: "Hotel", value: "hotel" },
  ];

  const listingTypes = [
    { title: "Sale", value: "sale" },
    { title: "Rent", value: "rent" },
  ];

  const handleLocationSelect = (lat: number, lng: number,) => {
    // Save to form state, API, etc.
    setPropCoordinates([lat, lng])
    toast.success(`Location selected: (${lat}, ${lng})`, { position: "top-right" });
    console.log("Selected coordinates:", lat, lng);
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const uploadedFiles = Array.from(event.target.files);
    const validFiles = uploadedFiles.filter(
      (file) => file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024
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

  // ✅ Submit Handler
  const handleSubmit = async () => {
    if (!propertyTitle || !listedFor || !category || !price || !photos.length) {
      alert("Please fill in all required fields and upload at least one photo.");
      return;
    }

    const formData = new FormData();
    formData.append("title", propertyTitle);
    formData.append("price", price.toString());
    formData.append("address", propertyAddress);
    formData.append("banner", '/apartment.png');
    formData.append("listed_for", listedFor);
    formData.append("category", category);
    formData.append("negotiable", "false");
    formData.append("status", "available");
    formData.append("latitude", String(propCoordinates?.[0] || mockProperties[0].latitude));
    formData.append("longitude", String(propCoordinates?.[1] || mockProperties[0].longitude));

    if (listedFor === "rent") {
      formData.append("period", renewPeriod.toLowerCase()); // monthly/yearly
    }

    photos.forEach((photo) => {
      formData.append("images", photo); 
    });

    try {
      setIsLoading(true);
      const response = await createProperty(formData);
      console.log("Property created:", response);
      alert("Property successfully added!");
      // You can redirect to property list page or clear form
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to add property.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pb-16 mx-auto w-full">
      <ScreenName title="Add Property" />

      <div className="p-6">
        <h2 className="text-xl mb-7">
          Hi User, Fill Details of your <span className="font-semibold">property</span>
        </h2>

        {/* Property Title */}
        <div>
          <h3 className={styles.H2}>Property title</h3>
          <div className="flex card-bg p-3 rounded-full shadow-md">
            <input
              name="title"
              value={propertyTitle}
              onChange={(e) => setPropertyTitle(e.target.value)}
              type="text"
              placeholder="Property title here"
              className="w-full outline-none card-bg"
            />
            <button className="text-gray-500 text-lg px-3" disabled>
              <IoHomeOutline className="font-bold" />
            </button>
          </div>
        </div>

        {/* Price */}
        <div>
          <h3 className={styles.H2}>
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

        {/* Property Address */}
        <div>
          <h3 className={styles.H2}>Property Address</h3>
          <div className="flex card-bg p-3 rounded-full shadow-md">
            <input
              name="address"
              value={propertyAddress}
              onChange={(e) => setPropertyAddress(e.target.value)}
              type="text"
              placeholder="Property Address here"
              className="w-full outline-none card-bg"
            />
            <button className="text-gray-500 text-lg px-3" disabled>
              <IoHomeOutline className="font-bold" />
            </button>
          </div>
        </div>          

        {/* Listed For */}
        <SelectButton<ListForEnum> 
          list={listingTypes} 
          setValue={setListedFor} 
          name="listedFor" 
          value={listedFor} 
          label="Listed For" 
        />

        {listedFor === "rent" && (
          <ToggleButtons<RenewalEnum>
            label="Tenancy Period"
            options={[RenewalEnum.monthly, RenewalEnum.yearly]}
            selected={renewPeriod}
            onChange={setRenewPeriod}
          />

        )}

        {/* Property Category */}
        <h3 className={styles.H2}>Property Category</h3>
        <SelectButton<CategoryEnum> list={categories} setValue={setCategory} name="category" value={category} />

        {/* Property Location */}
        <PropertyLocationSection
          userCoordinates={userCoordinates}
          fallbackCoordinates={[mockProperties[0].latitude, mockProperties[0].longitude]}
          onLocationSelect={handleLocationSelect}
        />

        {/* Photo Upload */}
        <PhotoUploadSection
          photos={photos}
          maxPhotos={maxPhotos}
          handlePhotoUpload={handlePhotoUpload}
          removePhoto={removePhoto}
        />

        {/* Property Details */}
        <AddPropertyDetails listingCategory="house" />

        {/* Submit Buttons */}
        <div className="w-full mx-auto">
          <div className="flex mt-16 gap-5 bottom-3">
            <button className="px-2 py-2 bg-white rounded-full flex items-center shadow-md">
              <FaArrowLeft className="text-xl" />
            </button>

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md w-full text-white ${
                isLoading ? "bg-gray-400" : "bg-green"
              }`}
            >
              {isLoading ? "Adding..." : "Add"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
