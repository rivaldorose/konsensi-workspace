import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { MarketingPost } from '@/types/marketing'

export function useMarketingPosts() {
  return useQuery({
    queryKey: ['marketing-posts'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('marketing_posts')
        .select('*, author:users(*)')
        .order('scheduled_date', { ascending: true })
      
      if (error) throw error
      return (data || []) as MarketingPost[]
    }
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
      return data as MarketingPost
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
      return data
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
      return data
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

