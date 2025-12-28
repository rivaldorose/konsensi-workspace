import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .order('full_name', { ascending: true })

      if (error) throw error
      return (data || []) as User[]
    },
  })
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) return null

      const { data, error } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .eq('id', authUser.id)
        .single()

      if (error) throw error
      return data as User
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<User> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as User
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
    }
  })
}

