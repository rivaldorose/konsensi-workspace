-- Supabase Storage Setup for Documents
-- Run this AFTER creating the documents bucket in Supabase Dashboard

-- Create the documents bucket (run this in Supabase Dashboard > Storage > Create Bucket)
-- Bucket name: documents
-- Public bucket: false
-- File size limit: 10485760 (10MB)
-- Allowed MIME types: (leave empty for all types, or specify: application/pdf,application/msword,application/vnd.*,image/*)

-- RLS Policies for storage.objects (for documents bucket)
-- Note: These policies allow authenticated users to upload/read/delete their own files

-- Allow authenticated users to upload files to their own folder
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to read their own documents
CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to delete their own documents
CREATE POLICY "Users can delete own documents"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

-- Allow users to update their own documents (for renaming, etc.)
CREATE POLICY "Users can update own documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
)
WITH CHECK (
  bucket_id = 'documents' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);

