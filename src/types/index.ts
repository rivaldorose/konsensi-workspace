export interface User {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  role: 'admin' | 'manager' | 'member'
  created_at: string
  updated_at: string
}

export interface App {
  id: string
  name: string
  description: string
  icon: string
  status: 'idea' | 'development' | 'beta' | 'live' | 'paused' | 'archived'
  category: string
  launch_date?: string
  production_url?: string
  staging_url?: string
  github_url?: string
  owner_id: string
  owner?: User
  team_members: string[]
  tech_stack?: {
    frontend?: string[]
    backend?: string[]
    ai?: string[]
  }
  metrics?: {
    active_users?: number
    satisfaction?: number
    feedback_count?: number
  }
  created_at: string
  updated_at: string
}

export interface Partner {
  id: string
  name: string
  type: string
  sector: string
  contact_name: string
  contact_email: string
  contact_phone?: string
  status: 'to_contact' | 'in_gesprek' | 'active' | 'paused'
  partnership_start?: string
  contract_end?: string
  annual_value?: number
  owner_id: string
  owner?: User
  next_action?: string
  next_action_date?: string
  tags: string[]
  notes?: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  name: string
  description: string
  type: 'pilot' | 'launch' | 'funding' | 'partnership' | 'campaign' | 'other'
  status: 'planning' | 'active' | 'completed' | 'on_hold'
  priority: 'critical' | 'high' | 'medium' | 'low'
  start_date: string
  end_date: string
  progress: number
  owner_id: string
  owner?: User
  team_members: string[]
  budget_total?: number
  budget_spent?: number
  success_criteria: string[]
  tags: string[]
  created_at: string
  updated_at: string
}

export interface Goal {
  id: string
  title: string
  objective: string
  category: 'product' | 'partnerships' | 'funding' | 'marketing' | 'operations' | 'team'
  quarter: string
  start_date: string
  target_date: string
  priority: 'critical' | 'high' | 'medium' | 'low'
  owner_id: string
  owner?: User
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed'
  progress: number
  event_id?: string
  created_at: string
  updated_at: string
}

