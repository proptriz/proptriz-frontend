'use client';

import React, { useState, useContext, Suspense, useActionState } from 'react';
import { AppContext } from '../../../../context/AppContextProvider';
import { useRouter, useSearchParams } from 'next/navigation';
import { ImSpinner2 } from 'react-icons/im';
import Link from 'next/link';
import Image from 'next/image';
import { FaApple, FaFacebookF } from 'react-icons/fa6';
import { FaGoogle } from 'react-icons/fa';
import { EmailInput, PasswordInput, TextInput } from '@/components/shared/Input';
import userAPI from '@/services/userApi';
import { toast } from 'react-toastify';
import { appleSignin, login, facebookSignin, googleSignin, githubSignin } from '@/utils/actions';
import { BsExclamation } from 'react-icons/bs';
import { SubmitButton } from '@/components/shared/buttons';

const LoginForm = () => {
  const { setAuthUser } = useContext(AppContext);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/profile/transaction';
  const [errorMessage, formAction, isLoading] = useActionState(
    login,
    undefined,
  );

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   try {
  //     const userData = { username, password };
  //     const user = await userAPI.login(userData);
  //     if (user) {
  //       toast.success('Login successful! Redirecting...');
  //       setAuthUser(user);
  //       router.push(`/profile/transaction/${user._id}`);
  //     }
  //   } catch (error: any) {
  //     toast.error(error.response?.data?.message || 'Login failed. Try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <form action={formAction}>
      <div className="mb-4">
        <TextInput name="username" setValue={setUsername} label="Username or Email" />
      </div>
      <div className="mb-10 relative">
        <PasswordInput password={password} setPassword={setPassword} name="password" />
      </div>
      <input type="hidden" name="redirectTo" value={callbackUrl} />
      <SubmitButton isLoading={isLoading} status='Login...' title='Login' />
    </form>
  );
};

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen overflow-hidden">
      <div className="w-full max-w-md rounded-lg p-8">
        <div className="text-center mb-16">
          <Link href="/">
            <img src="/banner.png" alt="Logo" className="mx-auto h-16 mb-4" />
          </Link>
          <p className="text-sm text-gray-500">
            Welcome back! Sign in using your social account or email to continue.
          </p>
        </div>

        <Suspense fallback={<p>Loading...</p>}>
          <LoginForm />
        </Suspense>

        <div className="text-center mt-4">
          <a href="#" className="text-sm text-gray-500 hover:underline">
            Forgot password?
          </a>
        </div>
        <div className="flex items-center my-4">
          <div className="flex-grow h-px bg-gray-300"></div>
          <span className="px-2 text-sm text-gray-500">OR</span>
          <div className="flex-grow h-px bg-gray-300"></div>
        </div>

        <div className="flex justify-center gap-4">
          <form action={facebookSignin}>
            <button
              type="submit"
              className="bg-blue-600 text-white p-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FaFacebookF className="text-xl text-white" />
            </button>
          </form>
          <form action={googleSignin}>
            <button
              type="submit"
              className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FaGoogle className="text-xl" />
            </button>
          </form>
          <form action={appleSignin}>
            <button
              type="submit"
              className="bg-black text-white p-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <FaApple className="text-xl" />
            </button>
          </form>
          <form action={githubSignin}>
            <button
              type="submit"
              className="bg-black text-white p-4 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              github
            </button>
          </form>
        </div>

        <div className="text-center mt-6">
          <p className="text-gray-500 mb-2">Don&apos;t have an account?</p>
          <Link href="/profile/signup">
            <button className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
              Sign Up
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
