import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Star, Award } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import LoyaltyCard from '../../../components/LoyaltyCard';
import { useProfile } from '../../../hooks/useProfile';
import { styles } from '@/styles/loyalty';

const loyaltyTiers = [
  {
    id: 'tugocare',
    name: 'TugoCare',
    subtitle: 'Đồng hành',
    color: '#CD7F32',
    backgroundColor: '#FDF2E9',
    icon: Award,
    benefits: [
      'Tích điểm cho mỗi chuyến đi',
      'Nhận thông báo ưu đãi đặc biệt',
      'Hỗ trợ khách hàng ưu tiên',
      'Voucher sinh nhật 5%'
    ]
  },
  {
    id: 'tugocare-plus',
    name: 'TugoCare+',
    subtitle: 'Thân Thiết',
    color: '#FFD700',
    backgroundColor: '#FFFBF0',
    icon: Star,
    benefits: [
      'Tất cả quyền lợi hạng Đồng',
      'Tích điểm x1.5 cho mỗi chuyến đi',
      'Voucher sinh nhật 10%',
      'Ưu tiên check-in sớm',
      'Miễn phí thay đổi lịch trình 1 lần',
      'Quà tặng chào mừng'
    ]
  },
  {
    id: 'tugocare-premium',
    name: 'TugoCare Plus',
    subtitle: 'Tri kỷ',
    color: '#660066',
    backgroundColor: '#F8F4F8',
    icon: Crown,
    benefits: [
      'Tất cả quyền lợi hạng Vàng',
      'Tích điểm x2 cho mỗi chuyến đi',
      'Voucher sinh nhật 15%',
      'Phòng nâng hạng miễn phí (tùy tình trạng)',
      'Miễn phí thay đổi lịch trình không giới hạn',
      'Tư vấn viên du lịch riêng',
      'Ưu tiên đặt chỗ tour hot',
      'Quà tặng cao cấp'
    ]
  }
];

export default function LoyaltyScreen() {
  const router = useRouter();
  const { profile } = useProfile();
  
  // For demo purposes, using the first tier as current tier
  const currentTier = loyaltyTiers[0];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chương trình TugoCare</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introSection}>
          <LoyaltyCard
            tier="tugocare"
            tierName={currentTier.name}
            tierSubtitle={currentTier.subtitle}
            color={currentTier.color}
            backgroundColor={currentTier.backgroundColor}
            fullName={profile?.full_name || 'Bao Nguyen'}
            cardNumber="1234567890123456"
            qrValue="TUGO_MEMBER_1234567890123456"
          />

          <Text style={styles.introTitle}>TugoCare Loyalty Program</Text>
          <Text style={styles.introDescription}>
            Tích lũy điểm và nhận những ưu đãi tuyệt vời cho mỗi chuyến đi cùng chúng tôi
          </Text>
          
          <View style={styles.spendingContainer}>
            <Text style={styles.spendingLabel}>Tổng chi tiêu (12 tháng gần nhất)</Text>
            <Text style={styles.spendingValue}>15.000.000 VNĐ</Text>
          </View>
        </View>

        {loyaltyTiers.map((tier, index) => {
          const IconComponent = tier.icon;
          return (
            <View key={tier.id} style={[styles.tierCard, { backgroundColor: tier.backgroundColor }]}>
              <View style={styles.tierHeader}>
                <View style={[styles.iconContainer, { backgroundColor: tier.color }]}>
                  <IconComponent size={24} color="#FFFFFF" />
                </View>
                <View style={styles.tierInfo}>
                  <Text style={[styles.tierName, { color: tier.color }]}>{tier.name}</Text>
                  <Text style={[styles.tierSubtitle, { color: tier.color }]}>{tier.subtitle}</Text>
                </View>
              </View>

              <View style={styles.benefitsSection}>
                <Text style={styles.benefitsTitle}>Quyền lợi:</Text>
                {tier.benefits.map((benefit, benefitIndex) => (
                  <View key={benefitIndex} style={styles.benefitItem}>
                    <View style={[styles.bulletPoint, { backgroundColor: tier.color }]} />
                    <Text style={styles.benefitText}>{benefit}</Text>
                  </View>
                ))}
              </View>
            </View>
          );
        })}

        <View style={styles.footerSection}>
          <Text style={styles.footerTitle}>Cách thức tích điểm</Text>
          <Text style={styles.footerDescription}>
            • Mỗi 100.000 VNĐ chi tiêu = 1 điểm{'\n'}
            • 100 điểm = Lên hạng tiếp theo{'\n'}
            • Điểm tích lũy có hiệu lực trong 12 tháng
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}