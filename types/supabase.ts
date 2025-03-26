export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          updated_at: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
        }
        Insert: {
          id: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
        Update: {
          id?: string
          updated_at?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          type: 'offer' | 'booking' | 'system'
          read: boolean
          created_at: string
          data: Json
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          type: 'offer' | 'booking' | 'system'
          read?: boolean
          created_at?: string
          data?: Json
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          message?: string
          type?: 'offer' | 'booking' | 'system'
          read?: boolean
          created_at?: string
          data?: Json
        }
      }
    }
  }
}