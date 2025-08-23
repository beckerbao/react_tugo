// TODO: verify icon mapping for: Crown
// TODO: verify icon mapping for: Star
// TODO: verify icon mapping for: Award
// TODO: verify icon mapping for: Loader
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
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
        icon: 'trophy-outline',
      };
    case 'gold':
    case 'tugocareplus':
      return {
        subtitle: 'Thân Thiết',
        color: '#FFD700',
        backgroundColor: '#FFFBF0',
        icon: 'star-outline',
      };
    case 'tugocarepro':
      return {
        subtitle: 'Tri kỷ',
        color: '#660066',
        backgroundColor: '#F8F4F8',
        icon: 'crown-outline',
      };
    default:
      return {
        subtitle: 'Thành viên',
        color: '#8B5CF6',
        backgroundColor: '#F3E8FF',
        icon: 'trophy-outline',
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
    console.log('Fetching tiers data...');
    // Fetch user stats if user is logged in
    if (session?.user?.id) {
      // Convert user ID to number - assuming it's a numeric string
      const userId = session.user.id
      console.log('User ID:', userId);
      // if (!isNaN(userId)) {
        fetchUserStats(userId);
      // }
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
          <Ionicons name="arrow-back" size={24} color="#8B5CF6" />
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
            cardNumber={userStatsData?.data?.[0]?.card_number || "N/A"}
            qrValue={userStatsData?.data?.[0]?.card_number ? `TUGO_MEMBER_${userStatsData.data[0].card_number}` : "N/A"}
          />

          <Text style={styles.introTitle}>TugoCare</Text>
          <Text style={styles.introDescription}>
            Mỗi chuyến đi luôn bắt đầu bằng sự An Tâm
          </Text>
          
          <View style={styles.spendingContainer}>
            <Text style={styles.spendingLabel}>Tổng chi tiêu (12 tháng gần nhất)</Text>
            <View style={styles.spendingValueContainer}>
              {userStatsLoading && (
                <Ionicons name="refresh-outline" size={16} color="#8B5CF6" />
              )}
              <Text style={styles.spendingValue}>{getTotalSpending()}</Text>
            </View>
          </View>
        </View>

        {tiersLoading ? (
          <View style={styles.loadingContainer}>
            <Ionicons name="refresh-outline" size={32} color="#8B5CF6" />
            <Text style={styles.loadingText}>Đang tải thông tin hạng thành viên...</Text>
          </View>
        ) : tiersError ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Không thể tải thông tin hạng thành viên</Text>
          </View>
        ) : (
          tiers.map((tier) => {
            const tierProps = getTierDisplayProps(tier.code);
            const iconName = tierProps.icon;

            return (
              <View key={tier.id} style={[styles.tierCard, { backgroundColor: tierProps.backgroundColor }]}> 
                <View style={styles.tierHeader}>
                  <View style={[styles.iconContainer, { backgroundColor: tierProps.color }]}> 
                    <Ionicons name={iconName as any} size={24} color="#FFFFFF" />
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