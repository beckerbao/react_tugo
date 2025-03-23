import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Ticket, Plane, Mail, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';

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
        <Text style={styles.headerTitle}>Notifications</Text>
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
            <Text style={styles.emptyStateText}>No notifications yet</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  notificationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  unreadNotification: {
    backgroundColor: '#F3F4F6',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  unreadText: {
    color: '#000000',
  },
  notificationMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  notificationTime: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 48,
  },
  emptyStateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginTop: 12,
  },
});