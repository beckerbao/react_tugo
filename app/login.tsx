import { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as AppleAuthentication from 'expo-apple-authentication';
import { useAuth } from '@/hooks/useAuth';
import { styles } from '@/styles/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithApple, continueAsGuest } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const { error: signInError } = await signIn(email, password);
      
      if (signInError) {
        throw signInError;
      }

      router.replace('/(tabs)/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  const handleAppleSignIn = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const { error } = await signInWithApple();
      
      if (error) throw error;
      
      router.replace('/(tabs)/home');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sign in with Apple');
    } finally {
      setLoading(false);
    }
  }, [signInWithApple, router]);

  const handleContinueAsGuest = () => {
    continueAsGuest();
    router.replace('/(tabs)/home');
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <KeyboardAvoidingView                                                                        
  style={{ flex: 1 }}                                                                        
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}                                    
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
    <SafeAreaView style={styles.container}>
      
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Đăng nhập</Text>
        </View>
      <ScrollView                                                                              
              contentContainerStyle={{ flexGrow: 1, padding: 16 }}                                   
              keyboardShouldPersistTaps="handled">
        <View style={styles.content}>
          <Text style={styles.welcomeText}>Xin chào!</Text>

          <View style={styles.form}>
            {error ? (
              <Text style={styles.errorText}>{error}</Text>
            ) : null}

            <Text style={styles.label}>Địa chỉ email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="Nhập email của bạn nhé"
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
                (!email || !password || loading) && styles.signUpButtonDisabled
              ]}
              onPress={handleLogin}
              disabled={!email || !password || loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text style={styles.signUpButtonText}>Đăng nhập</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => router.push('/forgot-password')} style={{ marginTop: 16 }}>
              <Text style={styles.forgotText}>Quên mật khẩu?</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.loginButton}
              onPress={handleSignUp}
            >
              <Text style={styles.loginButtonText}>
                Bạn chưa có tài khoản? Hãy đăng ký nhé
              </Text>
            </TouchableOpacity>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>hoặc</Text>
              <View style={styles.dividerLine} />
            </View>

            {Platform.OS === 'ios' && (
              <AppleAuthentication.AppleAuthenticationButton
                buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                cornerRadius={8}
                style={styles.appleButton}
                onPress={handleAppleSignIn}
              />
            )}

            <TouchableOpacity 
              style={styles.guestButton}
              onPress={handleContinueAsGuest}
            >
              <Text style={styles.guestButtonText}>Tiếp tục mà không cần đăng ký</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}