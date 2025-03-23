import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { X, Check } from 'lucide-react-native';

interface PopUpModalProps {
  visible: boolean;
  onClose: () => void;
  voucherCode?: string;
  onDownload?: () => void;
  type?: 'voucher' | 'booking';
}

export default function PopUpModal({ 
  visible, 
  onClose, 
  voucherCode, 
  onDownload,
  type = 'voucher' 
}: PopUpModalProps) {
  if (!visible) return null;

  const isBooking = type === 'booking';

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <X size={24} color="#1F2937" />
        </TouchableOpacity>
        
        <View style={styles.content}>
          {isBooking ? (
            <View style={[styles.iconContainer, styles.successIcon]}>
              <Check size={32} color="#FFFFFF" />
            </View>
          ) : (
            <View style={styles.imageContainer}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500' }}
                style={styles.image}
              />
            </View>
          )}
          
          <Text style={styles.title}>
            {isBooking ? 'Booking Confirmed!' : 'Your Voucher Code'}
          </Text>
          
          {isBooking ? (
            <Text style={styles.message}>
              We have received your booking. We will contact you soon.
            </Text>
          ) : (
            <Text style={styles.code}>{voucherCode || 'BAL2024FEB'}</Text>
          )}
          
          <TouchableOpacity 
            style={styles.downloadButton}
            onPress={onDownload}
          >
            <Text style={styles.downloadButtonText}>
              {isBooking ? 'Done' : 'Download'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '90%',
    maxWidth: 320,
    position: 'relative',
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
  closeButton: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 1,
    padding: 4,
  },
  content: {
    alignItems: 'center',
    padding: 24,
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#F3F4F6',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  successIcon: {
    backgroundColor: '#10B981',
  },
  title: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  message: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  code: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#8B5CF6',
    marginBottom: 24,
  },
  downloadButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: '100%',
  },
  downloadButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
  },
});