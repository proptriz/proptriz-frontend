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

const SignupPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    const handleSignup = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Logging in with:', { email, password });
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Log in with ${provider}`);
    };

    return (
        <div className="flex justify-center min-h-screen overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 -ml-5">
              <Image src={'/icon/spiral.png'} alt={'spiral'} width={200} height={200} className="" />
          </div>          
            <div className="w-full max-w-md rounded-lg p-8">
                <h1 className='text-3xl font-bold mt-10 mb-16'>
                  Sign Up
                </h1>
                <form onSubmit={handleSignup}>
                    <div className="mb-4">
                       <TextInput value={email} setValue={setEmail} label={'Your Full Name'}/>
                    </div>
                    <div className="mb-4">
                       <EmailInput email={email} setEmail={setEmail} label={'Your Email'}/>
                    </div>
                    <div className="mb-8 relative">
                        <PasswordInput password={password} setPassword={setPassword} />
                    </div>
                    <p className="text-sm text-gray-500 mb-8">
                      By continuing you agree to our Terms of Service
                      and Privacy Policy.
                    </p>
                    <Link href={'/profile/signup/confirm/phone'}>
                    <button
                        type="submit"
                        className="w-full bg-green text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        Sign Up
                    </button>
                    </Link>
                </form>
                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-2 text-sm text-gray-500">OR</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 mx-auto z-0">
                        <Image src={'/icon/spiral.png'} alt={'spiral'} width={400} height={300} className="ml-7 z-0" />
                    </div>
                    <div className="flex justify-center gap-4 z-20 relative">
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Facebook')}
                            className="bg-blue-600 text-white p-4 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <FaFacebookF className='text-xl text-white' />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Google')}
                            className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            <FaGoogle className='text-xl' />
                        </button>
                        <button
                            type="button"
                            onClick={() => handleSocialLogin('Apple')}
                            className="bg-black text-white p-4 rounded-full hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600"
                        >
                            <FaApple className='text-xl'/>
                        </button>
                    </div>
                </div>
                <div className="text-center mt-8 relative z-10">
                    <p className="font-semibold mb-2">                        
                        Already have an account?{' '}
                    
                        <Link
                            href="/profile/login"
                            className="text-green"
                        >
                          Login                            
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignupPage;
