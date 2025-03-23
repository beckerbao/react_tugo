/*
  # Create missing profiles

  1. Changes
    - Creates profiles for any existing users that don't have one
    - Ensures data consistency by checking for missing profiles

  2. Security
    - Maintains existing RLS policies
    - No changes to security settings
*/

-- Function to create missing profiles
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