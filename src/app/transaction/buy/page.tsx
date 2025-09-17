'use client';

import { useState, useContext } from "react";
import Image from "next/image";
import { FaPhone, FaCommentDots } from "react-icons/fa";
import { AppContext } from "@/context/AppContextProvider";
import { toast } from "react-toastify";
import { PaymentDataType } from "@/types";
import { payWithPi } from "@/config/payment";
import Splash from "@/components/shared/Splash"
import { BackButton } from "@/components/shared/buttons";

export default function FeaturePage() {
  const { authUser, isSigningInUser } = useContext(AppContext);
  const [isSaveLoading, setIsSaveLoading] = useState<boolean>(false);

  const onPaymentComplete = async (data:any) => {
    // setIsSaveLoading(false);  
    toast.success("Payment successfull")
    // reset();
  }
  
  const onPaymentError = (error: Error) => {
    toast.error('Payment error');
    // setIsSaveLoading(false);
  }
  
  const handleSend = async () => {
    if (!authUser?.pi_uid) {
      toast.error('SCREEN.MEMBERSHIP.VALIDATION.USER_NOT_LOGGED_IN_PAYMENT_MESSAGE')
      return 
    }
    setIsSaveLoading(true)
  
    const paymentData: PaymentDataType = {
      amount: 1,
      memo: `Proptriz payment for property`,
      metadata: { 
        seller_uid: '478d3238-86dd-47ca-a1b5-8f18326189d1',
        property_id: '0543',
      },        
    };
    await payWithPi(paymentData, onPaymentComplete, onPaymentError);
  }

  return (
    <>
    { !authUser ? 
    <Splash /> :
    <div className="">
      <div className="relative">
        <Image
          src="/apartment.png" // Placeholder; replace with actual image URL
          alt="Feature House"
          width={1440}
          height={700}
          className="w-full h-80 object-cover"
        />
        <div className="absolute top-4 left-4 text-white">
          <BackButton />
        </div>
      </div>
      <div className="p-6 space-y-4">
        <h1 className="text-2xl font-bold">Ascot House</h1>
        <p className="text-gray-600">Jl Sultan Iskandar Muda, Jakarta Selatan</p>
        <div className="flex space-x-6">
          <span>6 Bedrooms</span>
          <span>4 Bathrooms</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-blue-500">★★★★☆</span>
          <span>(15 reviews)</span>
        </div>
        <div className="flex items-center space-x-4">
          <div>
            <Image
              src="/avatar.jpg" // Placeholder
              alt="Owner Avatar"
              width={50}
              height={50}
              className="rounded-full"
            />
          </div>
          <div>
            <h3 className="text-lg font-bold">Garry Allen</h3>
            <p className="text-gray-600">Owner</p>
          </div>
          <div className="flex space-x-4">
            <button className="text-blue-500">
              <FaPhone size={24} />
            </button>
            <button className="text-blue-500">
              <FaCommentDots size={24} />
            </button>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold">Description</h2>
          <p className="text-gray-600">
            The 3-level house has a modern design, has a large pool, and a
            garage that fits up to four cars...
          </p>
        </div>
        <button 
        onClick={()=>handleSend()}
        className="w-full bg-green-500 text-white py-2 rounded"
        >
          Buy Now
        </button>
      </div>
    </div> }
    </>
  );
}
