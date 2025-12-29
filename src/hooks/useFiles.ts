'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { FileItem } from '@/types/files'
import type { User } from '@/types'

// Fetch files in a folder
export function useFiles(folderId?: string | null) {
  return useQuery({
    queryKey: ['files', folderId],
    queryFn: async () => {
      const supabase = createClient()
      
      // First get files
      let query = supabase
        .from('files')
        .select('id, name, type, mime_type, size, parent_id, file_url, storage_path, is_favorite, created_by, created_at, updated_at')
        .order('type', { ascending: false }) // Folders first
        .order('created_at', { ascending: false })
      
      if (folderId && folderId !== 'all') {
        query = query.eq('parent_id', folderId)
      } else {
        query = query.is('parent_id', null)
      }
      
      const { data: files, error: filesError } = await query
      
      if (filesError) throw filesError
      if (!files || files.length === 0) return []
      
      // Get unique created_by IDs
      const userIds = new Set<string>()
      files.forEach(file => {
        if (file.created_by) userIds.add(file.created_by)
      })
      
      let users: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (userIds.size > 0) {
        const { data: fetchedUsers, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(userIds))
        
        if (usersError) throw usersError
        users = (fetchedUsers || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const userMap = new Map(users.map(user => [user.id, user]))
      
      const transformed: FileItem[] = files.map((file: any): FileItem => ({
        ...file,
        created_by_user: file.created_by ? (userMap.get(file.created_by) || undefined) : undefined,
      }))
      
      return transformed
    },
    staleTime: 30000,
  })
}

// Fetch favorite files
export function useFavoriteFiles() {
  return useQuery({
    queryKey: ['files', 'favorites'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: files, error: filesError } = await supabase
        .from('files')
        .select('id, name, type, mime_type, size, parent_id, file_url, storage_path, is_favorite, created_by, created_at, updated_at')
        .eq('is_favorite', true)
        .order('created_at', { ascending: false })
      
      if (filesError) throw filesError
      if (!files || files.length === 0) return []
      
      const userIds = new Set<string>()
      files.forEach(file => {
        if (file.created_by) userIds.add(file.created_by)
      })
      
      let users: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (userIds.size > 0) {
        const { data: fetchedUsers } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(userIds))
        
        users = (fetchedUsers || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const userMap = new Map(users.map(user => [user.id, user]))
      
      return files.map((file: any): FileItem => ({
        ...file,
        created_by_user: file.created_by ? (userMap.get(file.created_by) || undefined) : undefined,
      }))
    },
    staleTime: 30000,
  })
}

// Fetch recent files
export function useRecentFiles() {
  return useQuery({
    queryKey: ['files', 'recent'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: files, error: filesError } = await supabase
        .from('files')
        .select('id, name, type, mime_type, size, parent_id, file_url, storage_path, is_favorite, created_by, created_at, updated_at')
        .order('updated_at', { ascending: false })
        .limit(10)
      
      if (filesError) throw filesError
      if (!files || files.length === 0) return []
      
      const userIds = new Set<string>()
      files.forEach(file => {
        if (file.created_by) userIds.add(file.created_by)
      })
      
      let users: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (userIds.size > 0) {
        const { data: fetchedUsers } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(userIds))
        
        users = (fetchedUsers || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const userMap = new Map(users.map(user => [user.id, user]))
      
      return files.map((file: any): FileItem => ({
        ...file,
        created_by_user: file.created_by ? (userMap.get(file.created_by) || undefined) : undefined,
      }))
    },
    staleTime: 30000,
  })
}

// Fetch folders for sidebar
export function useFolders() {
  return useQuery({
    queryKey: ['folders'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('files')
        .select('id, name, type, parent_id, is_favorite, created_by, created_at, updated_at')
        .eq('type', 'folder')
        .is('parent_id', null)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return (data || []) as FileItem[]
    },
    staleTime: 30000,
  })
}

// Create folder
export function useCreateFolder() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      name, 
      parentId 
    }: { 
      name: string
      parentId?: string | null
    }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('files')
        .insert({
          name,
          type: 'folder',
          parent_id: parentId || null,
          is_favorite: false,
          created_by: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    }
  })
}

// Upload file
export function useUploadFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      file, 
      folderId 
    }: { 
      file: File
      folderId?: string | null
    }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      // Upload to storage
      const fileName = `${user.id}/${Date.now()}-${file.name}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('files')
        .upload(fileName, file)
      
      if (uploadError) throw uploadError
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('files')
        .getPublicUrl(fileName)
      
      // Create file record
      const { data, error } = await supabase
        .from('files')
        .insert({
          name: file.name,
          type: 'file',
          mime_type: file.type,
          size: file.size,
          parent_id: folderId || null,
          file_url: publicUrl,
          storage_path: fileName,
          is_favorite: false,
          created_by: user.id
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
    }
  })
}

// Toggle favorite
export function useToggleFavorite() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      isFavorite 
    }: { 
      id: string
      isFavorite: boolean 
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('files')
        .update({ is_favorite: isFavorite })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['files', 'favorites'] })
    }
  })
}

// Delete file
export function useDeleteFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      
      // Get file info first
      const { data: fileData } = await supabase
        .from('files')
        .select('storage_path, type')
        .eq('id', id)
        .single()
      
      // If it's a file with storage, delete from storage
      if (fileData?.storage_path && fileData.type === 'file') {
        await supabase.storage
          .from('files')
          .remove([fileData.storage_path])
      }
      
      // Delete from database (cascade will delete children)
      const { error } = await supabase
        .from('files')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    }
  })
}

// Rename file/folder
export function useRenameFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      name 
    }: { 
      id: string
      name: string 
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('files')
        .update({ 
          name,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    }
  })
}

// Move file/folder
export function useMoveFile() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      parentId 
    }: { 
      id: string
      parentId: string | null 
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('files')
        .update({ 
          parent_id: parentId,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files'] })
      queryClient.invalidateQueries({ queryKey: ['folders'] })
    }
  })
}

// Fetch single file
export function useFile(id: string | null) {
  return useQuery({
    queryKey: ['file', id],
    queryFn: async () => {
      if (!id) return null
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('files')
        .select('id, name, type, mime_type, size, parent_id, file_url, storage_path, is_favorite, created_by, created_at, updated_at')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) return null
      
      let created_by_user: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'> | undefined = undefined
      if (data.created_by) {
        const { data: userData } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .eq('id', data.created_by)
          .single()
        
        created_by_user = userData || undefined
      }
      
      return {
        ...data,
        created_by_user,
      } as FileItem
    },
    enabled: !!id,
    staleTime: 30000,
  })
}

