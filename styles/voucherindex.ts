import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
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