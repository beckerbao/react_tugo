import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search } from 'lucide-react-native';
import NotificationBell from '@/components/NotificationBell';
import { useApi } from '@/hooks/useApi';
import { api } from '@/services/api';
import { Post } from '@/types/api';
import ErrorView from '@/components/ErrorView';

const API_BASE_URL = 'https://api.review.tugo.com.vn';
const DEFAULT_AVATAR = `${API_BASE_URL}/assets/images/avatar.png`;

export default function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  
  const { 
    data: postsData, 
    error, 
    loading, 
    execute: fetchPosts 
  } = useApi(api.posts.getAll);

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  }, [fetchPosts]);

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    // TODO: Implement search functionality
  };

  const getProfileImageUrl = (profileImage: string) => {
    if (!profileImage) return DEFAULT_AVATAR;
    return profileImage.startsWith('http') 
      ? profileImage 
      : `${API_BASE_URL}${profileImage}`;
  };

  if (loading && !refreshing) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
          <NotificationBell count={3} />
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#8B5CF6" />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Feed</Text>
          <NotificationBell count={3} />
        </View>
        <ErrorView message={error.message} onRetry={fetchPosts} />
      </SafeAreaView>
    );
  }

  const posts = postsData?.data.posts || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <NotificationBell count={3} />
      </View>

      {/* <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search posts..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#6B7280"
        />
      </View> */}

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {posts.map((post: Post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image 
                  source={{ uri: getProfileImageUrl(post.user.profile_image) }}
                  style={styles.avatar} 
                />
                <View>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <Text style={styles.timeAgo}>
                    {new Date(post.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            </View>

            <Text style={styles.tourName}>{post.tour_name}</Text>
            <Text style={styles.postContent}>
              {post.content.split(' , xem thêm tại')[0]}
            </Text>

            {post.images && post.images.length > 0 && (
              <Image source={{ uri: post.images[0] }} style={styles.postImage} />
            )}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1F2937',
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postCard: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    padding: 16,
  },
  postHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#1F2937',
  },
  timeAgo: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
  tourName: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 18,
    color: '#1F2937',
    marginBottom: 8,
  },
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#4B5563',
    marginBottom: 12,
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
});