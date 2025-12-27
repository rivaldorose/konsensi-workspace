import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { App } from '@/types'

export function useApps() {
  return useQuery({
    queryKey: ['apps'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('apps')
        .select('*, owner:users(*)')
        .order('created_at', { ascending: false })
      
      if (error) throw error
      return (data || []) as App[]
    }
  })
}

export function useApp(id: string | undefined) {
  return useQuery({
    queryKey: ['app', id],
    queryFn: async () => {
      if (!id) return null
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('apps')
        .select('*, owner:users(*)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as App
    },
    enabled: !!id
  })
}

export function useUpdateApp() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<App> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('apps')
        .update(updates)
        .eq('id', id)
        .select('*, owner:users(*)')
        .single()
      
      if (error) throw error
      return data as App
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
      queryClient.invalidateQueries({ queryKey: ['app', data.id] })
    }
  })
}

export function useCreateApp() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (app: Partial<App>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('apps')
        .insert({
          ...app,
          owner_id: user.id
        })
        .select('*, owner:users(*)')
        .single()
      
      if (error) throw error
      return data as App
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    }
  })
}

export function useDeleteApp() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('apps')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['apps'] })
    }
  })
}

