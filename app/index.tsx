import React, { useEffect } from 'react';                                                                                                                                                   
import { Redirect, SplashScreen } from 'expo-router';                                                                                                                                       
import { ActivityIndicator, View } from 'react-native';                                                                                                                                     
import { useAuth } from '@/hooks/useAuth'; // Assuming useAuth provides loading and session state                                                                                           
                                                                                                                                                                                            
export default function AppIndex() {                                                                                                                                                        
  const { session, loading, isGuest } = useAuth();                                                                                                                                          
                                                                                                                                                                                            
  // Optional: Keep splash screen visible while auth is loading                                                                                                                             
  // You might already handle this in _layout.tsx, adjust as needed                                                                                                                         
  useEffect(() => {                                                                                                                                                                         
    if (!loading) {                                                                                                                                                                         
      SplashScreen.hideAsync();                                                                                                                                                             
    }                                                                                                                                                                                       
  }, [loading]);                                                                                                                                                                            
                                                                                                                                                                                            
  if (loading) {                                                                                                                                                                            
    // Optional: Show a loading indicator while checking auth state                                                                                                                         
    // Or return null if _layout handles splash screen/loading state                                                                                                                        
    return (                                                                                                                                                                                
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>                                                                                                            
        <ActivityIndicator size="large" />                                                                                                                                                  
      </View>                                                                                                                                                                               
    );                                                                                                                                                                                      
    // return null; // If splash screen is handled elsewhere                                                                                                                                
  }                                                                                                                                                                                         
                                                                                                                                                                                            
  // If logged in (has session) or is continuing as guest, go to tabs/home                                                                                                                  
  if (session || isGuest) {                                                                                                                                                                 
    return <Redirect href="/(tabs)/home" />;                                                                                                                                                
  }                                                                                                                                                                                         
                                                                                                                                                                                            
  // If not loading and no session/guest, go to login                                                                                                                                       
  return <Redirect href="/login" />;                                                                                                                                                        
} 