import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MarketingPost, MarketingAnalytics, PostPlatform, PostStatus } from '@/types/marketing'
import type { User } from '@/types'

// Fetch all posts with filters
export function useMarketingPosts(filters?: {
  status?: string
  platform?: string
  dateRange?: { start: string; end: string }
}) {
  return useQuery({
    queryKey: ['marketing-posts', filters],
    queryFn: async () => {
      const supabase = createClient()
      
      // First, get posts without joins for better performance
      let query = supabase
        .from('marketing_posts')
        .select('id, title, content, caption, platforms, status, scheduled_date, scheduled_time, published_at, published_date, media_url, media_type, campaign, tags, author_id, requires_approval, approval_required, approved_by_id, approved_by, approved_at, views, likes, comments, shares, retweets, engagement_rate, created_at, updated_at')
        .order('created_at', { ascending: false })
      
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }
      
      if (filters?.platform && filters.platform !== 'all') {
        query = query.contains('platforms', [filters.platform])
      }
      
      if (filters?.dateRange) {
        query = query
          .gte('scheduled_date', filters.dateRange.start)
          .lte('scheduled_date', filters.dateRange.end)
      }
      
      const { data: posts, error: postsError } = await query
      
      if (postsError) throw postsError
      if (!posts || posts.length === 0) return []
      
      // Get unique author IDs
      const authorIds = new Set<string>()
      posts.forEach(post => {
        if (post.author_id) authorIds.add(post.author_id)
      })
      
      let authors: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (authorIds.size > 0) {
        const { data: fetchedAuthors, error: authorsError } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(authorIds))
        
        if (authorsError) throw authorsError
        authors = (fetchedAuthors || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const authorMap = new Map(authors.map(author => [author.id, author]))
      
      const transformed: MarketingPost[] = posts.map((post: any): MarketingPost => ({
        ...post,
        caption: post.caption || post.content || '',
        platforms: (post.platforms || []) as PostPlatform[],
        requires_approval: post.requires_approval || post.approval_required || false,
        author: post.author_id ? (authorMap.get(post.author_id) || undefined) : undefined,
      }))
      
      return transformed
    },
    staleTime: 30000,
  })
}

// Fetch calendar posts for specific month
export function useCalendarPosts(month: number, year: number) {
  return useQuery({
    queryKey: ['calendar-posts', month, year],
    queryFn: async () => {
      const supabase = createClient()
      const startDate = new Date(year, month, 1).toISOString()
      const endDate = new Date(year, month + 1, 0).toISOString()
      
      const { data: posts, error: postsError } = await supabase
        .from('marketing_posts')
        .select('id, title, content, caption, platforms, status, scheduled_date, scheduled_time, published_at, media_url, media_type, author_id, created_at, updated_at')
        .or(`scheduled_date.gte.${startDate},scheduled_date.lte.${endDate}`)
        .in('status', ['scheduled', 'pending_review', 'published'])
      
      if (postsError) throw postsError
      if (!posts || posts.length === 0) return []
      
      const authorIds = new Set<string>()
      posts.forEach(post => {
        if (post.author_id) authorIds.add(post.author_id)
      })
      
      let authors: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (authorIds.size > 0) {
        const { data: fetchedAuthors } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(authorIds))
        
        authors = (fetchedAuthors || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const authorMap = new Map(authors.map(author => [author.id, author]))
      
      return posts.map((post: any): MarketingPost => ({
        ...post,
        caption: post.caption || post.content || '',
        platforms: (post.platforms || []) as PostPlatform[],
        author: post.author_id ? (authorMap.get(post.author_id) || undefined) : undefined,
      }))
    },
    staleTime: 30000,
  })
}

// Fetch queue posts (drafts + scheduled)
export function useQueuePosts() {
  return useQuery({
    queryKey: ['queue-posts'],
    queryFn: async () => {
      const supabase = createClient()
      
      const { data: posts, error: postsError } = await supabase
        .from('marketing_posts')
        .select('id, title, content, caption, platforms, status, scheduled_date, scheduled_time, published_at, media_url, media_type, author_id, created_at, updated_at')
        .in('status', ['draft', 'scheduled', 'pending_review'])
        .order('scheduled_date', { ascending: true, nullsFirst: false })
      
      if (postsError) throw postsError
      if (!posts || posts.length === 0) return []
      
      const authorIds = new Set<string>()
      posts.forEach(post => {
        if (post.author_id) authorIds.add(post.author_id)
      })
      
      let authors: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (authorIds.size > 0) {
        const { data: fetchedAuthors } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(authorIds))
        
        authors = (fetchedAuthors || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const authorMap = new Map(authors.map(author => [author.id, author]))
      
      return posts.map((post: any): MarketingPost => ({
        ...post,
        caption: post.caption || post.content || '',
        platforms: (post.platforms || []) as PostPlatform[],
        author: post.author_id ? (authorMap.get(post.author_id) || undefined) : undefined,
      }))
    },
    staleTime: 30000,
  })
}

// Fetch published posts
export function usePublishedPosts(filters?: {
  platform?: string
  timeframe?: string
  search?: string
}) {
  return useQuery({
    queryKey: ['published-posts', filters],
    queryFn: async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('marketing_posts')
        .select('id, title, content, caption, platforms, status, scheduled_date, scheduled_time, published_at, published_date, media_url, media_type, author_id, views, likes, comments, shares, retweets, engagement_rate, created_at, updated_at')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
      
      if (filters?.platform && filters.platform !== 'all') {
        query = query.contains('platforms', [filters.platform])
      }
      
      if (filters?.timeframe) {
        const days = filters.timeframe === 'last_7_days' ? 7 : 30
        const date = new Date()
        date.setDate(date.getDate() - days)
        query = query.gte('published_at', date.toISOString())
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,caption.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
      }
      
      const { data: posts, error: postsError } = await query
      
      if (postsError) throw postsError
      if (!posts || posts.length === 0) return []
      
      const authorIds = new Set<string>()
      posts.forEach(post => {
        if (post.author_id) authorIds.add(post.author_id)
      })
      
      let authors: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (authorIds.size > 0) {
        const { data: fetchedAuthors } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(authorIds))
        
        authors = (fetchedAuthors || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const authorMap = new Map(authors.map(author => [author.id, author]))
      
      return posts.map((post: any): MarketingPost => ({
        ...post,
        caption: post.caption || post.content || '',
        platforms: (post.platforms || []) as PostPlatform[],
        author: post.author_id ? (authorMap.get(post.author_id) || undefined) : undefined,
      }))
    },
    staleTime: 30000,
  })
}

// Fetch single post
export function useMarketingPost(id: string | null) {
  return useQuery({
    queryKey: ['marketing-post', id],
    queryFn: async () => {
      if (!id) return null
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('marketing_posts')
        .select('id, title, content, caption, platforms, status, scheduled_date, scheduled_time, published_at, published_date, media_url, media_type, author_id, requires_approval, approval_required, approved_by_id, approved_by, approved_at, views, likes, comments, shares, retweets, engagement_rate, campaign, tags, created_at, updated_at')
        .eq('id', id)
        .single()
      
      if (error) throw error
      if (!data) return null
      
      let author: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'> | undefined = undefined
      if (data.author_id) {
        const { data: authorData } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .eq('id', data.author_id)
          .single()
        
        author = authorData || undefined
      }
      
      return {
        ...data,
        caption: data.caption || data.content || '',
        platforms: (data.platforms || []) as PostPlatform[],
        requires_approval: data.requires_approval || data.approval_required || false,
        author,
      } as MarketingPost
    },
    enabled: !!id,
    staleTime: 30000,
  })
}

// Fetch analytics
export function useMarketingAnalytics(timeframe: string = '30_days') {
  return useQuery({
    queryKey: ['marketing-analytics', timeframe],
    queryFn: async () => {
      const supabase = createClient()
      
      // Calculate date range
      const days = timeframe === '7_days' ? 7 : timeframe === '90_days' ? 90 : 30
      const endDate = new Date()
      const startDate = new Date()
      startDate.setDate(endDate.getDate() - days)
      
      // Get published posts in timeframe
      const { data: posts } = await supabase
        .from('marketing_posts')
        .select('*')
        .eq('status', 'published')
        .gte('published_at', startDate.toISOString())
        .lte('published_at', endDate.toISOString())
      
      if (!posts || posts.length === 0) {
        return {
          total_reach: 0,
          reach_change: 0,
          total_engagement: 0,
          engagement_change: 0,
          avg_performance: 0,
          performance_change: 0,
          net_growth: 0,
          total_posts: 0,
          avg_likes: 0,
          likes_change: 0,
          avg_comments: 0,
          comments_change: 0,
          avg_shares: 0,
          shares_change: 0,
          engagement_trend: [],
          platform_performance: [],
          best_time_to_post: [],
        } as MarketingAnalytics
      }
      
      // Calculate analytics
      const analytics: MarketingAnalytics = {
        total_reach: posts.reduce((sum, p) => sum + (p.views || 0), 0),
        reach_change: 15, // Calculate from previous period
        total_engagement: posts.reduce((sum, p) => sum + (p.likes || 0) + (p.comments || 0) + (p.shares || 0), 0),
        engagement_change: 8.2,
        avg_performance: posts.length > 0 
          ? posts.reduce((sum, p) => sum + (p.engagement_rate || 0), 0) / posts.length 
          : 0,
        performance_change: -0.5,
        net_growth: 540,
        
        total_posts: posts.length,
        avg_likes: posts.length > 0 ? posts.reduce((sum, p) => sum + (p.likes || 0), 0) / posts.length : 0,
        likes_change: 12,
        avg_comments: posts.length > 0 ? posts.reduce((sum, p) => sum + (p.comments || 0), 0) / posts.length : 0,
        comments_change: -2,
        avg_shares: posts.length > 0 ? posts.reduce((sum, p) => sum + (p.shares || 0), 0) / posts.length : 0,
        shares_change: 5,
        
        engagement_trend: [], // Calculate daily aggregates
        platform_performance: [], // Group by platform
        best_time_to_post: []
      }
      
      return analytics
    },
    staleTime: 60000,
  })
}

// Create post
export function useCreatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (post: Partial<MarketingPost>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('marketing_posts')
        .insert({
          ...post,
          author_id: user?.id,
          status: 'draft'
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-posts'] })
      queryClient.invalidateQueries({ queryKey: ['queue-posts'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-posts'] })
    }
  })
}

// Update post
export function useUpdatePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ 
      id, 
      updates 
    }: { 
      id: string
      updates: Partial<MarketingPost> 
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('marketing_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-posts'] })
      queryClient.invalidateQueries({ queryKey: ['marketing-post'] })
      queryClient.invalidateQueries({ queryKey: ['queue-posts'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-posts'] })
      queryClient.invalidateQueries({ queryKey: ['published-posts'] })
    }
  })
}

// Delete post
export function useDeletePost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('marketing_posts')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-posts'] })
      queryClient.invalidateQueries({ queryKey: ['queue-posts'] })
      queryClient.invalidateQueries({ queryKey: ['calendar-posts'] })
      queryClient.invalidateQueries({ queryKey: ['published-posts'] })
    }
  })
}


