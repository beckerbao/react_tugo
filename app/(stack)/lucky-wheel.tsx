import { Stack, useRouter } from 'expo-router';
import { View, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { WebView } from 'react-native-webview';
import { useRef, useState } from 'react';
import { RotateCw, ArrowLeft } from 'lucide-react-native';
import { styles } from '@/styles/luckywheel';

export default function LuckyWheelScreen() {
  const router = useRouter();
  const webviewRef = useRef(null);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <Stack.Screen
        options={{
          title: '',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ paddingLeft: 16 }}
            >
              <ArrowLeft size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => {
                if (webviewRef.current) {
                  webviewRef.current.reload();
                  setLoading(true);
                }
              }}
              style={{ paddingRight: 16 }}
            >
              <RotateCw size={22} color="#007AFF" />
            </TouchableOpacity>
          ),
          headerTitle: 'Vòng quay may mắn',
        }}
      />
      <View style={styles.container}>
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>Đang tải trò chơi...</Text>
          </View>
        )}
        <WebView
          ref={webviewRef}
          source={{ uri: 'https://spinwheel.tugo.com.vn/' }}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          style={{ flex: 1 }}
        />
      </View>
    </>
  );
}
