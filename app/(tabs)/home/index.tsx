import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { SplashScreen, useRouter } from 'expo-router';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import NotificationBell from '@/components/NotificationBell';
import PopUpModal from '@/components/PopUpModal';
import { api } from '@/services/api';
import { useApi } from '@/hooks/useApi';
import LoadingView from '@/components/LoadingView';
import ErrorView from '@/components/ErrorView';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const LOGO_URL = 'https://api.review.tugo.com.vn/assets/images/tugo_logo.png';
const LOGO_ASPECT_RATIO = 1.5;
const LOGO_HEIGHT = 66;

export default function HomeScreen() {
  const router = useRouter();
  const [showVoucherModal, setShowVoucherModal] = useState(false);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState('');
  
  const { 
    data: homepageData, 
    error, 
    loading, 
    execute: fetchHomepage 
  } = useApi(api.homepage.getData);

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  useEffect(() => {
    fetchHomepage();
  }, []);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  if (loading) {
    return <LoadingView />;
  }

  if (error) {
    return <ErrorView message={error.message} onRetry={fetchHomepage} />;
  }

  const handleTourPress = (tour: any) => {
    router.push(`/home/tour?id=${tour.tour_id}`);
  };

  const handleDestinationPress = (destination: string) => {
    router.push(`/home/destination?destination=${destination.toLowerCase()}`);
  };

  const handleCollect = (code: string, e: any) => {
    e.stopPropagation();
    setSelectedVoucherCode(code);
    setShowVoucherModal(true);
  };

  const handleDownload = () => {
    setShowVoucherModal(false);
  };

  const handleVoucherPress = (offerId: number) => {
    router.push(`/home/voucher?id=${offerId}`);
  };

  const handleSearchPress = () => {
    router.push('/(tabs)/search');
  };

  const data = homepageData?.data;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Image 
            source={{ uri: LOGO_URL }}
            style={[
              styles.logo,
              {
                width: LOGO_HEIGHT * LOGO_ASPECT_RATIO,
                height: LOGO_HEIGHT,
              }
            ]}
            resizeMode="contain"
          />
          <NotificationBell count={3} />
        </View>

        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Bạn tính đi đâu?</Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Các tour HOT</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toursContainer}>
          {(data?.popular_tours || []).map((tour, index) => (
            <TouchableOpacity 
              key={`tour-${index}`}
              style={styles.tourCard}
              onPress={() => handleTourPress(tour)}
            >
              <Image source={{ uri: tour.image }} style={styles.tourImage} />
              <View style={styles.tourContent}>
                <Text style={styles.tourTitle}>{tour.name}</Text>
                <Text style={styles.tourInfo}>
                  {tour.duration} · {tour.type}
                </Text>
                <View style={styles.tourFooter}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>★ {tour.rating}</Text>
                    <Text style={styles.reviews}>({tour.review_count} reviews)</Text>
                  </View>
                  <Text style={styles.price}>${tour.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Các điểm đến phổ biến</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationsContainer}>
          {(data?.popular_destinations || []).map((destination, index) => (
            <TouchableOpacity 
              key={`destination-${index}`}
              style={styles.destinationCard}
              onPress={() => handleDestinationPress(destination.name)}
            >
              <Image source={{ uri: destination.image }} style={styles.destinationImage} />
              <Text style={styles.destinationName}>{destination.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
  },
  logo: {
    // Width and height are set dynamically
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  sectionTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#1F2937',
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  toursContainer: {
    paddingLeft: 16,
  },
  tourCard: {
    width: 280,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginRight: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  tourImage: {
    width: '100%',
    height: 160,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  tourContent: {
    padding: 16,
  },
  tourTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  tourInfo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
  },
  tourFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#1F2937',
    marginRight: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#8B5CF6',
  },
  destinationsContainer: {
    paddingLeft: 16,
    paddingBottom: 24,
  },
  destinationCard: {
    marginRight: 16,
    alignItems: 'center',
  },
  destinationImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  destinationName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
  },
});