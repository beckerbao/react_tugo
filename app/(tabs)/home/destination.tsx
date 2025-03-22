import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationBell from '@/components/NotificationBell';

const destinationTours = {
  bali: {
    name: 'Bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500',
    tours: [
      {
        id: 1,
        title: 'Bali Beach Paradise',
        days: 5,
        type: 'All Inclusive',
        price: 899,
        image: 'https://images.unsplash.com/photo-1544644181-1484b3fdfc62?w=500',
      },
      {
        id: 2,
        title: 'Ubud Cultural Tour',
        days: 7,
        type: 'Premium',
        price: 1299,
        image: 'https://images.unsplash.com/photo-1583321500900-82807e458f3c?w=500',
      },
      {
        id: 3,
        title: 'Adventure Package',
        days: 4,
        type: 'Adventure',
        price: 749,
        image: 'https://images.unsplash.com/photo-1512100254544-47340ba56b5d?w=500',
      },
    ],
  },
  santorini: {
    name: 'Santorini',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
    tours: [
      {
        id: 1,
        title: 'Romantic Getaway',
        days: 6,
        type: 'Premium',
        price: 1499,
        image: 'https://images.unsplash.com/photo-1571406761758-9a3eed5338ef?w=500',
      },
      {
        id: 2,
        title: 'Island Explorer',
        days: 5,
        type: 'Adventure',
        price: 999,
        image: 'https://images.unsplash.com/photo-1507501336603-6e31db2be093?w=500',
      },
    ],
  },
  tokyo: {
    name: 'Tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
    tours: [
      {
        id: 1,
        title: 'City Explorer',
        days: 5,
        type: 'Cultural',
        price: 1199,
        image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=500',
      },
    ],
  },
  paris: {
    name: 'Paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
    tours: [
      {
        id: 1,
        title: 'Romantic Paris',
        days: 6,
        type: 'Premium',
        price: 1399,
        image: 'https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500',
      },
    ],
  },
};

export default function DestinationScreen() {
  const { destination } = useLocalSearchParams();
  const router = useRouter();
  const destinationData = destinationTours[destination as keyof typeof destinationTours];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleTourPress = (tourId: number) => {
    router.push(`/home/tour?id=${tourId}`);
  };

  if (!destinationData) {
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
          <Text style={styles.errorText}>Destination not found</Text>
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
        <Text style={styles.headerTitle}>{destinationData.name} Tours</Text>
        <NotificationBell count={3} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image source={{ uri: destinationData.image }} style={styles.heroImage} />
        
        <View style={styles.toursContainer}>
          {destinationData.tours.map((tour) => (
            <TouchableOpacity
              key={tour.id}
              style={styles.tourCard}
              onPress={() => handleTourPress(tour.id)}
            >
              <Image source={{ uri: tour.image }} style={styles.tourImage} />
              <View style={styles.tourInfo}>
                <View>
                  <Text style={styles.tourTitle}>{tour.title}</Text>
                  <Text style={styles.tourDetails}>
                    {tour.days} days · {tour.type}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>${tour.price}</Text>
                  <Text style={styles.perPerson}>per person</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    backgroundColor: '#FFFFFF',
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
  },
  heroImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  toursContainer: {
    padding: 16,
  },
  tourCard: {
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
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
    height: 150,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  tourInfo: {
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tourTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 4,
  },
  tourDetails: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 20,
    color: '#8B5CF6',
  },
  perPerson: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
  },
});