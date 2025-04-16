import 'react-native-url-polyfill/auto';
import { createClient, RealtimeChannel} from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Database } from '@/types/supabase';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// ✅ check môi trường trước khi truyền AsyncStorage
const isBrowser = typeof window !== 'undefined';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: false,
    ...(isBrowser
      ? {} // Web: để Supabase tự dùng localStorage hoặc bỏ qua
      : {
    storage: {
        getItem: (key) => AsyncStorage.getItem(key),
        setItem: (key, value) => AsyncStorage.setItem(key, value),
        removeItem: (key) => AsyncStorage.removeItem(key),
      },
    })
  },
});

export function subscribeToPostReactions(
  onUpdate: (payload: any) => void
): RealtimeChannel {
  const channel = supabase
    .channel('post_reactions_channel')
    .on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'posts', // hoặc bảng nào đang chứa like count
      },
      (payload) => {
        console.log('🔥 Realtime update:', payload);
        onUpdate(payload.new); // bạn sẽ nhận được dữ liệu mới (new row)
      }
    )
    .subscribe();

  return channel;
}