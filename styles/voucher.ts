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
      padding: 8,
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
    },
    headerTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: '#8B5CF6',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    voucherCard: {
      backgroundColor: '#F3E8FF',
      padding: 24,
      borderRadius: 16,
      alignItems: 'center',
      marginBottom: 24,
    },
    discount: {
      fontFamily: 'Inter-Bold',
      fontSize: 32,
      color: '#8B5CF6',
      marginBottom: 8,
    },
    description: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#6B7280',
    },
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 18,
      color: '#1F2937',
      marginBottom: 16,
    },
    detailItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    detailText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#4B5563',
      marginLeft: 12,
    },
    termItem: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 8,
      lineHeight: 20,
    },
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
    },
    collectButton: {
      backgroundColor: '#8B5CF6',
      paddingVertical: 16,
      borderRadius: 12,
      alignItems: 'center',
    },
    collectButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#FFFFFF',
    },
    errorContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 16,
    },
    errorText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#6B7280',
      marginBottom: 16,
    },
  });