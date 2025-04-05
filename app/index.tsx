import { Redirect } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function AppIndex() {
  const { session, loading, isGuest, continueAsGuest } = useAuth();

  useEffect(() => {
    if (!loading && !session && !isGuest) {
      console.log('[Index] Auto continuing as guest...');
      continueAsGuest();
    }
  }, [loading, session, isGuest]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // ✅ Nếu là khách hoặc đã login, vào home
  if (session || isGuest) {
    return <Redirect href="/(tabs)/home" />;
  }

  // (Không bao giờ tới đây nếu auto guest hoạt động đúng)
  return <Redirect href="/login" />;
}
