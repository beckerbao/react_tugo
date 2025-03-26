/*
  # Add delete_user function for self-deletion

  1. Changes
    - Add a stored procedure for users to delete their own account
    - Function uses security definer to allow deletion
    - Only allows users to delete their own account

  2. Security
    - Function runs with elevated privileges
    - Checks user ID matches before deletion
    - Only authenticated users can call this function
*/

create or replace function delete_user()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete from auth.users which will cascade to profiles
  delete from auth.users where id = auth.uid();
end;
$$;

-- Grant execute permission to authenticated users
grant execute on function delete_user to authenticated;