-- Check if contact_email is nullable
SELECT 
  column_name, 
  is_nullable, 
  data_type
FROM information_schema.columns
WHERE table_name = 'partners' 
  AND table_schema = 'public'
  AND column_name IN ('contact_email', 'contact_phone', 'sector');

-- Check for CHECK constraints on partners table
SELECT 
  conname AS constraint_name,
  pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.partners'::regclass
  AND contype = 'c'; -- 'c' = CHECK constraint


