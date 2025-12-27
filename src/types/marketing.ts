export interface MarketingPost {
  id: string
  title: string
  caption?: string
  status: 'draft' | 'scheduled' | 'published' | 'pending_review'
  scheduled_date?: string
  scheduled_time?: string
  platforms: string[] // e.g., 'linkedin', 'instagram', 'twitter'
  media_url?: string
  author_id: string
  author?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  approval_required: boolean
  approved_by?: string
  created_at: string
  updated_at: string
}

