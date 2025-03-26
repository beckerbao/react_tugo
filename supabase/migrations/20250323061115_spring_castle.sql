/*
  # Push Token Migration

  1. Changes
    - Ensures push_token column exists in profiles table
    - Updates any missing profiles for existing users
    - Sets default value for push_token to null
    - Adds validation for push_token format

  2. Security
    - Maintains existing RLS policies
    - Only authenticated users can update their own push_token
*/

-- First ensure the push_token column exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'profiles' AND column_name = 'push_token'
  ) THEN
    ALTER TABLE profiles ADD COLUMN push_token text;
  END IF;
END $$;

-- Create missing profiles for any users that don't have one
DO $$
DECLARE
  missing_user RECORD;
BEGIN
  FOR missing_user IN
    SELECT au.id
    FROM auth.users au
    LEFT JOIN public.profiles p ON p.id = au.id
    WHERE p.id IS NULL
  LOOP
    INSERT INTO public.profiles (id)
    VALUES (missing_user.id);
  END LOOP;
END $$;

-- Add constraint to ensure push_token format is valid when present
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS push_token_format;
ALTER TABLE profiles ADD CONSTRAINT push_token_format
  CHECK (
    push_token IS NULL OR 
    push_token ~ '^ExponentPushToken\[.*\]$' OR
    push_token ~ '^[A-Za-z0-9\-_]+$'
  );

-- Update RLS policies to allow users to update their own push_token
DROP POLICY IF EXISTS "Users can update own push_token" ON profiles;
CREATE POLICY "Users can update own push_token"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Add an index to improve query performance
DROP INDEX IF EXISTS idx_profiles_push_token;
CREATE INDEX idx_profiles_push_token ON profiles (push_token)
WHERE push_token IS NOT NULL;