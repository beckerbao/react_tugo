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
import { styles } from '@/styles/voucherindex';

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
