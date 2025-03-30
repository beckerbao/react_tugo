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
    // Initialize auth state
    initializeAuth();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, currentSession) => {
      console.log('Auth state changed:', event, 'Session:', currentSession ? 'Exists' : 'Null');                                                                                               
      const previousUserId = session?.user?.id; // Capture previous user ID before state update
      
      setSession(currentSession);
      setIsGuest(false);
      
      // Update push token when auth state changes
      if (currentSession?.user && expoPushToken) {
        console.log(`Auth Listener: User ${currentSession.user.id} logged in with token ${expoPushToken}. Updating token.`);
        await updatePushToken(currentSession.user.id, expoPushToken);
      }else if (!currentSession && previousUserId && expoPushToken) {                                                                                                                         
        // User just logged out (currentSession is null, but we had a previous user)                                                                                                           
        // This is a fallback, signOut should ideally handle it first.                                                                                                                         
        console.log(`Auth Listener: User ${previousUserId} logged out. Attempting to clear token ${expoPushToken} as fallback.`);                                                              
        // We don't strictly need to await this here if signOut handles it                                                                                                                     
        updatePushToken(previousUserId, null);                                                                                                                                                 
      } 
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, [expoPushToken]);

  const initializeAuth = async () => {
    try {
      // Get initial session
      const { data: { session: initialSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error getting session:', error);
        // Clear any invalid session data
        await supabase.auth.signOut();
        setSession(null);
      } else {
        setSession(initialSession);
      }
    } catch (err) {
      console.error('Error initializing auth:', err);
    } finally {
      setLoading(false);
    }
  };

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
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Update session immediately after successful sign in
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
      // Clear push token before signing out
      if (session?.user) {
        await updatePushToken(session.user.id, null);
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
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

  const deleteAccount = async () => {
    try {
      if (!session?.user) {
        throw new Error('No authenticated user');
      }

      // Clear push token before deleting account
      await updatePushToken(session.user.id, null);

      // Call the RPC function to delete the user
      const { error: deleteError } = await supabase.rpc('delete_user');
      if (deleteError) throw deleteError;

      // Clear local state
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