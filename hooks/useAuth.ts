import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Session } from '@supabase/supabase-js';
// import { usePushNotifications } from './usePushNotifications';
import * as AppleAuthentication from 'expo-apple-authentication';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { usePushNotificationContext } from '@/contexts/PushNotificationContext';

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  // const { expoPushToken } = usePushNotifications();
  const { expoPushToken } = usePushNotificationContext();

  useEffect(() => {
    console.log('[useAuth] useEffect mounted');
    
    if (typeof window !== 'undefined') {
      AsyncStorage.getItem('@supabase.auth.token').then(val => {
        console.log('📦 Saved Supabase token:', val);
      });
    }

    console.log('[Auth] Initializing...');
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        console.log('[Auth] onAuthStateChange:', event);
        console.log('[Auth] Session:', currentSession);
        setSession(currentSession);
        setIsGuest(false);
        setLoading(false);

        const previousUserId = session?.user?.id;

        if (currentSession?.user && expoPushToken) {
          await updatePushToken(currentSession.user.id, expoPushToken);
        } else if (!currentSession && previousUserId && expoPushToken) {
          updatePushToken(previousUserId, null);
        }
      }
    );

    return () => subscription.unsubscribe();
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
    const { error } = await supabase.auth.signUp({ email, password });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    setIsGuest(false);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      setSession(data.session);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error };
    }
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
      if (session?.user) {
        await updatePushToken(session.user.id, null);
      }

      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setSession(null);
      setIsGuest(false);
      return { error: null };
    } catch (error) {
      console.error('Error during sign out:', error);
      setSession(null);
      setIsGuest(false);
      return { error };
    }
  };

  const deleteAccount = async () => {
    try {
      if (!session?.user) throw new Error('No authenticated user');
      await updatePushToken(session.user.id, null);

      const { error: deleteError } = await supabase.rpc('delete_user');
      if (deleteError) throw deleteError;

      setSession(null);
      setIsGuest(false);
      return { error: null };
    } catch (error) {
      console.error('Error deleting account:', error);
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
    deleteAccount,
    continueAsGuest,
  };
}
