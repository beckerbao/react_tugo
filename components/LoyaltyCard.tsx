import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { Crown, Award, Star } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import QRCode from 'react-native-qrcode-svg';

interface LoyaltyCardProps {
  tier: 'tugocare' | 'tugocare-plus' | 'tugocare-premium';
  tierName: string;
  tierSubtitle: string;
  color: string;
  backgroundColor: string;
  fullName: string;
  cardNumber: string;
  qrValue: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_WIDTH = SCREEN_WIDTH - 32;
const CARD_HEIGHT = 200;

const getTierIcon = (tier: string) => {
  switch (tier) {
    case 'tugocare':
      return Award;
    case 'tugocare-plus':
      return Star;
    case 'tugocare-premium':
      return Crown;
    default:
      return Award;
  }
};

export default function LoyaltyCard({
  tier,
  tierName,
  tierSubtitle,
  color,
  backgroundColor,
  fullName,
  cardNumber,
  qrValue,
}: LoyaltyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useSharedValue(0);
  const IconComponent = getTierIcon(tier);

  const handleFlip = () => {
    const toValue = isFlipped ? 0 : 1;
    flipAnimation.value = withTiming(toValue, { duration: 600 });
    setIsFlipped(!isFlipped);
  };

  const frontAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [0, 180]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  const backAnimatedStyle = useAnimatedStyle(() => {
    const rotateY = interpolate(flipAnimation.value, [0, 1], [180, 360]);
    return {
      transform: [{ rotateY: `${rotateY}deg` }],
      backfaceVisibility: 'hidden',
    };
  });

  return (
    <TouchableOpacity onPress={handleFlip} activeOpacity={0.9}>
      <View style={styles.cardContainer}>
        {/* Front Side */}
        <Animated.View style={[styles.card, { backgroundColor }, frontAnimatedStyle]}>
          <View style={styles.cardHeader}>
            <View style={styles.logoContainer}>
              <Text style={[styles.logo, { color }]}>TUGO</Text>
            </View>
            <View style={[styles.iconContainer, { backgroundColor: color }]}>
              <IconComponent size={20} color="#FFFFFF" />
            </View>
          </View>

          <View style={styles.cardContent}>
            <Text style={[styles.tierName, { color }]}>{tierName}</Text>
            <Text style={[styles.tierSubtitle, { color }]}>{tierSubtitle}</Text>
          </View>

          <View style={styles.cardFooter}>
            <View style={styles.cardInfoLeft}>
              <Text style={styles.memberName}>{fullName}</Text>
              <Text style={styles.cardNumber}>**** **** **** {cardNumber.slice(-4)}</Text>
            </View>
            <Text style={styles.tapHint}>Chạm để xem mã</Text>
          </View>
        </Animated.View>

        {/* Back Side */}
        <Animated.View style={[styles.card, styles.cardBack, { backgroundColor }, backAnimatedStyle]}>
          <View style={styles.backHeader}>
            <Text style={[styles.logo, { color }]}>TUGO</Text>
            <Text style={[styles.backTierName, { color }]}>{tierName}</Text>
          </View>

          <View style={styles.qrContainer}>
            <View style={styles.qrCodeWrapper}>
              <QRCode
                value={qrValue}
                size={100}
                color={color}
                backgroundColor="white"
              />
            </View>
            <Text style={styles.qrLabel}>Quét mã để tích điểm</Text>
          </View>

          <View style={styles.backFooter}>
            <Text style={styles.fullCardNumber}>Mã thẻ: {cardNumber}</Text>
            <Text style={styles.tapHint}>Chạm để quay lại</Text>
          </View>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    alignSelf: 'center',
    marginBottom: 24,
  },
  card: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 16,
    padding: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  cardBack: {
    // Back side specific styles if needed
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    letterSpacing: 2,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tierName: {
    fontFamily: 'Inter-Bold',
    fontSize: 22,
    marginBottom: 4,
    textAlign: 'center',
  },
  tierSubtitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    textAlign: 'center',
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  cardInfoLeft: {
    flex: 1,
    marginRight: 8,
  },
  memberName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 4,
  },
  cardNumber: {
    fontFamily: 'Inter-Regular',
    fontSize: 13,
    color: '#6B7280',
    letterSpacing: 1,
  },
  tapHint: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: '#6B7280',
    opacity: 0.8,
  },
  backHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backTierName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
  },
  qrContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  qrCodeWrapper: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  qrLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
  backFooter: {
    alignItems: 'center',
    paddingTop: 12,
  },
  fullCardNumber: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 15,
    color: '#1F2937',
    marginBottom: 12,
    letterSpacing: 1,
  },
});