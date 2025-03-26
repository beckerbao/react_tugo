import { Tabs } from 'expo-router';
import { Chrome as Home, Newspaper, Search, Ticket, LogIn, User } from 'lucide-react-native';
import { useAuth } from '@/hooks/useAuth';

export default function TabLayout() {
  const { session, isGuest } = useAuth();
  const isAuthenticated = !!session?.user && !isGuest;

  const renderTabs = () => {
    const commonTabs = [
      <Tabs.Screen
        key="home"
        name="home"
        options={{
          title: 'Trang chủ',
          tabBarIcon: ({ color, size }) => <Home size={size} color={color} />,
        }}
      />,
      <Tabs.Screen
        key="feed"
        name="feed"
        options={{
          title: 'Feed',
          tabBarIcon: ({ color, size }) => <Newspaper size={size} color={color} />,
        }}
      />,
      <Tabs.Screen
        key="search"
        name="search"
        options={{
          title: 'Tìm kiếm',
          tabBarIcon: ({ color, size }) => <Search size={size} color={color} />,
        }}
      />,
      <Tabs.Screen
        key="voucher"
        name="voucher"
        options={{
          title: 'Vouchers',
          tabBarIcon: ({ color, size }) => <Ticket size={size} color={color} />,
        }}
      />,
    ];

    commonTabs.push(
      <Tabs.Screen
        key="profile"
        name="profile"
        options={{
          title: isAuthenticated ? 'Tài khoản' : 'Đăng nhập',
          tabBarIcon: ({ color, size }) => 
            isAuthenticated ? <User size={size} color={color} /> : <LogIn size={size} color={color} />,
          href: isAuthenticated ? '/profile' : '/login',
        }}
      />
    );

    return commonTabs;
  };

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
      {renderTabs()}
    </Tabs>
  );
}