import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { PushNotificationProvider } from '@/contexts/PushNotificationContext';
import { useAuth } from '@/hooks/useAuth';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // ✅ Bọc toàn bộ nội dung trong Provider trước
  return (
    <PushNotificationProvider>
      <RootLayoutInner />
    </PushNotificationProvider>
  );
}

// ✅ Hook và logic liên quan context chỉ chạy bên trong Provider
// export default function RootLayout() {
function RootLayoutInner() {
  useFrameworkReady();

  // const { 
  //   showPermissionModal, 
  //   handleAllowPermission, 
  //   handleDenyPermission,
  //   getAndRegisterDeviceToken, 
  //   permissionWasDenied,  } = usePushNotificationContext();

  // const { loading: authLoading, user } = useAuth();
  const { loading: authLoading } = useAuth();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if ((fontsLoaded || fontError) && !authLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError, authLoading]);

  // useEffect(() => {
  //   getAndRegisterDeviceToken(); // luôn gọi 1 lần khi app mở
  // }, []);
  
  // useEffect(() => {
  //   if (user) {
  //     getAndRegisterDeviceToken(); // đảm bảo token gắn user sau khi login
  //   }
  // }, [user]);

  if ((!fontsLoaded && !fontError) || authLoading) {
    return null;
  }

  return (
    <PushNotificationProvider>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="signup" options={{ headerShown: false }} />
        <Stack.Screen name="notifications" options={{ headerShown: false }} />
        <Stack.Screen name="test-notifications" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
      </Stack>

      <StatusBar style="auto" />

      {/* <PermissionModal
        visible={showPermissionModal}
        isDenied={permissionWasDenied}
        onAllow={handleAllowPermission}
        onDeny={handleDenyPermission}
      /> */}
    </PushNotificationProvider>
  );
}
