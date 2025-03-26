import { supabase } from './supabase';

export async function createTestNotification(userId: string, type: 'offer' | 'booking' | 'system' = 'system') {
  const notifications = {
    offer: {
      title: '20% Off Summer Tours!',
      message: 'Book now and get 20% off on all summer tour packages.',
      data: { offerId: '123', discount: '20%' }
    },
    booking: {
      title: 'Booking Confirmed',
      message: 'Your booking for Bali Paradise Tour has been confirmed.',
      data: { bookingId: '456', tourName: 'Bali Paradise Tour' }
    },
    system: {
      title: 'Welcome to Travel App',
      message: 'Start exploring amazing destinations around the world.',
      data: { type: 'welcome' }
    }
  };

  const notification = notifications[type];

  const { data, error } = await supabase
    .from('notifications')
    .insert({
      user_id: userId,
      title: notification.title,
      message: notification.message,
      type: type,
      data: notification.data
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating test notification:', error);
    throw error;
  }

  return data;
}