'use client'

import { BackButton } from '@/components/shared/buttons';
import { FileInput, SelectButton } from '@/components/shared/Input';
import axiosClient from '@/config/client';
import { aditProfile } from '@/services/userApi';
import { getDeviceLocation } from '@/utils/geolocation';
import Image from 'next/image';
import React, { useState, useActionState, useEffect, use } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaFacebookF, FaAddressBook } from 'react-icons/fa';
import { FaPencil } from "react-icons/fa6";
import { toast } from 'react-toastify';
import { useSession } from "next-auth/react";
import { AgentStatus, AgentType } from '@/definitions';
import { title } from 'process';

const EditProfile = () => {
  const {  data: session, status } = useSession();

  const [photo, setPhoto] = useState<File>();
  const [location, setLocation] = useState<[number, number] | null>(null);
  const [formData, setFormData] = useState<AgentType>({
    brand_name: "Brand Name",
    address: "",
    status: AgentStatus.available
  });

  useEffect(() => {
    const getLocation = async () =>{
      const userLocation = await getDeviceLocation()
      if (userLocation) {
        setLocation(userLocation);
      } else {
        toast.warn("Unable to get location. Please enable GPS.");
        setLocation(null)
      }
      console.log("User location: ", userLocation);
    }

    getLocation();
  }, []);

  const [state, formAction] = useActionState(
    async () => {
    try {
      // const jsonData = Object.fromEntries(formData.entries());
      const response = await axiosClient.put("/users/update-profile", formData );
      return { success: true, data: response.data };
    } catch (error: any) {
      console.error("Profile update failed:", error);
      return { success: false, message: error.message };
    }
  }, null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    const file = event.target.files[0];
    
    // Validate file type and size (max 5MB)
    if (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024) {
      toast.warn("Invalid file: Please select an image file under 5MB.");
      return;
    }
    
    // Convert file to a preview URL
    const imageUrl = URL.createObjectURL(file);
    setPhoto(file);
  };

  return (
    <div className="p-6">
    {/* Header */}
    <BackButton />
    <div className='flex flex-col'>
      <p className='text-xs mx-auto'>{session?.user?.name}</p>
      <h2 className="text-lg font-semibold mx-auto">Become Agent</h2>
    </div>      

    <form action={formAction}>
      {/* Profile Image */}
      <div className="flex flex-col items-center mb-8">
        <div className="relative bg-white w-32 h-32 rounded-full p-1 mt-4 overflow-hidden shadow-lg">
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handlePhotoUpload}
          />
          <img
            src={photo? URL.createObjectURL(photo): "https://placehold.co/128x128"}
            alt="profile"
            className="rounded-full w-full h-full object-cover"
          />
          <div className="absolute bottom-2 right-1 bg-white p-2 rounded-full shadow-md">
            <FaPencil className="text-green text-sm" />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="flex items-center card-bg rounded-xl px-3 py-5">
          <input
            type="text"
            name="brand_name"
            value={formData.brand_name}
            onChange={handleChange}
            className="w-full bg-transparent outline-none"
          />
          <FaUser className="text-gray-500 ms-auto" />
        </div>
        <div className="flex items-center card-bg rounded-xl px-3 py-5">
          <input
            type="tel"
            name="phone"
            value={""}
            onChange={handleChange}
            className="w-full bg-transparent outline-none"
          />
          <FaAddressBook className="text-gray-500 ms-auto" />
        </div>
          
        <div className="flex items-center card-bg rounded-xl px-3 py-5">
          <input
            type="text"
            name="email"
            onChange={handleChange}
            className="w-full bg-transparent outline-none"
          />
          <FaEnvelope className="text-gray-500 ms-auto" />
        </div>

        <SelectButton list={[{title:'available', value:'available'},{title:'unavailable', value:'unavailable'}]} name='status' setValue={()=>{}}/>
          
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <button
          className="w-full bg-green text-white py-3 rounded-xl"
          type="submit"
          disabled={!state}
        >
          {!state ? "Updating..." : "Submit"}
        </button>
      </div>
    </form>

    {/* Social Buttons */}
    <div className="flex justify-between mt-6 space-x-4">
      <button className="flex items-center justify-items-center bg-[#234F68] w-full text-white p-5 rounded-lg ">
        <Image src="/icon/google.svg" alt="google icon" width={20} height={20} className='mr-2'/>
          Google Unlink
      </button>
      <button className="flex items-center justify-items-center card-bg w-full p-5 rounded-lg ">
        <FaFacebookF className='text-2xl text-blue-600 mr-2' />
          Facebook Link
      </button>
    </div>

    {/* Location Button */}
    <div className="mt-16">
      <button className="w-full bg-green text-white py-3 rounded-xl" type='submit'>
        Submit
      </button>
    </div>
  </div>
  );
};

export default EditProfile;
