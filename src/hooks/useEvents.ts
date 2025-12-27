import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Event } from '@/types'

export function useEvents(filters?: {
  status?: Event['status']
  type?: Event['type']
  priority?: Event['priority']
}) {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('events')
        .select(`
          *,
          owner:users!events_owner_id_fkey(id, full_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.type) {
        query = query.eq('type', filters.type)
      }
      if (filters?.priority) {
        query = query.eq('priority', filters.priority)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as Event[]
    },
  })
}

export function useEventStats() {
  return useQuery({
    queryKey: ['events', 'stats'],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data: allEvents, error } = await supabase
        .from('events')
        .select('status')

      if (error) throw error

      const active = allEvents?.filter(e => e.status === 'active').length || 0
      const upcoming = allEvents?.filter(e => e.status === 'planning').length || 0
      const completed = allEvents?.filter(e => e.status === 'completed').length || 0
      const total = allEvents?.length || 0

      return {
        active,
        upcoming,
        completed,
        total,
      }
    },
  })
}

export function useEvent(id: string) {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          owner:users!events_owner_id_fkey(id, full_name, email, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Event
    },
    enabled: !!id,
  })
}

export function useCreateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'owner'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('events')
        .insert({
          ...event,
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', 'stats'] })
    },
  })
}

export function useUpdateEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Event> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Event
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', 'stats'] })
    },
  })
}

export function useDeleteEvent() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      queryClient.invalidateQueries({ queryKey: ['events', 'stats'] })
    },
  })
}

