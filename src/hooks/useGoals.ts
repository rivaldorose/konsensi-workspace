import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Goal } from '@/types'

export function useGoals(filters?: {
  status?: Goal['status']
  category?: Goal['category']
  quarter?: string
}) {
  return useQuery({
    queryKey: ['goals', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('goals')
        .select(`
          *,
          owner:users!goals_owner_id_fkey(id, full_name, email, avatar_url),
          event:events!goals_event_id_fkey(id, name)
        `)
        .order('created_at', { ascending: false })

      if (filters?.status) {
        query = query.eq('status', filters.status)
      }
      if (filters?.category) {
        query = query.eq('category', filters.category)
      }
      if (filters?.quarter) {
        query = query.eq('quarter', filters.quarter)
      }

      const { data, error } = await query

      if (error) throw error
      return (data || []) as Goal[]
    },
  })
}

export function useGoalStats() {
  return useQuery({
    queryKey: ['goals', 'stats'],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data: allGoals, error } = await supabase
        .from('goals')
        .select('status, progress')

      if (error) throw error

      const total = allGoals?.length || 0
      const completed = allGoals?.filter(g => g.status === 'completed').length || 0
      const onTrack = allGoals?.filter(g => g.status === 'on_track').length || 0
      const atRisk = allGoals?.filter(g => g.status === 'at_risk').length || 0
      const overallProgress = total > 0 
        ? Math.round(allGoals!.reduce((sum, g) => sum + (g.progress || 0), 0) / total)
        : 0

      return {
        total,
        completed,
        onTrack,
        atRisk,
        overallProgress,
      }
    },
  })
}

export function useCreateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (goal: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'owner' | 'event'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          owner_id: user.id,
        })
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goals', 'stats'] })
    },
  })
}

export function useGoal(id: string | undefined) {
  return useQuery({
    queryKey: ['goals', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('goals')
        .select(`
          *,
          owner:users!goals_owner_id_fkey(id, full_name, email, avatar_url),
          event:events!goals_event_id_fkey(id, name)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Goal
    },
    enabled: !!id,
  })
}

export function useUpdateGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Goal> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data as Goal
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goals', 'stats'] })
    },
  })
}

export function useDeleteGoal() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase.from('goals').delete().eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goals', 'stats'] })
    },
  })
}

