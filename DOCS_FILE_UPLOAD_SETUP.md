# Docs File Upload Setup Guide

This guide explains how to set up file upload functionality for the Documents page.

## 📋 Prerequisites

1. Supabase project configured
2. Database migrations 001 and 002 completed
3. Documents table exists

## 🗄️ Database Setup

### Step 1: Run Migration 003

Run the migration to add file fields to the documents table:

```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the contents of:
supabase/migrations/003_add_file_fields_to_documents.sql
```

This migration adds:
- `file_name` (TEXT)
- `file_size` (BIGINT)
- `file_type` (TEXT)
- `file_url` (TEXT)
- `file_path` (TEXT)
- `document_mode` (TEXT: 'text' | 'file')

### Step 2: Create Storage Bucket

1. Go to Supabase Dashboard > Storage
2. Click "Create a new bucket"
3. Configure:
   - **Name**: `documents`
   - **Public bucket**: `false` (private)
   - **File size limit**: `10485760` (10MB)
   - **Allowed MIME types**: Leave empty for all types, or specify:
     ```
     application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,image/jpeg,image/png,text/plain,text/markdown
     ```

### Step 3: Set Up Storage RLS Policies

Run the storage RLS policies SQL:

```bash
# In Supabase Dashboard > SQL Editor
# Copy and paste the contents of:
supabase/storage_setup.sql
```

This creates policies for:
- ✅ Users can upload files to their own folder
- ✅ Users can read their own files
- ✅ Users can delete their own files
- ✅ Users can update their own files (for renaming)

**File Path Structure**: `userId/folderId/fileName`
- Example: `123e4567-e89b-12d3-a456-426614174000/root/1699123456789_document.pdf`

## 🚀 Features

### Supported File Types

- **PDF**: `.pdf`
- **Word**: `.doc`, `.docx`
- **Excel**: `.xls`, `.xlsx`
- **PowerPoint**: `.ppt`, `.pptx`
- **Images**: `.jpg`, `.jpeg`, `.png`
- **Text**: `.txt`, `.md`

### File Size Limit

- **Maximum**: 10MB per file
- Validation happens client-side before upload

### Upload Methods

1. **Drag & Drop**: Drag files into the upload modal
2. **Browse**: Click "Browse Files" to select files
3. **Multiple Files**: Select multiple files at once

### Document Modes

- **Text Documents** (`document_mode: 'text'`): Tip-Tap editor documents
- **File Documents** (`document_mode: 'file'`): Uploaded files (PDF, DOCX, etc.)

## 📝 Usage

### Upload Files

1. Go to Documents page (`/docs`)
2. Click "Upload Files" button
3. Drag & drop or browse files
4. Select folder (optional)
5. Click "Upload X Files"

### Download Files

1. Click on a file document card
2. Click "Download" button (for file documents)
3. Or use the dropdown menu > "Download"

### Delete Files

1. Delete a file document (using existing delete functionality)
2. File is automatically removed from Supabase Storage
3. Document record is removed from database

## 🔧 Technical Details

### Hooks

- `useUploadDocument()`: Upload files to Supabase Storage
- `useDownloadDocument()`: Download files from storage
- `useDeleteDocument()`: Delete files (handles both database and storage)

### Components

- `UploadDocumentModal`: Modal for file uploads
- `DocumentCard`: Updated to show file info and download button

### Storage Structure

```
documents/
  ├── {userId}/
  │   ├── root/
  │   │   ├── 1699123456789_document.pdf
  │   │   └── 1699123456790_spreadsheet.xlsx
  │   └── {folderId}/
  │       └── 1699123456791_presentation.pptx
```

## ✅ Checklist

- [ ] Run migration 003_add_file_fields_to_documents.sql
- [ ] Create `documents` storage bucket
- [ ] Run storage_setup.sql for RLS policies
- [ ] Test file upload
- [ ] Test file download
- [ ] Test file deletion
- [ ] Verify file size validation (10MB limit)
- [ ] Verify file type validation

## 🐛 Troubleshooting

### Files not uploading

1. Check storage bucket exists and is named `documents`
2. Verify RLS policies are set correctly
3. Check browser console for errors
4. Verify user is authenticated

### Files not downloading

1. Check `file_url` in document record
2. Verify file exists in storage bucket
3. Check RLS policies allow read access
4. Verify file path matches storage structure

### Permission denied errors

1. Check RLS policies in `storage_setup.sql`
2. Verify user ID matches file path structure
3. Ensure user is authenticated
4. Check bucket is not public (should be private)

### File size errors

- Client-side validation: 10MB limit
- Server-side limit: Set in bucket settings (10485760 bytes = 10MB)
- Check both limits match

