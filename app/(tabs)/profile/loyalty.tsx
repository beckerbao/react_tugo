import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Crown, Star, Award, Loader } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useEffect, useCallback } from 'react';
import LoyaltyCard from '../../../components/LoyaltyCard';
import { useProfile } from '../../../hooks/useProfile';
import { useAuth } from '../../../hooks/useAuth';
import { useApi } from '../../../hooks/useApi';
import { api } from '../../../services/api';
import { formatPrice } from '../../../utils/format';
import { styles } from '@/styles/loyalty';

// Helper function to get tier display properties based on code
const getTierDisplayProps = (code: string) => {
  switch (code.toLowerCase()) {
    case 'tugocare':
      return {
        subtitle: 'Đồng hành',
        color: '#CD7F32',
        backgroundColor: '#FDF2E9',
        icon: Award,
      };
    case 'gold':
    case 'gold2':
      return {
        subtitle: 'Thân Thiết',
        color: '#FFD700',
        backgroundColor: '#FFFBF0',
        icon: Star,
      };
    case 'premium':
      return {
        subtitle: 'Tri kỷ',
        color: '#660066',
        backgroundColor: '#F8F4F8',
        icon: Crown,
      };
    default:
      return {
        subtitle: 'Thành viên',
        color: '#8B5CF6',
        backgroundColor: '#F3E8FF',
        icon: Award,
      };
  }
};

export default function LoyaltyScreen() {
  const router = useRouter();
  const { session } = useAuth();
  const { profile } = useProfile();
  
  const getUserStatsCallback = useCallback((userId: number) => api.tugocare.getUserStats(userId), []);
  const getTiersCallback = useCallback(() => api.tugocare.getTiers(), []);
  
  const { 
    data: userStatsData, 
    error: userStatsError, 
    loading: userStatsLoading,
    execute: fetchUserStats 
  } = useApi(getUserStatsCallback);
  
  const { 
    data: tiersData, 
    error: tiersError, 
    loading: tiersLoading,
    execute: fetchTiers 
  } = useApi(getTiersCallback);

  useEffect(() => {
    // Fetch tiers data
    fetchTiers();
    
    // Fetch user stats if user is logged in
    if (session?.user?.id) {
      // Convert user ID to number - assuming it's a numeric string
      const userId = parseInt(session.user.id, 10);
      if (!isNaN(userId)) {
        fetchUserStats(userId);
      }
    }
  }, [session?.user?.id, fetchUserStats, fetchTiers]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/profile');
    }
  };

  const getTotalSpending = () => {
    if (userStatsLoading) {
      return 'Đang tải...';
    }
    
    if (userStatsError || !userStatsData?.data || userStatsData.data.length === 0) {
      return '0 VNĐ';
    }
    
    const userStat = userStatsData.data[0];
    return `${formatPrice(userStat.total_12m_vnd)} VNĐ`;
  };

  // Get current tier (default to first tier or create a fallback)
  const tiers = tiersData?.data || [];
  const currentTier = tiers.find(tier => tier.code.toLowerCase() === 'tugocare') || tiers[0];
  const currentTierProps = currentTier ? getTierDisplayProps(currentTier.code) : getTierDisplayProps('tugocare');

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
            tier={currentTier?.code || "tugocare"}
            tierName={currentTier?.name || "TugoCare"}
            tierSubtitle={currentTierProps.subtitle}
            color={currentTierProps.color}
            backgroundColor={currentTierProps.backgroundColor}
            fullName={profile?.full_name || 'Bao Nguyen'}
            cardNumber="1234567890123456"
            qrValue="TUGO_MEMBER_1234567890123456"
          />

          <Text style={styles.introTitle}>TugoCare</Text>
          <Text style={styles.introDescription}>
            Mỗi chuyến đi luôn bắt đầu bằng sự An Tâm
          </Text>
          
          <View style={styles.spendingContainer}>
            <Text style={styles.spendingLabel}>Tổng chi tiêu (12 tháng gần nhất)</Text>
            <View style={styles.spendingValueContainer}>
              {userStatsLoading && <Loader size={16} color="#8B5CF6" />}
              <Text style={styles.spendingValue}>{getTotalSpending()}</Text>
            </View>
          </View>
        </View>

        {tiersLoading ? (
          <View style={styles.loadingContainer}>
            <Loader size={32} color="#8B5CF6" />
            <Text style={styles.loadingText}>Đang tải thông tin hạng thành viên...</Text>
          </View>
        ) : tiersError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Không thể tải thông tin hạng thành viên</Text>
          </View>
        ) : (
          tiers.map((tier) => {
            const tierProps = getTierDisplayProps(tier.code);
            const IconComponent = tierProps.icon;
            
            return (
              <View key={tier.id} style={[styles.tierCard, { backgroundColor: tierProps.backgroundColor }]}>
                <View style={styles.tierHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: tierProps.color }]}>
                    <IconComponent size={24} color="#FFFFFF" />
                  </View>
                  <View style={styles.tierInfo}>
                    <Text style={[styles.tierName, { color: tierProps.color }]}>{tier.name}</Text>
                    <Text style={[styles.tierSubtitle, { color: tierProps.color }]}>{tierProps.subtitle}</Text>
                    <Text style={styles.tierMinSpend}>
                      Tối thiểu: {formatPrice(tier.min_spend_12m)} VNĐ/12 tháng
                    </Text>
                  </View>
                </View>

                <View style={styles.benefitsSection}>
                  <Text style={styles.benefitsTitle}>Quyền lợi:</Text>
                  {tier.benefits.map((benefit, benefitIndex) => (
                    <View key={`${benefit.id}-${benefitIndex}`} style={styles.benefitItem}>
                      <View style={[styles.bulletPoint, { backgroundColor: tierProps.color }]} />
                      <Text style={styles.benefitText}>{benefit.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            );
          })
        )}        
      </ScrollView>
    </SafeAreaView>
  );
}