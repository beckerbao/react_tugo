import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { useAuth } from './useAuth';
import { usePushNotifications } from './usePushNotifications';

export interface Profile {
  id: string;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  updated_at: string;
  phone_number: string | null;
  push_token: string | null;
}

export function useProfile() {
  const { session } = useAuth();
  const { expoPushToken } = usePushNotifications();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    } else {
      setProfile(null);
      setLoading(false);
    }
  }, [session]);

  // Separate effect for push token updates to avoid unnecessary profile fetches
  useEffect(() => {
    const updateToken = async () => {
      if (session?.user && expoPushToken && profile?.push_token !== expoPushToken) {
        try {
          const { error } = await supabase
            .from('profiles')
            .update({ push_token: expoPushToken })
            .eq('id', session.user.id);

          if (error) throw error;
          
          // Update local profile state
          setProfile(prev => prev ? { ...prev, push_token: expoPushToken } : null);
        } catch (err) {
          console.error('Failed to update push token:', err);
        }
      }
    };

    updateToken();
  }, [session, expoPushToken, profile?.push_token]);

  const fetchProfile = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      setError(null);

      let { data, error } = await supabase
        .from('profiles')
        .select()
        .eq('id', session.user.id)
        .maybeSingle();

      if (!data && !error) {
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({ 
            id: session.user.id,
            push_token: expoPushToken 
          })
          .select()
          .single();

        if (insertError) throw insertError;
        data = newProfile;
      } else if (error) {
        throw error;
      }

      setProfile(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!session?.user) return { data: null, error: 'No authenticated user' };

    try {
      setLoading(true);
      setError(null);

      // Ensure push_token is included in updates if available
      const updatesWithToken = expoPushToken 
        ? { ...updates, push_token: expoPushToken }
        : updates;

      const { data, error } = await supabase
        .from('profiles')
        .update(updatesWithToken)
        .eq('id', session.user.id)
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return { data, error: null };
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update profile';
      setError(message);
      return { data: null, error: message };
    } finally {
      setLoading(false);
    }
  };

  return {
    profile,
    loading,
    error,
    updateProfile,
    refresh: fetchProfile,
  };
}