import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { supabase } from '@/services/supabase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

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

const DEVICE_TOKEN_KEY = '@device_token';
const LAST_NOTIFICATION_ID = '@last_notification_id';

let notificationListenerInstance: Notifications.Subscription | null = null;
let responseListenerInstance: Notifications.Subscription | null = null;

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const isRegistering = useRef(false);
  const isMounted = useRef(true);
  const lastNotificationId = useRef<string | null>(null);
  const isInitialNotificationHandled = useRef(false);

  useEffect(() => {
    isMounted.current = true;
    
    if (Platform.OS === 'web') {
      return;
    }

    const initializeNotifications = async () => {
      try {
        // Load last notification ID
        lastNotificationId.current = await AsyncStorage.getItem(LAST_NOTIFICATION_ID);
        
        await checkPermissionAndToken();

        // Only set up listeners if they don't exist
        if (!notificationListenerInstance) {
          notificationListenerInstance = Notifications.addNotificationReceivedListener(
            notification => {
              const notificationId = notification.request.identifier;
              
              // Prevent duplicate notifications
              if (notificationId === lastNotificationId.current) {
                return;
              }

              if (isMounted.current) {
                setNotification(notification);
                lastNotificationId.current = notificationId;
                AsyncStorage.setItem(LAST_NOTIFICATION_ID, notificationId);
              }
            }
          );
        }

        if (!responseListenerInstance) {
          responseListenerInstance = Notifications.addNotificationResponseReceivedListener(
            response => {
              if (isMounted.current) {
                handleNotificationTap(response, false);
              }
            }
          );
        }

        // Check for initial notification only once
        if (!isInitialNotificationHandled.current) {
          isInitialNotificationHandled.current = true;
          const initialNotification = await Notifications.getLastNotificationResponseAsync();
          if (initialNotification && isMounted.current) {
            handleNotificationTap(initialNotification, true);
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();

    return () => {
      isMounted.current = false;
    };
  }, []);

  const checkPermissionAndToken = async () => {
    if (!Device.isDevice) {
      return;
    }

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      if (existingStatus === 'granted') {
        const tokenData = await getToken();
        if (tokenData && isMounted.current) {
          setExpoPushToken(tokenData);
          await registerDevice(tokenData);
        }
      } else if (existingStatus === 'undetermined') {
        setShowPermissionModal(true);
      }
    } catch (error) {
      console.error('Error checking permissions:', error);
    }
  };

  const handleAllowPermission = async () => {
    try {
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
        if (tokenData && isMounted.current) {
          setExpoPushToken(tokenData);
          await registerDevice(tokenData);
        }
      }
    } catch (error) {
      console.error('Error requesting permissions:', error);
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
      return tokenData.data;
    } catch (err) {
      console.error('Failed to get push token:', err);
      return undefined;
    }
  };

  const registerDevice = async (token: string) => {
    if (isRegistering.current || !isMounted.current) {
      return;
    }

    try {
      isRegistering.current = true;

      const storedToken = await AsyncStorage.getItem(DEVICE_TOKEN_KEY);
      if (storedToken === token) {
        return;
      }

      const { data: existingDevice, error: fetchError } = await supabase
        .from('anonymous_devices')
        .select('id')
        .eq('push_token', token)
        .maybeSingle();

      if (fetchError) throw fetchError;

      if (!existingDevice) {
        const { error: insertError } = await supabase
          .from('anonymous_devices')
          .insert({ push_token: token });

        if (insertError) throw insertError;

        await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error registering device:', error);
    } finally {
      isRegistering.current = false;
    }
  };

  const handleNotificationTap = async (response: Notifications.NotificationResponse, isInitial: boolean) => {
    try {
      const data = response.notification.request.content.data;

      if (!data || !data.type || !isMounted.current) {
        return;
      }

      // Add delay only for initial notification
      if (isInitial) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      switch (data.type) {
        case 'offer':
          if (data.offerId) {
            router.push(`/home/voucher?id=${data.offerId}`);
          }
          break;
        case 'booking':
          if (data.bookingId) {
            router.push(`/profile/history`);
          }
          break;
        case 'system':
          router.push('/notifications');
          break;
      }
    } catch (error) {
      console.error('Error handling notification tap:', error);
    }
  };

  const sendPushNotification = async (expoPushToken: string, title: string, body: string, data = {}) => {
    if (Platform.OS === 'web') {
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

    try {
      const response = await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error('Failed to send push notification');
      }
    } catch (error) {
      console.error('Error sending push notification:', error);
    }
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