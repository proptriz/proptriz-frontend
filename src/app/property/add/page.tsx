'use client';

import { useState, useContext } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { ScreenName } from "@/components/shared/LabelCards";
import { SelectButton } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import PropertyLocationSection from "@/components/property/PropertyLocationSection";
import PhotoUploadSection from "@/components/property/PhotoUploadSection";
import AddPropertyDetails from "@/components/property/AddDetailsSection";
import { AppContext } from "@/context/AppContextProvider";
import { categories, styles } from "@/constant";
import { createProperty } from "@/services/propertyApi";
import { CategoryEnum, CurrencyEnum, Feature, ListForEnum, NegotiableEnum, PropertyStatusEnum, RenewalEnum } from "@/types";
import { toast } from "react-toastify";
import logger from "../../../../logger.config.mjs"
import Popup from "@/components/shared/Popup";
import { IoMdArrowDropdown } from "react-icons/io";
import ToggleCollapse from "@/components/shared/ToggleCollapse";
import { HiOutlineLocationMarker } from "react-icons/hi";

export default function AddPropertyPage() {
  const { authUser } = useContext(AppContext);
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [propertyAddress, setPropertyAddress] = useState<string>("");
  const [price, setPrice] = useState<string>("0.00");
  const [renewPeriod, setRenewPeriod] = useState<RenewalEnum>(RenewalEnum.yearly);
  const [listedFor, setListedFor] = useState<ListForEnum>(ListForEnum.rent);
  const [currency, setCurrency] = useState<CurrencyEnum>(CurrencyEnum.naira);
  const [category, setCategory] = useState<CategoryEnum>(CategoryEnum.house);
  const [propertyStatus, setPropertStatus] = useState<PropertyStatusEnum>(PropertyStatusEnum.available);
  const [photos, setPhotos] = useState<File[]>([]);
  const [negotiable, setNegotiable] = useState<NegotiableEnum>(NegotiableEnum.Negotiable);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [facilities, setFacilities] = useState<string[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([9.0820, 8.6753]);
  const [propCoordinates, setPropCoordinates] = useState<[number, number]>(userCoordinates);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [togglePopup, setTogglePopup] = useState(false);

  const maxPhotos = 1;

  const listingTypes = [
    { title: "Sale", value: "sale" },
    { title: "Rent", value: "rent" },
  ];

  const reset = () => {
    setPropertyTitle("");
    setPropertyAddress("");
    setPrice("0.00");
    setCurrency(CurrencyEnum.naira);
    setListedFor(ListForEnum.rent);
    setCategory(CategoryEnum.house);
    setRenewPeriod(RenewalEnum.yearly);
    setNegotiable(NegotiableEnum.Negotiable);
    setPropertStatus(PropertyStatusEnum.available);
    setPhotos([]);
    setFeatures([]);
    setFacilities([]);
    setPropCoordinates(userCoordinates);
  }
  const handleLocationSelect = (lat: number, lng: number,) => {
    // Save to form state, API, etc.
    setPropCoordinates([lat, lng])
    toast.success(`Location selected: (${lat}, ${lng})`, { position: "top-right" });
    logger.info("Selected coordinates:", lat, lng);
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
      toast.warn("Please fill in all required fields and upload at least one photo.");
      return;
    }

    const formData = new FormData();
    formData.append("title", propertyTitle);
    formData.append("price", price.toString());
    formData.append("currency", currency);
    formData.append("address", propertyAddress);
    formData.append("listed_for", listedFor);
    formData.append("category", category);
    formData.append("negotiable", negotiable === NegotiableEnum.Negotiable ? "true" : "false");
    formData.append("status", propertyStatus);
    formData.append("latitude", String(propCoordinates?.[0] || userCoordinates[0]));
    formData.append("longitude", String(propCoordinates?.[1] || userCoordinates[1]));
    // ✅ Properly serialize structured data
    formData.append("features", JSON.stringify(features)); // Array of { name, quantity }
    formData.append("env_facilities", JSON.stringify(facilities)); // Array of strings

    if (listedFor === ListForEnum.rent) {
      formData.append("period", renewPeriod.toLowerCase()); // monthly/yearly
    }

    photos.forEach((photo) => {
      formData.append("images", photo); 
    });

    try {
      setIsLoading(true);
      const response = await createProperty(formData);
      logger.info("Property created:", {response});
      toast.success("Property successfully added!");
      reset();
    } catch (error: any) {
      logger.error(error);
      toast.error(error.response?.data?.message || "Failed to add property.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
    <div className="pb-16 mx-auto w-full">
      <ScreenName title="Add Property" />

      <div className="p-6">
        <h2 className="text-xl mb-7">
          Hi {authUser?.username || "User"}, Fill Details of your <span className="font-semibold">property</span>
        </h2>

        {/* Property Category */}
        <h3 className={styles.H2}>Property Category</h3>
        <SelectButton<CategoryEnum> 
          list={categories} 
          setValue={setCategory} 
          name="category" 
          value={category} 
        />

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

        {/* Listed For */}
        <SelectButton<ListForEnum> 
          list={listingTypes} 
          setValue={setListedFor} 
          name="listedFor" 
          value={listedFor} 
          label="Listed For" 
        />

        {/* Price */}
        <div>
          <h3 className={styles.H2}>
            {listedFor === ListForEnum.rent ? "Rent Price" : "Sell Price"}
          </h3>
          <div className="flex card-bg p-3 rounded-lg shadow-md">
            <input
              name="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              type="number"
              placeholder="Property price here"
              className="w-full outline-none card-bg"
            />
            <button 
              className="text-gray-500 text-lg px-3 flex items-center gap-1"
              onClick={() => setTogglePopup(!togglePopup)}
            >
              {/* <FaNairaSign className="font-bold" />     */}
              {currency}
              <IoMdArrowDropdown />          
            </button>
          </div>
        </div>         

        {listedFor === ListForEnum.rent && (
          <ToggleButtons<RenewalEnum>
            label="Tenancy Period"
            options={Object.values(RenewalEnum)}
            selected={renewPeriod}
            onChange={setRenewPeriod}
          />
        )}

        {/* Availability status */}
        <ToggleButtons<PropertyStatusEnum>
          label="Availability status"
          options={Object.values(PropertyStatusEnum).filter(status => status !== PropertyStatusEnum.expired)}
          selected={propertyStatus}
          onChange={setPropertStatus}
        />

        {/* Property Location & Address */}
        <ToggleCollapse header="Property Location" open={true}>
          {/* Address */}
          <div className="mb-4">
            <h3 className={styles.H2}>Property Address</h3>
            <div className="flex card-bg p-3 rounded-full shadow-md">
              <input
                name="address"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                type="text"
                placeholder="Enter property Address"
                className="w-full outline-none card-bg"
              />
              <button className="text-gray-500 text-lg px-3" disabled>
                <HiOutlineLocationMarker className="font-bold" />
              </button>
            </div>
          </div> 

          {/* Map */}
          <PropertyLocationSection
            userCoordinates={userCoordinates}
            fallbackCoordinates={userCoordinates}
            onLocationSelect={handleLocationSelect}
          />
        </ToggleCollapse>
        

        <ToggleCollapse header="Description & Special terms" open={false}>
          <div className="flex flex-col gap-3">
            <textarea name="description" id="" placeholder="Enter property description"></textarea>
            <textarea name="property_terms" id="" placeholder="Enter property Special terms"></textarea>
          </div>
          
        </ToggleCollapse>

        {/* Photo Upload */}
        <PhotoUploadSection
          photos={photos}
          maxPhotos={maxPhotos}
          handlePhotoUpload={handlePhotoUpload}
          removePhoto={removePhoto}
        />

        {/* Property Details */}
        <AddPropertyDetails 
          listingCategory={category} 
          onNegotiableChange={setNegotiable}
          onFeaturesChange={setFeatures}
          onFacilitiesChange={setFacilities}
        />

        {/* Submit Buttons */}
        <div className="w-full mx-auto">
          <div className="flex mt-16 gap-5 bottom-3">
            <button className="px-2 py-2 bg-white rounded-full flex items-center shadow-md">
              <FaArrowLeft className="text-xl" />
            </button>

            { authUser ? <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-4 py-2 rounded-md w-full text-white ${
                isLoading ? "bg-gray-400" : "bg-green"
              }`}
            >
              {isLoading ? "Adding..." : "Add Property"}
            </button> : <button
              disabled
              className="px-4 py-2 rounded-md w-full text-white bg-gray-400" 
            >
              Add (Login on Pi Browser)
            </button>
            }
          </div>
        </div>
      </div>
    </div>
    {/* Currency popup */}
    <Popup header="Select currency" toggle={togglePopup} setToggle={setTogglePopup} useMask={true}>
      <div className="my-3">
        {Object.entries(CurrencyEnum).map(([key, value]) => (
          <button
            key={value}
            onClick={() => {
              setCurrency(value);
              setTogglePopup(false);
            }}
            className="w-full text-left p-3 border-b last:border-b-0 hover:bg-primary hover:text-white transition-colors cursor-pointer"
          >
            {key.charAt(0).toUpperCase() + key.slice(1)} ({value})
          </button>
        ))}

      </div>
    </Popup>
    </>
  );
}
