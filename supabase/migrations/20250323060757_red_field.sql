/*
  # Add push token field to profiles

  1. Changes
    - Add push_token column to profiles table
*/

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS push_token text;