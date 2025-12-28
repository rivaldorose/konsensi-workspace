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
      // Transform the data to match Document type - Supabase returns owner and last_edited_by as arrays
      const transformed = (data || []).map((doc: any) => {
        const owner = Array.isArray(doc.owner) ? (doc.owner[0] || null) : (doc.owner || null)
        const lastEditedBy = Array.isArray(doc.last_edited_by) ? (doc.last_edited_by[0] || null) : (doc.last_edited_by || null)
        const collaborators = (doc.collaborators || []).map((collab: any) => ({
          ...collab,
          user: Array.isArray(collab.user) ? (collab.user[0] || null) : (collab.user || null),
        }))
        
        return {
          ...doc,
          owner: owner || undefined,
          last_edited_by: lastEditedBy || undefined,
          collaborators: collaborators.length > 0 ? collaborators : undefined,
        } as Document
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

