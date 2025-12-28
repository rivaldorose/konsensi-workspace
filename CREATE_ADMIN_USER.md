# Create Admin User Guide

## Method 1: Via Supabase Dashboard (Recommended)

### Step 1: Create User in Auth

1. Go to **Supabase Dashboard** > **Authentication** > **Users**
2. Click **"Add user"** or **"Create new user"**
3. Fill in:
   - **Email**: `rivaldo.mac-andrew@konsensi-budgetbeheer.nl`
   - **Password**: Choose a secure password
   - **Auto Confirm User**: ✅ Check this box
4. Click **"Create user"**

The system will:
- Create the user in `auth.users` (with a UUID)
- The trigger `handle_new_user` will automatically create a profile in `public.users`
- Default role will be `'member'`

### Step 2: Update Role to Admin

After the user is created, run this SQL to make them an admin:

```sql
-- Update role to admin
UPDATE public.users
SET role = 'admin'
WHERE email = 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';
```

### Step 3: Verify

Check that the user was created correctly:

```sql
-- Check user profile
SELECT 
  id,
  email,
  full_name,
  role,
  created_at,
  updated_at
FROM public.users
WHERE email = 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';
```

You should see:
- `id`: A UUID (not null)
- `email`: `rivaldo.mac-andrew@konsensi-budgetbeheer.nl`
- `full_name`: `Rivaldo Mac andrew` (or the email if name wasn't provided)
- `role`: `admin`
- `created_at` and `updated_at`: Timestamps

---

## Method 2: Manual SQL (Only if you have the auth user ID)

**⚠️ This method requires you to first create the user in Auth to get their UUID**

If you already created the user in Auth and know their UUID:

```sql
-- Replace 'USER_UUID_HERE' with the actual UUID from auth.users
UPDATE public.users
SET 
  role = 'admin',
  full_name = 'Rivaldo Mac Andrew'
WHERE id = 'USER_UUID_HERE';
```

To find the UUID:

```sql
-- Find the user ID from auth.users
SELECT id, email, created_at
FROM auth.users
WHERE email = 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';
```

---

## Troubleshooting

### Error: "null value in column "id""

**Problem**: You're trying to INSERT into `public.users` without an `id`.

**Solution**: Never manually INSERT into `public.users`. Always create users through:
1. Supabase Auth Dashboard (recommended)
2. Supabase Auth API (for programmatic creation)
3. The trigger will automatically create the profile

The `id` column is a FOREIGN KEY to `auth.users(id)`, so it must exist in `auth.users` first.

### The trigger didn't create the profile

If you created a user in Auth but no profile exists in `public.users`, you can manually create it:

```sql
-- First, get the UUID from auth.users
SELECT id, email
FROM auth.users
WHERE email = 'rivaldo.mac-andrew@konsensi-budgetbeheer.nl';

-- Then insert with that UUID (replace 'UUID_HERE' with the actual UUID)
INSERT INTO public.users (id, email, full_name, role)
VALUES (
  'UUID_HERE',
  'rivaldo.mac-andrew@konsensi-budgetbeheer.nl',
  'Rivaldo Mac Andrew',
  'admin'
)
ON CONFLICT (id) DO UPDATE
SET 
  role = 'admin',
  full_name = 'Rivaldo Mac Andrew',
  updated_at = NOW();
```

### Check if trigger exists

```sql
-- Check if the trigger exists
SELECT 
  trigger_name,
  event_object_table,
  action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';
```

### Recreate trigger if needed

If the trigger doesn't exist, run this from `001_initial_schema.sql`:

```sql
-- FUNCTION to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    'member'
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- TRIGGER to create user profile
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
```

