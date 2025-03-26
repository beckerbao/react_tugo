import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
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
import { formatPrice } from '@/utils/format';
import { styles } from '@/styles/home';

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

  const handleDestinationPress = (destination: any) => {
    console.log('Destination pressed:', destination); // Add this for debugging
    router.push(`/home/destination?destination_id=${destination.destination_id}`);
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
  const tours = data?.popular_tours || [];

  // Create pairs of tours for the grid
  const tourPairs = [];
  for (let i = 0; i < tours.length; i += 2) {
    tourPairs.push(tours.slice(i, i + 2));
  }

  // Create pairs of destinations for the grid
  const destinations = data?.popular_destinations || [];
  const destinationPairs = [];
  for (let i = 0; i < destinations.length; i += 2) {
    destinationPairs.push(destinations.slice(i, i + 2));
  }

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
        <View style={styles.toursGrid}>
          {tourPairs.map((pair, rowIndex) => (
            <View key={`row-${rowIndex}`} style={styles.tourRow}>
              {pair.map((tour, colIndex) => (
                <TouchableOpacity
                  key={`tour-${rowIndex}-${colIndex}`}
                  style={styles.tourCard}
                  onPress={() => handleTourPress(tour)}
                >
                  <Image source={{ uri: tour.image }} style={styles.tourImage} />
                  <View style={styles.tourContent}>
                    <Text numberOfLines={2} style={styles.tourTitle}>
                      {tour.name}
                    </Text>
                    <Text style={styles.tourInfo}>
                      {tour.type}
                    </Text>
                    <View style={styles.tourFooter}>
                      <Text style={styles.price}>{formatPrice(tour.price)} đ</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
              {pair.length === 1 && <View style={styles.tourCard} />}
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Các điểm đến phổ biến</Text>
        <View style={styles.destinationsGrid}>
          {destinationPairs.map((pair, rowIndex) => (
            <View key={`dest-row-${rowIndex}`} style={styles.destinationRow}>
              {pair.map((destination, colIndex) => (
                <TouchableOpacity
                  key={`destination-${rowIndex}-${colIndex}`}
                  style={styles.destinationCard}
                  onPress={() => handleDestinationPress(destination)}
                >
                  <Image 
                    source={{ uri: destination.image }} 
                    style={styles.destinationImage}
                  />
                  <Text style={styles.destinationName}>{destination.name}</Text>
                </TouchableOpacity>
              ))}
              {pair.length === 1 && <View style={styles.destinationCard} />}
            </View>
          ))}
        </View>
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