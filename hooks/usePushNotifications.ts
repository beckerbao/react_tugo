import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { NotificationResponse } from 'expo-notifications';
import { DEFAULT_ACTION_IDENTIFIER } from 'expo-notifications';
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
let hasInitialized = false;

export function usePushNotifications() {
  // Skip initialization if already done or in SSR
  if (hasInitialized || (Platform.OS === 'web' && typeof window === 'undefined')) {
    return {
      expoPushToken: null,
      notification: null,
      setNotification: () => {},
      showPermissionModal: false,
      handleAllowPermission: () => {},
      handleDenyPermission: () => {},
      permissionWasDenied: false,
      getAndRegisterDeviceToken: async () => {},
    };
  }

  hasInitialized = true;
  
  console.log('[usePushNotifications] mounted');

  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<Notifications.Notification>();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const isRegistering = useRef(false);
  const isMounted = useRef(true);
  const lastNotificationId = useRef<string | null>(null);
  const initialNotificationHandled = useRef(false);
  const hasSentToken = useRef(false);

  const notificationListenerRef = useRef<Notifications.Subscription | null>(null);
  const responseListenerRef = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    // Skip effect in SSR
    if (Platform.OS === 'web' && typeof window === 'undefined') {
      return;
    }

    isMounted.current = true;
    
    if (Platform.OS === 'web') {
      return;
    }

    const initializeNotifications = async () => {
      try {
        lastNotificationId.current = await AsyncStorage.getItem(LAST_NOTIFICATION_ID);
        
        await checkPermissionAndToken();

        if (!notificationListenerRef.current) {
          notificationListenerRef.current = Notifications.addNotificationReceivedListener(notification => {
            const notificationId = notification.request.identifier;

            console.log('Notification Received:', notification);
            console.log('Received Notification ID:', notificationId);
              
            if (isMounted.current) {
              setNotification(notification);
            }
          });
        }

        if (!responseListenerRef.current) {
          responseListenerRef.current = Notifications.addNotificationResponseReceivedListener(
            response => {
              console.log('Notification Response Received:', response);
              console.log('Action Identifier:', response.actionIdentifier);
              console.log('Notification Response Received via Listener:', response);
              handleNotificationTap(response, false);
              console.log('[PushNotifications] Listener: Called handleNotificationTap (isMounted check removed)');
            }
          );
        }

        if (!initialNotificationHandled.current && Platform.OS !== 'web') {
          initialNotificationHandled.current = true;
          const initialNotification = await Notifications.getLastNotificationResponseAsync();
          console.log('Initial Notification Response:', initialNotification);
          
          if (
            initialNotification &&
            isMounted.current &&
            initialNotification.actionIdentifier === DEFAULT_ACTION_IDENTIFIER
          ) {
            console.log('[PushNotifications] Handling Initial Notification Tap via getLastNotificationResponseAsync...'); 
            handleNotificationTap(initialNotification, true);
          } else {
            console.log('[PushNotifications] Initial notification ignored. Details:');
            console.log(`  - initialNotification exists: ${!!initialNotification}`); 
            if (initialNotification) {                                                     
              console.log(`  - actionIdentifier: ${initialNotification.actionIdentifier}`);                                                
              console.log(`  - DEFAULT_ACTION_IDENTIFIER: ${DEFAULT_ACTION_IDENTIFIER}`); 
              console.log(`  - Identifiers match: ${initialNotification.actionIdentifier === DEFAULT_ACTION_IDENTIFIER}`);                                                         
            }                                                                              
            console.log(`  - isMounted.current: ${isMounted.current}`); 
          }
        }
      } catch (error) {
        console.error('Error initializing notifications:', error);
      }
    };

    initializeNotifications();

    return () => {
      isMounted.current = false;
      notificationListenerRef.current?.remove();
      notificationListenerRef.current = null;
      responseListenerRef.current?.remove();
      responseListenerRef.current = null;
    };
  }, []);

  const hasPromptedForDenied = useRef(false);
  const [permissionWasDenied, setPermissionWasDenied] = useState(false);

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
      } else if (existingStatus === 'denied' && !hasPromptedForDenied.current) {
        hasPromptedForDenied.current = true;
        setPermissionWasDenied(true);
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

  const registerDevice = async (token: string, userId?: string) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;

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

      if (existingDevice?.id) {
        await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
        await AsyncStorage.setItem('@anonymous_device_id', existingDevice.id);
      }

      if (!existingDevice) {
        const { data: insertedDevice, error: insertError } = await supabase
          .from('anonymous_devices')
          .insert({ push_token: token })
          .select('id')
          .single();

        if (insertError) throw insertError;

        if (insertedDevice?.id) {
          await AsyncStorage.setItem('@anonymous_device_id', insertedDevice.id);
        }

        await AsyncStorage.setItem(DEVICE_TOKEN_KEY, token);
      }
    } catch (error) {
      console.error('Error registering device:', error);
    } finally {
      isRegistering.current = false;
    }
  };

  const handleNotificationTap = async (
    response: NotificationResponse | null,
    isInitial: boolean = false
  ) => {
    if (Platform.OS === 'web' && typeof window === 'undefined') return;
    
    const notificationId = response?.notification.request.identifier;
    if (!notificationId) return;

    if (processingNotificationId.current === notificationId) {
      console.log('[handleNotificationTap] Already processing in-memory, skipping:', notificationId);
      return;
    }

    const alreadyHandledId = await AsyncStorage.getItem(LAST_NOTIFICATION_ID);
    if (alreadyHandledId === notificationId) {
      console.log('[handleNotificationTap] Skipping duplicate notification tap', notificationId);
      return;
    }

    processingNotificationId.current = notificationId;

    try {
      const data = response?.notification.request.content.data;
      if (!data || !data.type) {
        console.warn('[handleNotificationTap] Missing data or type');
        return;
      }

      console.log('[handleNotificationTap] preparing to route...');
      switch (data.type) {
        case 'booking': {
          console.log('[handleNotificationTap] booking payload:', data);
          const tourId = String(data.tourId ?? '');
          if (tourId) {
            const url = `/(tabs)/home/tour?id=${tourId}`;
            isInitial
              ? router.push(url)
              : setTimeout(() => router.push(url), 300);
          }
          break;
        }

        case 'offer': {
          const offerId = data.offerId || data.voucherId;
          if (offerId) {
            const url = `/(tabs)/voucher/detail?id=${offerId}`;
            isInitial
              ? router.push(url)
              : setTimeout(() => router.push(url), 300);
          }
          break;
        }

        case 'system':
          isInitial
            ? router.push(`/notifications`)
            : setTimeout(() => router.push(`/notifications`), 300);
          break;

        default:
          console.warn('[handleNotificationTap] Unknown type:', data.type);
          break;
      }

      await AsyncStorage.setItem(LAST_NOTIFICATION_ID, notificationId);
    } catch (err) {
      console.error('[handleNotificationTap] Error:', err);
    } finally {
      processingNotificationId.current = null;
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

  const getDeviceToken = async (): Promise<string | null> => {
    if (!Device.isDevice) return null;

    let { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      status = newStatus;
    }

    if (status !== 'granted') return null;

    const tokenData = await Notifications.getExpoPushTokenAsync();
    return tokenData.data;
  };
  
  let sentTokenRef: string | null = null;

  const getAndRegisterDeviceToken = async (userId?: string) => {
    if (!Device.isDevice) return;

    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      console.log('Existing status:', existingStatus);

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== 'granted') {
        console.warn('🔕 Permission denied for notifications.');
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync();
      const token = tokenData.data;

      if (!token || token === sentTokenRef) return;

      await registerDevice(token, userId);
      sentTokenRef = token;
      hasSentToken.current = true;

      console.log('✅ Registered device token:', token, userId || 'guest');
    } catch (err) {
      console.error('❌ Failed to register push token:', err);
    }
  };

  return {
    expoPushToken,
    notification,
    showPermissionModal,
    handleAllowPermission,
    handleDenyPermission,
    sendPushNotification,
    setShowPermissionModal,    
    getAndRegisterDeviceToken,
    permissionWasDenied,
  };
}