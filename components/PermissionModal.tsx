import { View, Text, StyleSheet, Modal, TouchableOpacity, Platform } from 'react-native';
import { Bell } from 'lucide-react-native';

interface PermissionModalProps {
  visible: boolean;
  onAllow: () => void;
  onDeny: () => void;
}

export default function PermissionModal({ visible, onAllow, onDeny }: PermissionModalProps) {
  if (Platform.OS === 'web') return null;

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
          
          <Text style={styles.title}>Enable Push Notifications</Text>
          
          <Text style={styles.message}>
            Stay updated with our latest offers, booking confirmations, and travel updates.
          </Text>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.denyButton]}
              onPress={onDeny}
            >
              <Text style={[styles.buttonText, styles.denyButtonText]}>Not Now</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.button, styles.allowButton]}
              onPress={onAllow}
            >
              <Text style={[styles.buttonText, styles.allowButtonText]}>Allow</Text>
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