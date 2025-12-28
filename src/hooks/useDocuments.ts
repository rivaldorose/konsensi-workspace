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
        .select('*, owner:users(*), last_edited_by:users(*), collaborators:document_collaborators(*, user:users(*))')
        .order('updated_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      // Transform the data to match Document type
      const transformed = (data || []).map((doc: any) => ({
        ...doc,
        last_edited_by: Array.isArray(doc.last_edited_by) ? doc.last_edited_by[0] : doc.last_edited_by,
        owner: Array.isArray(doc.owner) ? doc.owner[0] : doc.owner,
      }))
      return transformed as Document[]
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
      return data as Document
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
      return data
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
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

export function useDeleteDocument() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('documents')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] })
    }
  })
}

