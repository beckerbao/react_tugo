import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, LogIn } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import NotificationBell from '@/components/NotificationBell';
import PopUpModal from '@/components/PopUpModal';
import { useAuth } from '@/hooks/useAuth';

const voucherList = [
  {
    id: 1,
    title: 'Summer Sale',
    discount: '20% off on selected tours',
    validUntil: 'Aug 31, 2024',
    isCollected: false,
    code: 'SUMMER2024',
  },
  {
    id: 2,
    title: 'Early Bird Discount',
    discount: '15% off on advance bookings',
    validUntil: 'Jul 15, 2024',
    isCollected: true,
    code: 'EARLY2024',
  },
  {
    id: 3,
    title: 'Weekend Special',
    discount: '10% off on weekend tours',
    validUntil: 'Sep 30, 2024',
    isCollected: false,
    code: 'WEEKEND2024',
  },
  {
    id: 4,
    title: 'First Time User',
    discount: '25% off on your first booking',
    validUntil: 'Valid for 30 days',
    isCollected: false,
    code: 'FIRST2024',
  },
];

export default function VouchersScreen() {
  const router = useRouter();
  const { session, isGuest } = useAuth();
  const isAuthenticated = !!session?.user && !isGuest;
  const [vouchers, setVouchers] = useState(voucherList);
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');

  const handleVoucherPress = (id: number) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(`/home/voucher?id=${id}`);
  };

  const handleCollect = (id: number, code: string, e: any) => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    e.stopPropagation();
    setSelectedVoucherCode(code);
    setShowVoucherModal(true);
  };

  const handleDownload = () => {
    setShowVoucherModal(false);
    setVouchers(vouchers.map(voucher => 
      voucher.code === selectedVoucherCode ? { ...voucher, isCollected: true } : voucher
    ));
  };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Vouchers</Text>
          <NotificationBell />
        </View>
        <View style={styles.guestContainer}>
          <LogIn size={48} color="#8B5CF6" />
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestMessage}>
            Please login to view and collect vouchers
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vouchers</Text>
        <NotificationBell />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {vouchers.map((voucher) => (
          <TouchableOpacity
            key={voucher.id}
            style={styles.voucherCard}
            onPress={() => handleVoucherPress(voucher.id)}
          >
            <View style={styles.voucherInfo}>
              <Text style={styles.voucherTitle}>{voucher.title}</Text>
              <Text style={styles.voucherDiscount}>{voucher.discount}</Text>
              <View style={styles.validityContainer}>
                <Clock size={16} color="#6B7280" />
                <Text style={styles.validityText}>Valid until {voucher.validUntil}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={[
                styles.collectButton,
                voucher.isCollected && styles.collectedButton,
              ]}
              onPress={(e) => handleCollect(voucher.id, voucher.code, e)}
              disabled={voucher.isCollected}
            >
              <Text style={[
                styles.collectButtonText,
                voucher.isCollected && styles.collectedButtonText,
              ]}>
                {voucher.isCollected ? 'Collected' : 'Collect'}
              </Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <PopUpModal
        visible={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        voucherCode={selectedVoucherCode}
        onDownload={handleDownload}
      />
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
    padding: 16,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  guestTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  guestMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  voucherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  voucherInfo: {
    flex: 1,
    marginRight: 12,
  },
  voucherTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8B5CF6',
    marginBottom: 4,
  },
  voucherDiscount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  collectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  collectedButton: {
    backgroundColor: '#E5E7EB',
  },
  collectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  collectedButtonText: {
    color: '#6B7280',
  },
});