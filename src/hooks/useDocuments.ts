import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Document } from '@/types/document'

export function useDocuments() {
  return useQuery({
    queryKey: ['documents'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .select('id, title, type, document_mode, file_name, file_size, file_type, file_url, file_path, folder_id, status, owner_id, last_edited_by_id, is_favorite, created_at, updated_at, owner:users!documents_owner_id_fkey(id, full_name, email, avatar_url), last_edited_by:users!documents_last_edited_by_id_fkey(id, full_name, email, avatar_url)')
        .order('updated_at', { ascending: false })
        .limit(50)
      
      if (error) throw error
      // Transform the data to match Document type - Supabase returns owner and last_edited_by as arrays
      const transformed: Document[] = (data || []).map((doc: any): Document => {
        const owner = Array.isArray(doc.owner) ? (doc.owner[0] || null) : (doc.owner || null)
        const lastEditedBy = Array.isArray(doc.last_edited_by) ? (doc.last_edited_by[0] || null) : (doc.last_edited_by || null)
        
        return {
          ...doc,
          owner: owner || undefined,
          last_edited_by: lastEditedBy || undefined,
        }
      })
      return transformed
    },
    staleTime: 30000, // Cache for 30 seconds
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
      
      const { data, error } = await supabase
        .from('documents')
        .insert({
          ...document,
          owner_id: user?.id,
          last_edited_by_id: user?.id
        })
        .select('*, owner:users(*), last_edited_by:users(*), collaborators:document_collaborators(*, user:users(*))')
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

export function useUpdateDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Document> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('documents')
        .update(updates)
        .eq('id', id)
        .select('*, owner:users(*), last_edited_by:users(*), collaborators:document_collaborators(*, user:users(*))')
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
        .select('*, owner:users(*), last_edited_by:users(*)')
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

