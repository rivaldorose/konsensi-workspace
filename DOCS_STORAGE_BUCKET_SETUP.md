# Documents Storage Bucket Setup

The documents upload feature requires a Supabase Storage bucket named "documents".

## Setup Steps

### 1. Create the Storage Bucket

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **Storage** in the left sidebar
4. Click **"New bucket"**
5. Configure the bucket:
   - **Name**: `documents`
   - **Public bucket**: ❌ **Unchecked** (keep it private)
   - **File size limit**: Optional, but recommended (e.g., 10 MB)
   - **Allowed MIME types**: Leave empty for all types, or specify:
     - `application/pdf`
     - `application/vnd.openxmlformats-officedocument.wordprocessingml.document`
     - `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
     - `application/vnd.openxmlformats-officedocument.presentationml.presentation`
     - `image/*`
     - etc.

6. Click **"Create bucket"**

### 2. Set Up RLS Policies

After creating the bucket, run the SQL script `supabase/storage_setup.sql` in the Supabase SQL Editor to set up Row Level Security policies.

Alternatively, you can set up the policies manually in the Supabase Dashboard:

1. Go to **Storage** → **Policies** → **documents** bucket
2. Add the following policies:

**Policy 1: Users can upload files**
- Policy name: "Users can upload files to their own folder"
- Target roles: `authenticated`
- Operation: `INSERT`
- Policy definition:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```

**Policy 2: Users can view files**
- Policy name: "Users can view files they own"
- Target roles: `authenticated`
- Operation: `SELECT`
- Policy definition:
```sql
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
```

**Policy 3: Users can update files**
- Policy name: "Users can update files they own"
- Target roles: `authenticated`
- Operation: `UPDATE`
- Policy definition:
```sql
(storage.foldername(name))[1] = auth.uid()::text
```

**Policy 4: Users can delete files**
- Policy name: "Users can delete files they own"
- Target roles: `authenticated`
- Operation: `DELETE`
- Policy definition:
```sql
(storage.foldername(name))[1] = auth.uid()::text OR
EXISTS (
  SELECT 1 FROM public.documents
  WHERE file_path = name
  AND owner_id = auth.uid()
)
```

### 3. Test the Upload

After setting up the bucket and policies, try uploading a file through the Documents page. The error "Bucket not found" should be resolved.

## Troubleshooting

- **"Bucket not found" error**: Make sure the bucket name is exactly `documents` (lowercase, no spaces)
- **"Permission denied" error**: Check that the RLS policies are correctly set up
- **Files not appearing**: Verify that the `file_path` in the documents table matches the storage path structure


