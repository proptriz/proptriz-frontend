'use client';

import { ScreenName } from '@/components/shared/LabelCards';
import { AppContext } from '@/context/AppContextProvider';
import Image from 'next/image';
import React, { useContext, useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaFacebookF } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import logger from '../../../../logger.config.mjs';
import { styles } from '@/constant';
import { BsWhatsapp } from 'react-icons/bs';

const EditProfile = () => {
  const { authUser } = useContext(AppContext);
  const [photo, setPhoto] = useState<File>();

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!validTypes.includes(file.type)) {
        toast.error('Invalid file type. Please select a PNG or JPG image.');
        logger.error('Invalid file type selected', { type: file.type });
        return;
      }

      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('File is too large. Maximum size is 5 MB.');
        logger.error('File too large', { size: file.size });
        return;
      }

      setPhoto(file);
      toast.success('Profile photo selected');
      logger.info('Profile photo selected', { name: file.name, size: file.size });
    } catch (err) {
      logger.error('Error handling photo upload', err);
      toast.error('Unable to upload photo.');
    }
  };

  return (
    <div className="p-6">
      <ScreenName title="Update Profile" />

      <div className="flex flex-col items-center mb-8">
        <div className="relative bg-white w-32 h-32 rounded-full p-1 mt-4 overflow-hidden shadow-lg">
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleUpload} 
          />

          <img 
            src={photo ? URL.createObjectURL(photo) : "/logo.png"}
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
        <div> 
          <h3 className={styles.H2}>Full Name:</h3>
          <div className="flex items-center card-bg rounded-xl px-3 py-5">                
            <input
              name='full_name'
              type="text"
              placeholder='Enter your full name'
              className="w-full bg-transparent outline-none"
            />
              <FaUser className="text-gray-500 ms-auto" />
          </div>
        </div>
        
        <div> 
          <h3 className={styles.H2}>Email (optional):</h3> 
          <div className="flex items-center card-bg rounded-xl px-3 py-5">           
            <input
              name='email'
              type="email"
              placeholder='Enter your email'
              className="w-full bg-transparent outline-none"
            />
              <FaEnvelope className="text-gray-500 ms-auto" />
          </div>
        </div>
        <div>
          <h3 className={styles.H2}>Phone number (optional):</h3> 
          <div className="flex items-center card-bg rounded-xl px-3 py-5">             
            <input
              type="tel"
              placeholder='Enter your phone number (+234 080-3288-9111)'
              className="w-full bg-transparent outline-none"
            />
            <FaPhone className="text-gray-500 ms-auto" />
          </div>
        </div>
        <div>
          <h3 className={styles.H2}>Whatsapp number (optional):</h3>          
          <div className="flex items-center card-bg rounded-xl px-3 py-5">
            <input
              type="tel"
              placeholder='Enter your Whatsapp number (+234 080-3288-9111)'
              className="w-full bg-transparent outline-none"
            />
            <BsWhatsapp className="text-gray-500 ms-auto" />
          </div>
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
    </div>
  );
};

export default EditProfile;
