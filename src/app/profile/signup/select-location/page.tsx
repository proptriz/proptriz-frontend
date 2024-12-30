'use client';

// components/LoginPage.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ImEye, ImEyeBlocked } from 'react-icons/im';
import Link from 'next/link';
import Image from 'next/image';
import { FaApple, FaFacebookF } from 'react-icons/fa6';
import { FaGoogle } from 'react-icons/fa';
import { EmailInput, PasswordInput, TextInput } from '@/components/shared/Input';

const SelectLocationPage: React.FC = () => {
    const [area, setArea] = useState('');
    const [zone, setZone] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSelectLocation = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { area, zone });
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Log in with ${provider}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 -ml-5">
              <Image src={'/icon/spiral.png'} alt={'spiral'} width={200} height={200} className="" />
          </div>          
            <div className="w-full max-w-md rounded-lg p-8">
                <div className='w-full text-center mb-10'>
                    <Image src={'/location/location-banner.png'} alt='loc banner' width={300} height={300} className='mx-auto mb-3'/>
                    <h1 className='text-center mb-2'>Select your location</h1>
                    <h4 >Swithch on your location to stay in tune with what’s happening in your area</h4>
                </div>
                <form onSubmit={handleSelectLocation}>
                    <div className="mb-4">
                        <label htmlFor="zone" className="block text-gray-500 font-medium mb-1">Your Zone</label>
                        <div className="flex items-center">
                            <select
                                id="zone"
                                value={zone}
                                onChange={(e) => setZone(e.target.value)}
                                required
                                className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-green-600 bg-transparent"
                            >
                                <option value="loc 1">Zone A</option>
                            </select>
                        </div>
                    </div>
                    <div className="mb-7">
                        <label htmlFor="area" className="block text-gray-500 font-medium mb-1">Your Area</label>
                        <div className="flex items-center">
                            <select
                                id="area"
                                value={area}
                                onChange={(e) => setArea(e.target.value)}
                                required
                                className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-green-600 bg-transparent"
                            >
                                <option value="loc 1">Area 1</option>
                            </select>
                        </div>
                    </div>
                    <div className="relative">
                        <div className="absolute top-0 left-0 right-0 mx-auto z-0">
                            <Image src={'/icon/spiral.png'} alt={'spiral'} width={400} height={300} className="ml-7 z-0" />
                        </div>                    
                    </div>
                    <Link href={'/profile/signup/confirm/phone'} className='z-10 relative '>
                    <button
                        type="submit"
                        className="w-full bg-gray-800 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 mt-7"
                    >
                        Submit
                    </button>
                    </Link>
                </form>
                
                
            </div>
        </div>
    );
};

export default SelectLocationPage;
