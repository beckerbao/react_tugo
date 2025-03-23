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

  const handleTourPress = (tourId: number) => {
    router.push(`/home/tour?id=${tourId}`);
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
          <Text style={styles.logo}>logo</Text>
          <NotificationBell count={3} />
        </View>

        <TouchableOpacity 
          style={styles.searchContainer}
          onPress={handleSearchPress}
          activeOpacity={0.7}
        >
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <Text style={styles.searchPlaceholder}>Where to?</Text>
        </TouchableOpacity>

        <View style={styles.heroSection}>
          <Image
            source={{ uri: data?.hero.image || 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500' }}
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>{data?.hero.title || 'Explore Paradise'}</Text>
            <Text style={styles.heroSubtitle}>
              {data?.hero.subtitle || 'Best destinations for your next adventure'}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular Tours</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toursContainer}>
          {(data?.popular_tours || []).map((tour, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.tourCard}
              onPress={() => handleTourPress(index + 1)}
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

        <Text style={styles.sectionTitle}>Special Offers</Text>
        <View style={styles.offersContainer}>
          {(data?.special_offers || []).map((offer, index) => (
            <TouchableOpacity
              key={index}
              style={styles.offerCard}
              onPress={() => handleVoucherPress(index + 1)}
              activeOpacity={0.7}
            >
              <View style={styles.offerContent}>
                <View style={styles.offerInfo}>
                  <Text style={styles.offerTitle}>{offer.title}</Text>
                  <Text style={styles.offerDescription}>{offer.description}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.collectButton}
                  onPress={(e) => handleCollect(`${offer.title.toUpperCase().replace(/\s+/g, '')}2024`, e)}
                >
                  <Text style={styles.collectButtonText}>{offer.button_text}</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.offerImageContainer}>
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500' }}
                  style={styles.offerImage}
                />
                <View style={styles.offerOverlay}>
                  <Text style={styles.validUntil}>Valid until Dec 31, 2024</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationsContainer}>
          {(data?.popular_destinations || []).map((destination, index) => (
            <TouchableOpacity 
              key={index}
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
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
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
  heroSection: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  heroImage: {
    width: '100%',
    height: 200,
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  heroTitle: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 4,
  },
  heroSubtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#FFFFFF',
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
  offersContainer: {
    marginHorizontal: 16,
  },
  offerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
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
  offerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F3E8FF',
  },
  offerInfo: {
    flex: 1,
    marginRight: 12,
  },
  offerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  offerDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  collectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  collectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  offerImageContainer: {
    position: 'relative',
    height: 120,
  },
  offerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  offerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  validUntil: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#FFFFFF',
    textAlign: 'center',
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