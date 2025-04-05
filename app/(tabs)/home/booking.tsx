import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Platform, ActivityIndicator, KeyboardAvoidingView, ScrollView } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Calendar } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { styles } from '@/styles/booking';
import PopUpModal from '@/components/PopUpModal';
import { api } from '@/services/api';

export default function BookingScreen() {
  const router = useRouter();
  const { tourId, tourName } = useLocalSearchParams();

  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    departureDate: new Date(),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const handleBack = () => {
    router.canGoBack() ? router.back() : router.replace('/(tabs)/home');
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError('');

      if (!formData.fullName || !formData.phoneNumber) {
        throw new Error('Please fill in all required fields');
      }

      await api.booking.submit({
        tour_id: Number(tourId),
        tour_name: tourName as string,
        full_name: formData.fullName,
        phone: formData.phoneNumber,
        departure_date: formData.departureDate.toISOString().split('T')[0],
      });

      setShowSuccessModal(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit booking');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    router.replace('/(tabs)/home');
  };

  return (
    <KeyboardAvoidingView                                                                        
  style={{ flex: 1 }}                                                                        
  behavior={Platform.OS === 'ios' ? 'padding' : 'height'}                                    
  keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}>
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đăng ký tư vấn</Text>
        <View style={styles.headerButton} />
      </View>

      <View style={styles.content}>
        {error && <Text style={styles.errorText}>{error}</Text>}
        <ScrollView                                                                              
            contentContainerStyle={{ flexGrow: 1, padding: 16 }}                                   
            keyboardShouldPersistTaps="handled">
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Tour đã chọn</Text>
          <View style={styles.tourCard}>
            <Text style={styles.tourName}>{tourName}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Họ và tên <Text style={styles.requiredAsterisk}>(*)</Text></Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập họ và tên"
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Số điện thoại <Text style={styles.requiredAsterisk}>(*)</Text></Text> 
          <Text style={styles.noticeText}>(Chúng tôi sẽ liên hệ lại để tư vấn qua số điện thoại này.)</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập số điện thoại"
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Thời gian muốn đi</Text>
          <TouchableOpacity style={styles.dateInput} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateInputText}>{formData.departureDate.toLocaleDateString()}</Text>
            <Calendar size={20} color="#6B7280" />
          </TouchableOpacity>

        </View>
        </ScrollView>
        {/* Move date picker outside ScrollView */}
        {showDatePicker && (
          Platform.OS === 'web'
          ? <TextInput
              style={[styles.input, { marginTop: 16 }]}
              value={formData.departureDate.toISOString().split('T')[0]}
              onChangeText={(value) => {
                const date = new Date(value);
                setShowDatePicker(false);
                setFormData({ ...formData, departureDate: date });
              }}
              keyboardType="numeric"
              placeholder="YYYY‑MM‑DD"
            />
          : <View style={styles.datePickerContainer}>
              <DateTimePicker
                value={formData.departureDate}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                minimumDate={new Date()}
                onChange={(_, date) => {
                  setShowDatePicker(false);
                  if (date) setFormData({ ...formData, departureDate: date });
                }}
                themeVariant="light"
                style={styles.datePicker}
                textColor="#000000"
              />
            </View>
        )}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.submitButton,
            (loading || !formData.fullName || !formData.phoneNumber) && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={loading || !formData.fullName || !formData.phoneNumber}
        >
          {loading ? <ActivityIndicator color="#FFFFFF" /> : <Text style={styles.submitButtonText}>Gửi thông tin</Text>}
        </TouchableOpacity>
      </View>

      <PopUpModal
        visible={showSuccessModal}
        onClose={handleCloseModal}
        onDownload={handleCloseModal}
        type="booking"
      />
    </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
