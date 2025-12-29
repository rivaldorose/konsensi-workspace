-- Storage bucket setup for documents
-- This creates the 'documents' bucket in Supabase Storage if it doesn't exist
-- Run this in the Supabase SQL Editor

-- Note: Storage buckets must be created via the Supabase Dashboard or using the Storage API
-- This SQL script sets up RLS policies for an existing bucket

-- First, ensure the bucket exists (this must be done via Supabase Dashboard):
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "New bucket"
-- 3. Name it "documents"
-- 4. Make it private (not public)
-- 5. Enable File size limit if needed (e.g., 10MB)

-- RLS Policies for documents bucket
-- These policies allow authenticated users to manage files in their own folders

-- Policy: Users can upload files to their own folder
CREATE POLICY IF NOT EXISTS "Users can upload files to their own folder"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can view files they own or have access to
CREATE POLICY IF NOT EXISTS "Users can view files they own"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE file_path = name
      AND (
        owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM public.document_collaborators
          WHERE document_id = documents.id
          AND user_id = auth.uid()
        )
      )
    )
  )
);

-- Policy: Users can update files they own
CREATE POLICY IF NOT EXISTS "Users can update files they own"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Policy: Users can delete files they own
CREATE POLICY IF NOT EXISTS "Users can delete files they own"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' AND
  (
    (storage.foldername(name))[1] = auth.uid()::text OR
    EXISTS (
      SELECT 1 FROM public.documents
      WHERE file_path = name
      AND owner_id = auth.uid()
    )
  )
);
