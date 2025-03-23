/*
  # Create notifications table and setup security policies

  1. New Tables
    - `notifications`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `title` (text)
      - `message` (text)
      - `type` (text)
      - `read` (boolean)
      - `created_at` (timestamp)
      - `data` (jsonb, for additional metadata)

  2. Security
    - Enable RLS on notifications table
    - Add policies for users to read their own notifications
    - Add policy for system to create notifications
*/

CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  data jsonb DEFAULT '{}'::jsonb,
  CONSTRAINT valid_type CHECK (type IN ('offer', 'booking', 'system'))
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy for users to read their own notifications
CREATE POLICY "Users can read own notifications"
  ON notifications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for system to create notifications
CREATE POLICY "System can create notifications"
  ON notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (true);