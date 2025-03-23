import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock, Users } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationBell from '@/components/NotificationBell';
import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import ErrorView from '@/components/ErrorView';

const API_BASE_URL = 'https://api.review.tugo.com.vn';

export default function TourScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  
  const { 
    data: tourData, 
    error, 
    loading,
    execute: fetchTourDetail
  } = useApi(() => api.tours.getDetail(Number(id)));

  useEffect(() => {
    if (id) {
      fetchTourDetail();
    }
  }, [id]);

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/home');
    }
  };

  const handleBookNow = () => {
    if (!tourData?.data) return;
    
    router.push({
      pathname: '/home/booking',
      params: { 
        tourId: tourData.data.id,
        tourName: tourData.data.name 
      }
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <ArrowLeft size={24} color="#8B5CF6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Loading...</Text>
          <NotificationBell count={3} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error || !tourData?.data) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
            <ArrowLeft size={24} color="#8B5CF6" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Error</Text>
          <NotificationBell count={3} />
        </View>
        <ErrorView 
          message={error?.message || 'Tour not found'} 
          onRetry={fetchTourDetail}
        />
      </SafeAreaView>
    );
  }

  const tour = tourData.data;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{tour.name}</Text>
        <NotificationBell count={3} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.heroContainer}>
          <Image 
            source={{ uri: `${API_BASE_URL}${tour.image}` }} 
            style={styles.heroImage} 
          />
        </View>

        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{tour.name}</Text>
          
          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <MapPin size={20} color="#6B7280" />
              <Text style={styles.infoText}>{tour.type}</Text>
            </View>
            <View style={styles.infoItem}>
              <Clock size={20} color="#6B7280" />
              <Text style={styles.infoText}>{tour.duration}</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Highlights</Text>
            {tour.highlights.map((highlight, index) => (
              <View key={index} style={styles.highlightItem}>
                <Text style={styles.highlightTitle}>{highlight.title}</Text>
                <Text style={styles.highlightDescription}>
                  {highlight.description}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Itinerary</Text>
            {tour.itinerary.map((item, index) => (
              <View key={index} style={styles.itineraryItem}>
                <Text style={styles.itineraryDay}>Day {item.day}</Text>
                <Text style={styles.itineraryTitle}>{item.title}</Text>
                <Text style={styles.itineraryDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>What's Included</Text>
            {tour.whats_included.map((item, index) => (
              <View key={index} style={styles.includedItem}>
                <Text style={styles.includedTitle}>{item.title}</Text>
                <Text style={styles.includedDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Photo Gallery</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.galleryContainer}
            >
              {tour.photo_gallery.map((photo, index) => (
                <View key={index} style={styles.galleryItem}>
                  <Image 
                    source={{ uri: `${API_BASE_URL}${photo.image}` }}
                    style={styles.galleryImage}
                  />
                  <Text style={styles.galleryName}>{photo.name}</Text>
                </View>
              ))}
            </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
    gap: 24,
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
    fontSize: 20,
    color: '#1F2937',
    marginBottom: 16,
  },
  highlightItem: {
    marginBottom: 16,
  },
  highlightTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  highlightDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  itineraryItem: {
    marginBottom: 16,
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
  },
  itineraryDay: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#8B5CF6',
    marginBottom: 4,
  },
  itineraryTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 8,
  },
  itineraryDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  includedItem: {
    marginBottom: 16,
  },
  includedTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  includedDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  galleryContainer: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  galleryItem: {
    marginRight: 16,
    alignItems: 'center',
  },
  galleryImage: {
    width: 200,
    height: 150,
    borderRadius: 8,
    marginBottom: 8,
  },
  galleryName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
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
});