import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Search as SearchIcon, MapPin } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import NotificationBell from '@/components/NotificationBell';

const popularDestinations = [
  {
    id: 1,
    name: 'Paris, France',
    description: 'Most visited city in Europe',
    type: 'destination',
    slug: 'paris',
  },
  {
    id: 2,
    name: 'Tokyo, Japan',
    description: 'Modern meets traditional',
    type: 'destination',
    slug: 'tokyo',
  },
  {
    id: 3,
    name: 'New York, USA',
    description: 'The city that never sleeps',
    type: 'destination',
    slug: 'new-york',
  },
  {
    id: 4,
    name: 'Dubai, UAE',
    description: 'Luxury and modern wonders',
    type: 'destination',
    slug: 'dubai',
  },
];

export default function SearchScreen() {
  const router = useRouter();

  const handleDestinationPress = (destination: typeof popularDestinations[0]) => {
    if (destination.type === 'destination') {
      router.push(`/home/destination?destination=${destination.slug}`);
    }
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
        />
      </View>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.destinationsGrid}>
          {popularDestinations.map((destination) => (
            <TouchableOpacity
              key={destination.id}
              style={styles.destinationCard}
              onPress={() => handleDestinationPress(destination)}
            >
              <View style={styles.iconContainer}>
                <MapPin size={24} color="#8B5CF6" />
              </View>
              <View style={styles.destinationInfo}>
                <Text style={styles.destinationName}>{destination.name}</Text>
                <Text style={styles.destinationDescription}>
                  {destination.description}
                </Text>
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
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
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
});