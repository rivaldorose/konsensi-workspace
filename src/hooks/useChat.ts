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
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return [] as Channel[]
      }
      
      // Get all channels (RLS will filter based on policies)
      const { data: channels, error: channelsError } = await supabase
        .from('chat_channels')
        .select('*')
        .order('name', { ascending: true })
      
      if (channelsError) {
        console.error('Error fetching channels:', channelsError)
        throw channelsError
      }
      
      if (!channels || channels.length === 0) return []
      
      // Get members for each channel
      const channelIds = channels.map(c => c.id)
      const { data: members, error: membersError } = await supabase
        .from('chat_channel_members')
        .select('channel_id, user_id')
        .in('channel_id', channelIds)
      
      if (membersError) {
        console.error('Error fetching channel members:', membersError)
        throw membersError
      }
      
      // Group members by channel_id
      const membersByChannel = new Map<string, string[]>()
      if (members) {
        members.forEach((m: any) => {
          if (!membersByChannel.has(m.channel_id)) {
            membersByChannel.set(m.channel_id, [])
          }
          membersByChannel.get(m.channel_id)!.push(m.user_id)
        })
      }
      
      // Transform to Channel format
      return (channels || []).map((channel: any) => ({
        ...channel,
        members: membersByChannel.get(channel.id) || []
      })) as Channel[]
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

