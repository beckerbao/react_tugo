import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import { DEFAULT_ACTION_IDENTIFIER } from 'expo-notifications'; // Import the constant
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
  const initialNotificationHandled = useRef(false);
  const processedNotificationIdentifierRef = useRef<string | null>(null); // Track processed response

  useEffect(() => {
    isMounted.current = true;
    
    if (Platform.OS === 'web') {
      return;
    }

    const initializeNotifications = async () => {
      try {
        // Load last *received* notification ID (still useful for received listener)
        lastNotificationId.current = await AsyncStorage.getItem(LAST_NOTIFICATION_ID);
        
        await checkPermissionAndToken();

        // Only set up listeners if they don't exist
        if (!notificationListenerInstance) {
          notificationListenerInstance = Notifications.addNotificationReceivedListener(
            notification => {
              console.log('Notification Received:', notification);
              const notificationId = notification.request.identifier;
              console.log('Received Notification ID:', notificationId);
              
              // Prevent processing duplicates *received* while app is open      
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
              console.log('Notification Response Received:', response);
              console.log('Action Identifier:', response.actionIdentifier);
              // if (isMounted.current) {
              //   handleNotificationTap(response, false);
              //   console.log('[PushNotifications] Listener: Called handleNotificationTap'); 
              // } else {                                                                                                                                                                        
              //   console.log('[PushNotifications] Listener: isMounted was false, did not call handleNotificationTap');                                                                         
              // }
              console.log('Notification Response Received via Listener:', response);
              handleNotificationTap(response, false);
              console.log('[PushNotifications] Listener: Called handleNotificationTap (isMounted check removed)');
            }
          );
        }

        // Check for initial notification only once
        if (!!initialNotificationHandled.current.current && Platform.OS !== 'web') {
          initialNotificationHandled.current.current = true;
          const initialNotification = await Notifications.getLastNotificationResponseAsync();
          console.log('Initial Notification Response:', initialNotification);
          // Chỉ xử lý nếu có response và actionIdentifier là 'default'
          if (
            initialNotification &&
            isMounted.current &&
            initialNotification.actionIdentifier === DEFAULT_ACTION_IDENTIFIER
          ) {
            console.log('[PushNotifications] Handling Initial Notification Tap via getLastNotificationResponseAsync...'); 
            handleNotificationTap(initialNotification, true);
          } else {
            // console.log(
            //   'Initial notification response ignored due to actionIdentifier not being default or missing'
            // );
            console.log('[PushNotifications] Initial notification ignored. Details:');
            console.log(`  - initialNotification exists: ${!!initialNotification}`); 
            if (initialNotification) {                                                     
              console.log(`  - actionIdentifier:                                          
              ${initialNotification.actionIdentifier}`);                                                
              console.log(`  - DEFAULT_ACTION_IDENTIFIER: ${DEFAULT_ACTION_IDENTIFIER}`); 
              console.log(`  - Identifiers match: ${initialNotification.actionIdentifier=== DEFAULT_ACTION_IDENTIFIER}`);                                                         
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
      console.log('handleNotificationTap triggered with response:', response);
      console.log('actionIdentifier:', response.actionIdentifier);

      const currentIdentifier = response.notification.request.identifier;    
      console.log(`handleNotificationTap triggered. Identifier: ${currentIdentifier}, isInitial: ${isInitial}`);

      // --- Prevent processing the same response identifier multiple times ---  
      if (currentIdentifier === processedNotificationIdentifierRef.current) {               
        console.log(`Notification response ${currentIdentifier} already processed.          
        Ignoring.`);                                                                                 
        return;                                                                             
      }                                                                                     
      // --- Mark this identifier as processed ---                                          
      processedNotificationIdentifierRef.current = currentIdentifier;                       
      console.log(`Processing notification response ${currentIdentifier}.`);    

      // Chỉ xử lý khi người dùng thực sự nhấn vào thông báo
      // if (response.actionIdentifier !== 'default') {
      //   console.log('Not a default tap action, ignoring this notification.');
      //   return;
      // Only handle the default tap action (tapping the notification body)                                                                                                                   
      if (response.actionIdentifier !== DEFAULT_ACTION_IDENTIFIER) {                                                                                                                          
        console.log(`Ignoring notification tap with actionIdentifier: ${response.actionIdentifier}`);                                                                                         
        // Optionally handle other custom actions here if you add them later                                                                                                                 
        return; // Exit if it's not the default tap
      }

      const data = response.notification.request.content.data;
      console.log('Notification data payload:', data);

      if (!data || !data.type || !isMounted.current) {
        return;
      }

      // Add delay only for initial notification
      // if (isInitial) {
      //   await new Promise(resolve => setTimeout(resolve, 1000));
      // }

      switch (data.type) {
        case 'offer':
          // if (data.offerId) {
          //   router.push(`/home/voucher?id=${data.offerId}`);
          //   // Xóa thông tin của notification sau khi xử lý xong
          // Use offerId or voucherId based on what you send in the push payload                                                                                                              
          const offerId = data.offerId || data.voucherId;                                                                                                                                     
          if (offerId) {                                                                                                                                                                      
            console.log(`Navigating to voucher detail for ID: ${offerId}`);                                                                                                                   
            router.push(`/voucher/detail?id=${offerId}`);                                                                                                                                     
            // Clear the last *received* ID - might not be strictly necessary now but doesn't hurt 
            await AsyncStorage.removeItem(LAST_NOTIFICATION_ID);
          }
          break;
        case 'booking':
          // if (data.bookingId) {
            // Use bookingId or tourId based on what you send                                                                                                                                   
          const tourId = data.tourId; // Assuming you send tourId                                                                                                                             
          if (tourId) {                                                                                                                                                                       
              console.log(`Navigating to tour detail for ID: ${tourId}`);                                                                                                                       
              // *** IMPORTANT: Verify this route path matches your actual tour detail screen ***                                                                                               
              router.push(`/home/tour?id=${tourId}`); // Adjust path if needed                                                                                                                         
              // Clear the last notification ID                                                                                                                                                 
              await AsyncStorage.removeItem(LAST_NOTIFICATION_ID);                                                                                                                              
          } else if (data.bookingId) { // Fallback or alternative logic                                                                                                                       
                console.log(`Navigating to booking history for booking ID: ${data.bookingId}`);   
                router.push(`/profile/history`);
                // Xóa thông tin của notification sau khi xử lý xong
                await AsyncStorage.removeItem(LAST_NOTIFICATION_ID);
          } else {                                                                                                                                                                            
            console.warn('Booking notification tapped, but no tourId or bookingId found in data:', data);                                                                                     
          } 
          break;
        case 'system':
          console.log('System notification tapped, navigating to notifications screen'); 
          router.push('/notifications');
          // Xóa thông tin của notification sau khi xử lý xong
          await AsyncStorage.removeItem(LAST_NOTIFICATION_ID);
          break;
        default:                                                                                                                                                                              
          console.warn('Unhandled notification type in push notification tap:', data.type); 
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