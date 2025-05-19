import { StyleSheet, Platform } from 'react-native';

export const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backButton: {
      paddingHorizontal: 16,
    },
    backText: {
      color: '#007AFF',
      fontSize: 16,
    },
    loadingContainer: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 10,
    },
    loadingText: {
      marginTop: 12,
      fontSize: 14,
      color: '#555',
    },
  });