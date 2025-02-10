'use client';

// components/LoginPage.tsx
import React, { useState, useContext, useActionState, Suspense, } from 'react';
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
import { authenticate } from '@/utils/actions';
import { BsExclamation } from 'react-icons/bs';

const LoginPage: React.FC = () => {

    const { setAuthUser } = useContext(AppContext);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState<string>('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/profile/transaction';
    const [errorMessage, formAction, isPending] = useActionState(
      authenticate,
      undefined,
    );

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const userData = { username, password };
            const user = await userAPI.login(userData);
            if (user) {
                toast.success("Signup successful! Redirecting...");
                setAuthUser(user)
                console.log("authenticated user: ", user)
                router.push(`/profile/transaction/${user._id}`);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        console.log(`Log in with ${provider}`);
    };

    return (
        <div className="flex items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full max-w-md rounded-lg p-8">
                <div className="text-center mb-16">
                    <img src="/banner.png" alt="Logo" className="mx-auto h-16 mb-4" />
                    <p className="text-sm text-gray-500">
                        Welcome back! Sign in using your social account or email to continue.
                    </p>
                </div>
                <Suspense>
                <form action={formAction}>
                    <div className="mb-4">
                       <TextInput name={'username'} setValue={setUsername} label={'Your Email'}/>
                    </div>
                    <div className="mb-10 relative">
                        <PasswordInput password={password} setPassword={setPassword} name={'password'} />
                    </div>
                    <input type="hidden" name="redirectTo" value={callbackUrl} />
                    <button
                        aria-disabled={isPending}
                        
                        className="w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        {isPending ? 
                            <span className='flex items-center justify-center'><ImSpinner2 className="animate-spin mr-2 ml-1" /> {/* Spinner Icon */}
                                Login...
                            </span> : "Login"
                        }
                    </button>
                </form>
                </Suspense>
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                    >
                    {errorMessage && (
                        <>
                        <BsExclamation className="h-5 w-5 text-red-500" />
                        <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
                </div>
                <div className="text-center mt-4">
                    <a href="#" className="text-sm text-gray-500 hover:underline">Forgot password?</a>
                </div>
                <div className="flex items-center my-4">
                    <div className="flex-grow h-px bg-gray-300"></div>
                    <span className="px-2 text-sm text-gray-500">OR</span>
                    <div className="flex-grow h-px bg-gray-300"></div>
                </div>
                <div className="relative">
                    <div className="absolute top-0 left-0 right-0 mx-auto z-0">
                        <Image src={'/icon/spiral.png'} alt={'spiral'} width={400} height={300} className="ml-7 " />
                    </div>
                    <div className="flex justify-center gap-4 relative z-20">
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
                <div className="text-center mt-6 relative z-20">
                    <p className="text-gray-500 z-20 mb-2">                        
                        Don&apos;t have an account?{' '}
                    </p>
                    <Link
                        href="/profile/signup"
                        className=""
                    >
                        <button
                            className="z-20 w-full bg-green-600 text-white py-2 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                            Sign Up
                        </button>
                    </Link>
                    
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
