import 'react-native-url-polyfill/auto';
import { createClient, RealtimeChannel} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined' && window.localStorage;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    storage: isBrowser ? undefined : {
      getItem: (key) => AsyncStorage.getItem(key),
      setItem: (key, value) => AsyncStorage.setItem(key, value),
      removeItem: (key) => AsyncStorage.removeItem(key),
    },
  },
});

export function subscribeToPostReactions(
  onUpdate: (postId: number, updated: { likes: number; loves: number }) => void
): RealtimeChannel {  
  const channel = supabase
    .channel('posts_realtime')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts',
      },
      (payload) => {
        const updated = payload.new;

        console.log('[Realtime] Updated post:', updated.id, {
          likes: updated.likes,
          loves: updated.loves,
        });
  
        onUpdate(updated.id, {
          likes: updated.likes,
          loves: updated.loves,
        });
      }
    )
    .subscribe();

  return channel;
}