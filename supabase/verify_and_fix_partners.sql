-- VERIFY AND FIX: Partners table configuration
-- Run this in Supabase SQL Editor to check and fix the partners table

-- 1. Check if contact_email is nullable
SELECT 
  column_name, 
  is_nullable, 
  data_type,
  column_default
FROM information_schema.columns
WHERE table_name = 'partners' 
  AND table_schema = 'public'
  AND column_name IN ('contact_email', 'contact_phone', 'sector', 'name', 'type', 'contact_name', 'status', 'owner_id')
ORDER BY ordinal_position;

-- 2. Check all CHECK constraints on partners table
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.partners'::regclass
  AND contype = 'c' -- 'c' = CHECK constraint
ORDER BY conname;

-- 3. FIX: Make contact_email nullable if it's not already
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 
    FROM information_schema.columns
    WHERE table_name = 'partners' 
      AND table_schema = 'public'
      AND column_name = 'contact_email'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.partners ALTER COLUMN contact_email DROP NOT NULL;
    RAISE NOTICE 'contact_email is now nullable';
  ELSE
    RAISE NOTICE 'contact_email is already nullable';
  END IF;
END $$;

-- 4. Remove old CHECK constraint if it exists
ALTER TABLE public.partners 
  DROP CONSTRAINT IF EXISTS partners_contact_check;

-- 5. Add new CHECK constraint
ALTER TABLE public.partners 
  ADD CONSTRAINT partners_contact_check 
  CHECK (
    (contact_email IS NOT NULL AND contact_email::text != '') OR 
    (contact_phone IS NOT NULL AND contact_phone::text != '')
  );

-- 6. Verify the constraint was added
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.partners'::regclass
  AND contype = 'c'
  AND conname = 'partners_contact_check';

-- 7. Test query to verify the table structure
SELECT 
  'Table structure verified' AS status,
  (SELECT is_nullable FROM information_schema.columns 
   WHERE table_name = 'partners' AND column_name = 'contact_email') AS contact_email_nullable,
  (SELECT COUNT(*) FROM pg_constraint 
   WHERE conrelid = 'public.partners'::regclass 
   AND contype = 'c' 
   AND conname = 'partners_contact_check') AS constraint_exists;

