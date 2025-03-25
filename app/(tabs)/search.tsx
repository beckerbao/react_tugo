import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, MapPin, SearchX } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NotificationBell from '@/components/NotificationBell';
import { api } from '@/services/api';
import { useApi } from '@/hooks/useApi';
import ErrorView from '@/components/ErrorView';
import { styles } from '@/styles/search';

const API_BASE_URL = 'https://api.review.tugo.com.vn';

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(q as string || '');
  const [isSearching, setIsSearching] = useState(false);
  const { data: searchData, error, loading, execute: executeSearch } = useApi(api.search.destinations);

  useEffect(() => {
    // Call API without parameters on initial load
    executeSearch('');

    if (q) {
      setSearchQuery(q as string);
      setIsSearching(true);
      executeSearch(q as string);
    }
  }, [q]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(text.length > 0);
    executeSearch(text);
  };

  const handleDestinationPress = (destinationId: number) => {
    router.push(`/home/destination?destination_id=${destinationId}`);
  };

  const renderNoResults = () => (
    <View style={styles.noResultsContainer}>
      <SearchX size={64} color="#9CA3AF" />
      <Text style={styles.noResultsTitle}>No Results Found</Text>
      <Text style={styles.noResultsDescription}>
        We couldn't find any destinations matching "{searchQuery}"
      </Text>
    </View>
  );

  const getImageUrl = (imagePath: string) => {
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    return `${API_BASE_URL}${imagePath}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search</Text>
        <NotificationBell count={3} />
      </View>

      <View style={styles.searchContainer}>
        <SearchIcon size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search destinations, tours..."
          style={styles.searchInput}
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={handleSearch}
          autoCapitalize="none"
          returnKeyType="search"
          autoFocus={!!q}
        />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#8B5CF6" />
          </View>
        ) : error ? (
          <ErrorView message={error.message} onRetry={() => executeSearch(searchQuery)} />
        ) : isSearching && (!searchData?.data || searchData.data.length === 0) ? (
          renderNoResults()
        ) : (
          <View style={styles.destinationsGrid}>
            {searchData?.data.map((destination) => (
              <TouchableOpacity
                key={destination.destination_id}
                style={styles.destinationCard}
                onPress={() => handleDestinationPress(destination.destination_id)}
              >
                <Image 
                  source={{ uri: getImageUrl(destination.image) }}
                  style={styles.destinationImage}
                />
                <View style={styles.destinationContent}>
                  <View style={styles.iconContainer}>
                    <MapPin size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationName}>{destination.name}</Text>
                    <Text style={styles.destinationDescription}>
                      {destination.subtitle}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}