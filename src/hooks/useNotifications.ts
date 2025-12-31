import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'

export interface Notification {
  id: string
  user_id: string
  type: 'partner_created' | 'partner_updated' | 'status_changed' | 'mention' | 'approval' | 'update' | 'system' | 'comment'
  icon: string
  iconColor: string
  borderColor: string
  title: string
  titleSub?: string
  badge: string
  badgeColor: string
  message: string
  time: string
  created_at: string
  is_read: boolean
  metadata?: Record<string, any>
  actions?: Array<{
    label: string
    icon: string
    color: string
  }>
}

export function useNotifications() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) return []
      
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(100)
      
      if (error) throw error
      
      // Transform to match Notification interface
      return (data || []).map((n: any): Notification => ({
        id: n.id,
        user_id: n.user_id,
        type: n.type as Notification['type'],
        icon: n.icon || 'handshake',
        iconColor: n.icon_color || 'text-primary',
        borderColor: n.border_color || 'border-primary',
        title: n.title,
        badge: n.badge || '',
        badgeColor: n.badge_color || 'bg-primary/20 text-primary',
        message: n.message || '',
        time: format(new Date(n.created_at), 'HH:mm'),
        created_at: n.created_at,
        is_read: n.is_read || false,
        metadata: n.metadata || {}
      }))
    },
    staleTime: 30000, // Cache for 30 seconds
  })
}

export function useCreateNotification() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notification: {
      user_id: string
      type: Notification['type']
      title: string
      message?: string
      icon?: string
      icon_color?: string
      border_color?: string
      badge?: string
      badge_color?: string
      metadata?: Record<string, any>
    }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: notification.user_id,
          type: notification.type,
          title: notification.title,
          message: notification.message || null,
          icon: notification.icon || 'handshake',
          icon_color: notification.icon_color || 'text-primary',
          border_color: notification.border_color || 'border-primary',
          badge: notification.badge || null,
          badge_color: notification.badge_color || 'bg-primary/20 text-primary',
          metadata: notification.metadata || null,
          is_read: false
        })
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (notificationId: string) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .select()
        .single()
      
      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })
}

