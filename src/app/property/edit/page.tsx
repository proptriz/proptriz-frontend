'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import dynamic from 'next/dynamic';
import { BackButton } from "@/components/shared/buttons";
import HorizontalCard from "@/components/shared/HorizontalCard";
import { SelectButton } from "@/components/shared/Input";
import ToggleButtons from "@/components/ToggleButtons";
import { mockProperties } from "@/constant";
import { FaNairaSign } from "react-icons/fa6";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { IoClose, IoHomeOutline } from "react-icons/io5";
import AddPropertyDetails from "@/components/property/AddDetailsSection";
import Image from "next/image";
import { categories } from "@/constant";
import { toast } from 'react-toastify';
import getUserPosition from "@/utils/getUserPosition";
import LocationPickerMap from "@/components/LocationPickerMap ";
import handleLocationSelect from "@/utils/handleLocationSelect";

const Map = dynamic(() => import('@/components/Map'), { ssr: false });

export default function EditPropertyPage() {
  const [togglePopup, setTogglePopup] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [propertyTitle, setPropertyTitle] = useState<string>("");
  const [price, setPrice] = useState<number>(180000);
  const [rentType, setRentType] = useState<string>("Monthly");
  const [listedFor, setListedFor] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number] | null>(null);
  
  const maxPhotos = 5;

  const listingTypes = [
    { title: "Sell", value: "sell" },
    { title: "Rent", value: "rent" },
  ];

  // Get user location
  useEffect(() => {
  const fetchLocation = async () => {
    const [lat, lng] = await getUserPosition();
    console.log("User location:", lat, lng);
    setUserCoordinates([lat, lng]);
  };
  fetchLocation();
  }, []);

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

  useEffect(() => {
    console.log("Selected value:", listedFor);
    console.log("Selected value:", category);
  }, [listedFor, category]);

  const handleSubmit = () => {
    // setSelectedFacilities([...selectedFacilities, ...customFacilities])
    // const extraDetails = {
    //   negotiable: negotiableToggle,
    //   features: features,
    //   facilities: selectedFacilities,
    // }
    console.log('submission successfull: ')
    setSubmitSuccess(true)
  }

  return (
    <div className="p-6 pb-16 min-h-screen relative">
      {/* Back button */}
      <header className="flex w-full mb-16">
        <BackButton />
        <h2 className="text-center w-full font-bold">Edit Listing</h2>
      </header>

      {/* Property Card */}
      <div className="">
        {mockProperties.slice(0, 1).map(((info, key)=>(
          <HorizontalCard 
            id={info.id}
            name={info.title} 
            price={30} 
            type={info.category} 
            address={info.address} 
            image={info.banner} 
            period={info.period? info.period: ''} 
            rating={0}
            key={key}
          />
        )))}
      </div>
      
      <div>
        {/* Property Title */}
        <h3 className="mt-10 font-semibold">Listing Title</h3>
        <div className="flex card-bg p-3 rounded-full shadow-md">
          <input
            name="tittle"
            value={propertyTitle}
            onChange={(e) => setPropertyTitle(e.target.value)}
            type="text"
            placeholder="Property title Here"
            className="w-full outline-none card-bg text-sm"
          />
          <button className="text-gray-500 text-lg px-3" disabled>
            <IoHomeOutline className="font-bold" />
          </button>
        </div>

        {/* Listed For */}
        <h3 className="mt-10 font-semibold">Listed For</h3>
        <SelectButton list={listingTypes} setValue={setListedFor} name="listedFor" />

        {/* Listing Price */}
        <div className="my-4">
          <label className="block mt-10 font-semibold">
            {listedFor === "rent" ? "Rent Price" : "Sell Price"}
          </label>
          <div className="flex card-bg p-3 rounded-lg shadow-md mt-2">
            <input
              name="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              type="number"
              placeholder="Property price here"
              className="w-full outline-none card-bg text-sm"
            />
            <button className="text-gray-500 text-lg px-3">
              <FaNairaSign className="font-bold" />
            </button>
          </div>
        </div>

        {listedFor === "rent" && (
          <div className="my-4">
            <ToggleButtons
              options={["Monthly", "Yearly"]}
              selected={rentType}
              onChange={setRentType}
            />
          </div>
        )}

        {/* Property Category */}
        <h3 className="mt-10 font-semibold">Property Category</h3>
        <SelectButton list={categories} setValue={setCategory} name="category" />
        
        {/* Proprty Location */}
        <h3 className="mt-10 font-semibold">Location</h3>
        <div
          className="rounded-full p-4 border border-[#DCDFD9] my-4 cursor-pointer hover:bg-gray-100 flex items-center"
        >
          <button className="card-bg rounded-full p-3 mr-2 text-2xl" disabled>
            <HiOutlineLocationMarker />
          </button>
          <p className="text-gray-700 text-sm">
              Opposite Gate-04 Jimeta International Market, Yola
          </p>
        </div>
        <div className="max-h-[280px] overflow-hidden rounded-lg border border-gray-200 relative map-container-fix">
          <LocationPickerMap initialCenter={userCoordinates || [mockProperties[0].latitude, mockProperties[0].longitude]} onLocationSelect={handleLocationSelect}/>
        </div>
        <button className="w-full py-4 card-bg text-sm rounded-b-lg" disabled>Set & Save Location</button>
        
        <h3 className="mt-10 font-semibold mb-2">Listing photos</h3>
        <div>
          {/* Photo Upload Section */}
          <div className="mb-6">
            <label
              htmlFor="photo-upload"
              className="block w-full h-20 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-green-500"
            >
              {photos.length < maxPhotos ? (
                <span className="text-gray-500 text-xs">Click to upload photos (Max {maxPhotos})</span>
              ) : (
                <span className="text-red-500 text-xs">Maximum {maxPhotos} photos reached</span>
              )}
            </label>
            <input
              type="file"
              id="photo-upload"
              accept="image/jpeg, image/png"
              multiple
              className="hidden"
              onChange={handlePhotoUpload}
              disabled={photos.length >= maxPhotos}
            />
          </div>
    
          {/* Uploaded Photos Grid */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {photos.map((photo, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(photo)}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <button
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full shadow-md"
                  onClick={() => removePhoto(index)}
                >
                  <IoClose size={16} />
                </button>
              </div>
            ))}
          </div>

          <AddPropertyDetails listingCategory="house"/>
          
        </div>
        {/* Update Button */}
        <button className="w-full bg-green text-white py-2 rounded-md mt-16" onClick={() => {setTogglePopup(!togglePopup); handleSubmit()}}>
          Update
        </button>      
      </div>

      {/* Notification popup */}      
      <div
          className={`h-[400px] bg-white fixed bottom-0 left-0 w-full rounded-t-3xl p-6 ease-linear transition-transform z-10  ${
            togglePopup ? 'translate-y-0' : 'translate-y-full'
          }`}
      >
        <div className="h-px w-16 mx-auto bg-black"></div>

        {submitSuccess ? <div className="w-full mt-3">
          <Image src={'/icon/alert-success.png'} width={150} height={150} alt="success-icon"className="mx-auto"/>
          <h2 className="text-3xl mb-7 text-center">
            Your listing is now <span className="font-semibold text-[#252B5C]">submitted</span>
          </h2>
          <div className="flex gap-4">
            <button className="card-bg p-5 rounded-xl w-full">Add More</button>
            <button className="bg-green p-5 rounded-xl text-white w-full">Finish</button>
          </div>          
        </div> :
        <div className="w-full mt-3">
          <Image src={'/icon/alert-danger.png'} width={150} height={150} alt="success-icon"className="mx-auto"/>
          <h2 className="text-3xl mb-7 text-center">
            Aw snap, something <span className="font-semibold text-[#252B5C]">error</span> happened
          </h2>
          <div className="flex gap-4">
            <button className="card-bg p-5 rounded-xl w-full">Close</button>
            <button className="bg-green p-5 rounded-xl text-white w-full">Retry</button>
          </div>          
        </div>
        }
      </div>
    </div>
  );
}
