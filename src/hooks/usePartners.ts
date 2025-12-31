import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Partner } from '@/types'
import { useCreateNotification } from './useNotifications'

export function usePartners() {
  return useQuery({
    queryKey: ['partners'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .order('status', { ascending: false })
        .order('updated_at', { ascending: false })
      
      if (error) throw error
      return (data || []) as Partner[]
    }
  })
}

export function usePartnerStats(partners?: Partner[]) {
  if (!partners) {
    return {
      active: 0,
      inGesprek: 0,
      toContact: 0,
      total: 0
    }
  }
  
  return {
    active: partners.filter(p => p.status === 'active').length,
    inGesprek: partners.filter(p => p.status === 'in_gesprek').length,
    toContact: partners.filter(p => p.status === 'to_contact').length,
    total: partners.length
  }
}

export function usePartner(id: string) {
  return useQuery({
    queryKey: ['partner', id],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      return data as Partner
    },
    enabled: !!id
  })
}

export function useCreatePartner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (partner: Partial<Partner>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // Use partner.owner_id if provided, otherwise use current user
      const ownerId = partner.owner_id || user?.id
      
      if (!ownerId) {
        throw new Error('Owner ID is required')
      }
      
      // Clean up partner data - ensure contact fields and date fields are explicitly set (null or value, never undefined or empty string)
      const cleanPartner: any = {}
      for (const [key, value] of Object.entries(partner)) {
        // For contact_email and contact_phone, explicitly set to null if undefined or empty string
        if (key === 'contact_email' || key === 'contact_phone') {
          cleanPartner[key] = (value === undefined || value === '' || value === null) ? null : value
        } 
        // For date fields, completely omit if empty (don't send null or empty string)
        // Supabase will use the column default (NULL) if field is omitted
        else if (key === 'next_action_date' || key === 'partnership_start' || key === 'contract_end') {
          // Only include date field if it has a valid value
          if (value !== undefined && value !== null && value !== '' && (typeof value !== 'string' || value.trim() !== '')) {
            cleanPartner[key] = value
          }
          // Otherwise, don't include the field at all (let database use default NULL)
        } 
        // For other fields, only include if not undefined
        else if (value !== undefined) {
          cleanPartner[key] = value
        }
      }
      
      const insertData = {
        ...cleanPartner,
        owner_id: ownerId
      }
      
      const { data, error } = await supabase
        .from('partners')
        .insert(insertData)
        .select('*')
        .single()
      
      if (error) {
        throw error
      }
      
      return data
    },
    onSuccess: async (data) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      
      // Create notification for partner creation
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user && data) {
          await supabase.from('notifications').insert({
            user_id: user.id,
            type: 'partner_created',
            title: 'New Partner Added',
            message: `Partner "${data.name}" has been added to your workspace`,
            icon: 'handshake',
            icon_color: 'text-primary',
            border_color: 'border-primary',
            badge: 'New',
            badge_color: 'bg-primary/20 text-primary',
            metadata: { partner_id: data.id, partner_name: data.name },
            is_read: false
          })
        }
      } catch (error) {
        console.error('Failed to create notification:', error)
        // Don't throw - notification failure shouldn't break partner creation
      }
    }
  })
}

export function useUpdatePartner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Partner> }) => {
      const supabase = createClient()
      
      // Get old partner data BEFORE update to compare status
      const { data: oldPartner } = await supabase
        .from('partners')
        .select('status, name')
        .eq('id', id)
        .single()
      
      // Clean up date fields - omit if empty (don't send empty strings)
      const cleanedUpdates: any = {}
      for (const [key, value] of Object.entries(updates)) {
        // For date fields, completely omit if empty (don't send null or empty string)
        if (key === 'next_action_date' || key === 'partnership_start' || key === 'contract_end') {
          // Only include date field if it has a valid value
          if (value !== undefined && value !== null && value !== '' && (typeof value !== 'string' || value.trim() !== '')) {
            cleanedUpdates[key] = value
          }
          // Otherwise, don't include the field at all
        }
        // For contact fields, convert empty strings to null
        else if (key === 'contact_email' || key === 'contact_phone') {
          cleanedUpdates[key] = (value === undefined || value === '' || value === null) ? null : value
        }
        // For other fields, include if not undefined
        else if (value !== undefined) {
          cleanedUpdates[key] = value
        }
      }
      
      const { data, error } = await supabase
        .from('partners')
        .update(cleanedUpdates)
        .eq('id', id)
        .select('*')
        .single()
      
      if (error) throw error
      
      // Return data with old partner info for notification
      return { ...data, _oldPartner: oldPartner }
    },
    onSuccess: async (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      queryClient.invalidateQueries({ queryKey: ['partner', variables.id] })
      
      // Create notification for partner update, especially status changes
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (user && data) {
          const oldPartner = (data as any)._oldPartner
          
          if (variables.updates.status && oldPartner && oldPartner.status !== variables.updates.status) {
            // Status changed
            const statusLabels: Record<string, string> = {
              'to_contact': 'To Contact',
              'in_gesprek': 'In Gesprek',
              'active': 'Active',
              'paused': 'Paused'
            }
            
            const newStatusLabel = statusLabels[variables.updates.status] || variables.updates.status
            
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'status_changed',
              title: 'Partner Status Updated',
              message: `Partner "${data.name}" status changed to "${newStatusLabel}"`,
              icon: 'handshake',
              icon_color: 'text-primary',
              border_color: 'border-primary',
              badge: newStatusLabel,
              badge_color: 'bg-primary/20 text-primary',
              metadata: { 
                partner_id: data.id, 
                partner_name: data.name,
                old_status: oldPartner.status,
                new_status: variables.updates.status
              },
              is_read: false
            })
          } else {
            // General update notification (only if status didn't change)
            await supabase.from('notifications').insert({
              user_id: user.id,
              type: 'partner_updated',
              title: 'Partner Updated',
              message: `Partner "${data.name}" has been updated`,
              icon: 'handshake',
              icon_color: 'text-primary',
              border_color: 'border-primary',
              badge: 'Updated',
              badge_color: 'bg-primary/20 text-primary',
              metadata: { partner_id: data.id, partner_name: data.name },
              is_read: false
            })
          }
        }
      } catch (error) {
        console.error('Failed to create notification:', error)
        // Don't throw - notification failure shouldn't break partner update
      }
    }
  })
}

export function useDeletePartner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('partners')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}
