import React, { useEffect, useState, useCallback } from 'react'; // Import useCallback                                                                                                         
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, RefreshControl } from 'react-native';                                                                                 
import { SafeAreaView } from 'react-native-safe-area-context';                                                                                                                                 
import { useRouter, useFocusEffect } from 'expo-router'; // Import useFocusEffect                                                                                                              
import { Tag, XCircle, CheckCircle, Clock, LogIn } from 'lucide-react-native'; // Added Clock, LogIn                                                                                           
import { useAuth } from '@/hooks/useAuth';                                                                                                                                                     
import { api, UserVoucher, ApiError, ApiResponse } from '@/services/api'; // Import UserVoucher and ApiError, ApiResponse                                                                      
import LoadingView from '@/components/LoadingView'; // Import LoadingView                                                                                                                      
import ErrorView from '@/components/ErrorView'; // Import ErrorView                                                                                                                            
import NotificationBell from '@/components/NotificationBell'; // Import NotificationBell                                                                                                       
import { useApi } from '@/hooks/useApi'; // Import useApi

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
  const [refreshing, setRefreshing] = useState(false);                                                                                                                                         
                                                                                                                                                                                               
  const {                                                                                                                                                                                      
    data: voucherData,                                                                                                                                                                         
    loading,                                                                                                                                                                                   
    error,                                                                                                                                                                                     
    execute: fetchVouchers,                                                                                                                                                                    
  } = useApi<ApiResponse<UserVoucher[]>>(api.vouchers.getUserVouchers);                                                                                                                        
                                                                                                                                                                                               
  const memoizedFetchVouchers = useCallback(() => {                                                                                                                                            
    if (session?.user?.id) {                                                                                                                                                                   
      fetchVouchers(session.user.id);                                                                                                                                                          
    }                                                                                                                                                                                          
  }, [session?.user?.id, fetchVouchers]);                                                                                                                                                      
                                                                                                                                                                                               
  useEffect(() => {                                                                                                                                                                            
    if (isAuthenticated && session?.user?.id) {                                                                                                                                                
      memoizedFetchVouchers();                                                                                                                                                                 
    }                                                                                                                                                                                          
  }, [isAuthenticated, session?.user?.id, memoizedFetchVouchers]);                                                                                                                             
                                                                                                                                                                                               
  useFocusEffect(                                                                                                                                                                              
    useCallback(() => {                                                                                                                                                                        
      if (isAuthenticated && session?.user?.id) {                                                                                                                                              
        console.log('Voucher list focused, refetching...');                                                                                                                                    
        memoizedFetchVouchers();                                                                                                                                                               
      }                                                                                                                                                                                        
      return () => {};                                                                                                                                                                         
    }, [isAuthenticated, session?.user?.id, memoizedFetchVouchers])                                                                                                                            
  );                                                                                                                                                                                           
                                                                                                                                                                                               
  const handleVoucherPress = (voucher: UserVoucher) => {                                                                                                                                       
    console.log('--- handleVoucherPress called ---');                                                                                                                                          
    console.log('Is Authenticated:', isAuthenticated);                                                                                                                                         
    console.log('Voucher Data:', JSON.stringify(voucher, null, 2));                                                                                                                            
                                                                                                                                                                                               
    if (!isAuthenticated) {                                                                                                                                                                    
      console.log('Redirecting to login...');                                                                                                                                                  
      router.push('/login');                                                                                                                                                                   
      return;                                                                                                                                                                                  
    }                                                                                                                                                                                          
                                                                                                                                                                                               
    const targetPath = '/(tabs)/voucher/detail';                                                                                                                                               
    const params = { ...voucher };                                                                                                                                                             
                                                                                                                                                                                               
    try {                                                                                                                                                                                      
      router.push({                                                                                                                                                                            
        pathname: targetPath,                                                                                                                                                                  
        params: params,                                                                                                                                                                        
      });                                                                                                                                                                                      
      console.log('Navigation executed successfully');                                                                                                                                         
    } catch (navError) {                                                                                                                                                                       
      console.error('Error during router.push:', navError);                                                                                                                                    
    }                                                                                                                                                                                          
  };                                                                                                                                                                                           
                                                                                                                                                                                               
  // Handle pull-to-refresh                                                                                                                                                                    
  const onRefresh = useCallback(async () => {                                                                                                                                                  
    if (!isAuthenticated || !session?.user?.id) {                                                                                                                                              
      setRefreshing(false);                                                                                                                                                                    
      return;                                                                                                                                                                                  
    }                                                                                                                                                                                          
    setRefreshing(true);                                                                                                                                                                       
    await memoizedFetchVouchers();                                                                                                                                                             
    setRefreshing(false);                                                                                                                                                                      
  }, [isAuthenticated, session?.user?.id, memoizedFetchVouchers]);                                                                                                                             
                                                                                                                                                                                               
  // Final return which always renders the same parent structure.                                                                                                                              
  return (                                                                                                                                                                                     
    <SafeAreaView style={styles.container}>                                                                                                                                                    
      <View style={styles.header}>                                                                                                                                                             
        <Text style={styles.headerTitle}>My Vouchers</Text>                                                                                                                                    
        <NotificationBell />                                                                                                                                                                   
      </View>                                                                                                                                                                                  
                                                                                                                                                                                               
      {/* Render guest view if not authenticated */}                                                                                                                                           
      {!isAuthenticated && (                                                                                                                                                                   
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
      )}                                                                                                                                                                                       
                                                                                                                                                                                               
      {/* If authenticated, show loading, error, or the vouchers list */}                                                                                                                      
      {isAuthenticated && (                                                                                                                                                                    
        <>                                                                                                                                                                                     
          {loading && (                                                                                                                                                                        
            <View style={styles.flexCenter}>                                                                                                                                                   
              <LoadingView />                                                                                                                                                                  
            </View>                                                                                                                                                                            
          )}                                                                                                                                                                                   
          {error && (                                                                                                                                                                          
            <ErrorView                                                                                                                                                                         
              message={error.message || 'Failed to load vouchers.'}                                                                                                                            
              onRetry={                                                                                                                                                                        
                session?.user?.id ? () => fetchVouchers(session.user.id) : undefined                                                                                                           
              }                                                                                                                                                                                
            />                                                                                                                                                                                 
          )}                                                                                                                                                                                   
          {/* When not loading and no error, show vouchers */}                                                                                                                                 
          {!loading && !error && (                                                                                                                                                             
            <ScrollView                                                                                                                                                                        
              style={styles.content}                                                                                                                                                           
              showsVerticalScrollIndicator={false}                                                                                                                                             
              refreshControl={                                                                                                                                                                 
                // Optionally attach refresh control if desired                                                                                                                                
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />                                                                                                               
              }                                                                                                                                                                                
            >                                                                                                                                                                                  
              {voucherData?.data && voucherData.data.length > 0 ? (                                                                                                                            
                <>                                                                                                                                                                             
                  {voucherData.data.map((voucher) => (                                                                                                                                         
                    <TouchableOpacity                                                                                                                                                          
                      key={voucher.id}                                                                                                                                                         
                      style={[                                                                                                                                                                 
                        styles.voucherCard,                                                                                                                                                    
                        (voucher.status === 'expired' ||                                                                                                                                       
                          voucher.usage_status === 'used') &&                                                                                                                                  
                          styles.disabledVoucherCard,                                                                                                                                          
                      ]}                                                                                                                                                                       
                      onPress={() => handleVoucherPress(voucher)}                                                                                                                              
                      disabled={                                                                                                                                                               
                        voucher.status === 'expired' ||                                                                                                                                        
                        voucher.usage_status === 'used'                                                                                                                                        
                      }                                                                                                                                                                        
                    >                                                                                                                                                                          
                      <View style={styles.voucherInfo}>                                                                                                                                        
                        <View style={styles.titleContainer}>                                                                                                                                   
                          <Text style={styles.voucherTitle}>                                                                                                                                   
                            {voucher.voucher_name}                                                                                                                                             
                          </Text>                                                                                                                                                              
                          {voucher.status === 'expired' && (                                                                                                                                   
                            <XCircle                                                                                                                                                           
                              size={16}                                                                                                                                                        
                              color="#EF4444"                                                                                                                                                  
                              style={styles.statusIcon}                                                                                                                                        
                            />                                                                                                                                                                 
                          )}                                                                                                                                                                   
                          {voucher.status !== 'expired' &&                                                                                                                                     
                            voucher.usage_status === 'used' && (                                                                                                                               
                              <CheckCircle                                                                                                                                                     
                                size={16}                                                                                                                                                      
                                color="#EF4444"                                                                                                                                                
                                style={styles.statusIcon}                                                                                                                                      
                              />                                                                                                                                                               
                            )}
                          {voucher.claim_status === 'claimed' && (                                                                                                                                                   
                            <Tag size={16} color="#10B981" style={styles.statusIcon} />                                                                                                                              
                          )}                                                                                                                                                                                         
                          {/* Display used icon if voucher is used */}                                                                                                                                               
                          {voucher.usage_status === 'used' && (                                                                                                                                                      
                            <CheckCircle size={16} color="#6B7280" style={styles.statusIcon} />                                                                                                                      
                          )}                                                                                                                                                                  
                        </View>                                                                                                                                                                
                        <Text style={styles.voucherDiscount}>                                                                                                                                  
                          {voucher.term_condition}                                                                                                                                             
                        </Text>                                                                                                                                                                
                        <View style={styles.validityContainer}>                                                                                                                                
                          <Clock size={16} color="#6B7280" />                                                                                                                                  
                          <Text style={styles.validityText}>                                                                                                                                   
                            Valid until{' '}                                                                                                                                                   
                            {new Date(voucher.valid_until).toLocaleDateString()}                                                                                                               
                          </Text>                                                                                                                                                              
                        </View>                                                                                                                                                                
                      </View>                                                                                                                                                                  
                    </TouchableOpacity>                                                                                                                                                        
                  ))}                                                                                                                                                                          
                </>                                                                                                                                                                            
              ) : (                                                                                                                                                                            
                <View style={styles.emptyStateContainer}>                                                                                                                                      
                  <Text style={styles.emptyStateText}>                                                                                                                                         
                    No vouchers available.                                                                                                                                                     
                  </Text>                                                                                                                                                                      
                </View>                                                                                                                                                                        
              )}                                                                                                                                                                               
            </ScrollView>                                                                                                                                                                      
          )}                                                                                                                                                                                   
        </>                                                                                                                                                                                    
      )}                                                                                                                                                                                       
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
    // marginBottom: 4,
    marginRight: 8,
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
  // Add these new styles:                                                                                                                                                                     
  titleContainer: {                                                                                                                                                                            
    flexDirection: 'row',                                                                                                                                                                      
    alignItems: 'center',                                                                                                                                                                      
    marginBottom: 4, // Add margin previously on voucherTitle                                                                                                                                  
  },                                                                                                                                                                                       
  statusIconsContainer: {                                                                                                                                                                      
    flexDirection: 'row',                                                                                                                                                                      
    marginLeft: 8, // Provides spacing from the title                                                                                                                                          
  },                                                                                                                                                                                           
  statusIcon: {                                                                                                                                                                                
    // You can add margin here if needed, but marginRight on title works too                                                                                                                   
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
  flexCenter: {                                                                                                                                                                                
    flex: 1,                                                                                                                                                                                   
    justifyContent: 'center',                                                                                                                                                                  
    alignItems: 'center',                                                                                                                                                                      
  },
});
