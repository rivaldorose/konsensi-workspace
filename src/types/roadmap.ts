import type { User } from './index'

export interface Goal {
  id: string
  title: string
  emoji: string
  category: 'Product' | 'Growth' | 'Funding' | 'Team' | 'Apps' | 'Partners' | 'Marketing'
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  year: number
  status: 'not_started' | 'in_progress' | 'on_track' | 'at_risk' | 'behind' | 'complete'
  priority: 'critical' | 'high' | 'medium' | 'low' | 'none'
  
  // Progress
  progress: number // 0-100
  
  // Key Results (OKRs)
  key_results?: KeyResult[]
  
  // Team
  owner_id: string
  owner?: User
  team_members?: User[]
  
  // Dates
  start_date: string
  due_date: string
  completed_at?: string
  
  // Position (for Kanban)
  kanban_column?: 'not_started' | 'in_progress' | 'on_track' | 'complete'
  kanban_position?: number
  
  // Legacy fields (for compatibility)
  objective?: string
  target_date?: string
  event_id?: string
  
  created_at: string
  updated_at: string
}

export interface KeyResult {
  id: string
  goal_id: string
  title: string
  status: 'complete' | 'in_progress' | 'not_started'
  progress: number // 0-100
  order: number
  created_at?: string
  updated_at?: string
}

export interface RoadmapItem {
  id: string
  category: 'Product' | 'Funding' | 'Team' | 'Apps' | 'Partners'
  title: string
  quarter_start: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  quarter_end: 'Q1' | 'Q2' | 'Q3' | 'Q4'
  start_date: string
  end_date: string
  progress: number
  color: string
  owner_id?: string
  owner?: User
  year: number
  created_at?: string
  updated_at?: string
}

export interface Milestone {
  id: string
  title: string
  emoji: string
  category: string
  owner_id: string
  owner?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
  start_date: string
  end_date: string
  progress: number
  status: 'on_track' | 'at_risk' | 'behind' | 'complete'
  key_milestones?: {
    title: string
    date: string
    status: 'complete' | 'in_progress' | 'not_started'
  }[]
  created_at: string
  updated_at?: string
}

export interface GoalMetrics {
  total_goals: number
  on_track: number
  at_risk: number
  complete: number
  behind: number
  average_progress: number
  completion_trend: {
    month: string
    on_track: number
    at_risk: number
    behind: number
  }[]
  category_progress: {
    category: string
    progress: number
    goal_count: number
  }[]
  top_performers: {
    goal: Goal
    progress: number
  }[]
  needs_attention: {
    goal: Goal
    progress: number
  }[]
}

