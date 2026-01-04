# Files Table Setup Guide

This guide explains how to set up the `files` table and storage bucket in Supabase.

## Step 1: Create the Files Table

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Open and run `files_table.sql`
   - This creates the `files` table
   - Sets up indexes for performance
   - Creates RLS policies for security
   - Adds triggers for automatic `updated_at` updates

## Step 2: Create the Storage Bucket

1. Go to **Storage** in the Supabase Dashboard
2. Click **"Create Bucket"**
3. Configure the bucket:
   - **Name**: `files`
   - **Public bucket**: `false` (recommended for security)
   - **File size limit**: `10485760` (10MB) or adjust as needed
   - **Allowed MIME types**: Leave empty for all types, or specify:
     - `application/pdf`
     - `application/msword`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `application/vnd.ms-excel`
     - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
     - `application/vnd.ms-powerpoint`
     - `application/vnd.openxmlformats-officedocument.presentationml.presentation`
     - `image/*`
     - `text/*`
4. Click **"Create bucket"**

## Step 3: Set Up Storage Policies

1. Go back to **SQL Editor**
2. Run `files_storage_policies.sql`
   - This creates RLS policies for the storage bucket
   - Allows users to upload, read, update, and delete their own files
   - Files are organized by user ID in folders: `userId/filename`

## Step 4: Verify Setup

After running both SQL scripts, verify:

1. **Table exists**: Go to **Table Editor** and confirm `files` table is visible
2. **Storage bucket exists**: Go to **Storage** and confirm `files` bucket is visible
3. **Policies are active**: Check that RLS is enabled on the `files` table
4. **Test upload**: Try uploading a file through the application

## Table Structure

The `files` table has the following structure:

- `id` (UUID) - Primary key
- `name` (TEXT) - File or folder name
- `type` (TEXT) - Either 'file' or 'folder'
- `mime_type` (TEXT) - MIME type for files
- `size` (BIGINT) - File size in bytes
- `parent_id` (UUID) - References files.id for folder hierarchy (NULL = root)
- `file_url` (TEXT) - Public URL to the file
- `storage_path` (TEXT) - Path in Supabase Storage
- `is_favorite` (BOOLEAN) - Whether the file is favorited
- `created_by` (UUID) - User ID who created the file
- `created_at` (TIMESTAMPTZ) - Creation timestamp
- `updated_at` (TIMESTAMPTZ) - Last update timestamp

## Folder Hierarchy

The `files` table supports nested folders using `parent_id`:
- Root level files/folders have `parent_id = NULL`
- Subfolders reference their parent folder's `id`
- Files reference their parent folder's `id`

Example:
```
Root
  ├── Folder A (parent_id = NULL)
  │   ├── File 1 (parent_id = Folder A's id)
  │   └── Folder B (parent_id = Folder A's id)
  │       └── File 2 (parent_id = Folder B's id)
  └── File 3 (parent_id = NULL)
```

## Security

- RLS (Row Level Security) is enabled
- Users can only view, create, update, and delete their own files
- Storage policies ensure users can only access files in their own folder (`userId/`)

## Troubleshooting

### 404 Errors
If you see 404 errors:
1. Verify the `files` table exists
2. Check that RLS policies are created correctly
3. Ensure you're authenticated

### Storage Upload Errors
If uploads fail:
1. Verify the `files` bucket exists
2. Check storage policies are applied
3. Verify the bucket is not set to "Public" if you want private files
4. Check file size limits

### Permission Errors
If you see permission errors:
1. Verify RLS policies are active
2. Check that `auth.uid()` returns the correct user ID
3. Ensure the user is authenticated


