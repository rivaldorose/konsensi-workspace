import type { User } from './index'

export type PostStatus = 'draft' | 'scheduled' | 'pending_review' | 'published'
export type PostPlatform = 'linkedin' | 'twitter' | 'instagram' | 'facebook'

export interface MarketingPost {
  id: string
  title: string
  caption?: string
  
  // Media
  media_url?: string
  media_type?: 'image' | 'video' | 'text'
  
  // Platforms
  platforms: PostPlatform[]
  
  // Status & Scheduling
  status: PostStatus
  scheduled_date?: string
  scheduled_time?: string
  published_at?: string
  
  // Author
  author_id: string
  author?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
  
  // Approval
  requires_approval?: boolean
  approved_by_id?: string
  approved_at?: string
  
  // Analytics (for published posts)
  views?: number
  likes?: number
  comments?: number
  shares?: number
  retweets?: number
  engagement_rate?: number
  
  // Legacy/compat fields
  content?: string
  campaign?: string
  tags?: string[]
  approval_required?: boolean
  approved_by?: string
  published_date?: string
  
  created_at: string
  updated_at: string
}

export interface CalendarDay {
  date: string
  day: number
  isCurrentMonth: boolean
  isToday: boolean
  posts: MarketingPost[]
}

export interface MarketingAnalytics {
  total_reach: number
  reach_change: number
  total_engagement: number
  engagement_change: number
  avg_performance: number
  performance_change: number
  net_growth: number
  
  // Stats by timeframe
  total_posts: number
  avg_likes: number
  likes_change: number
  avg_comments: number
  comments_change: number
  avg_shares: number
  shares_change: number
  
  // Engagement trend (for chart)
  engagement_trend: {
    date: string
    value: number
  }[]
  
  // Platform breakdown
  platform_performance: {
    platform: PostPlatform
    percentage: number
    posts_count: number
  }[]
  
  // Best posting times
  best_time_to_post: {
    day: string
    hour: number
    engagement_score: number
  }[]
}
