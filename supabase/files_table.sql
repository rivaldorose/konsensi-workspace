-- Create files table for document/file storage
-- This table replaces the documents table and uses a hierarchical folder structure

-- Drop table if exists (for development - remove in production)
DROP TABLE IF EXISTS files CASCADE;

-- Create files table
CREATE TABLE IF NOT EXISTS files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('file', 'folder')),
  mime_type TEXT,
  size BIGINT,
  parent_id UUID REFERENCES files(id) ON DELETE CASCADE,
  file_url TEXT,
  storage_path TEXT,
  is_favorite BOOLEAN DEFAULT false,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_files_parent_id ON files(parent_id);
CREATE INDEX IF NOT EXISTS idx_files_created_by ON files(created_by);
CREATE INDEX IF NOT EXISTS idx_files_type ON files(type);
CREATE INDEX IF NOT EXISTS idx_files_is_favorite ON files(is_favorite);
CREATE INDEX IF NOT EXISTS idx_files_updated_at ON files(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_files_created_at ON files(created_at DESC);

-- Enable Row Level Security
ALTER TABLE files ENABLE ROW LEVEL SECURITY;

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_files_updated_at ON files;
CREATE TRIGGER trigger_update_files_updated_at
  BEFORE UPDATE ON files
  FOR EACH ROW
  EXECUTE FUNCTION update_files_updated_at();

-- RLS Policies

-- Helper function to drop policy if exists
CREATE OR REPLACE FUNCTION drop_policy_if_exists(table_name TEXT, policy_name TEXT)
RETURNS void AS $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE schemaname = 'public' 
    AND tablename = table_name 
    AND policyname = policy_name
  ) THEN
    EXECUTE format('DROP POLICY %I ON %I', policy_name, table_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Drop existing policies if they exist
SELECT drop_policy_if_exists('files', 'Users can view own files');
SELECT drop_policy_if_exists('files', 'Users can create own files');
SELECT drop_policy_if_exists('files', 'Users can update own files');
SELECT drop_policy_if_exists('files', 'Users can delete own files');

-- Policy: Users can view files they created
CREATE POLICY "Users can view own files"
  ON files FOR SELECT
  TO authenticated
  USING (created_by = auth.uid());

-- Policy: Users can create files
CREATE POLICY "Users can create own files"
  ON files FOR INSERT
  TO authenticated
  WITH CHECK (created_by = auth.uid());

-- Policy: Users can update files they created
CREATE POLICY "Users can update own files"
  ON files FOR UPDATE
  TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Policy: Users can delete files they created
CREATE POLICY "Users can delete own files"
  ON files FOR DELETE
  TO authenticated
  USING (created_by = auth.uid());

-- Create storage bucket for files (run this in Supabase Dashboard > Storage > Create Bucket)
-- Bucket name: files
-- Public bucket: false (or true if you want public URLs)
-- File size limit: 10485760 (10MB) or larger
-- Allowed MIME types: (leave empty for all types)

-- Note: After creating the bucket, you'll need to set up storage policies
-- See files_storage_policies.sql for storage RLS policies

-- Grant permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON files TO authenticated;

COMMENT ON TABLE files IS 'Stores files and folders with hierarchical structure using parent_id';
COMMENT ON COLUMN files.type IS 'Either "file" or "folder"';
COMMENT ON COLUMN files.parent_id IS 'References files.id for folder hierarchy. NULL means root level';
COMMENT ON COLUMN files.storage_path IS 'Path in Supabase Storage bucket';
COMMENT ON COLUMN files.file_url IS 'Public URL to the file in storage';

