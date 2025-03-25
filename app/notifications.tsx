import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Ticket, Plane, Mail, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';
import { styles } from '@/styles/notifications';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'offer':
      return Ticket;
    case 'booking':
      return Plane;
    default:
      return Mail;
  }
};

export default function NotificationsScreen() {
  const router = useRouter();
  const { 
    notifications, 
    loading, 
    error, 
    markAsRead, 
    markAllAsRead,
    refresh 
  } = useNotifications();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  }, [refresh]);

  if (loading && !refreshing) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error} onRetry={refresh} />;
  }

  const handleNotificationPress = async (id: string) => {
    await markAsRead(id);
    // Handle navigation based on notification type
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <TouchableOpacity onPress={markAllAsRead} style={styles.headerButton}>
          <Check size={24} color="#8B5CF6" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.content}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {notifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Bell size={48} color="#9CA3AF" />
            <Text style={styles.emptyStateText}>Chưa có thông báo nào</Text>
          </View>
        ) : (
          notifications.map((notification) => {
            const Icon = getNotificationIcon(notification.type);
            return (
              <TouchableOpacity
                key={notification.id}
                style={[
                  styles.notificationItem,
                  !notification.read && styles.unreadNotification,
                ]}
                onPress={() => handleNotificationPress(notification.id)}
              >
                <View style={[
                  styles.iconContainer,
                  { backgroundColor: `${notification.read ? '#E5E7EB' : '#8B5CF6'}20` }
                ]}>
                  <Icon
                    size={24}
                    color={notification.read ? '#6B7280' : '#8B5CF6'}
                  />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={[
                    styles.notificationTitle,
                    !notification.read && styles.unreadText
                  ]}>
                    {notification.title}
                  </Text>
                  <Text style={styles.notificationMessage}>
                    {notification.message}
                  </Text>
                  <Text style={styles.notificationTime}>
                    {new Date(notification.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}