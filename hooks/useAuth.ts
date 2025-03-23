import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
import { usePushNotifications } from './usePushNotifications';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const { expoPushToken } = usePushNotifications();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsGuest(false);
      
      // Update push token when auth state changes
      if (session?.user && expoPushToken) {
        updatePushToken(session.user.id, expoPushToken);
      }
    });
  }, [expoPushToken]);

  const updatePushToken = async (userId: string, token: string | null) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ push_token: token })
        .eq('id', userId);

      if (error) {
        console.error('Error updating push token:', error);
      }
    } catch (err) {
      console.error('Failed to update push token:', err);
    }
  };

  const signUp = async (email: string, password: string) => {
    setIsGuest(false);
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setIsGuest(false);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signInWithApple = async () => {
    if (Platform.OS !== 'ios') {
      return { error: new Error('Apple Sign In is only available on iOS devices') };
    }

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });

      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: credential.identityToken!,
      });

      if (error) throw error;

      // Update user profile with Apple data if available
      if (credential.fullName && data.user) {
        const { givenName, familyName } = credential.fullName;
        if (givenName && familyName) {
          const fullName = `${givenName} ${familyName}`;
          await supabase
            .from('profiles')
            .update({ full_name: fullName })
            .eq('id', data.user.id);
        }
      }

      return { data, error: null };
    } catch (error) {
      console.error('Apple sign in error:', error);
      return { data: null, error };
    }
  };

  const signOut = async () => {
    try {
      // Only attempt to clear push token if there's an active session
      if (session?.user) {
        await updatePushToken(session.user.id, null);
      }

      // Always attempt to sign out, regardless of session state
      await supabase.auth.signOut();
      
      // Clear local state
      setSession(null);
      setIsGuest(false);
      
      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      // Still clear local state even if the API call fails
      setSession(null);
      setIsGuest(false);
      return { error };
    }
  };

  const continueAsGuest = () => {
    setIsGuest(true);
    setSession(null);
  };

  return {
    session,
    loading,
    isGuest,
    signUp,
    signIn,
    signInWithApple,
    signOut,
    continueAsGuest,
  };
}