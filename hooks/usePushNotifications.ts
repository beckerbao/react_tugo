import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/services/supabase';

// Configure notification handler with platform-specific settings
if (Platform.OS !== 'web') {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      priority: Platform.OS === 'android' ? Notifications.AndroidImportance.HIGH : undefined,
    }),
  });
}

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    checkPermissionAndToken();

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      const data = response.notification.request.content.data;
      handleNotificationResponse(data);
    });

    return () => {
      if (Platform.OS !== 'web') {
        if (notificationListener.current) {
          Notifications.removeNotificationSubscription(notificationListener.current);
        }
        if (responseListener.current) {
          Notifications.removeNotificationSubscription(responseListener.current);
        }
      }
    };
  }, []);

  const checkPermissionAndToken = async () => {
    if (!Device.isDevice) {
      console.log('Must use physical device for Push Notifications');
      return;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      // Permission already granted, get token
      const tokenData = await getToken();
      setExpoPushToken(tokenData);
    } else if (existingStatus === 'undetermined') {
      // Show custom permission modal
      setShowPermissionModal(true);
    }
  };

  const handleAllowPermission = async () => {
    setShowPermissionModal(false);
    const { status } = await Notifications.requestPermissionsAsync({
      ios: {
        allowAlert: true,
        allowBadge: true,
        allowSound: true,
        allowAnnouncements: true,
      },
    });

    if (status === 'granted') {
      const tokenData = await getToken();
      setExpoPushToken(tokenData);
    }
  };

  const handleDenyPermission = () => {
    setShowPermissionModal(false);
  };

  const getToken = async () => {
    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: '30a29066-52b8-4976-80bc-eb7ca759038f',
      });
      
      console.log('\n=== Expo Push Token ===');
      console.log(tokenData.data);
      console.log('=====================\n');
      
      return tokenData.data;
    } catch (err) {
      console.error('Failed to get push token:', err);
      return undefined;
    }
  };

  const handleNotificationResponse = (data: any) => {
    if (data.type === 'offer') {
      // Navigate to offer details
    } else if (data.type === 'booking') {
      // Navigate to booking details
    }
  };

  const sendPushNotification = async (expoPushToken: string, title: string, body: string, data = {}) => {
    if (Platform.OS === 'web') {
      console.log('Push notifications are not supported on web');
      return;
    }

    const message = {
      to: expoPushToken,
      sound: 'default',
      title,
      body,
      data,
      priority: 'high',
      ...(Platform.OS === 'android' ? {
        channelId: 'default',
        androidMode: 'default',
        vibrate: true,
        color: '#8B5CF6',
        icon: 'ic_notification',
        importance: 'high',
        priority: 'high',
      } : {
        _displayInForeground: true,
      }),
    };

    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });
  };

  return {
    expoPushToken,
    notification,
    showPermissionModal,
    handleAllowPermission,
    handleDenyPermission,
    sendPushNotification,
  };
}