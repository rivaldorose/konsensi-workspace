-- Storage RLS Policies for files bucket
-- Run this AFTER creating the 'files' bucket in Supabase Dashboard > Storage

-- Storage bucket setup:
-- 1. Go to Supabase Dashboard > Storage
-- 2. Click "Create Bucket"
-- 3. Name: files
-- 4. Public bucket: false (recommended for security)
-- 5. File size limit: 10485760 (10MB) or adjust as needed
-- 6. Allowed MIME types: (leave empty for all types)

-- Helper function to drop storage policy if exists
CREATE OR REPLACE FUNCTION drop_storage_policy_if_exists(bucket_name TEXT, policy_name TEXT)
RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname = policy_name
  ) THEN
    EXECUTE format('DROP POLICY %I ON storage.objects', policy_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing policies if they exist
SELECT drop_storage_policy_if_exists('files', 'Users can upload files');
SELECT drop_storage_policy_if_exists('files', 'Users can view own files');
SELECT drop_storage_policy_if_exists('files', 'Users can delete own files');
SELECT drop_storage_policy_if_exists('files', 'Users can update own files');

-- Policy: Users can upload files to their own folder
CREATE POLICY "Users can upload files"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can read their own files
CREATE POLICY "Users can view own files"
  ON storage.objects FOR SELECT
  TO authenticated
  USING (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can delete their own files
CREATE POLICY "Users can delete own files"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

-- Policy: Users can update their own files (for renaming, etc.)
CREATE POLICY "Users can update own files"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'files' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

COMMENT ON POLICY "Users can upload files" ON storage.objects IS 'Allows authenticated users to upload files to the files bucket in their own folder (userId/)';
COMMENT ON POLICY "Users can view own files" ON storage.objects IS 'Allows users to view files they uploaded';
COMMENT ON POLICY "Users can delete own files" ON storage.objects IS 'Allows users to delete their own files';
COMMENT ON POLICY "Users can update own files" ON storage.objects IS 'Allows users to update metadata of their own files';

