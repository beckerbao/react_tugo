import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator, KeyboardAvoidingView, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { supabase } from '@/services/supabase';
import { styles } from '@/styles/auth';

export default function SignUpScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    // if (!email || !password || !fullName || !phoneNumber) {
    if (!email || !password || !fullName) {  
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Sign up the user with metadata
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // phone_number: phoneNumber,
          },
        },
      });
      
      if (signUpError) throw signUpError;

      // Show success message and redirect to login
      alert('Registration successful! Please login to continue.');
      router.replace('/login');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign up');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView                                                                    
      style={styles.container}                                                               
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}                                
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}                                
    > 
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Disable the back swipe gesture for this screen */}  
          {/* <Stack.Screen options={{ gestureEnabled: false }} /> */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Đăng ký</Text>
          </View>

          <View style={styles.content}>
            <Text style={styles.welcomeText}>Tạo tài khoản</Text>

            <View style={styles.form}>
              {error ? (
                <Text style={styles.errorText}>{error}</Text>
              ) : null}

              <Text style={styles.label}>Họ và tên</Text>
              <TextInput
                style={styles.input}
                value={fullName}
                onChangeText={setFullName}
                placeholder="Nhập họ và tên"
                autoCapitalize="words"
              />

              {/* <Text style={styles.label}>Số điện thoại</Text>
              <TextInput
                style={styles.input}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholder="Nhập số điện thoại"
                keyboardType="phone-pad"
              /> */}

              <Text style={styles.label}>Địa chỉ email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="Nhập địa chỉ email"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
              />

              <Text style={styles.label}>Mật khẩu</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Nhập mật khẩu"
                secureTextEntry
              />

              <TouchableOpacity 
                style={[
                  styles.signUpButton,
                  // (!email || !password || !fullName || !phoneNumber || loading) && styles.signUpButtonDisabled
                  (!email || !password || !fullName || loading) && styles.signUpButtonDisabled
                ]}
                onPress={handleSignUp}
                disabled={!email || !password || !fullName || loading}
                // disabled={!email || !password || !fullName || !phoneNumber || loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.signUpButtonText}>Đăng ký ngay</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginButtonText}>Bạn đã có tài khoản? Hãy đăng nhập</Text>
              </TouchableOpacity>
            </View>
          </View>
          </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}