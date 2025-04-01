import React from 'react';                                                                                                                                                                     import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';                                                                                                 
import { SafeAreaView } from 'react-native-safe-area-context';                                                                                                                                 
import { useRouter, useLocalSearchParams } from 'expo-router';                                                                                                                                 
import { ArrowLeft, Clock, Tag, Info, XCircle, CheckCircle } from 'lucide-react-native';                                                                                                       
import { UserVoucher } from '@/services/api'; // Import the type                                                                                                                               
                                                                                                                                                                                               
export default function VoucherDetailScreen() {                                                                                                                                                
  const router = useRouter();                                                                                                                                                                  
  const params = useLocalSearchParams();                                                                                                                                                       
                                                                                                                                                                                               
  // Reconstruct the voucher object from params                                                                                                                                                
  // Since we spread the object, params directly contains its properties                                                                                                                       
  // We need to cast the types appropriately                                                                                                                                                   
  const voucher = params as unknown as UserVoucher;                                                                                                                                            
                                                                                                                                                                                               
  // Basic check if essential data is missing (adjust based on required fields)                                                                                                                
  if (!voucher || !voucher.id || !voucher.voucher_name) {                                                                                                                                      
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
});