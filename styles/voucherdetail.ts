import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({                                                                                                                                                             
    container: {                                                                                                                                                                                 
      flex: 1,                                                                                                                                                                                   
      backgroundColor: '#F9FAFB',                                                                                                                                                                
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
      padding: 4,                                                                                                                                                                                
      minWidth: 32,                                                                                                                                                                              
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
        ios: {                                                                                                                                                                                   
          shadowColor: '#000',                                                                                                                                                                   
          shadowOffset: { width: 0, height: 1 },                                                                                                                                                 
          shadowOpacity: 0.05,                                                                                                                                                                   
          shadowRadius: 2,                                                                                                                                                                       
        },                                                                                                                                                                                       
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
      flexShrink: 1,                                                                                                                                                                             
    },                                                                                                                                                                                           
    titleContainer: {                                                                                                                                                                            
      flexDirection: 'row',                                                                                                                                                                      
      alignItems: 'center',                                                                                                                                                                      
      marginBottom: 4,                                                                                                                                                                           
    },                                                                                                                                                                                           
    statusIconsContainer: {                                                                                                                                                                      
      flexDirection: 'row',                                                                                                                                                                      
      marginLeft: 8,                                                                                                                                                                             
    },                                                                                                                                                                                           
    statusIcon: {                                                                                                                                                                                
      marginRight: 4,                                                                                                                                                                            
    },                                                                                                                                                                                           
    statusText: {                                                                                                                                                                                
      fontFamily: 'Inter-Medium',                                                                                                                                                                
      fontSize: 14,                                                                                                                                                                              
      marginTop: 4,                                                                                                                                                                              
    },                                                                                                                                                                                           
    codeContainer: {                                                                                                                                                                             
      backgroundColor: '#E0E7FF',                                                                                                                                                                
      paddingVertical: 8,                                                                                                                                                                        
      paddingHorizontal: 12,                                                                                                                                                                     
      borderRadius: 6,                                                                                                                                                                           
      alignSelf: 'flex-start',                                                                                                                                                                   
      marginTop: 4,                                                                                                                                                                              
    },                                                                                                                                                                                           
    codeText: {                                                                                                                                                                                  
      fontFamily: 'Inter-SemiBold',                                                                                                                                                              
      fontSize: 16,                                                                                                                                                                              
      color: '#4338CA',                                                                                                                                                                          
    },                                                                                                                                                                                           
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
    buttonContainer: {                                                                                                                                                                           
      marginTop: 10,                                                                                                                                                                             
      marginBottom: 20,                                                                                                                                                                          
    },                                                                                                                                                                                           
    actionButton: {                                                                                                                                                                              
      backgroundColor: '#8B5CF6',                                                                                                                                                                
      paddingVertical: 14,                                                                                                                                                                       
      paddingHorizontal: 20,                                                                                                                                                                     
      borderRadius: 8,                                                                                                                                                                           
      alignItems: 'center',                                                                                                                                                                      
      justifyContent: 'center',                                                                                                                                                                  
      marginTop: 10,                                                                                                                                                                             
    },                                                                                                                                                                                           
    actionButtonText: {                                                                                                                                                                          
      fontFamily: 'Inter-SemiBold',                                                                                                                                                              
      fontSize: 16,                                                                                                                                                                              
      color: '#FFFFFF',                                                                                                                                                                          
    },                                                                                                                                                                                           
    actionButtonDisabled: {                                                                                                                                                                      
      backgroundColor: '#A5B4FC',                                                                                                                                                                
    },                                                                                                                                                                                           
    errorTextSmall: {                                                                                                                                                                            
      fontFamily: 'Inter-Regular',                                                                                                                                                               
      fontSize: 13,                                                                                                                                                                              
      color: '#EF4444',                                                                                                                                                                          
      textAlign: 'center',                                                                                                                                                                       
      marginTop: 8,                                                                                                                                                                              
    },                                                                                                                                                                                           
  });