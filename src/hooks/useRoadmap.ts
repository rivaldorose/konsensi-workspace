import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Goal, RoadmapItem, Milestone, GoalMetrics, KeyResult } from '@/types/roadmap'
import type { User } from '@/types'

// Fetch all goals
export function useGoals(filters?: {
  status?: string
  category?: string
  year?: number
}) {
  return useQuery({
    queryKey: ['goals', filters],
    queryFn: async () => {
      const supabase = createClient()
      let query = supabase
        .from('goals')
        .select('id, title, category, quarter, year, status, priority, progress, owner_id, start_date, due_date, target_date, completed_at, kanban_column, kanban_position, created_at, updated_at, objective, event_id, emoji')
        .order('created_at', { ascending: false })
      
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }
      if (filters?.year) {
        query = query.eq('year', filters.year)
      }
      
      const { data: goals, error: goalsError } = await query
      if (goalsError) throw goalsError
      if (!goals || goals.length === 0) return []
      
      // Get unique owner IDs
      const ownerIds = new Set<string>()
      goals.forEach(goal => {
        if (goal.owner_id) ownerIds.add(goal.owner_id)
      })
      
      let owners: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (ownerIds.size > 0) {
        const { data: fetchedOwners, error: ownersError } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(ownerIds))
        
        if (ownersError) throw ownersError
        owners = (fetchedOwners || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      // Create a map for quick owner lookup
      const ownerMap = new Map(owners.map(owner => [owner.id, owner]))
      
      // Transform goals with owner data
      const transformed: Goal[] = goals.map((goal: any): Goal => ({
        ...goal,
        emoji: goal.emoji || '🎯',
        owner: goal.owner_id ? (ownerMap.get(goal.owner_id) || undefined) : undefined,
      }))
      
      return transformed
    },
    staleTime: 30000,
  })
}

// Fetch roadmap items (converted from goals/events)
export function useRoadmapItems(year: number = 2025) {
  return useQuery({
    queryKey: ['roadmap-items', year],
    queryFn: async () => {
      const supabase = createClient()
      
      // Fetch goals for the year
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title, category, quarter, year, start_date, target_date, due_date, progress, owner_id')
        .eq('year', year)
      
      if (goalsError) throw goalsError
      
      // Transform goals to roadmap items
      const items: RoadmapItem[] = (goals || []).map((goal: any) => {
        const startDate = new Date(goal.start_date || goal.created_at)
        const endDate = new Date(goal.due_date || goal.target_date || goal.start_date)
        
        // Determine quarters
        const getQuarter = (date: Date): 'Q1' | 'Q2' | 'Q3' | 'Q4' => {
          const month = date.getMonth()
          if (month < 3) return 'Q1'
          if (month < 6) return 'Q2'
          if (month < 9) return 'Q3'
          return 'Q4'
        }
        
        const categoryMap: Record<string, 'Product' | 'Funding' | 'Team' | 'Apps' | 'Partners'> = {
          'product': 'Product',
          'funding': 'Funding',
          'team': 'Team',
          'apps': 'Apps',
          'partners': 'Partners',
          'marketing': 'Product',
          'growth': 'Product',
        }
        
        const colors = {
          'Product': '#10b981',
          'Funding': '#f59e0b',
          'Team': '#3b82f6',
          'Apps': '#8b5cf6',
          'Partners': '#ec4899',
        }
        
        return {
          id: goal.id,
          category: categoryMap[goal.category?.toLowerCase() || 'product'] || 'Product',
          title: goal.title,
          quarter_start: getQuarter(startDate),
          quarter_end: getQuarter(endDate),
          start_date: goal.start_date || goal.created_at,
          end_date: goal.due_date || goal.target_date || goal.start_date,
          progress: goal.progress || 0,
          color: colors[categoryMap[goal.category?.toLowerCase() || 'product'] || 'Product'],
          owner_id: goal.owner_id,
          year: goal.year || year,
        } as RoadmapItem
      })
      
      return items
    },
    staleTime: 30000,
  })
}

// Fetch milestones (converted from goals)
export function useMilestones(year: number = 2025) {
  return useQuery({
    queryKey: ['milestones', year],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .select('id, title, category, owner_id, start_date, target_date, due_date, progress, status, emoji, created_at')
        .eq('year', year)
        .order('start_date')
      
      if (goalsError) throw goalsError
      
      // Get owners
      const ownerIds = new Set<string>()
      goals?.forEach(goal => {
        if (goal.owner_id) ownerIds.add(goal.owner_id)
      })
      
      let owners: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (ownerIds.size > 0) {
        const { data: fetchedOwners } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(ownerIds))
        
        owners = (fetchedOwners || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const ownerMap = new Map(owners.map(owner => [owner.id, owner]))
      
      const milestones: Milestone[] = (goals || []).map((goal: any): Milestone => ({
        id: goal.id,
        title: goal.title,
        emoji: goal.emoji || '🎯',
        category: goal.category || 'Product',
        owner_id: goal.owner_id,
        owner: goal.owner_id ? (ownerMap.get(goal.owner_id) || undefined) : undefined,
        start_date: goal.start_date || goal.created_at,
        end_date: goal.due_date || goal.target_date || goal.start_date,
        progress: goal.progress || 0,
        status: (goal.status === 'on_track' ? 'on_track' : goal.status === 'at_risk' ? 'at_risk' : goal.status === 'behind' ? 'behind' : goal.status === 'completed' || goal.status === 'complete' ? 'complete' : 'on_track') as Milestone['status'],
        key_milestones: [],
        created_at: goal.created_at,
      }))
      
      return milestones
    },
    staleTime: 30000,
  })
}

// Fetch goal metrics
export function useGoalMetrics() {
  return useQuery({
    queryKey: ['goal-metrics'],
    queryFn: async () => {
      const supabase = createClient()
      
      // Get all goals
      const { data: goals } = await supabase
        .from('goals')
        .select('*')
      
      if (!goals || goals.length === 0) {
        return {
          total_goals: 0,
          on_track: 0,
          at_risk: 0,
          complete: 0,
          behind: 0,
          average_progress: 0,
          completion_trend: [],
          category_progress: [],
          top_performers: [],
          needs_attention: [],
        } as GoalMetrics
      }
      
      // Calculate metrics
      const metrics: GoalMetrics = {
        total_goals: goals.length,
        on_track: goals.filter(g => g.status === 'on_track').length,
        at_risk: goals.filter(g => g.status === 'at_risk').length,
        complete: goals.filter(g => g.status === 'complete' || g.status === 'completed').length,
        behind: goals.filter(g => g.status === 'behind').length,
        average_progress: goals.reduce((sum, g) => sum + (g.progress || 0), 0) / goals.length,
        completion_trend: [],
        category_progress: [],
        top_performers: goals
          .sort((a, b) => (b.progress || 0) - (a.progress || 0))
          .slice(0, 3)
          .map(g => ({ goal: g as Goal, progress: g.progress || 0 })),
        needs_attention: goals
          .filter(g => g.status === 'at_risk' || g.status === 'behind')
          .sort((a, b) => (a.progress || 0) - (b.progress || 0))
          .slice(0, 3)
          .map(g => ({ goal: g as Goal, progress: g.progress || 0 })),
      }
      
      // Calculate category progress
      const categories = new Set(goals.map(g => g.category))
      metrics.category_progress = Array.from(categories).map(category => {
        const categoryGoals = goals.filter(g => g.category === category)
        const avgProgress = categoryGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / categoryGoals.length
        return {
          category,
          progress: avgProgress,
          goal_count: categoryGoals.length,
        }
      })
      
      return metrics
    },
    staleTime: 60000,
  })
}

// Create goal
export function useCreateGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (goal: Partial<Goal>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('goals')
        .insert({
          ...goal,
          owner_id: user?.id,
          progress: 0,
          status: 'not_started',
          kanban_column: 'not_started',
          kanban_position: 0,
          emoji: goal.emoji || '🎯',
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goal-metrics'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap-items'] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
    }
  })
}

// Update goal
export function useUpdateGoal() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Goal> }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('goals')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goal-metrics'] })
      queryClient.invalidateQueries({ queryKey: ['roadmap-items'] })
      queryClient.invalidateQueries({ queryKey: ['milestones'] })
    }
  })
}

// Update goal kanban position
export function useUpdateGoalKanban() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      column, 
      position 
    }: { 
      id: string
      column: string
      position: number
    }) => {
      const supabase = createClient()
      
      // Map column to status
      const statusMap: Record<string, Goal['status']> = {
        'not_started': 'not_started',
        'in_progress': 'in_progress',
        'on_track': 'on_track',
        'complete': 'complete',
      }
      
      const { data, error } = await supabase
        .from('goals')
        .update({
          kanban_column: column,
          kanban_position: position,
          status: statusMap[column] || 'not_started',
        })
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals'] })
      queryClient.invalidateQueries({ queryKey: ['goal-metrics'] })
    }
  })
}

