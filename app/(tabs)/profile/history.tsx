import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const travelHistory = [
  {
    id: 1,
    tourName: 'Bali Adventure Package',
    days: '5 Days',
    date: '2024-02-15',
    status: 'Confirmed',
    customer: {
      name: 'John Doe',
      phone: '+1 234-567-8900'
    }
  },
  {
    id: 2,
    tourName: 'Tokyo City Tour',
    days: '3 Days',
    date: '2024-01-20',
    status: 'Completed',
    customer: {
      name: 'John Doe',
      phone: '+1 234-567-8900'
    }
  },
  {
    id: 3,
    tourName: 'Paris Experience',
    days: '7 Days',
    date: '2023-12-10',
    status: 'Completed',
    customer: {
      name: 'John Doe',
      phone: '+1 234-567-8900'
    }
  }
];

export default function TravelHistoryScreen() {
  const router = useRouter();

  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return styles.statusConfirmed;
      case 'completed':
        return styles.statusCompleted;
      default:
        return styles.statusDefault;
    }
  };

  const getStatusTextStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case 'confirmed':
        return styles.statusConfirmedText;
      case 'completed':
        return styles.statusCompletedText;
      default:
        return styles.statusDefaultText;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <ArrowLeft size={24} color="#8B5CF6" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Travel History</Text>
        <View style={styles.headerButton} />
      </View>

      <ScrollView style={styles.content}>
        {travelHistory.map((trip) => (
          <View key={trip.id} style={styles.tripCard}>
            <View style={styles.tripHeader}>
              <View>
                <Text style={styles.tripName}>{trip.tourName}</Text>
                <Text style={styles.tripDays}>{trip.days}</Text>
              </View>
              <Text style={styles.tripDate}>{trip.date}</Text>
            </View>

            <View style={styles.tripDetails}>
              <View style={styles.customerInfo}>
                <Text style={styles.customerName}>{trip.customer.name}</Text>
                <Text style={styles.customerPhone}>{trip.customer.phone}</Text>
              </View>
              <View style={getStatusStyle(trip.status)}>
                <Text style={getStatusTextStyle(trip.status)}>{trip.status}</Text>
              </View>
            </View>
          </View>
        ))}
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
  },
  content: {
    flex: 1,
    padding: 16,
  },
  tripCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
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
  tripHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tripName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 4,
  },
  tripDays: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  tripDate: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  tripDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  customerInfo: {
    flex: 1,
  },
  customerName: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#1F2937',
    marginBottom: 2,
  },
  customerPhone: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  statusConfirmed: {
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusConfirmedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#059669',
  },
  statusCompleted: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusCompletedText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#4B5563',
  },
  statusDefault: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusDefaultText: {
    fontFamily: 'Inter-Medium',
    fontSize: 12,
    color: '#6B7280',
  },
});