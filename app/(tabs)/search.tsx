import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search as SearchIcon, MapPin, SearchX } from 'lucide-react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import NotificationBell from '@/components/NotificationBell';

const allDestinations = [
  {
    id: 1,
    name: 'Paris, France',
    description: 'Most visited city in Europe',
    type: 'destination',
    slug: 'paris',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=500',
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    description: 'Modern meets traditional',
    type: 'destination',
    slug: 'tokyo',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=500',
  },
  {
    id: 3,
    name: 'New York, USA',
    description: 'The city that never sleeps',
    type: 'destination',
    slug: 'new-york',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=500',
  },
  {
    id: 4,
    name: 'Dubai, UAE',
    description: 'Luxury and modern wonders',
    type: 'destination',
    slug: 'dubai',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=500',
  },
  {
    id: 5,
    name: 'Bali, Indonesia',
    description: 'Tropical paradise',
    type: 'destination',
    slug: 'bali',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=500',
  },
  {
    id: 6,
    name: 'Santorini, Greece',
    description: 'Stunning sunsets and views',
    type: 'destination',
    slug: 'santorini',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=500',
  },
];

export default function SearchScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(q as string || '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (q) {
      setSearchQuery(q as string);
      setIsSearching(true);
    }
  }, [q]);

  const filteredDestinations = searchQuery
    ? allDestinations.filter(destination =>
        destination.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        destination.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : allDestinations;

  const handleDestinationPress = (destination: typeof allDestinations[0]) => {
    if (destination.type === 'destination') {
      router.push(`/home/destination?destination=${destination.slug}`);
    }
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setIsSearching(text.length > 0);
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
        {isSearching && filteredDestinations.length === 0 ? (
          renderNoResults()
        ) : (
          <View style={styles.destinationsGrid}>
            {filteredDestinations.map((destination) => (
              <TouchableOpacity
                key={destination.id}
                style={styles.destinationCard}
                onPress={() => handleDestinationPress(destination)}
              >
                <Image 
                  source={{ uri: destination.image }}
                  style={styles.destinationImage}
                />
                <View style={styles.destinationContent}>
                  <View style={styles.iconContainer}>
                    <MapPin size={20} color="#8B5CF6" />
                  </View>
                  <View style={styles.destinationInfo}>
                    <Text style={styles.destinationName}>{destination.name}</Text>
                    <Text style={styles.destinationDescription}>
                      {destination.description}
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
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  destinationsGrid: {
    padding: 16,
  },
  destinationCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  destinationImage: {
    width: '100%',
    height: 150,
    resizeMode: 'cover',
  },
  destinationContent: {
    flexDirection: 'row',
    padding: 16,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3E8FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  destinationInfo: {
    flex: 1,
  },
  destinationName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  destinationDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  noResultsContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    marginTop: 40,
  },
  noResultsTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsDescription: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
  },
});