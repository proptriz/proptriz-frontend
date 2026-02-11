'use client';

import { useState, useContext } from "react";
import { IoHomeOutline } from "react-icons/io5";
import { FaArrowLeft } from "react-icons/fa6";
import { ScreenName } from "@/components/shared/LabelCards";
import { SelectButton, TextareaInput, TextInput } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
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
import { HiOutlineLocationMarker } from "react-icons/hi";
import Splash from "@/components/shared/Splash";
import { CgDetailsMore } from "react-icons/cg";
import Counter from "@/components/Counter";
import PropertyLocationModal from "@/components/property/PropertyLocationSection";
import { OutlineButton } from "@/components/shared/buttons";

export default function AddPropertyPage() {
  const { authUser } = useContext(AppContext);
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
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
  const [duration, setDuration] = useState<number>(1)
  const [openLocPicker, setOpenLocPicker] = useState<boolean>(false)

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
    setDescription("")
    setDuration(1)
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
    formData.append("description", description);
    formData.append("duration", duration.toString());
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

  if (!authUser) {
    return <Splash showFooter/>;
  }

  return (
    <>
    <div className="relative pb-16 mx-auto w-full">
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

        <div className="mt-4 space-y-4">
          {/* Property Title */}
          <TextInput
            label="Property title"
            icon={<IoHomeOutline />}
            id="title"
            name="title"
            value={propertyTitle}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPropertyTitle(e.target.value)}
            placeholder="Property title here"
          />

          {/* Listed For */}
          <div className="">
            <SelectButton<ListForEnum> 
              list={listingTypes} 
              setValue={setListedFor} 
              name="listedFor" 
              value={listedFor} 
              label="Listed For" 
            />
          </div>

          {/* Price */}
          <div>
            <label className={styles.H2} htmlFor={"price"}>
              {listedFor === ListForEnum.rent ? "Rent Price" : "Sell Price"}
            </label>
            <div 
            className="flex items-center p-[10px] w-full rounded-md border-[1px]
              bg-gray-100 border-primary
              focus-within:border-secondary
              focus-within:bg-white
              transition-colors
              "
            >
              <input
                name="price"
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                type="number"
                placeholder="Property price here"
                className="w-full outline-none bg-transparent"
              />
              <button 
                className="text-gray-500 text-lg px-3 flex items-center gap-1"
                onClick={() => setTogglePopup(!togglePopup)}
              >
                {currency}
                <IoMdArrowDropdown />          
              </button>
            </div>
          </div>

          <div>
            {listedFor === ListForEnum.rent && (
              <ToggleButtons<RenewalEnum>
                label="Tenancy Period"
                options={Object.values(RenewalEnum)}
                selected={renewPeriod}
                onChange={setRenewPeriod}
              />
            )} 
          </div>

          <TextareaInput
            label="Property Description (optional)"
            id='description'
            icon={<CgDetailsMore />}
            name="description"
            value={description}
            onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="Enter Property details here"
            className="w-full outline-none card-bg"
          />

          <div className="gap-4 items-center mt-4">
            <label htmlFor="duration"  className={styles.H2}>Listing Duration (in weeks)</label>
            <div 
              className="flex items-center w-full px-2 rounded-md border-[1px]
              bg-gray-100 border-primary
              focus-within:border-secondary
              focus-within:bg-white
              transition-colors
              "
            >
              <input
                type="number"
                name="duration"
                id="duration"
                placeholder="Enter listing duration (in weeks)"
                value={duration}
                min={1}
                max={50}
                readOnly
                onChange={(e:React.ChangeEvent<HTMLInputElement>) => {setDuration(parseInt(e.target.value) || 1)}}
                className="w-full outline-none p-1 bg-transparent"
              />
              <Counter
                label=""
                value={duration}
                onIncrement={() => setDuration(duration < 50 ? duration + 1 : 50)}
                onDecrement={() => setDuration(duration > 1 ? duration - 1 : 1)}
              />
            </div>
          </div>

          {/* Availability status */}
          <div>
            <ToggleButtons<PropertyStatusEnum>
              label="Availability status"
              options={Object.values(PropertyStatusEnum).filter(status => status !== PropertyStatusEnum.expired)}
              selected={propertyStatus}
              onChange={setPropertStatus}
            />
          </div>
        </div>

        {/* Property Location & Address */}
        {/* Address */}
        <div className="mt-4">
          <TextInput 
            label="Property Address"
            icon={<HiOutlineLocationMarker />}
            name="address"
            id="address"
            value={propertyAddress}
            onChange={(e:React.ChangeEvent<HTMLInputElement>) => setPropertyAddress(e.target.value)}
            placeholder="Enter property Address"
          />
        </div>

        <div className="w-full flex justify-end mt-4">
          <OutlineButton 
            onClick={()=>setOpenLocPicker(true)}
          >
            Pick property location
          </OutlineButton>
        </div>
        
      
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
    <PropertyLocationModal
      isOpen={openLocPicker}
      onClose={() => setOpenLocPicker(false)}
      userCoordinates={userCoordinates}
      fallbackCoordinates={[9.082, 8.6753]} // Nigeria default
      onLocationSelect={handleLocationSelect}
    />
    
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
