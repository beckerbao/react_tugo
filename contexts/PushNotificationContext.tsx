import React, { createContext, useContext, ReactNode } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';

export type PushNotificationContextType = ReturnType<typeof usePushNotifications>;

const PushNotificationContext = createContext<PushNotificationContextType | null>(null);

interface PushNotificationProviderProps {
  children: ReactNode;
}

export const PushNotificationProvider = ({ children }: PushNotificationProviderProps) => {
  // Khởi tạo usePushNotifications một lần duy nhất
  const pushNotification = usePushNotifications();

  return (
    <PushNotificationContext.Provider value={pushNotification}>
      {children}
    </PushNotificationContext.Provider>
  );
};

export const usePushNotificationContext = (): PushNotificationContextType => {
  const context = useContext(PushNotificationContext);
  if (!context) {
    throw new Error('usePushNotificationContext phải được sử dụng bên trong PushNotificationProvider');
  }
  return context;
};
