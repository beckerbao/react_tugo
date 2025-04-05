import { Tabs } from 'expo-router';
import { Chrome as Home, Newspaper, Search, Ticket, LogIn, User } from 'lucide-react-native';
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
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="voucher"
        options={{
          title: 'Vouchers',
          tabBarIcon: ({ color, size }) => <Ticket size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: isAuthenticated ? 'Tài khoản' : 'Đăng nhập',
          tabBarIcon: ({ color, size }) =>
            isAuthenticated ? <User size={size} color={color} /> : <LogIn size={size} color={color} />,
          href: isAuthenticated ? '/profile' : '/login',
        }}
      />
    </Tabs>
  );
}
