import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export interface Notification {
  id: string
  type: 'mention' | 'approval' | 'update' | 'system' | 'comment'
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
      // TODO: Implement notifications table in database
      // For now, return empty array
      return [] as Notification[]
    },
    staleTime: 30000, // Cache for 30 seconds
  })
}

