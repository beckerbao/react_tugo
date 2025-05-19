import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as Linking from 'expo-linking';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/auth';
import { api } from '@/services/api'

export default function ResetPasswordScreen() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleUrl = (url: string | null) => {
      if (url) {
        const parsed = Linking.parse(url);
        const token = parsed.queryParams?.token;
        console.log('[DEEP LINK] URL:', url);
        console.log('[DEEP LINK] Token:', token);
        if (token) setToken(token);
      }
    };

    // Lấy URL nếu app được mở từ deep link
    Linking.getInitialURL().then(handleUrl);
  
    // Lắng nghe sự kiện nếu app đang mở sẵn
    const sub = Linking.addEventListener('url', (event) => {
      handleUrl(event.url);
    });
  
    return () => sub.remove();
  }, []);

  const handleUpdatePassword = async () => {
    if (!password || password !== confirm) {
      Alert.alert('Lỗi', 'Mật khẩu không hợp lệ hoặc không khớp.');
      return;
    }

    setLoading(true);

    try {
        await api.auth.resetPassword({ token, new_password: password });
        Alert.alert('Thành công', 'Mật khẩu đã được cập nhật!', [
          { text: 'OK', onPress: () => router.replace('/login') },
        ]);
      } catch (error: any) {
        Alert.alert('Lỗi', error?.message || 'Không thể cập nhật mật khẩu.');
      } finally {
        setLoading(false);
      }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { justifyContent: 'center' }]}>
        <Text style={[styles.headerTitle, { fontSize: 22, textAlign: 'center', marginBottom: 12 }]}>
          Đặt lại mật khẩu
        </Text>

        {token ? (
          <>
            <TextInput
              placeholder="Mật khẩu mới"
              secureTextEntry
              style={[styles.input, { marginBottom: 16 }]}
              onChangeText={setPassword}
            />
            <TextInput
              placeholder="Nhập lại mật khẩu"
              secureTextEntry
              style={[styles.input, { marginBottom: 24 }]}
              onChangeText={setConfirm}
            />

            <TouchableOpacity
              onPress={handleUpdatePassword}
              disabled={loading}
              style={[
                styles.signUpButton,
                loading && styles.signUpButtonDisabled,
              ]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.signUpButtonText}>Cập nhật mật khẩu</Text>
              )}
            </TouchableOpacity>
          </>
        ) : (
          <Text style={styles.errorText}>
            Token không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại liên kết trong email.
          </Text>
        )}

        <View style={{ marginTop: 32, alignItems: 'center' }}>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginButtonText}>Quay lại đăng nhập</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/signup')} style={{ marginTop: 12 }}>
            <Text style={styles.loginButtonText}>Tạo tài khoản mới</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
