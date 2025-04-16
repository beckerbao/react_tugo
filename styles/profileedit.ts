import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFFFFF',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
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
      color: '#1F2937',
    },
    content: {
      flex: 1,
    },
    errorText: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#EF4444',
      textAlign: 'center',
      marginVertical: 16,
    },
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    avatarContainer: {
      position: 'relative',
      width: 100,
      height: 100,
      borderRadius: 50,
      backgroundColor: '#F3F4F6',
      overflow: 'hidden',
    },
    avatar: {
      width: '100%',
      height: '100%',
    },
    cameraButton: {
      position: 'absolute',
      right: 0,
      bottom: 0,
      backgroundColor: '#8B5CF6',
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: '#FFFFFF',
    },
    form: {
      padding: 16,
    },
    formGroup: {
      marginBottom: 20,
    },
    label: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#6B7280',
      marginBottom: 8,
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
    footer: {
      padding: 16,
      borderTopWidth: 1,
      borderTopColor: '#E5E7EB',
      backgroundColor: '#FFFFFF',
    },
    saveButton: {
      backgroundColor: '#8B5CF6',
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
    },
    saveButtonDisabled: {
      backgroundColor: '#E5E7EB',
    },
    saveButtonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#FFFFFF',
    },
  });