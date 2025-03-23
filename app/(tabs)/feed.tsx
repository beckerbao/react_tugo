import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Heart, MessageCircle, Share2, MoveVertical as MoreVertical } from 'lucide-react-native';
import NotificationBell from '@/components/NotificationBell';

const feedPosts = [
  {
    id: 1,
    user: {
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
      timeAgo: '2 hours ago',
    },
    content: 'Just had an amazing trip to Bali! The beaches were absolutely stunning 🌊',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800',
    likes: 124,
    comments: 38,
  },
  {
    id: 2,
    user: {
      name: 'Mike Thompson',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=200',
      timeAgo: '5 hours ago',
    },
    content: 'Found this hidden gem in Tokyo! Best ramen I\'ve ever had 🍜',
    image: 'https://images.unsplash.com/photo-1557872943-16a5ac26437e?w=800',
    likes: 89,
    comments: 15,
  },
  {
    id: 3,
    user: {
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200',
      timeAgo: '1 day ago',
    },
    content: 'Sunset views from Santorini never disappoint ✨',
    image: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=800',
    likes: 256,
    comments: 42,
  },
];

export default function FeedScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleLike = (postId: number) => {
    // Handle like functionality
  };

  const handleComment = (postId: number) => {
    // Handle comment functionality
  };

  const handleShare = (postId: number) => {
    // Handle share functionality
  };

  const handleMore = (postId: number) => {
    // Handle more options functionality
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
        <NotificationBell count={3} />
      </View>

      <View style={styles.searchContainer}>
        <Search size={20} color="#6B7280" style={styles.searchIcon} />
        <TextInput
          placeholder="Search posts..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#6B7280"
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {feedPosts.map((post) => (
          <View key={post.id} style={styles.postCard}>
            <View style={styles.postHeader}>
              <View style={styles.userInfo}>
                <Image source={{ uri: post.user.avatar }} style={styles.avatar} />
                <View>
                  <Text style={styles.userName}>{post.user.name}</Text>
                  <Text style={styles.timeAgo}>{post.user.timeAgo}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => handleMore(post.id)}>
                <MoreVertical size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <Text style={styles.postContent}>{post.content}</Text>

            <Image source={{ uri: post.image }} style={styles.postImage} />

            <View style={styles.postActions}>
              <TouchableOpacity 
                style={styles.actionButton} 
                onPress={() => handleLike(post.id)}
              >
                <Heart size={20} color="#6B7280" />
                <Text style={styles.actionText}>{post.likes}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleComment(post.id)}
              >
                <MessageCircle size={20} color="#6B7280" />
                <Text style={styles.actionText}>{post.comments}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleShare(post.id)}
              >
                <Share2 size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
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
  postContent: {
    fontFamily: 'Inter-Regular',
    fontSize: 16,
    color: '#1F2937',
    marginBottom: 12,
    lineHeight: 24,
  },
  postImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionText: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    color: '#6B7280',
  },
});