import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Ban } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import NotificationBell from '@/components/NotificationBell';
import PopUpModal from '@/components/PopUpModal';
import { styles } from '@/styles/voucher';

const voucherData = {
  1: {
    id: 1,
    title: 'Summer Sale',
    discount: '20% OFF',
    description: 'Summer Sale Discount',
    validUntil: 'Aug 31, 2024',
    availability: 'Available for all tours',
    maxDiscount: '¥500',
    code: 'SUMMER2024',
    terms: [
      'Valid for selected tours only',
      'Cannot be combined with other offers',
      'No cash value',
      'Subject to availability',
    ],
  },
  2: {
    id: 2,
    title: 'Early Bird',
    discount: '15% OFF',
    description: 'Book now save 15%',
    validUntil: 'Dec 31, 2024',
    availability: 'Available for all tours',
    maxDiscount: '¥300',
    code: 'EARLY2024',
    terms: [
      'Valid for advance bookings only',
      'Must book 30 days in advance',
      'No cash value',
      'Subject to availability',
    ],
  },
};

export default function VoucherScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const voucher = voucherData[Number(id)];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleCollect = () => {
    setShowVoucherModal(true);
  };

  const handleDownload = () => {
    // Handle download logic here
    setShowVoucherModal(false);
    handleBack();
  };

  if (!voucher) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <ArrowLeft size={24} color="#8B5CF6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Not Found</Text>
          <NotificationBell count={3} />
        </View>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>This voucher does not exist.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{voucher.title}</Text>
        <NotificationBell count={3} />
      </View>

      <View style={styles.content}>
        <View style={styles.voucherCard}>
          <Text style={styles.discount}>{voucher.discount}</Text>
          <Text style={styles.description}>{voucher.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voucher Details</Text>
          <View style={styles.detailItem}>
            <Calendar size={20} color="#6B7280" />
            <Text style={styles.detailText}>Valid until {voucher.validUntil}</Text>
          </View>
          <View style={styles.detailItem}>
            <Clock size={20} color="#6B7280" />
            <Text style={styles.detailText}>{voucher.availability}</Text>
          </View>
          <View style={styles.detailItem}>
            <Ban size={20} color="#6B7280" />
            <Text style={styles.detailText}>Maximum discount: {voucher.maxDiscount}</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Terms & Conditions</Text>
          {voucher.terms.map((term, index) => (
            <Text key={index} style={styles.termItem}>• {term}</Text>
          ))}
        </View>
      </View>

      {/* <View style={styles.footer}>
        <TouchableOpacity style={styles.collectButton} onPress={handleCollect}>
          <Text style={styles.collectButtonText}>Collect Now</Text>
        </TouchableOpacity>
      </View> */}

      <PopUpModal
        visible={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        voucherCode={voucher.code}
        onDownload={handleDownload}
      />
    </SafeAreaView>
  );
}