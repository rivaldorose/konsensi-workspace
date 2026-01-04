'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export interface FileComment {
  id: string
  file_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

// Fetch comments for a file
export function useComments(fileId: string | null | undefined) {
  return useQuery({
    queryKey: ['comments', fileId],
    queryFn: async () => {
      if (!fileId) return []
      
      const supabase = createClient()
      
      const { data: comments, error } = await supabase
        .from('file_comments')
        .select('id, file_id, user_id, content, created_at, updated_at')
        .eq('file_id', fileId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      if (!comments || comments.length === 0) return []
      
      // Get unique user IDs
      const userIds = new Set<string>()
      comments.forEach(comment => {
        if (comment.user_id) userIds.add(comment.user_id)
      })
      
      // Fetch user data
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
      
      const transformed: FileComment[] = comments.map((comment: any): FileComment => ({
        ...comment,
        user: comment.user_id ? (userMap.get(comment.user_id) || undefined) : undefined,
      }))
      
      return transformed
    },
    enabled: !!fileId,
    staleTime: 30000,
  })
}

// Create a comment
export function useCreateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ fileId, content }: { fileId: string; content: string }) => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('file_comments')
        .insert({
          file_id: fileId,
          user_id: user.id,
          content: content.trim(),
        })
        .select('id, file_id, user_id, content, created_at, updated_at')
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ['comments', data.file_id] })
    },
  })
}

// Delete a comment
export function useDeleteComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ commentId, fileId }: { commentId: string; fileId: string }) => {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('file_comments')
        .delete()
        .eq('id', commentId)
      
      if (error) throw error
      return { commentId, fileId }
    },
    onSuccess: (data) => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ['comments', data.fileId] })
    },
  })
}

// Update a comment
export function useUpdateComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ commentId, fileId, content }: { commentId: string; fileId: string; content: string }) => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('file_comments')
        .update({
          content: content.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', commentId)
        .select('id, file_id, user_id, content, created_at, updated_at')
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      // Invalidate comments query to refetch
      queryClient.invalidateQueries({ queryKey: ['comments', data.file_id] })
    },
  })
}

