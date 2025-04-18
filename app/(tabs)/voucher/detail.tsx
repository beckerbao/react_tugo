import React, { useState } from 'react';                                                                                                                                                       
import {                                                                                                                                                                                       
  View,                                                                                                                                                                                        
  Text,                                                                                                                                                                                        
  StyleSheet,                                                                                                                                                                                  
  ScrollView,                                                                                                                                                                                  
  TouchableOpacity,                                                                                                                                                                            
  Platform,                                                                                                                                                                                    
  Alert,                                                                                                                                                                                       
  ActivityIndicator,                                                                                                                                                                           
} from 'react-native';                                                                                                                                                                         
import { SafeAreaView } from 'react-native-safe-area-context';                                                                                                                                 
import { useRouter, useLocalSearchParams } from 'expo-router';                                                                                                                                 
import {                                                                                                                                                                                       
  ArrowLeft,                                                                                                                                                                                   
  Clock,                                                                                                                                                                                       
  Tag,                                                                                                                                                                                         
  Info,                                                                                                                                                                                        
  XCircle,                                                                                                                                                                                     
  CheckCircle,                                                                                                                                                                                 
  Clipboard,                                                                                                                                                                                   
} from 'lucide-react-native';                                                                                                                                                                  
import { UserVoucher, api, ApiError } from '@/services/api';                                                                                                                                   
import { useAuth } from '@/hooks/useAuth';   
import { styles } from '@/styles/voucherdetail';                                                                                                                                                  
                                                                                                                                                                                               
export default function VoucherDetailScreen() {                                                                                                                                                
  const router = useRouter();                                                                                                                                                                  
  const params = useLocalSearchParams();                                                                                                                                                       
  const { session } = useAuth();                                                                                                                                                               
                                                                                                                                                                                               
  // State for claim action                                                                                                                                                                    
  const [isClaiming, setIsClaiming] = useState(false);                                                                                                                                         
  const [claimError, setClaimError] = useState<string | null>(null);                                                                                                                           
  // Local state to track claim status after successful claim                                                                                                                                  
  const [localClaimStatus, setLocalClaimStatus] = useState<                                                                                                                                    
    'claimed' | 'not_claimed' | null                                                                                                                                                           
  >(null);                                                                                                                                                                                     
                                                                                                                                                                                               
  // Reconstruct the voucher object from params                                                                                                                                                
  const initialVoucher = params as unknown as UserVoucher;                                                                                                                                     
  const voucher = {                                                                                                                                                                            
    ...initialVoucher,                                                                                                                                                                         
    claim_status: localClaimStatus ?? initialVoucher.claim_status,                                                                                                                             
    id: Number(initialVoucher?.id ?? 0),                                                                                                                                                       
  };                                                                                                                                                                                           
                                                                                                                                                                                               
  // If essential data is missing, show an error screen                                                                                                                                        
  if (                                                                                                                                                                                         
    !voucher ||                                                                                                                                                                                
    !voucher.id ||                                                                                                                                                                             
    isNaN(voucher.id) ||                                                                                                                                                                       
    voucher.id === 0 ||                                                                                                                                                                        
    !voucher.voucher_name                                                                                                                                                                      
  ) {                                                                                                                                                                                          
    return (                                                                                                                                                                                   
      <SafeAreaView style={styles.container}>                                                                                                                                                  
        <View style={styles.header}>                                                                                                                                                           
          <TouchableOpacity                                                                                                                                                                    
            onPress={() => router.back()}                                                                                                                                                      
            style={styles.headerButton}                                                                                                                                                        
          >                                                                                                                                                                                    
            <ArrowLeft size={24} color="#8B5CF6" />                                                                                                                                            
          </TouchableOpacity>                                                                                                                                                                  
          <Text style={styles.headerTitle}>Error</Text>                                                                                                                                        
          <View style={styles.headerButton} />                                                                                                                                                 
        </View>                                                                                                                                                                                
        <View style={styles.errorContainer}>                                                                                                                                                   
          <Text style={styles.errorText}>Could not load voucher details.</Text>                                                                                                                
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>                                                                                                           
            <Text style={styles.backButtonText}>Go Back</Text>                                                                                                                                 
          </TouchableOpacity>                                                                                                                                                                  
        </View>                                                                                                                                                                                
      </SafeAreaView>                                                                                                                                                                          
    );                                                                                                                                                                                         
  }                                                                                                                                                                                            
                                                                                                                                                                                               
  // Helper: Get status text and color                                                                                                                                                         
  const getStatusTextAndColor = () => {                                                                                                                                                        
    if (voucher.status === 'expired') {                                                                                                                                                        
      return { text: 'Expired', color: '#EF4444' };                                                                                                                                            
    }                                                                                                                                                                                          
    if (voucher.usage_status === 'used') {                                                                                                                                                     
      return { text: 'Used', color: '#6B7280' };                                                                                                                                               
    }                                                                                                                                                                                          
    if (voucher.status === 'active') {                                                                                                                                                         
      return { text: 'Active', color: '#10B981' };                                                                                                                                             
    }                                                                                                                                                                                          
    return { text: voucher.status, color: '#6B7280' };                                                                                                                                         
  };                                                                                                                                                                                           
                                                                                                                                                                                               
  const statusInfo = getStatusTextAndColor();                                                                                                                                                  
                                                                                                                                                                                               
  const handleClaimPress = async () => {                                                                                                                                                       
    if (!session?.user) {                                                                                                                                                                      
      Alert.alert('Error', 'You need to be logged in to claim a voucher.');                                                                                                                    
      return;                                                                                                                                                                                  
    }                                                                                                                                                                                          
                                                                                                                                                                                               
    if (!voucher?.id || isNaN(voucher.id) || voucher.id === 0) {                                                                                                                               
      Alert.alert('Error', 'Voucher ID is missing or invalid.');                                                                                                                               
      return;                                                                                                                                                                                  
    }                                                                                                                                                                                          
                                                                                                                                                                                               
    setIsClaiming(true);                                                                                                                                                                       
    setClaimError(null);                                                                                                                                                                       
                                                                                                                                                                                               
    try {                                                                                                                                                                                      
      console.log('User ID when clicking claim:', session.user.id);                                                                                                                            
      await api.vouchers.claimVoucher(session.user.id, voucher.id);                                                                                                                            
      Alert.alert(                                                                                                                                                                             
        'Success',                                                                                                                                                                             
        `Voucher ${voucher.code} claimed successfully!`                                                                                                                                        
      );                                                                                                                                                                                       
      setLocalClaimStatus('claimed');                                                                                                                                                          
    } catch (error) {                                                                                                                                                                          
      console.error('Claim Voucher Error:', error);                                                                                                                                            
      let errorMessage = 'Failed to claim voucher. Please try again.';                                                                                                                         
      if (error instanceof ApiError) {                                                                                                                                                         
        errorMessage = error.message;                                                                                                                                                          
      } else if (error instanceof Error) {                                                                                                                                                     
        errorMessage = error.message;                                                                                                                                                          
      }                                                                                                                                                                                        
      setClaimError(errorMessage);                                                                                                                                                             
      Alert.alert('Claim Failed', errorMessage);                                                                                                                                               
    } finally {                                                                                                                                                                                
      setIsClaiming(false);                                                                                                                                                                    
    }                                                                                                                                                                                          
  };
  
  const [isUsing, setIsUsing] = useState(false);                                                                                                                                                 
  const [isUsed, setIsUsed] = useState(false);
                                                                                                                                                                                               
  const handleUsePress = async () => {                                                                                                                                                               
    if (!session?.user) {                                                                                                                                                                        
        Alert.alert('Error', 'You need to be logged in to use a voucher.');                                                                                                                        
        return;                                                                                                                                                                                    
      }                                                                                                                                                                                            
                                                                                                                                                                                                   
    if (!voucher?.id || isNaN(voucher.id) || voucher.id === 0) {                                                                                                                                 
        Alert.alert('Error', 'Voucher ID is missing or invalid.');                                                                                                                                 
        return;                                                                                                                                                                                    
    }                                                                                                                                                                                            
        setIsUsing(true);                                                                                                                                                                    
    try {                                                                                                                                                                                        
        await api.vouchers.useVoucher(session.user.id, voucher.id);                                                                                                                                
        Alert.alert('Success', `Voucher ${voucher.code} used successfully!`);
        setIsUsed(true); // Hide the button after a successful use                                                                                                                      
        // Optionally update local state here if needed                                                                                                                                            
    } catch (error) {                                                                                                                                                                            
        console.error('Use Voucher Error:', error);                                                                                                                                                
        let errorMessage = 'Failed to use voucher. Please try again.';                                                                                                                             
        if (error instanceof ApiError) {                                                                                                                                                           
          errorMessage = error.message;                                                                                                                                                            
        } else if (error instanceof Error) {                                                                                                                                                       
          errorMessage = error.message;                                                                                                                                                            
        }                                                                                                                                                                                          
        Alert.alert('Use Failed', errorMessage);                                                                                                                                                   
    } finally {                                                                                                                                                                                  
        setIsUsing(false);                                                                                                                                                                         
    }                                                                                                                
  };                                                                                                                                                                                           
                                                                                                                                                                                               
  return (                                                                                                                                                                                     
    <SafeAreaView style={styles.container}>                                                                                                                                                    
      {/* Custom Header */}                                                                                                                                                                    
      <View style={styles.header}>                                                                                                                                                             
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>                                                                                                           
          <ArrowLeft size={24} color="#8B5CF6" />                                                                                                                                              
        </TouchableOpacity>                                                                                                                                                                    
        <Text style={styles.headerTitle}>Voucher Details</Text>                                                                                                                                
        <View style={styles.headerButton} />                                                                                                                                                   
      </View>                                                                                                                                                                                  
                                                                                                                                                                                               
      <ScrollView style={styles.content}>                                                                                                                                                      
        {/* Voucher Name and Status Icon */}                                                                                                                                                   
        <View style={styles.section}>                                                                                                                                                          
          <View style={styles.titleContainer}>                                                                                                                                                 
            <Text style={styles.voucherName}>{voucher.voucher_name}</Text>                                                                                                                     
            <View style={styles.statusIconsContainer}>                                                                                                                                         
              {voucher.status === 'expired' && (                                                                                                                                               
                <XCircle size={20} color="#EF4444" style={styles.statusIcon} />                                                                                                                
              )}                                                                                                                                                                               
              {voucher.status === 'active' && voucher.claim_status === 'claimed' && (                                                                                                          
                <Tag size={20} color="#10B981" style={styles.statusIcon} />                                                                                                                    
              )}                                                                                                                                                                               
              {voucher.usage_status === 'used' && (                                                                                                                                            
                // Use Clipboard icon to indicate voucher has been used                                                                                                                        
                <Clipboard size={20} color="#6B7280" style={styles.statusIcon} />                                                                                                              
              )}                                                                                                                                                                               
            </View>                                                                                                                                                                            
          </View>                                                                                                                                                                              
          <Text style={[styles.statusText, { color: statusInfo.color }]}>                                                                                                                      
            Status: {statusInfo.text}                                                                                                                                                          
          </Text>                                                                                                                                                                              
        </View>                                                                                                                                                                                
                                                                                                                                                                                               
        {/* Voucher Code */}                                                                                                                                                                   
        <View style={styles.section}>                                                                                                                                                          
          <View style={styles.sectionHeader}>                                                                                                                                                  
            <Tag size={18} color="#4B5563" />                                                                                                                                                  
            <Text style={styles.sectionTitle}>Code</Text>                                                                                                                                      
          </View>                                                                                                                                                                              
          <View style={styles.codeContainer}>                                                                                                                                                  
            <Text style={styles.codeText}>{voucher.code}</Text>                                                                                                                                
          </View>                                                                                                                                                                              
        </View>                                                                                                                                                                                
                                                                                                                                                                                               
        {/* Validity */}                                                                                                                                                                       
        <View style={styles.section}>                                                                                                                                                          
          <View style={styles.sectionHeader}>                                                                                                                                                  
            <Clock size={18} color="#4B5563" />                                                                                                                                                
            <Text style={styles.sectionTitle}>Validity</Text>                                                                                                                                  
          </View>                                                                                                                                                                              
          <Text style={styles.sectionText}>                                                                                                                                                    
            Valid until: {new Date(voucher.valid_until).toLocaleDateString()}                                                                                                                  
          </Text>                                                                                                                                                                              
        </View>                                                                                                                                                                                
                                                                                                                                                                                               
        {/* Applicable For */}                                                                                                                                                                 
        <View style={styles.section}>                                                                                                                                                          
          <View style={styles.sectionHeader}>                                                                                                                                                  
            <Info size={18} color="#4B5563" />                                                                                                                                                 
            <Text style={styles.sectionTitle}>Applicable For</Text>                                                                                                                            
          </View>                                                                                                                                                                              
          <Text style={styles.sectionText}>{voucher.available_for}</Text>                                                                                                                      
        </View>                                                                                                                                                                                
                                                                                                                                                                                               
        {/* Terms and Conditions */}                                                                                                                                                           
        <View style={styles.section}>                                                                                                                                                          
          <View style={styles.sectionHeader}>                                                                                                                                                  
            <Info size={18} color="#4B5563" />                                                                                                                                                 
            <Text style={styles.sectionTitle}>Terms & Conditions</Text>                                                                                                                        
          </View>                                                                                                                                                                              
          <Text style={styles.sectionText}>{voucher.term_condition}</Text>                                                                                                                     
        </View>                                                                                                                                                                                
                                                                                                                                                                                               
        {/* Action Buttons */}                                                                                                                                                                 
        <View style={styles.buttonContainer}>                                                                                                                                                              
            {voucher.status === 'active' &&                                                                                                                                                      
                voucher.claim_status === 'not_claimed' && (                                                                                                                                        
                <>                                                                                                                                                                               
                    <TouchableOpacity                                                                                                                                                              
                    style={[                                                                                                                                                                     
                        styles.actionButton,                                                                                                                                                       
                        isClaiming && styles.actionButtonDisabled,                                                                                                                                 
                    ]}                                                                                                                                                                           
                    onPress={handleClaimPress}                                                                                                                                                   
                    disabled={isClaiming}                                                                                                                                                        
                    >                                                                                                                                                                              
                    {isClaiming ? (                                                                                                                                                              
                        <ActivityIndicator size="small" color="#FFFFFF" />                                                                                                                         
                    ) : (                                                                                                                                                                        
                        <Text style={styles.actionButtonText}>Claim Now</Text>                                                                                                                     
                    )}                                                                                                                                                                           
                    </TouchableOpacity>                                                                                                                                                            
                    {claimError && (                                                                                                                                                               
                    <Text style={styles.errorTextSmall}>{claimError}</Text>                                                                                                                      
                    )}                                                                                                                                                                             
                </>                                                                                                                                                                              
            )}                                                                                                                                                                                 
            {voucher.status === 'active' &&                                                                                                                                                              
                voucher.claim_status === 'claimed' &&                                                                                                                                                      
                voucher.usage_status === 'not_used' &&                                                                                                                                                     
                !isUsed && (                                                                                                                                                                               
                <TouchableOpacity                                                                                                                                                                        
                    style={[                                                                                                                                                                               
                    styles.actionButton,                                                                                                                                                                 
                    isUsing && styles.actionButtonDisabled,                                                                                                                                              
                    ]}                                                                                                                                                                                     
                    onPress={handleUsePress}                                                                                                                                                               
                    disabled={isUsing}                                                                                                                                                                     
                >                                                                                                                                                                                        
                    {isUsing ? (                                                                                                                                                                           
                    <ActivityIndicator size="small" color="#FFFFFF" />                                                                                                                                   
                    ) : (                                                                                                                                                                                  
                    <Text style={styles.actionButtonText}>Use Now</Text>                                                                                                                                 
                    )}                                                                                                                                                                                     
                </TouchableOpacity>                                                                                                                                                                      
            )}                                                                                                                                             
        </View>                                                                                                                                                                                
      </ScrollView>                                                                                                                                                                            
    </SafeAreaView>                                                                                                                                                                            
  );                                                                                                                                                                                           
}