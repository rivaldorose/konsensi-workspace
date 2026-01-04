-- Avatar Storage Bucket Setup
-- 
-- This script sets up RLS policies for the 'avatars' storage bucket
-- 
-- Step 1: Create the Storage Bucket (run in Supabase Dashboard > Storage)
-- 1. Go to Storage in the Supabase Dashboard
-- 2. Click "Create Bucket"
-- 3. Configure the bucket:
--    - Name: avatars
--    - Public bucket: true (recommended for avatar images)
--    - File size limit: 1048576 (1MB) or 819200 (800KB)
--    - Allowed MIME types: image/jpeg, image/png, image/gif, image/webp
-- 4. Click "Create bucket"
--
-- Step 2: Run this SQL script in the SQL Editor to set up RLS policies

-- Helper function to drop policy if exists
CREATE OR REPLACE FUNCTION drop_storage_policy_if_exists(bucket_name TEXT, policy_name TEXT)
RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'storage' 
    AND tablename = 'objects'
    AND policyname = policy_name
  ) THEN
    EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing policies if they exist
SELECT drop_storage_policy_if_exists('avatars', 'Avatar images are publicly accessible');
SELECT drop_storage_policy_if_exists('avatars', 'Users can upload their own avatars');
SELECT drop_storage_policy_if_exists('avatars', 'Users can update their own avatars');
SELECT drop_storage_policy_if_exists('avatars', 'Users can delete their own avatars');

-- Allow public read access to avatars (since bucket is public)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

-- Allow users to upload their own avatars
CREATE POLICY "Users can upload their own avatars"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own avatars
CREATE POLICY "Users can update their own avatars"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their own avatars"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Clean up helper function
DROP FUNCTION IF EXISTS drop_storage_policy_if_exists(TEXT, TEXT);

