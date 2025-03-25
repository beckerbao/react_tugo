import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import NotificationBell from '@/components/NotificationBell';
import { styles } from '@/styles/destination';
import { formatPrice } from '@/utils/format';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import { useEffect } from 'react';
import ErrorView from '@/components/ErrorView';

const API_BASE_URL = 'https://api.review.tugo.com.vn';

export default function DestinationScreen() {
  const { destination_id } = useLocalSearchParams();
  const router = useRouter();
  
  const { 
    data: destinationData, 
    error, 
    loading,
    execute: fetchDestination
  } = useApi(() => api.destination.getTours(destination_id));

  useEffect(() => {
    if (destination_id) {
      fetchDestination();
    }
  }, [destination_id]);

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

  if (error || !destinationData?.data) {
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
          message={error?.message || 'Destination not found'} 
          onRetry={fetchDestination}
        />
      </SafeAreaView>
    );
  }

  const destination = destinationData.data;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{destination.destination_name}</Text>
        <NotificationBell count={3} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Image 
          source={{ uri: `${API_BASE_URL}${destination.destination_image}` }} 
          style={styles.heroImage} 
        />
        
        <View style={styles.toursContainer}>
          {destination.tours.map((tour) => (
            <TouchableOpacity
              key={tour.tour_id}
              style={styles.tourCard}
              onPress={() => handleTourPress(tour.tour_id)}
            >
              <Image 
                source={{ uri: `${API_BASE_URL}${tour.image}` }} 
                style={styles.tourImage} 
              />
              <View style={styles.tourInfo}>
                <View>
                  <Text style={styles.tourTitle}>{tour.name}</Text>
                  <Text style={styles.tourDetails}>
                    {tour.duration}
                  </Text>
                </View>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>{formatPrice(tour.price)} đ</Text>
                  <Text style={styles.perPerson}></Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}