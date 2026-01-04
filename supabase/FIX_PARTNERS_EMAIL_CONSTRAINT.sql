-- FIX: Make contact_email nullable and add proper CHECK constraint
-- Run this in Supabase SQL Editor if the previous migration didn't work correctly

-- Step 1: Make contact_email nullable (drop NOT NULL constraint)
ALTER TABLE public.partners 
  ALTER COLUMN contact_email DROP NOT NULL;

-- Step 2: Remove old CHECK constraint if it exists (in case it was created with wrong logic)
ALTER TABLE public.partners 
  DROP CONSTRAINT IF EXISTS partners_contact_check;

-- Step 3: Add new CHECK constraint that allows NULL but requires at least one non-empty value
ALTER TABLE public.partners 
  ADD CONSTRAINT partners_contact_check 
  CHECK (
    (contact_email IS NOT NULL AND contact_email != '') OR 
    (contact_phone IS NOT NULL AND contact_phone != '')
  );

-- Step 4: Verify the constraint exists
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.partners'::regclass
  AND contype = 'c'
  AND conname = 'partners_contact_check';

-- Step 5: Verify contact_email is nullable
SELECT 
  column_name, 
  is_nullable, 
  data_type
FROM information_schema.columns
WHERE table_name = 'partners' 
  AND table_schema = 'public'
  AND column_name = 'contact_email';


