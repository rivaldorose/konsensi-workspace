import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Partner } from '@/types'

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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    }
  })
}

export function useUpdatePartner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<Partner> }) => {
      const supabase = createClient()
      
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
      return data
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['partners'] })
      queryClient.invalidateQueries({ queryKey: ['partner', variables.id] })
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
