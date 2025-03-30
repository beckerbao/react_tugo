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
    errorText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#EF4444',
      textAlign: 'center',
      marginBottom: 16,
      padding: 12,
      backgroundColor: '#FEE2E2',
      borderRadius: 8,
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 8,
    },
    tourCard: {
      backgroundColor: '#F3F4F6',
      padding: 16,
      borderRadius: 8,
    },
    tourName: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#1F2937',
    },
    label: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 4, // Adjusted margin for label
    },
    noticeText: { 
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: '#6B7280', // Same color as label, but smaller font
      marginBottom: 8,
    },
    requiredAsterisk: {
      color: '#EF4444', // Red color
    },
    input: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#1F2937',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#FFFFFF',
    },
    dateInput: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: '#E5E7EB',
      borderRadius: 8,
      padding: 12,
      backgroundColor: '#FFFFFF',
    },
    dateInputText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#1F2937',
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
    },
    submitButton: {
      backgroundColor: '#8B5CF6',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    submitButtonDisabled: {
      backgroundColor: '#E5E7EB',
    },
    submitButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#FFFFFF',
    },
  });
