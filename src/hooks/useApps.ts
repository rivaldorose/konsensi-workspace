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

export function useAppTeam(appId: string) {
  return useQuery({
    queryKey: ['app-team', appId],
    queryFn: async () => {
      const supabase = createClient()
      
      // First get the app to get team_members array
      const { data: app, error: appError } = await supabase
        .from('apps')
        .select('team_members, owner_id')
        .eq('id', appId)
        .single()
      
      if (appError) throw appError
      if (!app) return []
      
      // Get all team member IDs (owner + team_members array)
      const teamMemberIds = [
        app.owner_id,
        ...(app.team_members || [])
      ].filter((id, index, self) => id && self.indexOf(id) === index) // Remove duplicates
      
      if (teamMemberIds.length === 0) return []
      
      // Fetch users for all team members
      const { data: users, error: usersError } = await supabase
        .from('users')
        .select('id, full_name, email, avatar_url')
        .in('id', teamMemberIds)
      
      if (usersError) throw usersError
      
      // Map to team member format with role
      return (users || []).map((user) => ({
        id: user.id,
        user_id: user.id,
        app_id: appId,
        role: (user.id === app.owner_id ? 'owner' : 'member') as 'owner' | 'admin' | 'member',
        user: {
          id: user.id,
          full_name: user.full_name || '',
          email: user.email || '',
          avatar_url: user.avatar_url
        },
        created_at: new Date().toISOString() // This is just for compatibility
      }))
    },
    enabled: !!appId
  })
}
