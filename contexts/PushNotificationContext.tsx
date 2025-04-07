import React, { createContext, useContext, ReactNode } from 'react';
import { usePushNotifications } from '../hooks/usePushNotifications';
import PermissionModal from '@/components/PermissionModal'; // ✅ thêm import

export type PushNotificationContextType = ReturnType<typeof usePushNotifications>;

const PushNotificationContext = createContext<PushNotificationContextType | null>(null);

interface PushNotificationProviderProps {
  children: ReactNode;
}

export const PushNotificationProvider = ({ children }: PushNotificationProviderProps) => {
  // Khởi tạo usePushNotifications một lần duy nhất
  const pushNotification = usePushNotifications();

  return (
    // <PushNotificationContext.Provider value={pushNotification}>
    //   {children}
    // </PushNotificationContext.Provider>
    <PushNotificationContext.Provider value={pushNotification}>
      {children}

      {/* ✅ Đưa PermissionModal vào đây để modal chỉ xuất hiện đúng nơi */}
      <PermissionModal
        visible={pushNotification.showPermissionModal}
        isDenied={pushNotification.permissionWasDenied}
        onAllow={pushNotification.handleAllowPermission}
        onDeny={pushNotification.handleDenyPermission}
      />
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
