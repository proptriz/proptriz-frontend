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
import { IoChevronForward } from 'react-icons/io5';

const ConfirmCodePage: React.FC = () => {
    const [code, setCode] = useState('');
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { code });
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Log in with ${provider}`);
    };

    return (
        <div className="flex justify-center min-h-screen overflow-hidden relative">        
            <div className="w-full max-w-md rounded-lg p-8">
                <h1 className='text-3xl font-bold mt-10 mb-16'>
                  Enter Received 4-Digit Code
                </h1>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                        <label htmlFor="code" className="block text-green font-medium mb-1">Code</label>
                        <input
                            type="number"
                            id="code"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full px-4 py-2 border-b border-gray-700 focus:outline-none focus:border-gray-400 bg-transparent"
                        />
                    </div>
                    <div className='flex justify-items-between items-center w-full mt-3'>
                        <Link  href={'#'} className='text-green text-sm'>
                            Resend Code
                        </Link>
                        <button className="ml-auto p-5 text-xl bg-green rounded-full shadow-md text-white" onClick={()=>router.back()}>
                            <IoChevronForward className='text-3xl'/>
                        </button>
                    </div>
                    
                </form>
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 mx-auto z-10">
                        <Image src={'/icon/spiral.png'} alt={'spiral'} width={400} height={300} className="ml-7" />
                    </div>  
                                      
                </div>
                <div className="text-center mt-32">
                    <img src="/banner.png" alt="Logo" className="mx-auto h-16 mb-4" />
                </div>    
            </div>
        </div>
    );
};

export default ConfirmCodePage;
