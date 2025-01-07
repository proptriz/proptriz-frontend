'use client';

import { useState } from "react";
import Counter from "@/components/Counter";
import ToggleButtons from "@/components/ToggleButtons";
import TagSelector from "@/components/TagSelector";
import { BackButton } from "@/components/shared/buttons";
import { FaNairaSign, FaPlus } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";
import Image from "next/image";
import AddPropertyDetails from "@/components/property/AddDetailsSection";

interface Feature {
  name: string;
  quantity: number;
}

interface CategoryFeatures {
  [key: string]: Feature[]; // Updated to include quantity
}

export default function AddPropertyDetailsPage() {

  const listingCategory: string = "house"; // Updated to include 'land'
  
  const categoryFeatures: CategoryFeatures = {
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
    ], // Added land category features
  };
  const [togglePopup, setTogglePopup] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(true);
  const [negotiableToggle, setNegotiableToggle] = useState<string>("Negotiable");
  const [selectedFacilities, setSelectedFacilities] = useState<string[]>([]);
  const [customFacilities, setCustomFacilities] = useState<string[]>([]);
  const [features, setFeatures] = useState<Feature[]>(categoryFeatures[listingCategory]);

  const handleSubmit = () => {
    setSelectedFacilities([...selectedFacilities, ...customFacilities])
    const extraDetails = {
      negotiable: negotiableToggle,
      features: features,
      facilities: selectedFacilities,
    }
    console.log('submission successfull: ', extraDetails)
  }

  return (
    <div className="p-6 pb-10 relative">
      <div className={`absolute top-0 left-0 w-full h-full z-0 bg-blue-200 opacity-75 ${
          togglePopup ? '' : 'hidden'
          }`}
          // onClick={()=>setTogglePopup(false)}
      ></div>
      <header className="flex w-full mb-16">
        <BackButton />
        <h1 className="text-center w-full">Add Property</h1>
      </header>

      <h2 className="text-3xl mb-7">
        <span className="font-semibold text-[#252B5C]">Almost finish</span>, complete the
        listing
      </h2>

      <AddPropertyDetails listingCategory="house"/>

      {/* Finish Button */}
      <button className="w-full bg-green text-white py-2 rounded-md mt-16" onClick={() => {setTogglePopup(!togglePopup); handleSubmit()}}>
        Finish
      </button>


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
