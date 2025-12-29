-- Make contact_email nullable for partners table
-- This allows partners to have either email or phone (or both), but at least one must be provided at the application level

ALTER TABLE public.partners 
  ALTER COLUMN contact_email DROP NOT NULL;

-- Add a check constraint to ensure at least one of contact_email or contact_phone is provided
-- Note: This constraint will prevent inserts where both are null/empty
ALTER TABLE public.partners 
  DROP CONSTRAINT IF EXISTS partners_contact_check;

ALTER TABLE public.partners 
  ADD CONSTRAINT partners_contact_check 
  CHECK (
    (contact_email IS NOT NULL AND contact_email != '') OR 
    (contact_phone IS NOT NULL AND contact_phone != '')
  );

