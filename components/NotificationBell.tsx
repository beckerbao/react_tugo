import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useNotifications } from '@/hooks/useNotifications';

interface NotificationBellProps {
  color?: string;
}

export default function NotificationBell({ color = '#8B5CF6' }: NotificationBellProps) {
  const router = useRouter();
  const { unreadCount } = useNotifications();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => router.push('/notifications')}
    >
      <Bell size={24} color={color} />
      {unreadCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontFamily: 'Inter-Bold',
    paddingHorizontal: 4,
  },
});