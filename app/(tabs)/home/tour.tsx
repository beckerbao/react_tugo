import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Clock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationBell from '@/components/NotificationBell';
import { useEffect } from 'react';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import ErrorView from '@/components/ErrorView';
import { formatPrice } from '@/utils/format';
import { styles } from '@/styles/tour';

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

  // Create pairs of photos for the grid
  const photoPairs = [];
  for (let i = 0; i < tour.photo_gallery.length; i += 2) {
    photoPairs.push(tour.photo_gallery.slice(i, i + 2));
  }

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
            source={{ uri: `${tour.image}` }} 
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
            <Text style={styles.sectionTitle}>Điểm nổi bật</Text>
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
            <Text style={styles.sectionTitle}>Chương trình</Text>
            {tour.itinerary.map((item, index) => (
              <View key={index} style={styles.itineraryItem}>
                <Text style={styles.itineraryDay}>{item.day}</Text>
                <Text style={styles.itineraryTitle}>{item.title}</Text>
                <Text style={styles.itineraryDescription}>
                  {item.description}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Đã bao gồm</Text>
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
            <Text style={styles.sectionTitle}>Hình ảnh</Text>
            <View style={styles.galleryGrid}>
              {photoPairs.map((pair, rowIndex) => (
                <View key={rowIndex} style={styles.galleryRow}>
                  {pair.map((photo, colIndex) => (
                    <View key={colIndex} style={styles.galleryItem}>
                      <Image
                        source={{ uri: `${photo.image}` }}
                        style={styles.galleryImage}
                      />
                      {/* <Text style={styles.galleryName}>{photo.name}</Text> */}
                    </View>
                  ))}
                  {pair.length === 1 && <View style={styles.galleryItem} />}
                </View>
              ))}
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.priceContainer}>
          <Text style={styles.priceLabel}>Giá 1 khách</Text>
          <Text style={styles.price}>{formatPrice(tour.price)} đ</Text>
        </View>
        <TouchableOpacity style={styles.bookButton} onPress={handleBookNow}>
          <Text style={styles.bookButtonText}>Đặt lịch</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}