import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  Platform,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { SplashScreen, useRouter } from 'expo-router';
import NotificationBell from '@/components/NotificationBell';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const popularTours = [
  {
    id: 1,
    title: 'Maldives Luxury Resort',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500',
    price: 1299,
    days: 7,
    type: 'All inclusive',
    rating: 4.9,
    reviews: 128,
  },
  {
    id: 2,
    title: 'Swiss Alps Adventure',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500',
    price: 899,
    days: 5,
    type: 'Guided tour',
    rating: 4.8,
    reviews: 96,
  },
];

const specialOffers = [
  {
    id: 1,
    title: 'Summer Sale',
    description: 'Get 20% off on selected tours',
  },
  {
    id: 2,
    title: 'Early Bird',
    description: 'Book now save 15%',
  },
];

const popularDestinations = [
  {
    id: 1,
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500',
  },
  {
    id: 2,
    name: 'Santorini',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
  },
  {
    id: 3,
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
  },
  {
    id: 4,
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const [showCollectedModal, setShowCollectedModal] = useState(false);
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

  if (!fontsLoaded && !fontError) {
    return null;
  }

  const handleTourPress = (tourId: number) => {
    router.push(`/home/tour?id=${tourId}`);
  };

  const handleDestinationPress = (destination: string) => {
    router.push(`/home/destination?destination=${destination.toLowerCase()}`);
  };

  const handleVoucherPress = (offerId: number) => {
    router.push(`/home/voucher?id=${offerId}`);
  };

  const handleCollect = () => {
    setShowCollectedModal(true);
    setTimeout(() => {
      setShowCollectedModal(false);
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.logo}>logo</Text>
          <NotificationBell count={3} />
        </View>

        <View style={styles.searchContainer}>
          <Search size={20} color="#6B7280" style={styles.searchIcon} />
          <TextInput
            placeholder="Where to?"
            style={styles.searchInput}
            placeholderTextColor="#6B7280"
          />
        </View>

        <View style={styles.heroSection}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=500' }}
            style={styles.heroImage}
          />
          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>Explore Paradise</Text>
            <Text style={styles.heroSubtitle}>Best destinations for your next adventure</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Popular Tours</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.toursContainer}>
          {popularTours.map((tour) => (
            <TouchableOpacity 
              key={tour.id} 
              style={styles.tourCard}
              onPress={() => handleTourPress(tour.id)}
            >
              <Image source={{ uri: tour.image }} style={styles.tourImage} />
              <View style={styles.tourContent}>
                <Text style={styles.tourTitle}>{tour.title}</Text>
                <Text style={styles.tourInfo}>
                  {tour.days} days · {tour.type}
                </Text>
                <View style={styles.tourFooter}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>★ {tour.rating}</Text>
                    <Text style={styles.reviews}>({tour.reviews} reviews)</Text>
                  </View>
                  <Text style={styles.price}>${tour.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Special Offers</Text>
        <View style={styles.offersContainer}>
          {specialOffers.map((offer) => (
            <TouchableOpacity 
              key={offer.id} 
              style={styles.offerCard}
              onPress={() => handleVoucherPress(offer.id)}
            >
              <View>
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerDescription}>{offer.description}</Text>
              </View>
              <TouchableOpacity 
                style={styles.collectButton}
                onPress={(e) => {
                  e.stopPropagation();
                  handleCollect();
                }}
              >
                <Text style={styles.collectButtonText}>Collect</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Popular Destinations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.destinationsContainer}>
          {popularDestinations.map((destination) => (
            <TouchableOpacity 
              key={destination.id} 
              style={styles.destinationCard}
              onPress={() => handleDestinationPress(destination.name)}
            >
              <Image source={{ uri: destination.image }} style={styles.destinationImage} />
              <Text style={styles.destinationName}>{destination.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>

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
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
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
});