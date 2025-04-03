// import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native'; // Import Alert                                                                                                                                                                                                                                               import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';                                                                                                 
import { SafeAreaView } from 'react-native-safe-area-context';                                                                                                                                 
import { useRouter, useLocalSearchParams } from 'expo-router';                                                                                                                                 
import { ArrowLeft, Clock, Tag, Info, XCircle, CheckCircle } from 'lucide-react-native';                                                                                                       
import { UserVoucher, api, ApiError } from '@/services/api'; // Import the type, api object, and ApiError                                                                                      
import React, { useState } from 'react'; // Import useState                                                                                                                                    
import { ActivityIndicator } from 'react-native'; // Import ActivityIndicator                                                                                                                  
import { useAuth } from '@/hooks/useAuth'; // Import useAuth                                                                                                                              
                                                                                                                                                                                               
export default function VoucherDetailScreen() {                                                                                                                                                
  const router = useRouter();                                                                                                                                                                  
  const params = useLocalSearchParams(); 
  const { session } = useAuth(); // Get session info 
  
  // State for claim action                                                                                                                                                                    
  const [isClaiming, setIsClaiming] = useState(false);                                                                                                                                         
  const [claimError, setClaimError] = useState<string | null>(null);                                                                                                                           
  // Local state to track claim status after successful claim                                                                                                                                  
  const [localClaimStatus, setLocalClaimStatus] = useState<'claimed' | 'not_claimed' | null>(null); 
                                                                                                                                                                                               
  // Reconstruct the voucher object from params                                                                                                                                                
  // Since we spread the object, params directly contains its properties                                                                                                                       
  // We need to cast the types appropriately                                                                                                                                                   
  // Use localClaimStatus if set, otherwise fallback to param status                                                                                                                           
  const initialVoucher = params as unknown as UserVoucher;                                                                                                                                     
  const voucher = {                                                                                                                                                                            
      ...initialVoucher,                                                                                                                                                                       
      claim_status: localClaimStatus ?? initialVoucher.claim_status,                                                                                                                           
      // Ensure id is a number for API calls                                                                                                                                                   
      // Use optional chaining and nullish coalescing for safety                                                                                                                               
      id: Number(initialVoucher?.id ?? 0)                                                                                                                                                      
  };                                                                                                                                                                                           
  // console.log('Voucher Details:', JSON.stringify(voucher, null, 2)); // Keep for debugging if needed                                                                                        
                                                                                                                                                                                               
  // Basic check if essential data is missing (adjust based on required fields)                                                                                                                
  if (!voucher || !voucher.id || isNaN(voucher.id) || voucher.id === 0 || !voucher.voucher_name) { // Check if id is a valid number > 0                                                        
    return (                                                                                                                                                                                   
      <SafeAreaView style={styles.container}>                                                                                                                                                  
        <View style={styles.header}>                                                                                                                                                          
          <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>                                                                                                         
            <ArrowLeft size={24} color="#8B5CF6" />                                                                                                                                            
          </TouchableOpacity>                                                                                                                                                                  
          <Text style={styles.headerTitle}>Error</Text>                                                                                                                                        
          <View style={styles.headerButton} />
          {/* Placeholder for balance */}                                                                                                                 
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
    return { text: voucher.status, color: '#6B7280' }; // Default fallback                                                                                                                     
  };                                                                                                                                                                                           
                                                                                                                                                                                               
  // --- Action Handlers ---                                                                                                                                                                   
  const handleClaimPress = async () => {                                                                                                                                                       
    if (!session?.user) {                                                                                                                                                                      
      Alert.alert('Error', 'You need to be logged in to claim a voucher.');                                                                                                                    
      return;                                                                                                                                                                                  
    }                                                                                                                                                                                          
    // Use the potentially modified voucher object which has id as number                                                                                                                      
    if (!voucher?.id || isNaN(voucher.id) || voucher.id === 0) {                                                                                                                               
        Alert.alert('Error', 'Voucher ID is missing or invalid.');                                                                                                                             
        return;                                                                                                                                                                                
    }                                                                                                                                                                                          
                                                                                                                                                                                               
    setIsClaiming(true);                                                                                                                                                            
    setClaimError(null);                                                                                                                                                                       
                                                                                                                                                                                               
    try {                                                                                                                                                                                      
        console.log('User ID when clicking claim:', session.user.id); // Log auth status 
        // Call the API function from services/api.ts                                                                                                                                            
      await api.vouchers.claimVoucher(session.user.id, voucher.id);                                                                                                                            
                                                                                                                                                                                               
      // --- Success ---                                                                                                                                                                       
      Alert.alert('Success', `Voucher ${voucher.code} claimed successfully!`);                                                                                                                 
      // Update local state to reflect the change immediately                                                                                                                                  
      setLocalClaimStatus('claimed');                                                                                                                                                          
      // Optionally: Navigate back or refresh the list                                                                                                                                         
      // router.back();                                                                                                                                                                        
                                                                                                                                                                                               
    } catch (error) {                                                                                                                                                                          
      // --- Error ---                                                                                                                                                                         
      console.error('Claim Voucher Error:', error);                                                                                                                                            
      let errorMessage = 'Failed to claim voucher. Please try again.';                                                                                                                         
      if (error instanceof ApiError) {                                                                                                                                                         
        // Use the message from the ApiError if available                                                                                                                                      
        errorMessage = error.message;                                                                                                                                                          
      } else if (error instanceof Error) {                                                                                                                                                     
        errorMessage = error.message;                                                                                                                                                          
      }                                                                                                                                                                                        
      setClaimError(errorMessage);                                                                                                                                                             
      Alert.alert('Claim Failed', errorMessage);                                                                                                                                               
    } finally {                                                                                                                                                                                
      // --- Always run ---                                                                                                                                                                    
      setIsClaiming(false);                                                                                                                                                                    
    }                                                                                                                                                                                          
  };                                                                                                                                                                                           
                                                                                                                                                                                               
  const handleUsePress = () => {                                                                                                                                                               
    // TODO: Implement actual use logic (e.g., navigate to booking/search with voucher applied)                                                                                                
    Alert.alert('Use Voucher', `Using voucher: ${voucher.code}`);                                                                                                                              
    // This might involve navigating to a relevant screen or applying the code                                                                                                                 
  };                                                                                                                                                                                           
  // --- End Action Handlers ---                                                                                                                                                                                            
                                                                                                                                                                                               
  const statusInfo = getStatusTextAndColor();                                                                                                                                                  
                                                                                                                                                                                               
  return (                                                                                                                                                                                     
    <SafeAreaView style={styles.container}>                                                                                                                                                    
      {/* Custom Header */}                                                                                                                                                                    
      <View style={styles.header}>                                                                                                                                                             
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>                                                                                                           
          <ArrowLeft size={24} color="#8B5CF6" />                                                                                                                                              
        </TouchableOpacity>                                                                                                                                                                    
        <Text style={styles.headerTitle}>Voucher Details</Text>                                                                                                                                
        <View style={styles.headerButton} /> {/* Placeholder for balance */}                                                                                                                   
      </View>                                                                                                                                                                                  
                                                                                                                                      
      <ScrollView style={styles.content}>                                                                                                                                                      
        {/* Voucher Name and Status Icon */}                                                                                                                                                   
        <View style={styles.section}>                                                                                                                                                          
          <View style={styles.titleContainer}>                                                                                                                                                 
            <Text style={styles.voucherName}>{voucher.voucher_name}</Text>                                                                                                                     
            {voucher.status === 'expired' && (                                                                                                                                                 
              <XCircle size={20} color="#EF4444" style={styles.statusIcon} />                                                                                                                  
            )}                                                                                                                                                                                 
            {voucher.status !== 'expired' && voucher.usage_status === 'used' && (                                                                                                              
              <CheckCircle size={20} color="#9CA3AF" style={styles.statusIcon} />                                                                                                              
            )}
            {/* Optional: Add an icon for claimed but not used */}                                                                                                                             
            {voucher.status === 'active' && voucher.claim_status === 'claimed' && voucher.usage_status === 'not_used' && (                                                                     
               <CheckCircle size={20} color="#10B981" style={styles.statusIcon} />                
            )}                                                                                                                                                                                 
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
            {/* You could add a "Copy Code" button here */}                                                                                                                                    
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
        {/* --- Action Buttons --- */}                                                                                                                                                         
        <View style={styles.buttonContainer}>                                                                                                                                                  
          {/* Show "Claim" button if active, not claimed (locally or from params) */}                                                                                                          
          {voucher.status === 'active' && voucher.claim_status === 'not_claimed' && (                                                                                                          
            <>                                                                                                                                                                                 
              <TouchableOpacity                                                                                                                                                                
                style={[styles.actionButton, isClaiming && styles.actionButtonDisabled]}                                                                                                       
                onPress={handleClaimPress}                                                                                                                                                     
                disabled={isClaiming} // Disable button while claiming                                                                                                                         
              >                                                                                                                                                                                
                {isClaiming ? (                                                                                                                                                                
                  <ActivityIndicator size="small" color="#FFFFFF" />                                                                                                                           
                ) : (                                                                                                                                                                          
                  <Text style={styles.actionButtonText}>Claim Now</Text>                                                                                                                       
                )}                                                                                                                                                                             
              </TouchableOpacity>                                                                                                                                                              
              {/* Display claim error if any */}                                                                                                                                               
              {claimError && <Text style={styles.errorTextSmall}>{claimError}</Text>}                                                                                                          
            </>                                                                                                                                                                                
          )}                                                                                                                                                                                   
                                                                                                                                                                                               
          {/* Show "Use" button if active, claimed (locally or from params), and not used */}                                                                                                                           
          {voucher.status === 'active' &&                                                                                                                                                      
            voucher.claim_status === 'claimed' &&                                                                                                                                              
            voucher.usage_status === 'not_used' && (                                                                                                                                           
              <TouchableOpacity style={styles.actionButton} onPress={handleUsePress}>                                                                                                          
                <Text style={styles.actionButtonText}>Use Now</Text>                                                                                                                           
              </TouchableOpacity>                                                                                                                                                              
          )}                                                                                                                                                                                   
        </View>                                                                                                                                                                                
        {/* --- End Action Buttons --- */}                                                                                                                                                                                        
      </ScrollView>                                                                                                                                                                            
    </SafeAreaView>                                                                                                                                                                            
  );                                                                                                                                                                                           
}                                                                                                                                                                                              
                                                                                                                                                                                               
// Add Styles                                                                                                                                                                                  
const styles = StyleSheet.create({                                                                                                                                                             
  container: {                                                                                                                                                                                 
    flex: 1,                                                                                                                                                                                   
    backgroundColor: '#F9FAFB', // Light background for detail screen                                                                                                                          
  },                                                                                                                                                                                           
  header: {                                                                                                                                                                                    
    flexDirection: 'row',                                                                                                                                                                      
    justifyContent: 'space-between',                                                                                                                                                           
    alignItems: 'center',                                                                                                                                                                      
    paddingHorizontal: 16,                                                                                                                                                                     
    paddingVertical: 12,                                                                                                                                                                       
    backgroundColor: '#FFFFFF',                                                                                                                                                                
    borderBottomWidth: 1,                                                                                                                                                                      
    borderBottomColor: '#E5E7EB',                                                                                                                                                              
  },                                                                                                                                                                                           
  headerButton: {                                                                                                                                                                              
    padding: 4, // Add padding for easier touch                                                                                                                                                
    minWidth: 32, // Ensure minimum touch area                                                                                                                                                 
    alignItems: 'center',                                                                                                                                                                      
  },                                                                                                                                                                                           
  headerTitle: {                                                                                                                                                                               
    fontFamily: 'Inter-SemiBold',                                                                                                                                                              
    fontSize: 18,                                                                                                                                                                              
    color: '#1F2937',                                                                                                                                                                          
  },                                                                                                                                                                                           
  content: {                                                                                                                                                                                   
    flex: 1,                                                                                                                                                                                   
    padding: 20,                                                                                                                                                                               
  },                                                                                                                                                                                           
  section: {                                                                                                                                                                                   
    backgroundColor: '#FFFFFF',                                                                                                                                                                
    borderRadius: 12,                                                                                                                                                                          
    padding: 16,                                                                                                                                                                               
    marginBottom: 16,                                                                                                                                                                          
    ...Platform.select({                                                                                                                                                                       
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },                                                                               
      android: { elevation: 1 },                                                                                                                                                               
    }),                                                                                                                                                                                        
  },                                                                                                                                                                                           
  sectionHeader: {                                                                                                                                                                             
    flexDirection: 'row',                                                                                                                                                                      
    alignItems: 'center',                                                                                                                                                                      
    marginBottom: 8,                                                                                                                                                                           
  },                                                                                                                                                                                           
  sectionTitle: {                                                                                                                                                                              
    fontFamily: 'Inter-SemiBold',                                                                                                                                                              
    fontSize: 16,                                                                                                                                                                              
    color: '#374151',                                                                                                                                                                          
    marginLeft: 8,                                                                                                                                                                             
  },                                                                                                                                                                                           
  sectionText: {                                                                                                                                                                               
    fontFamily: 'Inter-Regular',                                                                                                                                                               
    fontSize: 14,                                                                                                                                                                              
    color: '#4B5563',                                                                                                                                                                          
    lineHeight: 20,                                                                                                                                                                            
  },                                                                                                                                                                                           
  voucherName: {                                                                                                                                                                               
    fontFamily: 'Inter-Bold',                                                                                                                                                                  
    fontSize: 22,                                                                                                                                                                              
    color: '#8B5CF6',                                                                                                                                                                          
    marginRight: 8,                                                                                                                                                                            
    flexShrink: 1, // Allow text to wrap if needed                                                                                                                                             
  },                                                                                                                                                                                           
  titleContainer: {                                                                                                                                                                            
    flexDirection: 'row',                                                                                                                                                                      
    alignItems: 'center',                                                                                                                                                                      
    marginBottom: 4,                                                                                                                                                                           
  },                                                                                                                                                                                           
  statusIcon: {                                                                                                                                                                                
    // marginLeft: 8, // Handled by marginRight on title                                                                                                                                       
  },                                                                                                                                                                                           
  statusText: {                                                                                                                                                                                
    fontFamily: 'Inter-Medium',                                                                                                                                                                
    fontSize: 14,                                                                                                                                                                              
    marginTop: 4,                                                                                                                                                                              
  },                                                                                                                                                                                           
  codeContainer: {                                                                                                                                                                             
    backgroundColor: '#E0E7FF', // Light purple background                                                                                                                                     
    paddingVertical: 8,                                                                                                                                                                        
    paddingHorizontal: 12,                                                                                                                                                                     
    borderRadius: 6,                                                                                                                                                                           
    alignSelf: 'flex-start', // Don't stretch full width                                                                                                                                       
    marginTop: 4,                                                                                                                                                                              
  },                                                                                                                                                                                           
  codeText: {                                                                                                                                                                                  
    fontFamily: 'Inter-SemiBold',                                                                                                                                                              
    fontSize: 16,                                                                                                                                                                              
    color: '#4338CA', // Darker purple text                                                                                                                                                    
  },                                                                                                                                                                                           
  // Error styles                                                                                                                                                                              
  errorContainer: {                                                                                                                                                                            
    flex: 1,                                                                                                                                                                                   
    justifyContent: 'center',                                                                                                                                                                  
    alignItems: 'center',                                                                                                                                                                      
    padding: 20,                                                                                                                                                                               
  },                                                                                                                                                                                           
  errorText: {                                                                                                                                                                                 
    fontFamily: 'Inter-Medium',                                                                                                                                                                
    fontSize: 16,                                                                                                                                                                              
    color: '#EF4444',                                                                                                                                                                          
    textAlign: 'center',                                                                                                                                                                       
    marginBottom: 20,                                                                                                                                                                          
  },                                                                                                                                                                                           
  backButton: {                                                                                                                                                                                
    backgroundColor: '#8B5CF6',                                                                                                                                                                
    paddingVertical: 10,                                                                                                                                                                       
    paddingHorizontal: 20,                                                                                                                                                                     
    borderRadius: 8,                                                                                                                                                                           
  },                                                                                                                                                                                           
  backButtonText: {                                                                                                                                                                            
    fontFamily: 'Inter-SemiBold',                                                                                                                                                              
    fontSize: 16,                                                                                                                                                                              
    color: '#FFFFFF',                                                                                                                                                                          
  },
    // --- New Styles for Action Buttons ---                                                                                                                                                     
    buttonContainer: {                                                                                                                                                                           
        marginTop: 10, // Add some space above the button(s)                                                                                                                                       
        marginBottom: 20, // Add space at the bottom of the scroll view                                                                                                                            
    },                                                                                                                                                                                           
    actionButton: {                                                                                                                                                                              
        backgroundColor: '#8B5CF6', // Use primary color                                                                                                                                           
        paddingVertical: 14,                                                                                                                                                                       
        paddingHorizontal: 20,                                                                                                                                                                     
        borderRadius: 8,                                                                                                                                                                           
        alignItems: 'center',                                                                                                                                                                      
        justifyContent: 'center',                                                                                                                                                                  
        marginTop: 10, // Space between buttons if both could somehow appear (though logic prevents this)                                                                                          
    },                                                                                                                                                                                           
    actionButtonText: {                                                                                                                                                                          
        fontFamily: 'Inter-SemiBold',                                                                                                                                                              
        fontSize: 16,                                                                                                                                                                              
        color: '#FFFFFF',                                                                                                                                                                      
    },                                                                                                                                                                                         
    actionButtonDisabled: {                                                                                                                                                                    
      backgroundColor: '#A5B4FC', // Lighter purple when disabled                                                                                                                              
    },                                                                                                                                                                                         
    errorTextSmall: { // Smaller error text for inline display                                                                                                                                 
        fontFamily: 'Inter-Regular',                                                                                                                                                           
        fontSize: 13,                                                                                                                                                                          
        color: '#EF4444',                                                                                                                                                                      
        textAlign: 'center',                                                                                                                                                                   
        marginTop: 8,                                                                                                                                                                          
    },                                                                                                                                                                                         
    // --- End New Styles ---                                                                                                                                                                  
});