import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationBell from '@/components/NotificationBell';

const tourData = {
  1: {
    id: 1,
    title: 'Maldives Luxury Resort',
    image: 'https://images.unsplash.com/photo-1573843981267-be1999ff37cd?w=500',
    price: 1299,
    days: 7,
    type: 'All inclusive',
    rating: 4.9,
    reviews: 128,
    location: 'Maldives',
    description: 'Experience luxury at its finest in this all-inclusive Maldives resort. Enjoy pristine beaches, crystal-clear waters, and world-class amenities.',
    highlights: [
      'Private beach access',
      'Underwater restaurant',
      'Spa treatments',
      'Water sports activities',
      'Sunset cruise',
    ],
    groupSize: '2-8 people',
  },
  2: {
    id: 2,
    title: 'Swiss Alps Adventure',
    image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=500',
    price: 899,
    days: 5,
    type: 'Guided tour',
    rating: 4.8,
    reviews: 96,
    location: 'Switzerland',
    description: 'Embark on an unforgettable journey through the Swiss Alps. Experience breathtaking views, hiking trails, and authentic Alpine culture.',
    highlights: [
      'Mountain hiking',
      'Cable car rides',
      'Swiss chocolate tasting',
      'Local cuisine experience',
      'Photography spots',
    ],
    groupSize: '4-12 people',
  },
};

export default function TourScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const tour = tourData[Number(id)];

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleBookNow = () => {
    router.push({
      pathname: '/home/booking',
      params: { tourName: tour.title }
    });
  };

  if (!tour) {
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
          <Text style={styles.errorText}>This tour does not exist.</Text>
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
        <Text style={styles.headerTitle}>{tour.title}</Text>
        <NotificationBell count={3} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image source={{ uri: tour.image }} style={styles.heroImage} />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{tour.title}</Text>
          
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {tour.rating}</Text>
            <Text style={styles.reviews}>({tour.reviews} reviews)</Text>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.infoText}>{tour.location}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={20} color="#6B7280" />
              <Text style={styles.infoText}>{tour.days} days</Text>
            </View>
            <View style={styles.infoItem}>
              <Users size={20} color="#6B7280" />
              <Text style={styles.infoText}>{tour.groupSize}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{tour.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {tour.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <View style={styles.bulletPoint} />
                <Text style={styles.highlightText}>{highlight}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Price per person</Text>
          <Text style={styles.price}>${tour.price}</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Book Now</Text>
        </TouchableOpacity>
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  content: {
    flex: 1,
  },
  heroContainer: {
    position: 'relative',
    height: 300,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  detailsContainer: {
    padding: 16,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#1F2937',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  rating: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginRight: 4,
  },
  reviews: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 12,
  },
  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    lineHeight: 24,
  },
  highlightItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#8B5CF6',
    marginRight: 12,
  },
  highlightText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceContainer: {
    flex: 1,
    marginRight: 16,
  },
  priceLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  price: {
    fontFamily: 'Inter-Bold',
    fontSize: 24,
    color: '#8B5CF6',
  },
  bookButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  bookButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  errorText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 16,
  },
});