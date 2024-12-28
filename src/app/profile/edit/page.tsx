import { BackButton } from '@/components/shared/buttons';
import Image from 'next/image';
import React from 'react';
import { FaUser, FaPhone, FaEnvelope, FaArrowLeft, FaFacebookF } from 'react-icons/fa';

const EditProfile = () => {
  return (
    <div className="p-6">
        {/* Header */}
        <div className="flex items-center mb-6">
            <BackButton />
            <h2 className="text-lg font-semibold mx-auto">Edit Profile</h2>
        </div>

        {/* Profile Image */}
        <div className="flex flex-col items-center mb-8">
            <div className="bg-white w-32 h-32 rounded-full p-1 mt-4">
                <img
                    src="https://placehold.co/40"
                    alt="profile"
                    className="rounded-full w-full h-full object-cover"
                />                    
            </div>                    
            <div className="-mt-4 ml-12">
                <span className="bg-green text-white text-xs px-2 py-1 rounded-full">
                #1
                </span>
            </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
            <div className="flex items-center card-bg rounded-xl px-3 py-5">                
                <input
                    type="text"
                    defaultValue="Mathew Adam"
                    className="w-full bg-transparent outline-none"
                />
                <FaUser className="text-gray-500 ms-auto" />
            </div>
            <div className="flex items-center card-bg rounded-xl px-3 py-5">                
                <input
                    type="tel"
                    defaultValue="+62 112-3288-9111"
                    className="w-full bg-transparent outline-none"
                />
                <FaPhone className="text-gray-500 ms-auto" />
            </div>
            <div className="flex items-center card-bg rounded-xl px-3 py-5">
                <input
                    type="email"
                    defaultValue="Mathew@email.com"
                    className="w-full bg-transparent outline-none "
                />
                <FaEnvelope className="text-gray-500 ms-auto" />
            </div>
        </div>

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
            <button className="w-full bg-green text-white py-3 rounded-xl">
            Choose location
            </button>
        </div>
        </div>
    );
};

export default EditProfile;
