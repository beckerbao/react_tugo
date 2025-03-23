import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleUser as UserCircle, Bookmark as BookmarkIcon, History, Settings2, LogOut, TestTube } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const menuItems = [
  {
    id: 'edit-profile',
    title: 'Edit Profile',
    icon: UserCircle,
    color: '#8B5CF6',
  },
  // {
  //   id: 'saved-places',
  //   title: 'Saved Places',
  //   icon: BookmarkIcon,
  //   color: '#8B5CF6',
  // },
  // {
  //   id: 'travel-history',
  //   title: 'Travel History',
  //   icon: History,
  //   color: '#8B5CF6',
  // },
  // {
  //   id: 'test-notifications',
  //   title: 'Test Notifications',
  //   icon: TestTube,
  //   color: '#8B5CF6',
  // },
  {
    id: 'logout',
    title: 'Logout',
    icon: LogOut,
    color: '#EF4444',
  },
];

const DEFAULT_AVATAR = 'https://api.review.tugo.com.vn/assets/images/avatar.png';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { profile } = useProfile();

  const handleMenuPress = async (id: string) => {
    switch (id) {
      case 'edit-profile':
        router.push('/profile/edit');
        break;
      case 'travel-history':
        router.push('/profile/history');
        break;
      case 'test-notifications':
        router.push('/test-notifications');
        break;
      case 'logout':
        await signOut();
        router.replace('/login');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <NotificationBell />
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: profile?.avatar_url || DEFAULT_AVATAR }}
              style={styles.avatar}
            />
          </View>
          <Text style={styles.name}>{profile?.full_name || 'Guest User'}</Text>
        </View>

        <View style={styles.menuSection}>
          {menuItems.map((item, index) => (
            <TouchableOpacity 
              key={item.id} 
              style={[
                styles.menuItem,
                index !== menuItems.length - 1 && styles.menuItemBorder
              ]}
              onPress={() => handleMenuPress(item.id)}
            >
              <View style={styles.menuItemLeft}>
                <item.icon size={24} color={item.color} />
                <Text style={[
                  styles.menuItemText,
                  item.id === 'logout' && styles.logoutText
                ]}>
                  {item.title}
                </Text>
              </View>
              <View style={styles.menuItemRight}>
                <Text style={styles.menuItemArrow}>›</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
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
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    marginBottom: 16,
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  name: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 4,
  },
  menuSection: {
    paddingTop: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginLeft: 12,
  },
  menuItemRight: {
    opacity: 0.5,
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#6B7280',
  },
  logoutText: {
    color: '#EF4444',
  },
});