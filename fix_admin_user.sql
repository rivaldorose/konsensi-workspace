-- Fix Admin User Setup
-- This script helps you properly create an admin user

-- Step 1: Check if user exists in auth.users
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at
FROM auth.users
WHERE email = 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';

-- Step 2: If the user exists in auth.users, get their ID and create/update profile
-- Replace 'USER_UUID_HERE' with the actual UUID from Step 1
-- Then run this:

DO $$
DECLARE
  user_uuid UUID;
  user_email TEXT := 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';
BEGIN
  -- Get the user UUID from auth.users
  SELECT id INTO user_uuid
  FROM auth.users
  WHERE email = user_email;
  
  -- If user exists in auth, create/update profile
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.users (id, email, full_name, role)
    VALUES (
      user_uuid,
      user_email,
      'Rivaldo Mac Andrew',
      'admin'
    )
    ON CONFLICT (id) DO UPDATE
    SET 
      email = user_email,
      full_name = 'Rivaldo Mac Andrew',
      role = 'admin',
      updated_at = NOW();
    
    RAISE NOTICE 'User profile created/updated successfully for: %', user_email;
  ELSE
    RAISE EXCEPTION 'User does not exist in auth.users. Please create the user in Supabase Dashboard > Authentication > Users first.';
  END IF;
END $$;

-- Step 3: Verify the user profile
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM public.users
WHERE email = 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';


