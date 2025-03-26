import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';
import { createTestNotification } from '@/services/testHelpers';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { useState } from 'react';

export default function TestNotificationsScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { expoPushToken, sendPushNotification } = usePushNotifications();
  const [title, setTitle] = useState('Test Notification');
  const [body, setBody] = useState('This is a test notification');

  const handleCreateNotification = async (type: 'offer' | 'booking' | 'system') => {
    if (!session?.user) {
      alert('Please login first');
      return;
    }

    try {
      await createTestNotification(session.user.id, type);
      
      // Send push notification if token exists
      if (expoPushToken) {
        await sendPushNotification(expoPushToken, title, body, { type });
      }
      
      alert(`${type} notification created successfully!`);
    } catch (error) {
      alert('Error creating notification');
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Test Notifications</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.content}>
        <View style={styles.form}>
          <Text style={styles.label}>Notification Title</Text>
          <TextInput
            style={styles.input}
            value={title}
            onChangeText={setTitle}
            placeholder="Enter notification title"
          />

          <Text style={styles.label}>Notification Body</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={body}
            onChangeText={setBody}
            placeholder="Enter notification message"
            multiline
            numberOfLines={4}
          />
        </View>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleCreateNotification('system')}
        >
          <Text style={styles.buttonText}>Create System Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleCreateNotification('offer')}
        >
          <Text style={styles.buttonText}>Create Offer Notification</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button}
          onPress={() => handleCreateNotification('booking')}
        >
          <Text style={styles.buttonText}>Create Booking Notification</Text>
        </TouchableOpacity>

        {expoPushToken && (
          <Text style={styles.tokenText}>Push Token: {expoPushToken}</Text>
        )}
      </View>
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
    padding: 16,
    gap: 16,
  },
  form: {
    gap: 12,
    marginBottom: 16,
  },
  label: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  input: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  tokenText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginTop: 24,
  },
});