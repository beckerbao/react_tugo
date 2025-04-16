import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform, Linking } from 'react-native';
import { Bell } from 'lucide-react-native';

interface PermissionModalProps {
  visible: boolean;
  isDenied: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export default function PermissionModal({ visible, isDenied, onAllow, onDeny }: PermissionModalProps) {
  if (Platform.OS === 'web') return null;

  const handleSettings = () => {
    Linking.openSettings(); // mở phần cài đặt app
    onDeny(); // đóng modal
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.iconContainer}>
            <Bell size={32} color="#8B5CF6" />
          </View>
          
          <Text style={styles.title}>Cho phép Tugo gửi thông báo</Text>
          
          <Text style={styles.message}>
            Cập nhật sớm những ưu đãi dành riêng cho bạn.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.denyButton]}
              onPress={onDeny}
            >
              <Text style={[styles.buttonText, styles.denyButtonText]}>Để sau</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[styles.button, styles.allowButton]}
              onPress={isDenied ? handleSettings : onAllow}
            >
              <Text style={[styles.buttonText, styles.allowButtonText]}>
                {isDenied ? 'Mở Cài Đặt' : 'Cho phép'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 24,
    width: '90%',
    maxWidth: 320,
    alignItems: 'center',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
  },
  allowButton: {
    backgroundColor: '#8B5CF6',
  },
  allowButtonText: {
    color: '#FFFFFF',
  },
  denyButton: {
    backgroundColor: '#F3F4F6',
  },
  denyButtonText: {
    color: '#6B7280',
  },
});