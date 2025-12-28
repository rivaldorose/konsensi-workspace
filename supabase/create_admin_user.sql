-- Script to create an admin user profile
-- IMPORTANT: First create the user via Supabase Auth (Dashboard > Authentication > Users)
-- Then run this script to update the role to 'admin'

-- Step 1: Create user via Supabase Auth Dashboard first!
-- Go to: Authentication > Users > Add user
-- Enter email and password, then copy the user ID

-- Step 2: Update the role to admin (replace USER_ID_HERE with actual user ID from step 1)
-- Uncomment and run after creating auth user:

/*
UPDATE public.users
SET role = 'admin'
WHERE id = 'USER_ID_HERE';
*/

-- Alternative: If you want to create the profile manually (not recommended, use trigger instead)
-- First get the user ID from auth.users, then:

/*
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'USER_ID_FROM_AUTH_USERS',
  'your-email@example.com',
  'Your Full Name',
  'admin'
)
ON CONFLICT (id) DO UPDATE SET role = 'admin';
*/

