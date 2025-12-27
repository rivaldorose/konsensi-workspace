import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useEffect } from 'react'
import type { User } from '@/types'

export interface Channel {
  id: string
  name: string
  type: 'channel' | 'dm'
  description?: string
  members: string[]
  created_by: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  channel_id: string
  user_id: string
  user?: User
  content: string
  attachments?: any[]
  mentions?: string[]
  reactions?: { emoji: string; users: string[] }[]
  thread_count?: number
  created_at: string
  updated_at: string
}

export function useChannels() {
  return useQuery({
    queryKey: ['chat_channels'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('chat_channels')
        .select('*')
        .order('name', { ascending: true })
      
      if (error) throw error
      return (data || []) as Channel[]
    }
  })
}

export function useMessages(channelId: string | undefined) {
  const queryClient = useQueryClient()
  
  const query = useQuery({
    queryKey: ['chat_messages', channelId],
    queryFn: async () => {
      if (!channelId) return []
      
      const supabase = createClient()
      const { data, error } = await supabase
        .from('chat_messages')
        .select('*, user:users(*)')
        .eq('channel_id', channelId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return (data || []) as Message[]
    },
    enabled: !!channelId
  })
  
  // Realtime subscription
  useEffect(() => {
    if (!channelId) return
    
    const supabase = createClient()
    
    const channel = supabase
      .channel(`messages:${channelId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${channelId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat_messages', channelId] })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: `channel_id=eq.${channelId}`
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['chat_messages', channelId] })
        }
      )
      .subscribe()
    
    return () => {
      supabase.removeChannel(channel)
    }
  }, [channelId, queryClient])
  
  return query
}

export function useSendMessage() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (message: { channel_id: string; content: string; mentions?: string[] }) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          ...message,
          user_id: user.id
        })
        .select('*, user:users(*)')
        .single()
      
      if (error) throw error
      return data as Message
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat_messages', variables.channel_id] })
    }
  })
}

export function useCreateChannel() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (channel: Partial<Channel>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('chat_channels')
        .insert({
          ...channel,
          type: 'channel',
          created_by: user.id,
          members: [user.id, ...(channel.members || [])]
        })
        .select()
        .single()
      
      if (error) throw error
      return data as Channel
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat_channels'] })
    }
  })
}

