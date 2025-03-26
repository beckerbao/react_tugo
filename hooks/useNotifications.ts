import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import { Database } from '@/types/supabase';
import { useAuth } from './useAuth';

type Notification = Database['public']['Tables']['notifications']['Row'];

export function useNotifications() {
  const { session } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // For guest users, use mock notifications
    if (!session?.user) {
      setNotifications([
        {
          id: '1',
          user_id: 'guest',
          title: 'Welcome to Travel App',
          message: 'Start exploring amazing destinations around the world.',
          type: 'system',
          read: false,
          created_at: new Date().toISOString(),
          data: {}
        }
      ]);
      setUnreadCount(1);
      setLoading(false);
      return;
    }

    // Fetch initial notifications for authenticated users
    fetchNotifications();

    // Subscribe to new notifications
    const channel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${session.user.id}`,
        },
        async (payload) => {
          if (payload.eventType === 'INSERT') {
            // Fetch the complete notification data
            const { data: newNotification, error } = await supabase
              .from('notifications')
              .select('*')
              .eq('id', payload.new.id)
              .single();

            if (!error && newNotification) {
              setNotifications((prev) => [newNotification, ...prev]);
              if (!newNotification.read) {
                setUnreadCount((prev) => prev + 1);
              }
            }
          } else if (payload.eventType === 'UPDATE') {
            setNotifications((prev) =>
              prev.map((notification) =>
                notification.id === payload.new.id
                  ? { ...notification, ...payload.new }
                  : notification
              )
            );
            updateUnreadCount();
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [session]);

  const fetchNotifications = async () => {
    if (!session?.user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setNotifications(data || []);
      setUnreadCount((data || []).filter((n) => !n.read).length);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const updateUnreadCount = () => {
    setUnreadCount(notifications.filter((n) => !n.read).length);
  };

  const markAsRead = async (id: string) => {
    if (!session?.user) {
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      updateUnreadCount();
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id)
        .eq('user_id', session.user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id ? { ...notification, read: true } : notification
        )
      );
      updateUnreadCount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (!session?.user) {
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
      return;
    }

    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', session.user.id);

      if (error) throw error;

      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );
      setUnreadCount(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark all notifications as read');
    }
  };

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refresh: fetchNotifications,
  };
}