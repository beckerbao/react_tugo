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
    },
    profileSection: {
      alignItems: 'center',
      paddingVertical: 24,
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    avatarContainer: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#F3F4F6',
      marginBottom: 16,
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    name: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 20,
      color: '#1F2937',
      marginBottom: 4,
    },
    menuSection: {
      paddingTop: 8,
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: '#FFFFFF',
    },
    menuItemBorder: {
      borderBottomWidth: 1,
      borderBottomColor: '#E5E7EB',
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    menuItemText: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#1F2937',
      marginLeft: 12,
    },
    menuItemRight: {
      opacity: 0.5,
    },
    menuItemArrow: {
      fontSize: 24,
      color: '#6B7280',
    },
    dangerText: {
      color: '#EF4444',
    },
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      backgroundColor: '#FFFFFF',
      borderRadius: 16,
      padding: 24,
      width: '90%',
      maxWidth: 320,
    },
    modalTitle: {
      fontFamily: 'Inter-Bold',
      fontSize: 20,
      color: '#1F2937',
      marginBottom: 12,
      textAlign: 'center',
    },
    modalMessage: {
      fontFamily: 'Inter-Regular',
      fontSize: 16,
      color: '#6B7280',
      marginBottom: 24,
      textAlign: 'center',
      lineHeight: 24,
    },
    modalButtons: {
      flexDirection: 'row',
      gap: 12,
    },
    modalButton: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    cancelButton: {
      backgroundColor: '#F3F4F6',
    },
    cancelButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#6B7280',
    },
    deleteButton: {
      backgroundColor: '#EF4444',
    },
    deleteButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#FFFFFF',
    },
  });