'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';
import { BackButton } from '@/components/shared/buttons';

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { toast } = useToast();
  const navigate = useRouter();
  // const { signUp } = useAuth();
  
  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();
    
  //   if (password !== confirmPassword) {
  //     toast({
  //       title: "Passwords do not match",
  //       description: "Please ensure both passwords are identical",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   if (!termsAccepted) {
  //     toast({
  //       title: "Terms not accepted",
  //       description: "You must accept the terms and conditions to register",
  //       variant: "destructive",
  //     });
  //     return;
  //   }
    
  //   setIsLoading(true);
    
  //   try {
  //     // Prepare user metadata
  //     const metadata = {
  //       full_name: `${firstName} ${lastName}`.trim(),
  //       phone: phone
  //     };
      
  //     // Register using AuthContext's signUp method
  //     const { error, data } = await signUp(email, password, metadata);
      
  //     if (error) throw error;
      
  //     // Store additional user data in metadata
  //     if (data.user) {
  //       console.log("User created successfully:", data.user);
        
  //       toast({
  //         title: "Registration successful!",
  //         description: "Check your email to confirm your registration.",
  //       });
        
  //       // Navigate to login page
  //       navigate('/login');
  //     }
  //   } catch (error: any) {
  //     console.error("Registration error:", error);
  //     toast({
  //       title: "Registration failed",
  //       description: error.message || "An error occurred during registration",
  //       variant: "destructive",
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <BackButton />
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Create an Account</h1>
            
            <form 
            // onSubmit={handleSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="First name"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                    placeholder="Last name"
                    disabled={isLoading}
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  placeholder="Your email"
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  placeholder="Your phone number"
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  placeholder="Create a password"
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
              
              <div className="mb-6">
                <label className="flex items-center">
                  <input 
                    type="checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="h-4 w-4 text-estate-primary focus:ring-estate-primary border-gray-300 rounded" 
                    disabled={isLoading}
                  />
                  <span className="ml-2 text-gray-600 text-sm">
                    I agree to the <Link href="/terms" className="text-estate-primary hover:underline">Terms of Service</Link>{' '}
                    and <Link href="/privacy" className="text-estate-primary hover:underline">Privacy Policy</Link>
                  </span>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-estate-primary text-white hover:bg-estate-primary/90 mb-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : 'Create Account'}
              </Button>
              
              <p className="text-center text-gray-600">
                Already have an account? {' '}
                <Link href="/login" className="text-estate-primary hover:underline">
                  Sign in
                </Link>
              </p>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or sign up with</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
                disabled={isLoading}
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
                disabled={isLoading}
              >
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Register as an Agent</h3>
            <p className="text-gray-600 mb-4">
              If you're a property agent looking to list properties on our platform,
              click below to register as an agent.
            </p>
            <Link href="/agent/register">
              <Button className="w-full bg-estate-secondary text-white hover:bg-estate-secondary/90">
                Agent Registration
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
