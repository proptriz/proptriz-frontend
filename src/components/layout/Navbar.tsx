'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Menu, 
  X, 
  User,
  LogOut
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const { user, signOut } = useAuth();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };
  
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-2xl font-bold text-estate-primary">E-Landlord</span>
          <span className="text-estate-secondary">Nigeria</span>
        </Link>

        {/* Auth Buttons - Desktop */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              {user.email && (
                <Link href="/profile" className="flex items-center space-x-2">
                  <User size={18} className="text-estate-secondary" />
                  <span className="text-gray-700">{user.email.split('@')[0]}</span>
                </Link>
              )}
              
              {user.email?.toLowerCase().includes('agent') && (
                <Link href="/agent/dashboard">
                  <Button variant="outline" className="border-estate-primary text-estate-primary">Dashboard</Button>
                </Link>
              )}
              
              <Button 
                variant="ghost" 
                onClick={() => signOut()}
                className="text-gray-700 flex items-center"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          ) : (
            <>
              <Link href="/login">
                <Button variant="outline" className="border-estate-primary text-estate-primary">Log in</Button>
              </Link>
              <div className="relative group">
                <Button className="bg-estate-primary text-white hover:bg-estate-primary/90">Sign up</Button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-20 invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100">
                  <Link href="/register" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">As User</Link>
                  <Link href="/agent/register" className="block py-2 px-4 text-sm text-gray-700 hover:bg-gray-100">As Agent</Link>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-gray-700" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white px-4 py-2 shadow-md animate-fade-in">
          <div className="flex flex-col space-y-4 py-2">
            <Link href="/" className="text-gray-700 hover:text-estate-primary py-2 border-b">Home</Link>
            <Link href="/properties" className="text-gray-700 hover:text-estate-primary py-2 border-b">Properties</Link>
            <Link href="/agents" className="text-gray-700 hover:text-estate-primary py-2 border-b">Agents</Link>
            
            {user ? (
              <div className="flex flex-col space-y-2 py-2">
                <Link href="/profile" className="flex items-center space-x-2 text-gray-700 hover:text-estate-primary py-2 border-b">
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                
                {user.email?.toLowerCase().includes('agent') && (
                  <Link href="/agent/dashboard" className="w-full">
                    <Button variant="outline" className="w-full border-estate-primary text-estate-primary">Dashboard</Button>
                  </Link>
                )}
                
                <Button 
                  variant="ghost" 
                  onClick={() => signOut()}
                  className="w-full text-gray-700 flex items-center justify-center"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-2 py-2">
                <Link href="/login" className="w-full">
                  <Button variant="outline" className="w-full border-estate-primary text-estate-primary">Log in</Button>
                </Link>
                <Link href="/register" className="w-full">
                  <Button className="w-full bg-estate-primary text-white hover:bg-estate-primary/90">Sign up as User</Button>
                </Link>
                <Link href="/agent/register" className="w-full">
                  <Button variant="secondary" className="w-full">Sign up as Agent</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
