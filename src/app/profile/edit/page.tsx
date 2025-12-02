'use client';

import { ScreenName } from '@/components/shared/LabelCards';
import { AppContext } from '@/context/AppContextProvider';
import Image from 'next/image';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FaUser, FaPhone, FaEnvelope } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import logger from '../../../../logger.config.mjs';
import { styles } from '@/constant';
import { BsWhatsapp } from 'react-icons/bs';
import { UserSettingsType } from '@/types';
import ToggleCollapse from '@/components/shared/ToggleCollapse';
import { addOrUpdateUserSettings } from '@/services/settingsApi';

const EditProfile = () => {
  const { authUser } = useContext(AppContext);
  const [photo, setPhoto] = useState<File>();
  const [submitLoading, setSubmitLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Partial<UserSettingsType>>({});

  useEffect(() => {
    // Fetch existing user settings if needed
    const fetchUserSettings = async () => {
      try {
        // Placeholder for fetching user settings logic
        // const settings = await getUserSettings(authUser.id);
        // setFormData(settings);
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
  
  // Submit handler
  // const handleSubmit = useCallback(async () => {
  
  //   if (!formData.title || !formData.listed_for || !formData.category || !formData.price) {
  //     toast.error("Please fill required fields.");
  //     return;
  //   }

  //   setSubmitLoading(true);
  
  //   try {
  //     const updateData: Partial<UserType> = {
  //       ...formData,
  //       currency,
  //       negotiable: negotiable === NegotiableEnum.Negotiable,
  //       latitude: propCoordinates?.[0],
  //       longitude: propCoordinates?.[1],
  //       features,
  //       env_facilities: facilities,
  //       period: formData.listed_for === ListForEnum.rent ? formData.period : undefined
  //     };

  //     const res = await updateProperty(propertyId, updateData);

  //     if (res?.success) {
  //       toast.success("Property updated successfully");
  //       setSubmitSuccess(true);
  //       setShowStatusPopup(true);
  //     } else {
  //       toast.error(res?.message ?? "Failed to update property");
  //     }

  //   } catch (err: any) {
  //     logger.error("Update failed:", err?.message ?? err);
  //     toast.error("Unexpected error occurred");
  //   } finally {
  //     setSubmitLoading(false);
  //   }

  // }, [
  //   formData,
  //   negotiable,
  //   propCoordinates,
  //   features,
  //   facilities,
  //   propertyId
  // ]);

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

  const handleSubmit = async () => {
    try {
      setSubmitLoading(true);
      const updatedSettings = addOrUpdateUserSettings(formData, photo);
      toast.success('Profile updated successfully');
      logger.info('User profile updated', updatedSettings);
    } catch (err) {
      logger.error('Error updating profile', err);
      toast.error('Failed to update profile.');
    } finally {
      setSubmitLoading(false);
    }
  }

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
      <div className="space-y-6">
        <div> 
          <h3 className={styles.H2}>Full name or Brand:</h3>
          <div className="flex items-center card-bg rounded-xl p-3">                
            <input
              name='brand'
              type="text"
              value={formData.brand || ""}
              onChange={onChange}
              placeholder='Enter your full name or brand'
              className="w-full bg-transparent outline-none"
            />
              <FaUser className="text-gray-500 ms-auto" />
          </div>
        </div>
        
        <ToggleCollapse header="Contact Details" open={true} >
          <div> 
            <h3 className={styles.H2}>Email (optional):</h3> 
            <div className="flex items-center card-bg rounded-xl p-3">           
              <input
                name='email'
                type="email"
                value={formData.email || ""}
                onChange={onChange}
                placeholder='Enter your email'
                className="w-full bg-transparent outline-none"
              />
                <FaEnvelope className="text-gray-500 ms-auto" />
            </div>
          </div>
          <div>
            <h3 className={styles.H2}>Phone number (optional):</h3> 
            <div className="flex items-center card-bg rounded-xl p-3">             
              <input
                type="tel"
                name='phone'
                value={formData.phone || ""}
                onChange={onChange}
                placeholder='Enter your phone number (+234 080-3288-9111)'
                className="w-full bg-transparent outline-none"
              />
              <FaPhone className="text-gray-500 ms-auto" />
            </div>
          </div>
          <div>
            <h3 className={styles.H2}>Whatsapp number (optional):</h3>          
            <div className="flex items-center card-bg rounded-xl p-3">
              <input
                type="tel"
                name='whatsapp'
                value={formData.whatsapp || ""}
                onChange={onChange}
                placeholder='Enter your Whatsapp number (+234 080-3288-9111)'
                className="w-full bg-transparent outline-none"
              />
              <BsWhatsapp className="text-gray-500 ms-auto" />
            </div>
          </div>
        </ToggleCollapse>
        
      </div>

      {/* Submit Button */}
      <div className="mt-16 bottom-3">
        { <button
            disabled={submitLoading}
            onClick={handleSubmit}
            className={`px-4 py-2 rounded-md w-full text-white ${
              submitLoading ? "bg-gray-400" : "bg-green"
            }`}
          >
            {submitLoading ? "Updating..." : "Update Profile"}
          </button> }
      </div>
    </div>
  );
};

export default EditProfile;
