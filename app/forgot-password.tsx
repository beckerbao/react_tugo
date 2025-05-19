import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { styles } from '@/styles/auth';
import { api } from '@/services/api';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const isValidEmail = (email: string) => {
    return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
  };

  const handleReset = async () => {
    if (!email) {
      Alert.alert('Lỗi', 'Vui lòng nhập email.');
      return;
    }
    const cleanEmail = email.trim();
    
    console.log('cleanEmail:', cleanEmail);

    // if (!isValidEmail(cleanEmail)) {
    //   Alert.alert('Lỗi', 'Email không hợp lệ.');
    //   return;
    // }

    setLoading(true);
    try {
      await api.auth.requestReset({ email: cleanEmail });
  
      Alert.alert('Thành công', 'Vui lòng kiểm tra email để đặt lại mật khẩu.');
      router.replace('/login');
    } catch (error: any) {
      Alert.alert('Lỗi', error?.message || 'Không thể gửi yêu cầu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.content, { justifyContent: 'center' }]}>
        <Text style={[styles.headerTitle, { fontSize: 22, textAlign: 'center', marginBottom: 8 }]}>
          Quên mật khẩu
        </Text>
        <Text style={[styles.label, { textAlign: 'center', marginBottom: 24 }]}>
          Nhập email để nhận link đặt lại mật khẩu
        </Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { marginBottom: 24 }]}
        />

        <TouchableOpacity
          onPress={handleReset}
          disabled={loading}
          style={[
            styles.signUpButton,
            loading && styles.signUpButtonDisabled,
          ]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.signUpButtonText}>Gửi email đặt lại mật khẩu</Text>
          )}
        </TouchableOpacity>

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
