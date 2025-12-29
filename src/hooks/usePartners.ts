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
      
      // Clean up partner data - remove undefined values
      const cleanPartner = Object.fromEntries(
        Object.entries(partner).filter(([_, value]) => value !== undefined)
      ) as Partial<Partner>
      
      const { data, error } = await supabase
        .from('partners')
        .insert({
          ...cleanPartner,
          owner_id: ownerId
        })
        .select('*')
        .single()
      
      if (error) {
        console.error('Create partner error:', error)
        console.error('Partner data that was sent:', { ...cleanPartner, owner_id: ownerId })
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
      const { data, error } = await supabase
        .from('partners')
        .update(updates)
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
