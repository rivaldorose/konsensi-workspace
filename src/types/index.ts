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
  description?: string
  icon?: string
  status: 'idea' | 'development' | 'beta' | 'live' | 'paused' | 'archived'
  category: string
  launch_date?: string
  
  // URLs
  production_url?: string
  staging_url?: string
  development_url?: string
  github_url?: string
  docs_url?: string
  
  // Owner
  owner_id: string
  owner?: User
  team_members?: string[]
  
  // Tech Stack
  tech_stack?: {
    frontend?: string[]
    backend?: string[]
    hosting?: string[]
    integrations?: string[]
    ai?: string[]
  }
  
  // Metrics (optional, can be calculated)
  metrics?: {
    active_users?: number
    user_growth_percentage?: number
    monthly_cost?: number
    cost_change_percentage?: number
    uptime_percentage?: number
    uptime_change_percentage?: number
    open_issues?: number
    satisfaction?: number
    feedback_count?: number
  }
  
  // Version & Deployment
  version?: string
  last_deploy?: string
  
  // Key Features
  key_features?: string[]
  
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

// Legacy Goal interface - use roadmap.ts for new code
export interface Goal {
  id: string
  title: string
  objective?: string
  category: 'product' | 'partnerships' | 'funding' | 'marketing' | 'operations' | 'team' | 'Product' | 'Growth' | 'Funding' | 'Team' | 'Apps' | 'Partners' | 'Marketing'
  quarter: string
  start_date: string
  target_date?: string
  due_date?: string
  priority: 'critical' | 'high' | 'medium' | 'low' | 'none'
  owner_id: string
  owner?: User
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed' | 'in_progress' | 'behind' | 'complete'
  progress: number
  event_id?: string
  emoji?: string
  year?: number
  kanban_column?: string
  kanban_position?: number
  completed_at?: string
  created_at: string
  updated_at: string
}

export * from './marketing'
export * from './document'
export * from './contract'
export * from './roadmap'

