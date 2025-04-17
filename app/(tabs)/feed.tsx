import { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
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
import { styles } from '@/styles/feed';
import { ReactionButtons } from '@/components/ReactionButtons';
import LoginPromptModal from '@/components/LoginPromptModal';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'expo-router';
import { subscribeToPostReactions } from '@/services/supabase';
import { supabase } from '@/services/supabase';

const API_BASE_URL = 'https://api.review.tugo.com.vn';
const DEFAULT_AVATAR = `${API_BASE_URL}/assets/images/avatar.png`;

export default function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const { session } = useAuth();
  const router = useRouter();
  
  const { 
    data: postsData, 
    error, 
    loading, 
    execute: fetchPosts 
  } = useApi(api.posts.getAll);

  const loadPosts = async (pageNum: number, isRefresh = false) => {
    const query = { page: pageNum, page_size: 20 };
    try {
      const result = await fetchPosts(query); // ✅ lấy từ chính execute

      console.log('[DEBUG] result from fetchPosts:', result);

      const fetched = result?.data?.posts || []; // ✅ dùng response trực tiếp
      
      console.log('[DEBUG] session:', session);
      console.log('[DEBUG] fetched posts[0]:', fetched[0]);

      if (isRefresh) {
        setPosts(fetched);
      } else {
        setPosts(prev => [...prev, ...fetched]);
      }
      setHasMore(fetched.length === 20);
      setPage(pageNum);
    } catch (err) {
      console.error('❌ loadPosts failed:', error);
      // Không cần xử lý UI ở đây vì useApi đã set error
    }
  };

  useEffect(() => {
    loadPosts(1, true); // ✅ gọi đúng logic loadPosts (có setPosts)
  }, []);

  useEffect(() => {
    if (session) {
      loadPosts(1, true); // ✅ refetch lại khi vừa login
    }
  }, [session]); 

  useEffect(() => {
    const channel = subscribeToPostReactions((postId, updated) => {
      console.log('[Realtime] updated:', postId, updated);
  
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId
            ? { ...post, ...updated }
            : post
        )
      );
    });
  
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // await fetchPosts();
    await loadPosts(1, true);
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
  
  const handleScroll = async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;

    const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 100;
    if (isCloseToBottom && hasMore && !loadingMore && !refreshing) {
      setLoadingMore(true);
      await loadPosts(page + 1);
      setLoadingMore(false);
    }
  };

  if (loading && posts.length === 0) {    
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
        <ErrorView message={error.message} onRetry={() => loadPosts(1, true)} />
      </SafeAreaView>
    );
  }

  // const posts = postsData?.data.posts || [];

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
        onScroll={handleScroll}                         // 👈 THÊM DÒNG NÀY
        scrollEventThrottle={300}                       // 👈 Để scroll mượt và trigger đúng lúc
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

            <ReactionButtons
                  postId={post.id}
                  initialReaction={post.user_reaction ?? null}// đảm bảo post trả về trường này
                  likes={post.likes}
                  loves={post.loves}
                  disabled={!session}
                  onLoginRequired={() => setShowLoginModal(true)}
                  onReactionSent={async (reaction) => {
                    if (reaction === null) return;
                    try {
                      await api.reactions.sendReaction(post.id, reaction);
                      // không cần setPosts nếu có realtime
                    } catch (err) {
                      console.error('Gửi reaction thất bại:', err);
                    }
                  }}
                />
          </View>
        ))}

        {loadingMore && (
          <View style={{ paddingVertical: 16 }}>
            <ActivityIndicator size="small" color="#8B5CF6" />
          </View>
        )}
      </ScrollView>
      <LoginPromptModal
        visible={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onLogin={() => {
          setShowLoginModal(false);
          router.push('/login');
        }}
      />
    </SafeAreaView>
  );
}