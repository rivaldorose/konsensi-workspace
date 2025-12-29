import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MarketingPost } from '@/types/marketing'
import type { User } from '@/types'

export function useMarketingPosts() {
  return useQuery({
    queryKey: ['marketing-posts'],
    queryFn: async () => {
      const supabase = createClient()
      
      // First, get posts without joins for better performance
      const { data: posts, error: postsError } = await supabase
        .from('marketing_posts')
        .select('id, title, content, platforms, status, scheduled_date, published_date, media_url, media_type, campaign, tags, author_id, created_at, updated_at')
        .order('scheduled_date', { ascending: true })
        .limit(100)
      
      if (postsError) throw postsError
      if (!posts || posts.length === 0) return []
      
      // Get unique author IDs
      const authorIds = new Set<string>()
      posts.forEach(post => {
        if (post.author_id) authorIds.add(post.author_id)
      })
      
      let authors: Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>> = []
      if (authorIds.size > 0) {
        // Fetch authors in one query
        const { data: fetchedAuthors, error: authorsError } = await supabase
          .from('users')
          .select('id, full_name, email, avatar_url')
          .in('id', Array.from(authorIds))
        
        if (authorsError) throw authorsError
        authors = (fetchedAuthors || []) as Array<Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>>
      }
      
      // Create a map for quick author lookup
      const authorMap = new Map(authors.map(author => [author.id, author]))
      
      // Transform posts with author data
      const transformed: MarketingPost[] = posts.map((post: any): MarketingPost => {
        const author = post.author_id ? authorMap.get(post.author_id) : undefined
        return {
          ...post,
          author: author ? {
            id: author.id,
            full_name: author.full_name || '',
            avatar_url: author.avatar_url
          } : undefined,
        }
      })
      
      return transformed
    },
    staleTime: 30000, // Cache for 30 seconds
    gcTime: 300000, // Keep in cache for 5 minutes
  })
}

export function useMarketingPost(id: string) {
  return useQuery({
    queryKey: ['marketing-post', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('marketing_posts')
        .select('*, author:users(*)')
        .eq('id', id)
        .single()
      
      if (error) throw error
      
      // Transform the data to match MarketingPost type - Supabase returns author as array
      const author = Array.isArray((data as any).author) ? ((data as any).author[0] || null) : ((data as any).author || null)
      
      const transformed: MarketingPost = {
        ...data,
        author: author || undefined,
      }
      return transformed
    },
    enabled: !!id
  })
}

export function useCreateMarketingPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (post: Partial<MarketingPost>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      const { data, error } = await supabase
        .from('marketing_posts')
        .insert({
          ...post,
          author_id: user?.id
        })
        .select('*, author:users(*)')
        .single()
      
      if (error) throw error
      
      // Transform the data to match MarketingPost type
      const author = Array.isArray((data as any).author) ? ((data as any).author[0] || null) : ((data as any).author || null)
      
      const transformed: MarketingPost = {
        ...data,
        author: author || undefined,
      }
      return transformed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-posts'] })
    }
  })
}

export function useUpdateMarketingPost() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<MarketingPost> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('marketing_posts')
        .update(updates)
        .eq('id', id)
        .select('*, author:users(*)')
        .single()
      
      if (error) throw error
      
      // Transform the data to match MarketingPost type
      const author = Array.isArray((data as any).author) ? ((data as any).author[0] || null) : ((data as any).author || null)
      
      const transformed: MarketingPost = {
        ...data,
        author: author || undefined,
      }
      return transformed
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['marketing-posts'] })
    }
  })
}

export function useDeleteMarketingPost() {
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
    }
  })
}

