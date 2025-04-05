import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CircleUser as UserCircle, Bookmark as BookmarkIcon, History, Settings2, LogOut, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';

const menuItems = [
  {
    id: 'edit-profile',
    title: 'Cập nhật',
    icon: UserCircle,
    color: '#8B5CF6',
  },
  {
    id: 'delete-account',
    title: 'Xóa tài khoản',
    icon: Trash2,
    color: '#EF4444',
  },
  {
    id: 'logout',
    title: 'Thoát',
    icon: LogOut,
    color: '#EF4444',
  },
];

const DEFAULT_AVATAR = 'https://api.review.tugo.com.vn/assets/images/avatar.png';

export default function ProfileScreen() {
  const router = useRouter();
  const { signOut, deleteAccount } = useAuth();
  const { profile } = useProfile();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMenuPress = async (id: string) => {
    switch (id) {
      case 'edit-profile':
        router.push('/profile/edit');
        break;
      case 'delete-account':
        setShowDeleteModal(true);
        break;
      case 'logout':
        await signOut();
        router.replace('/login');
        break;
    }
  };

  const handleDeleteAccount = async () => {
    try {
      setLoading(true);
      const { error } = await deleteAccount();
      
      if (error) throw error;
      
      router.replace('/login');
    } catch (err) {
      console.error('Failed to delete account:', err);
      alert('Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  // --- START: Determine the correct avatar URI ---                                                                                                                                           
  let avatarUriToShow = DEFAULT_AVATAR; // Default to the default avatar                                                                                                                       
                                                                                                                                                                                               
  if (profile?.avatar_url) {                                                                                                                                                                   
    // Check if the stored URL is a valid HTTP/HTTPS URL                                                                                                                                       
    const urlString = profile.avatar_url;                                                                                                                                                      
    if (urlString.startsWith('http://') || urlString.startsWith('https://')) {                                                                                                                 
      avatarUriToShow = urlString; // Use the valid remote URL                                                                                                                                 
    } else {                                                                                                                                                                                   
      // Log if we encounter an invalid URL format (like file://)                                                                                                                              
      console.warn(`Invalid avatar_url found in profile: ${urlString}. Using default avatar.`);                                                                                                
    }                                                                                                                                                                                          
  }                                                                                                                                                                                            
  // --- END: Determine the correct avatar URI --- 

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
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
                  (item.id === 'logout' || item.id === 'delete-account') && styles.dangerText
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

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Xóa tài khoản?</Text>
            <Text style={styles.modalMessage}>
              Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác và tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowDeleteModal(false)}
                disabled={loading}
              >
                <Text style={styles.cancelButtonText}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.modalButton, styles.deleteButton]}
                onPress={handleDeleteAccount}
                disabled={loading}
              >
                <Text style={styles.deleteButtonText}>
                  {loading ? 'Đang xóa...' : 'Xóa'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  dangerText: {
    color: '#EF4444',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
  },
  modalTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  modalMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 24,
    textAlign: 'center',
    lineHeight: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#6B7280',
  },
  deleteButton: {
    backgroundColor: '#EF4444',
  },
  deleteButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
});