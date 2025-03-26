/*
  # Update auth trigger for profile creation

  1. Changes
    - Drop existing trigger and function if they exist
    - Recreate trigger function with updated logic
    - Create new trigger on auth.users table

  2. Security
    - Function executes with security definer privileges
    - Restricted to internal Supabase auth operations
*/

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Drop existing function if it exists
drop function if exists public.handle_new_user();

-- Create trigger function
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id,
    full_name,
    phone_number,
    avatar_url,
    updated_at
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'phone_number',
    null,
    now()
  );
  return new;
end;
$$;

-- Create trigger on auth.users
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();