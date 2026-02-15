'use client';

import { ScreenName } from '@/components/shared/LabelCards';
import { AppContext } from '@/context/AppContextProvider';
import React, { useContext, useEffect, useState } from 'react';
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import logger from '../../../../logger.config.mjs';
import { BsWhatsapp } from 'react-icons/bs';
import { UserSettingsType, UserTypeEnum } from '@/types';
import ToggleCollapse from '@/components/shared/ToggleCollapse';
import { addOrUpdateUserSettings, getUserSettings } from '@/services/settingsApi';
import Image from 'next/image';
import { EmailInput, SelectInput, TextInput } from '@/components/shared/Input';
import { PhoneInput } from '@/components/shared/PhoneInput';
import Splash from '@/components/shared/Splash';

const EditProfile = () => {
  const { authUser } = useContext(AppContext);
  const [photo, setPhoto] = useState<File>();
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string>("/logo.png");
  const [formData, setFormData] = useState<Partial<UserSettingsType>>({});
  const [phone, setPhone] = useState("");
  const [normalizedPhone, setNormalizedPhone] = useState<string | null>(null);
  const [whatsapp, setWhatsapp] = useState("");
  const [normalizedWhatsapp, setNormalizedWhatsapp] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    // Fetch existing user settings if needed
    const fetchUserSettings = async () => {
      try {
        // fetching user settings logic
        const settings = await getUserSettings();
        if (!settings) {
          logger.warn("unable to fetch user settings")
          return;
        }

        setFormData(settings);
        setExistingPhotoUrl(settings.image || '');
        setPhone(settings.phone || '');
        setNormalizedPhone(settings.phone || null);
        setWhatsapp(settings.whatsapp || '')
        setNormalizedWhatsapp(settings.whatsapp || null)
        

      } catch (err) {
        logger.error('Error fetching user settings', err);
      }
    };

    if (authUser) {
      fetchUserSettings();
    }
  }, [authUser]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }
  
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

      const maxSize = 2 * 1024 * 1024; // 2MB
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

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      formData.phone = normalizedPhone || "";
      formData.whatsapp= normalizedWhatsapp || "";

      const updatedSettings = addOrUpdateUserSettings(formData, photo);
      if (updatedSettings) {
        logger.info('User profile updated', updatedSettings);
      }      
    } catch (err) {
      logger.error('Error updating profile', err);
      toast.error('Failed to update profile.');
    } finally {
      setIsLoading(false);
    }
  }

  if (!authUser) {
    return <Splash showFooter/>;
  }

  return (
    <div className="px-6 pb-7">
      <ScreenName title="Update Profile" />

      <div className="flex flex-col items-center mb-8">
        <div className="relative bg-white w-32 h-32 rounded-full p-1 overflow-hidden shadow-lg">
          <input
            type="file"
            name="image"
            accept="image/png, image/jpeg, image/jpg"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            onChange={handleUpload} 
          />
          
          <Image 
            src={photo ? URL.createObjectURL(photo) : existingPhotoUrl}
            height={32}
            width={32}
            alt="profile"
            className="rounded-full w-full h-full object-cover"
          />

          <div className="absolute bottom-2 right-1 bg-white p-2 rounded-full shadow-md">
            <FaPencil className="text-green text-sm" />
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-6">
        <TextInput
          label="Full name or Brand:" 
          icon={<FaUser />} 
          name='brand'
          id={'brand'}
          value={formData.brand || ""}  
          onChange={onChange} 
          placeholder='Enter your full name or brand' 
        />

        <SelectInput 
          label={"Register as:"}
          value={formData.user_type || UserTypeEnum.Individual}
          onChange={onChange}
          options={Object.values(UserTypeEnum).map((type) => ({ name: type.charAt(0).toUpperCase() + type.slice(1), value: type }))}
          name="user_type"
        />
        
        <ToggleCollapse header="Contact Details" open={true} >
          <div className='space-y-4'>
            <EmailInput
              label="Email (optional):" 
              icon={<FaEnvelope />} 
              name='email'
              id={'email'}
              value={formData.email || ""}  
              onChange={onChange} 
              placeholder='Enter your email'
            />

            <PhoneInput
              label="Phone number"
              value={phone}
              onChange={setPhone}
              onNormalize={setNormalizedPhone}
            />

            <PhoneInput
              label="Whatsapp number (optional):" 
              name='whatsapp'
              id={'whatsapp'}
              value={whatsapp}  
              onChange={setWhatsapp} 
              onNormalize={setNormalizedWhatsapp}
              placeholder='Enter your Whatsapp number (234 080-3288-9111)'
            />
          </div>
        </ToggleCollapse>        
      </div>

      {/* Submit Button */}
      <div className="mt-16 mb-7">
        {authUser? <button
            disabled={isLoading}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-md w-full text-white focus:border-secondary ${
              isLoading ? "bg-gray-400 text-primary" : "bg-primary text-white"
            }`}
          >
            {isLoading ? "Updating..." : "Update Profile"}
          </button> :
          <button
            disabled
            className="px-4 py-2 rounded-md w-full text-white bg-tertiary" 
          >
            Update (Login on Pi Browser)
          </button>
        }
      </div>
    </div>
  );
};

export default EditProfile;
