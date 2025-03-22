import { View, Text, StyleSheet, TouchableOpacity, Platform, Modal } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Calendar, Clock, Ban } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useState } from 'react';
import NotificationBell from '@/components/NotificationBell';

const voucherData = {
  1: {
    id: 1,
    title: 'Summer Sale',
    discount: '20% OFF',
    description: 'Summer Sale Discount',
    validUntil: 'Aug 31, 2024',
    availability: 'Available for all tours',
    maxDiscount: '¥500',
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
  const [showCollectedModal, setShowCollectedModal] = useState(false);
  const voucher = voucherData[Number(id)];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleCollect = () => {
    setShowCollectedModal(true);
    setTimeout(() => {
      setShowCollectedModal(false);
      handleBack();
    }, 2000);
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

      <View style={styles.footer}>
        <TouchableOpacity style={styles.collectButton} onPress={handleCollect}>
          <Text style={styles.collectButtonText}>Collect Now</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showCollectedModal}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Your voucher has been collected!</Text>
          </View>
        </View>
      </Modal>
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
    padding: 8,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#8B5CF6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  voucherCard: {
    backgroundColor: '#F3E8FF',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  discount: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#8B5CF6',
    marginBottom: 8,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  detailText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginLeft: 12,
  },
  termItem: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  collectButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  collectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    padding: 24,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.25)',
      },
    }),
  },
  modalText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
  backButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8B5CF6',
  },
});