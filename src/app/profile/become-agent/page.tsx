'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PasswordInput, TextInput } from '@/components/shared/Input';
import { toast } from 'react-toastify';
import { ImSpinner2 } from 'react-icons/im';

const SignupPage: React.FC = () => {
  const router = useRouter();

  const [username, setUsername] = useState<string>('');
  const [fullname, setFullname] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);  
    try {
        const userData = { username, fullname, password };
        // const user = await userAPI.signup(userData);
        toast.success("Signup successful! Redirecting...");
        // setAuthUser(user)
        // console.log("authenticated user: ", user)
        router.push('/profile/login');
    } catch (error: any) {
        toast.error(error.response?.data?.message || "Signup failed. Try again.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="w-full h-full mx-auto relative">
      {/* Background Image */}
      <div className="absolute top-0 left-0 right-0 -ml-5">
          <Image src={'/icon/spiral.png'} alt={'spiral'} width={200} height={200} />
      </div> 
      {/* Signup Card */}
      <div className="w-full max-w-md rounded-lg p-8">
        <h1 className="text-3xl font-bold mt-10 mb-16">Be Agent</h1> 
        {/* Signup Form */}
        <form onSubmit={handleSignup}>
          <div className="mb-4">
            <TextInput username={username} setValue={setUsername} name="username" label="Username or Email" />
          </div>
          <div className="mb-4">
            <TextInput value={fullname} setValue={setFullname} name="fullname" label="Your Full Name (optional)" />
          </div>
          <div className="mb-8 relative">
            <PasswordInput password={password} setPassword={setPassword} name='password' />
          </div>

          <p className="text-sm text-gray-500 mb-8">
              By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>

          <button
            type="submit"
            className="w-full bg-green text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={loading}
          >
            {loading ? 
              <span className='flex items-center justify-center'><ImSpinner2 className="animate-spin mr-2 ml-1" /> {/* Spinner Icon */}
                Signing Up..
              </span> : "Register"
            }
          </button>
        </form>

          {/* Divider */}
          <div className="flex items-center my-4">
              <div className="flex-grow h-px bg-gray-300"></div>
              <span className="px-2 text-sm text-gray-500">AND</span>
              <div className="flex-grow h-px bg-gray-300"></div>
          </div>
        </div>
      </div>
    );
};

export default SignupPage;
