-- Verify files table structure and test queries
-- Run this to check if the table is set up correctly

-- 1. Check if table exists
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_schema = 'public' 
  AND table_name = 'files'
) AS table_exists;

-- 2. Check table columns
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public' 
AND table_name = 'files'
ORDER BY ordinal_position;

-- 3. Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename = 'files';

-- 4. Check existing policies
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE schemaname = 'public' 
AND tablename = 'files';

-- 5. Test query (should work if RLS allows)
SELECT id, name, type, mime_type, size, parent_id, file_url, storage_path, is_favorite, created_by, created_at, updated_at
FROM files
LIMIT 1;

