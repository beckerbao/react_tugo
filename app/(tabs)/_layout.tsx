import { Tabs } from 'expo-router';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { session, isGuest, loading } = useAuth();
  const isAuthenticated = !!session?.user && !isGuest;

  if (loading) return null; // ✅ Đợi auth xong

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#8B5CF6',
        tabBarInactiveTintColor: '#6B7280',
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#E5E7EB',
          height: 60,
          paddingBottom: 8,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Feather name="home" size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="search-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="voucher"
        options={{
          title: 'Vouchers',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="ticket-outline" size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? 'Tài khoản' : 'Đăng nhập',
          tabBarIcon: ({ color, size }) =>
            isAuthenticated ? (
              <Ionicons name="person-outline" size={size} color={color} />
            ) : (
              <Ionicons name="log-in-outline" size={size} color={color} />
            ),
          href: isAuthenticated ? '/profile' : '/login',
        }}
      />
    </Tabs>
  );
}
