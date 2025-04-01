import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Clock, LogIn } from 'lucide-react-native';
import { useRouter } from 'expo-router';
// import { useState } from 'react';
import { useEffect } from 'react'; // Added useEffect 
import NotificationBell from '@/components/NotificationBell';
// import PopUpModal from '@/components/PopUpModal';
import { useAuth } from '@/hooks/useAuth';
import { useApi } from '@/hooks/useApi'; // Import useApi
// Import UserVoucher, UserVouchersResponse is no longer needed
import { api, UserVoucher } from '@/services/api';
import LoadingView from '@/components/LoadingView'; // Assuming you have this
import ErrorView from '@/components/ErrorView'; // Assuming you have this

// const voucherList = [
//   {
//     id: 1,
//     title: 'Summer Sale',
//     discount: '20% off on selected tours',
//     validUntil: 'Aug 31, 2024',
//     isCollected: false,
//     code: 'SUMMER2024',
//   },
//   {
//     id: 2,
//     title: 'Early Bird Discount',
//     discount: '15% off on advance bookings',
//     validUntil: 'Jul 15, 2024',
//     isCollected: true,
//     code: 'EARLY2024',
//   },
//   {
//     id: 3,
//     title: 'Weekend Special',
//     discount: '10% off on weekend tours',
//     validUntil: 'Sep 30, 2024',
//     isCollected: false,
//     code: 'WEEKEND2024',
//   },
//   {
//     id: 4,
//     title: 'First Time User',
//     discount: '25% off on your first booking',
//     validUntil: 'Valid for 30 days',
//     isCollected: false,
//     code: 'FIRST2024',
//   },
// ];

export default function VouchersScreen() {
  const router = useRouter();
  const { session, isGuest } = useAuth();
  const isAuthenticated = !!session?.user && !isGuest;
  // const [vouchers, setVouchers] = useState(voucherList);
  // const [showVoucherModal, setShowVoucherModal] = useState(false);
  // const [selectedVoucherCode, setSelectedVoucherCode] = useState('');

  // Use the useApi hook to fetch vouchers                                                                                                                                                     
  const {                                                                                                                                                                                      
    data: voucherData, // Rename data to avoid conflict                                                                                                                                        
    loading,                                                                                                                                                                                   
    error,
    execute: fetchVouchers
  } = useApi<UserVoucher[]>(api.vouchers.getUserVouchers); // Expect an array of UserVoucher

  // const handleVoucherPress = (id: number) => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //     return;
  //   }
  //   router.push(`/home/voucher?id=${id}`);
  // };

  // Fetch vouchers when the user is authenticated and the component mounts                                                                                                                    
  useEffect(() => {                                                                                                                                                                            
    if (isAuthenticated && session?.user?.id) {                                                                                                                                                
      fetchVouchers(session.user.id);                                                                                                                                                          
    }                                                                                                                                                                                          
  }, [isAuthenticated, session?.user?.id, fetchVouchers]); // Add dependencies                                                                                                                 
                                                                                                                                                                                               
  const handleVoucherPress = (voucher: UserVoucher) => { // Pass the whole voucher object                                                                                                      
    if (!isAuthenticated) {                                                                                                                                                                    
      router.push('/login');                                                                                                                                                                   
      return;                                                                                                                                                                                  
    }                                                                                                                                                                                          
    // Navigate to a detail screen if you have one, passing necessary info                                                                                                                     
    // Example: router.push(`/home/voucherDetail?id=${voucher.id}&code=${voucher.code}`);                                                                                                      
    // For now, let's just log it, as the original navigation seemed incomplete                                                                                                                
    console.log('Voucher pressed:', voucher);                                                                                                                                                  
    // router.push(`/home/voucher?id=${voucher.id}`); // Original navigation might need adjustment                                                                                             
  };   

  // const handleCollect = (id: number, code: string, e: any) => {
  //   if (!isAuthenticated) {
  //     router.push('/login');
  //     return;
  //   }
  //   e.stopPropagation();
  //   setSelectedVoucherCode(code);
  //   setShowVoucherModal(true);
  // };

  // const handleDownload = () => {
  //   setShowVoucherModal(false);
  //   setVouchers(vouchers.map(voucher => 
  //     voucher.code === selectedVoucherCode ? { ...voucher, isCollected: true } : voucher
  //   ));
  // };

  if (!isAuthenticated) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Vouchers</Text>
          <NotificationBell />
        </View>
        <View style={styles.guestContainer}>
          <LogIn size={48} color="#8B5CF6" />
          <Text style={styles.guestTitle}>Login Required</Text>
          <Text style={styles.guestMessage}>
            Please login to view and collect vouchers
          </Text>
          <TouchableOpacity 
            style={styles.loginButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.loginButtonText}>Login Now</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // --- Loading State ---                                                                                                                                                                     
  if (loading) {                                                                                                                                                                               
      return (                                                                                                                                                                                  
        <SafeAreaView style={styles.container}>                                                                                                                                                 
          <View style={styles.header}>                                                                                                                                                          
            <Text style={styles.headerTitle}>My Vouchers</Text>                                                                                                                                 
            <NotificationBell />                                                                                                                                                                
          </View>                                                                                                                                                                               
          <LoadingView />                                                                                                                                                                       
        </SafeAreaView>                                                                                                                                                                         
      );                                                                                                                                                                                        
  } 
  // --- Error State ---                                                                                                                                                                       
  if (error) {                                                                                                                                                                                 
    return (                                                                                                                                                                                   
      <SafeAreaView style={styles.container}>                                                                                                                                                  
        <View style={styles.header}>                                                                                                                                                           
          <Text style={styles.headerTitle}>My Vouchers</Text>                                                                                                                                  
          <NotificationBell />                                                                                                                                                                 
        </View>                                                                                                                                                                                
        <ErrorView                                                                                                                                                                             
          message={error.message || 'Failed to load vouchers.'}                                                                                                                                
          // Provide a retry function if ErrorView supports it                                                                                                                                 
          onRetry={session?.user?.id ? () => fetchVouchers(session.user.id) : undefined}                                                                                                       
        />                                                                                                                                                                                     
      </SafeAreaView>                                                                                                                                                                          
    );                                                                                                                                                                                         
  }  

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Vouchers</Text>
        <NotificationBell />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Use voucherData directly as it's the array */}
        {voucherData && voucherData.length > 0 ? (
          voucherData.map((voucher) => (
            <TouchableOpacity
              key={voucher.id} // Use ID from API data
              // Add opacity style if voucher is expired or used
              style={[
                styles.voucherCard,
                (voucher.status === 'expired' || voucher.usage_status === 'used') && styles.disabledVoucherCard,
              ]}
              onPress={() => handleVoucherPress(voucher)} // Pass the voucher object
              // Disable press if expired or used
              disabled={voucher.status === 'expired' || voucher.usage_status === 'used'}
            >
              <View style={styles.voucherInfo}>
                {/* Use new field names */}
                <Text style={styles.voucherTitle}>{voucher.voucher_name}</Text>
                <Text style={styles.voucherDiscount}>{voucher.term_condition}</Text>
                <View style={styles.validityContainer}>
                  <Clock size={16} color="#6B7280" />
                  {/* Use valid_until from API data and format it */}
                  <Text style={styles.validityText}>Valid until {new Date(voucher.valid_until).toLocaleDateString()}</Text>
                </View>
              </View>
              {/*
                The "Collect" button logic needs rethinking with an API.
                It would require:                                                                                                                                                              
                1. An API endpoint to mark a voucher as collected for a user.                                                                                                                  
                2. A separate useApi call or mutation function to call that endpoint.                                                                                                          
                3. Updating the UI after the API call succeeds (refetching or updating local cache).                                                                                           
                For now, it's commented out.                                                                                                                                                   
              */}                                                                                                                                                                              
              {/* <TouchableOpacity                                                                                                                                                            
                style={[                                                                                                                                                                       
                  styles.collectButton,                                                                                                                                                        
                  // Use is_collected from API data if available                                                                                                                               
                  voucher.is_collected && styles.collectedButton,                                                                                                                              
                ]}                                                                                                                                                                             
                // onPress={(e) => handleCollect(voucher.id, voucher.code, e)}                                                                                                                 
                // disabled={voucher.is_collected}                                                                                                                                             
              >                                                                                                                                                                                
                <Text style={[                                                                                                                                                                 
                  styles.collectButtonText,                                                                                                                                                    
                  // Use is_collected from API data if available                                                                                                                               
                  voucher.is_collected && styles.collectedButtonText,                                                                                                                          
                ]}>                                                                                                                                                                            
                  {voucher.is_collected ? 'Collected' : 'Collect'}                                                                                                                             
                </Text>                                                                                                                                                                        
              </TouchableOpacity> */}                                                                                                                                                          
            </TouchableOpacity>                                                                                                                                                                
          ))
        ) : (
          // Show empty state if array is empty or null/undefined
          <View style={styles.emptyStateContainer}>
             <Text style={styles.emptyStateText}>No vouchers available.</Text>
          </View>
        )}
      </ScrollView>

      {/* <PopUpModal
        visible={showVoucherModal}
        onClose={() => setShowVoucherModal(false)}
        voucherCode={selectedVoucherCode}
        onDownload={handleDownload}
      /> */}
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
  content: {
    flex: 1,
    padding: 16,
  },
  guestContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  guestTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 20,
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 8,
  },
  guestMessage: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  loginButton: {
    backgroundColor: '#8B5CF6',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  loginButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#FFFFFF',
  },
  voucherCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  voucherInfo: {
    flex: 1,
    marginRight: 12,
  },
  voucherTitle: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#8B5CF6',
    marginBottom: 4,
  },
  voucherDiscount: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#4B5563',
    marginBottom: 8,
  },
  validityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  validityText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: '#6B7280',
    marginLeft: 4,
  },
  collectButton: {
    backgroundColor: '#8B5CF6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    minWidth: 80,
    alignItems: 'center',
  },
  collectedButton: {
    backgroundColor: '#E5E7EB',
  },
  collectButtonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: '#FFFFFF',
  },
  collectedButtonText: {
    color: '#6B7280',
  },
  // --- Empty State Styles ---                                                                                                                                                                
  emptyStateContainer: {                                                                                                                                                                       
    flex: 1,                                                                                                                                                                                   
    justifyContent: 'center',                                                                                                                                                                  
    alignItems: 'center',                                                                                                                                                                      
    paddingVertical: 50, // Add some padding                                                                                                                                                   
  },                                                                                                                                                                                           
  emptyStateText: {                                                                                                                                                                            
    fontFamily: 'Inter-Regular',                                                                                                                                                               
    fontSize: 16,
    color: '#6B7280',
  },
  // Style for disabled/expired/used vouchers
  disabledVoucherCard: {
    opacity: 0.6,
    backgroundColor: '#F3F4F6', // Lighter background
  },
});
