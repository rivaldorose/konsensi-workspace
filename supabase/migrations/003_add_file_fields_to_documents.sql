-- Add file fields to documents table for file upload support
-- Run this AFTER 002_additional_tables.sql

-- Add file-related columns to documents table
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS file_name TEXT,
ADD COLUMN IF NOT EXISTS file_size BIGINT,
ADD COLUMN IF NOT EXISTS file_type TEXT,
ADD COLUMN IF NOT EXISTS file_url TEXT,
ADD COLUMN IF NOT EXISTS file_path TEXT;

-- Update type check constraint to support both text and file documents
-- First drop the existing constraint if it exists
ALTER TABLE public.documents
DROP CONSTRAINT IF EXISTS documents_type_check;

-- Add new constraint that allows both text document types and file type indicator
-- We'll use the existing type values ('doc', 'sheet', 'slide', 'pdf') for backward compatibility
-- And add a new column to distinguish between text and file documents
ALTER TABLE public.documents
ADD COLUMN IF NOT EXISTS document_mode TEXT DEFAULT 'text' CHECK (document_mode IN ('text', 'file'));

-- Create index for file_path for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_file_path ON public.documents(file_path) WHERE file_path IS NOT NULL;

-- Create index for document_mode
CREATE INDEX IF NOT EXISTS idx_documents_document_mode ON public.documents(document_mode);

