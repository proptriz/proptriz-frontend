'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { BackButton } from '@/components/shared/buttons';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signOut, user, isLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
  if (user) {
    router.replace('/home/agent-dashboard');
  }
}, [user]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.info('Login form submitted');
    
    if (!username || !password) {
      toast({
        title: "Missing information",
        description: "Please provide both email and password",
        variant: "destructive",
      });
      return;
    }
    
    setLoading(true);
    
    try {
      const formData = new FormData()
      formData.append('username', username)
      formData.append('password', password)
      await signIn(formData);

      toast({
        title: "Login successful",
        description: "Welcome back!",
      });
      
      // Navigate to home page after successful login
      router.push('/');
      
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error.message || "Check your email and password and try again",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div>
      <div className="container mx-auto px-4 py-12">
        <BackButton />
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h1 className="text-2xl font-bold text-center mb-6">Welcome Back</h1>
            
            <form 
            onSubmit={handleSubmit}
            >
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                <input 
                  type="text" 
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  placeholder="Your Username"
                />
              </div>
              
              <div className="mb-6">
                <div className="flex justify-between mb-1">
                  <label className="block text-sm font-medium text-gray-700">Password</label>
                  <Link href="/forgot-password" className="text-sm text-estate-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-estate-primary focus:border-estate-primary"
                  placeholder="Your password"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-estate-primary text-white hover:bg-estate-primary/90 mb-4"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
              
              <p className="text-center text-gray-600">
                Don't have an account? {' '}
                <Link href="/register" className="text-estate-primary hover:underline">
                  Sign up
                </Link>
              </p>
            </form>
            
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
                type="button"
              >
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-gray-300 hover:bg-gray-50"
                type="button"
              >
                Facebook
              </Button>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Agent Login</h3>
            <p className="text-gray-600 mb-4">
              If you're a registered property agent, login to access your dashboard and manage your listings.
            </p>
            <div className="flex space-x-2 mb-4">
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-estate-success mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">Access your property listings</span>
              </div>
              <div className="flex items-start">
                <CheckCircle className="h-5 w-5 text-estate-success mr-2 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600">View client inquiries</span>
              </div>
            </div>
            <Link href="/agents/login">
              <Button className="w-full bg-estate-secondary text-white hover:bg-estate-secondary/90">
                Agent Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
