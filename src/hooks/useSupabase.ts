
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';

export const useSupabase = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  
  const getProfile = async () => {
    setIsLoading(true);
    try {
      if (!user) {
        console.error('Cannot fetch profile: User not authenticated');
        throw new Error('User not authenticated');
      }
      
      console.log('Fetching profile for user:', user.id);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();
        
      if (error) {
        console.error('Profile fetch error:', error);
        throw error;
      }
      
      // If no profile is found, create one
      if (!data) {
        console.log('No profile found, creating one for user:', user.id);
        
        const username = user.email ? user.email.split('@')[0] : 'user';
        
        const { data: newProfileData, error: insertError } = await supabase
          .from('profiles')
          .insert([{ 
            id: user.id,
            username: username,
            email: user.email,
            full_name: user.user_metadata?.full_name || '',
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
          
        if (insertError) {
          console.error('Failed to create profile:', insertError);
          throw insertError;
        }
        
        console.log('Created new profile:', newProfileData);
        return newProfileData;
      }
      
      console.log('Profile data fetched:', data);
      return data;
    } catch (error: any) {
      console.error('Error in getProfile:', error);
      toast({
        title: 'Error fetching profile',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };
  
  const updateProfile = async (updates: any) => {
    setIsLoading(true);
    try {
      if (!user) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('profiles')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
      
      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Error updating profile',
        description: error.message,
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };
  
  const getProperties = async (filters = {}) => {
    setIsLoading(true);
    try {
      // Check if the properties table exists 
      const { error: tableCheckError } = await supabase
        .from('properties')
        .select('id')
        .limit(1)
        .maybeSingle();
        
      if (tableCheckError && tableCheckError.message.includes('relation "public.properties" does not exist')) {
        // If table doesn't exist, return mock data
        console.log('Properties table does not exist yet, returning mock data');
        return [];
      }
      
      // If table exists, query it with filters
      let query = supabase.from('properties').select('*');
      
      // Apply filters
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          query = query.eq(key, value);
        }
      });
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching properties:', error);
      toast({
        title: 'Error fetching properties',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  const getAgents = async () => {
    setIsLoading(true);
    try {
      // Check if the agents table exists
      const { error: tableCheckError } = await supabase
        .from('agents')
        .select('id')
        .limit(1)
        .maybeSingle();
        
      if (tableCheckError && tableCheckError.message.includes('relation "public.agents" does not exist')) {
        // If table doesn't exist, return mock data
        console.log('Agents table does not exist yet, returning mock data');
        return [];
      }
      
      // If table exists, query it
      const { data, error } = await supabase
        .from('agents')
        .select(`
          *,
          profiles(*)
        `);
      
      if (error) throw error;
      
      return data || [];
    } catch (error: any) {
      console.error('Error fetching agents:', error);
      toast({
        title: 'Error fetching agents',
        description: error.message,
        variant: 'destructive',
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    getProfile,
    updateProfile,
    getProperties,
    getAgents,
    isLoading
  };
};
