'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Profile } from '@/types/property';
import { AlertCircle, Home, MessageSquare, Settings } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { mockProfile } from '@/data/mockData';

const UserProfile = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const [profile, setProfile] = useState<Profile>(mockProfile[0]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     if (status === 'unauthenticated') {
  //       router.push('/login');
  //       return;
  //     }

  //     if (status === 'authenticated' && session?.user) {
  //       try {
  //         const res = await fetch('/api/profile');
  //         if (!res.ok) {
  //           throw new Error('Failed to fetch profile');
  //         }
  //         const data = await res.json();
  //         setProfile(data);
  //       } catch (error: any) {
  //         console.error(error);
  //         setFetchError(error.message || 'An error occurred while loading profile');
  //         toast({
  //           title: 'Profile Load Error',
  //           description: error.message,
  //           variant: 'destructive',
  //         });
  //       } finally {
  //         setIsLoading(false);
  //       }
  //     }
  //   };

  //   fetchProfile();
  // }, [session, status, router, toast]);

  const ProfileSkeleton = () => (
    <div className="col-span-1">
      <Card className="overflow-hidden">
        <div className="bg-estate-primary h-24"></div>
        <div className="p-6 -mt-12 text-center">
          <Skeleton className="h-24 w-24 rounded-full mx-auto border-4 border-white" />
          <Skeleton className="h-6 w-32 mx-auto mt-4" />
          <Skeleton className="h-4 w-48 mx-auto mt-2" />
          <Skeleton className="h-4 w-36 mx-auto mt-1" />
          <Skeleton className="h-10 w-full mt-4" />
        </div>
      </Card>
      <Card className="mt-4 p-4">
        <Skeleton className="h-5 w-40 mb-3" />
        <div className="space-y-2">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
          <div className="flex justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </Card>
    </div>
  );

  const ContentSkeleton = () => (
    <div className="col-span-1 lg:col-span-3">
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Card className="p-6">
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      </Card>
    </div>
  );

  // if (isLoading) {
  //   return (
  //     <div className="container mx-auto py-8">
  //       <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
  //         <ProfileSkeleton />
  //         <ContentSkeleton />
  //       </div>
  //     </div>
  //   );
  // }

  // if (fetchError) {
  //   return (
  //     <div className="container mx-auto py-16">
  //       <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
  //         <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-2" />
  //         <h2 className="text-2xl font-bold mb-2">Profile Error</h2>
  //         <p className="mb-4 text-gray-700">{fetchError}</p>
  //         <div className="flex justify-center gap-4">
  //           <Button onClick={() => router.push('/')}>Go Home</Button>
  //           <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!profile) {
  //   return (
  //     <div className="container mx-auto py-16 text-center">
  //       <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
  //       <p className="mb-6">We couldn't find your profile information.</p>
  //       <Button onClick={() => router.push('/')}>Go Home</Button>
  //     </div>
  //   );
  // }

  return (
    <div className="container mx-auto py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="col-span-1">
          <Card className="overflow-hidden">
            <div className="bg-estate-primary h-24"></div>
            <div className="p-6 -mt-12 text-center">
              <Avatar className="h-24 w-24 mx-auto border-4 border-white">
                <AvatarImage src={profile.avatar_url || undefined} alt={profile.full_name || 'User'} />
                <AvatarFallback className="bg-estate-secondary text-white text-2xl">
                  {profile.full_name?.substring(0, 2).toUpperCase() || profile.username?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-bold mt-2">{profile.full_name || 'User'}</h2>
              <p className="text-gray-500 text-sm">{profile.email || session?.user?.email || 'No email'}</p>
              <p className="text-gray-500 text-sm">{profile.phone || 'No phone number'}</p>
              <Button variant="outline" className="mt-4 w-full" onClick={() => router.push('/edit-profile')}>
                <Settings className="mr-2 h-4 w-4" /> Edit Profile
              </Button>
            </div>
          </Card>
          <Card className="mt-4 p-4">
            <h3 className="font-medium mb-3">Account Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Member since</span>
                <span>{profile.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'Unknown'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Account type</span>
                <span>{profile.is_agent ? 'Agent' : 'User'}</span>
              </div>
            </div>
          </Card>
        </div>

        <div className="col-span-1 lg:col-span-3">
          <Tabs defaultValue="reviews">
            <TabsList className="mb-4">
              <TabsTrigger value="reviews">
                <MessageSquare className="mr-2 h-4 w-4" /> My Reviews
              </TabsTrigger>
              <TabsTrigger value="favorites">
                <Home className="mr-2 h-4 w-4" /> Saved Properties
              </TabsTrigger>
            </TabsList>
            <TabsContent value="reviews">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">My Reviews</h3>
                <div className="divide-y">
                  <div className="py-8 text-center">
                    <MessageSquare className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="font-medium">No reviews yet</h3>
                    <p className="text-sm text-gray-500">You haven't written any reviews for properties or agents.</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
            <TabsContent value="favorites">
              <Card className="p-6">
                <h3 className="font-semibold mb-4 text-lg">Saved Properties</h3>
                <div className="divide-y">
                  <div className="py-8 text-center">
                    <Home className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                    <h3 className="font-medium">No saved properties</h3>
                    <p className="text-sm text-gray-500">You haven't saved any properties yet.</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
