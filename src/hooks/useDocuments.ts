import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Document } from '@/types/document'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const supabase = createClient()
      
      // First, get documents without joins for better performance
      const { data: docs, error: docsError } = await supabase
        .from('documents')
        .select('id, title, type, document_mode, file_name, file_size, file_type, file_url, file_path, folder_id, status, owner_id, last_edited_by_id, is_favorite, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(100)
      
      if (docsError) throw docsError
      if (!docs || docs.length === 0) return []
      
      // Get unique user IDs
      const userIds = new Set<string>()
      docs.forEach(doc => {
        if (doc.owner_id) userIds.add(doc.owner_id)
        if (doc.last_edited_by_id) userIds.add(doc.last_edited_by_id)
      })
      
      // Fetch users in one query (only if we have user IDs)
      let userMap = new Map()
      if (userIds.size > 0) {
        const { data: users, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(userIds))
        
        if (usersError) throw usersError
        
        // Create a map for quick user lookup
        userMap = new Map((users || []).map((user: any) => [user.id, user]))
      }
      
      // Transform documents with user data
      const transformed: Document[] = docs.map((doc: any): Document => ({
        ...doc,
        owner: doc.owner_id ? (userMap.get(doc.owner_id) || undefined) : undefined,
        last_edited_by: doc.last_edited_by_id ? (userMap.get(doc.last_edited_by_id) || undefined) : undefined,
      }))
      
      return transformed
    },
    staleTime: 60000, // Cache for 60 seconds (increased from 30)
    gcTime: 300000, // Keep in cache for 5 minutes
  })
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ['document', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('*, owner:users(*), last_edited_by:users(*), collaborators:document_collaborators(*, user:users(*))')
        .eq('id', id)
        .single()
      
      if (error) throw error
      // Transform the data to match Document type - Supabase returns owner and last_edited_by as arrays
      const owner = Array.isArray((data as any).owner) ? ((data as any).owner[0] || null) : ((data as any).owner || null)
      const lastEditedBy = Array.isArray((data as any).last_edited_by) ? ((data as any).last_edited_by[0] || null) : ((data as any).last_edited_by || null)
      const collaborators = ((data as any).collaborators || []).map((collab: any) => ({
        ...collab,
        user: Array.isArray(collab.user) ? (collab.user[0] || null) : (collab.user || null),
      }))
      
      const transformed: Document = {
        ...data,
        owner: owner || undefined,
        last_edited_by: lastEditedBy || undefined,
        collaborators: collaborators.length > 0 ? collaborators : undefined,
      }
      return transformed
    },
    enabled: !!id
  })
}

export function useCreateDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (document: Partial<Document>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Remove 'folder' and 'document_mode' if present - these don't exist in the database
      const { folder, document_mode, ...documentData } = document as any
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...documentData,
          owner_id: user?.id,
          last_edited_by_id: user?.id
        })
        .select('*')
        .single()
      
      if (error) {
        console.error('Create document error:', error)
        throw error
      }
      
      // Fetch users separately to avoid foreign key ambiguity
      let owner, lastEditedBy
      if (data.owner_id) {
        const { data: ownerData } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .eq('id', data.owner_id)
          .single()
        owner = ownerData || undefined
      }
      if (data.last_edited_by_id) {
        const { data: lastEditedData } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .eq('id', data.last_edited_by_id)
          .single()
        lastEditedBy = lastEditedData || undefined
      }
      
      const transformed: Document = {
        ...data,
        owner: owner,
        last_edited_by: lastEditedBy,
      }
      return transformed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Document> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select('*, owner:users!documents_owner_id_fkey(*), last_edited_by:users!documents_last_edited_by_id_fkey(*), collaborators:document_collaborators(*, user:users(*))')
        .single()
      
      if (error) throw error
      // Transform the data to match Document type - Supabase returns owner and last_edited_by as arrays
      const owner = Array.isArray((data as any).owner) ? ((data as any).owner[0] || null) : ((data as any).owner || null)
      const lastEditedBy = Array.isArray((data as any).last_edited_by) ? ((data as any).last_edited_by[0] || null) : ((data as any).last_edited_by || null)
      const collaborators = ((data as any).collaborators || []).map((collab: any) => ({
        ...collab,
        user: Array.isArray(collab.user) ? (collab.user[0] || null) : (collab.user || null),
      }))
      
      const transformed: Document = {
        ...data,
        owner: owner || undefined,
        last_edited_by: lastEditedBy || undefined,
        collaborators: collaborators.length > 0 ? collaborators : undefined,
      }
      return transformed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (document: Document | string) => {
      const supabase = createClient()
      
      // If it's a string (id), fetch the document first
      let doc: Document | null = null
      if (typeof document === 'string') {
        const { data, error: fetchError } = await supabase
          .from('documents')
          .select('*')
          .eq('id', document)
          .single()
        
        if (fetchError) throw fetchError
        doc = data as Document
      } else {
        doc = document
      }
      
      // If it's a file document, delete from storage first
      if (doc && doc.document_mode === 'file' && doc.file_path) {
        const { error: storageError } = await supabase
          .storage
          .from('documents')
          .remove([doc.file_path])
        
        if (storageError) throw storageError
      }
      
      // Delete document record
      const docId = typeof document === 'string' ? document : document.id
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', docId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

export function useUploadDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      folderId, 
      title,
      type = 'doc'
    }: { 
      file: File
      folderId?: string | null
      title?: string
      type?: 'doc' | 'sheet' | 'slide' | 'pdf'
    }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024 // 10MB
      if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit')
      }
      
      // Create file path: userId/folderId/fileName
      const fileExt = file.name.split('.').pop()
      const timestamp = Date.now()
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
      const fileName = `${timestamp}_${sanitizedFileName}`
      const folderPath = folderId ? folderId : 'root'
      const filePath = `${user.id}/${folderPath}/${fileName}`
      
      // Upload to Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('documents')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('documents')
        .getPublicUrl(filePath)
      
      // Determine document type based on file extension
      let docType: 'doc' | 'sheet' | 'slide' | 'pdf' = 'doc'
      const fileTypeLower = file.type.toLowerCase()
      if (fileTypeLower.includes('pdf')) docType = 'pdf'
      else if (fileTypeLower.includes('sheet') || fileTypeLower.includes('excel') || fileExt === 'xls' || fileExt === 'xlsx') docType = 'sheet'
      else if (fileTypeLower.includes('presentation') || fileTypeLower.includes('powerpoint') || fileExt === 'ppt' || fileExt === 'pptx') docType = 'slide'
      else docType = 'doc'
      
      // Create document record
      const { data, error } = await supabase
        .from('documents')
        .insert({
          type: docType,
          document_mode: 'file',
          title: title || file.name.replace(/\.[^/.]+$/, ''), // Remove extension from title
          file_name: file.name,
          file_size: file.size,
          file_type: file.type,
          file_url: publicUrl,
          file_path: filePath,
          folder: folderId || null,
          folder_id: folderId || null,
          owner_id: user.id,
          last_edited_by_id: user.id,
          status: 'draft',
          is_favorite: false
        })
        .select('*, owner:users!documents_owner_id_fkey(*), last_edited_by:users!documents_last_edited_by_id_fkey(*)')
        .single()
      
      if (error) throw error
      
      // Transform the data to match Document type
      const owner = Array.isArray((data as any).owner) ? ((data as any).owner[0] || null) : ((data as any).owner || null)
      const lastEditedBy = Array.isArray((data as any).last_edited_by) ? ((data as any).last_edited_by[0] || null) : ((data as any).last_edited_by || null)
      
      const transformed: Document = {
        ...data,
        owner: owner || undefined,
        last_edited_by: lastEditedBy || undefined,
      }
      return transformed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

export function useDownloadDocument() {
  return useMutation({
    mutationFn: async (doc: Document) => {
      if (!doc.file_url) {
        throw new Error('No file URL available')
      }
      
      // Fetch file
      const response = await fetch(doc.file_url)
      if (!response.ok) {
        throw new Error('Failed to download file')
      }
      
      const blob = await response.blob()
      
      // Create download link
      const url = window.URL.createObjectURL(blob)
      const a = window.document.createElement('a')
      a.href = url
      a.download = doc.file_name || doc.title
      window.document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      window.document.body.removeChild(a)
    }
  })
}

