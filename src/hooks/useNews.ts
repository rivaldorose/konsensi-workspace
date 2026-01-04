'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export interface NewsSource {
  id: string
  name: string
  url: string
  category: 'finance' | 'technology' | 'policy' | 'general' | 'other'
  language: 'dutch' | 'english' | 'french' | 'german'
  fetch_frequency: 'hourly' | 'daily' | 'weekly'
  description?: string
  is_active: boolean
  created_by: string
  created_at: string
  updated_at: string
}

export interface NewsArticle {
  id: string
  source_id?: string
  title: string
  summary?: string
  content?: string
  url: string
  image_url?: string
  category?: 'finance' | 'technology' | 'policy' | 'real_estate' | 'crypto' | 'agritech' | 'general' | 'other'
  author?: string
  published_at?: string
  fetched_at: string
  is_saved: boolean
  is_read: boolean
  status: 'published' | 'draft' | 'archived'
  metadata?: Record<string, any>
  created_at: string
  updated_at: string
  source?: NewsSource
}

export interface NewsArticleNote {
  id: string
  article_id: string
  user_id: string
  content: string
  is_auto_saved: boolean
  created_at: string
  updated_at: string
  user?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

export interface NewsArticleComment {
  id: string
  article_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  user?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

// Fetch news articles
export function useNewsArticles(filters?: {
  category?: string
  source?: string
  dateRange?: string
  search?: string
  saved?: boolean
}) {
  return useQuery({
    queryKey: ['news-articles', filters],
    queryFn: async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('news_articles')
        .select(`
          *,
          source:news_sources(*)
        `)
        .eq('status', 'published')
        .order('fetched_at', { ascending: false })
      
      if (filters?.category && filters.category !== 'all') {
        query = query.eq('category', filters.category)
      }
      
      if (filters?.source && filters.source !== 'all') {
        query = query.eq('source_id', filters.source)
      }
      
      if (filters?.saved) {
        query = query.eq('is_saved', true)
      }
      
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,summary.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
      }
      
      if (filters?.dateRange) {
        const now = new Date()
        let startDate: Date
        switch (filters.dateRange) {
          case 'last_24h':
            startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
            break
          case 'last_week':
            startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
            break
          case 'last_month':
            startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
            break
          default:
            startDate = new Date(0)
        }
        query = query.gte('fetched_at', startDate.toISOString())
      }
      
      const { data: articles, error } = await query
      
      if (error) throw error
      return (articles || []) as NewsArticle[]
    },
    staleTime: 30000,
  })
}

// Fetch a single news article
export function useNewsArticle(articleId: string | null | undefined) {
  return useQuery({
    queryKey: ['news-article', articleId],
    queryFn: async () => {
      if (!articleId) return null
      
      const supabase = createClient()
      const { data: article, error } = await supabase
        .from('news_articles')
        .select(`
          *,
          source:news_sources(*)
        `)
        .eq('id', articleId)
        .single()
      
      if (error) throw error
      return article as NewsArticle
    },
    enabled: !!articleId,
  })
}

// Fetch news sources
export function useNewsSources() {
  return useQuery({
    queryKey: ['news-sources'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: sources, error } = await supabase
        .from('news_sources')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })
      
      if (error) throw error
      return (sources || []) as NewsSource[]
    },
  })
}

// Fetch comments for an article
export function useNewsArticleComments(articleId: string | null | undefined) {
  return useQuery({
    queryKey: ['news-article-comments', articleId],
    queryFn: async () => {
      if (!articleId) return []
      
      const supabase = createClient()
      const { data: comments, error } = await supabase
        .from('news_article_comments')
        .select('*')
        .eq('article_id', articleId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (!comments || comments.length === 0) return []
      
      // Get unique user IDs
      const userIds = new Set<string>()
      comments.forEach(comment => {
        if (comment.user_id) userIds.add(comment.user_id)
      })
      
      // Fetch user data
      let users: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (userIds.size > 0) {
        const { data: fetchedUsers, error: usersError } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(userIds))
        
        if (usersError) throw usersError
        users = (fetchedUsers || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      const userMap = new Map(users.map(user => [user.id, user]))
      
      return comments.map((comment: any): NewsArticleComment => ({
        ...comment,
        user: comment.user_id ? (userMap.get(comment.user_id) || undefined) : undefined,
      }))
    },
    enabled: !!articleId,
    staleTime: 30000,
  })
}

// Fetch note for an article (user's own note)
export function useNewsArticleNote(articleId: string | null | undefined) {
  return useQuery({
    queryKey: ['news-article-note', articleId],
    queryFn: async () => {
      if (!articleId) return null
      
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return null
      
      const { data: note, error } = await supabase
        .from('news_article_notes')
        .select('*')
        .eq('article_id', articleId)
        .eq('user_id', user.id)
        .single()
      
      if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
      return (note || null) as NewsArticleNote | null
    },
    enabled: !!articleId,
  })
}

// Create news source
export function useCreateNewsSource() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (sourceData: Partial<NewsSource>) => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('news_sources')
        .insert({
          ...sourceData,
          created_by: user.id,
        })
        .select()
        .single()
      
      if (error) throw error
      return data as NewsSource
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news-sources'] })
    },
  })
}

// Update news article
export function useUpdateNewsArticle() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<NewsArticle> & { id: string }) => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('news_articles')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as NewsArticle
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['news-articles'] })
      queryClient.invalidateQueries({ queryKey: ['news-article', data.id] })
    },
  })
}

// Create or update note
export function useUpsertNewsArticleNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ articleId, content }: { articleId: string; content: string }) => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('news_article_notes')
        .upsert({
          article_id: articleId,
          user_id: user.id,
          content: content.trim(),
          is_auto_saved: false,
        })
        .select()
        .single()
      
      if (error) throw error
      return data as NewsArticleNote
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['news-article-note', data.article_id] })
    },
  })
}

// Create comment
export function useCreateNewsArticleComment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ articleId, content }: { articleId: string; content: string }) => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('news_article_comments')
        .insert({
          article_id: articleId,
          user_id: user.id,
          content: content.trim(),
        })
        .select()
        .single()
      
      if (error) throw error
      return data as NewsArticleComment
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['news-article-comments', data.article_id] })
    },
  })
}
