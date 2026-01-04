'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@/types'

export interface AILead {
  id: string
  company_name: string
  industry?: string
  company_size?: string
  location?: string
  website?: string
  target_role?: string
  suggested_contact_name?: string
  suggested_contact_email?: string
  suggested_contact_linkedin?: string
  keywords?: string
  ai_summary?: string
  ai_confidence?: number
  relevance_score?: 'high' | 'medium' | 'low'
  status: 'discovered' | 'saved' | 'dismissed' | 'converted'
  search_criteria?: Record<string, any>
  ai_insights?: Record<string, any>
  created_by: string
  converted_to_partner_id?: string
  created_at: string
  updated_at: string
  created_by_user?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

export interface LeadNote {
  id: string
  lead_id: string
  user_id: string
  content: string
  note_type: 'note' | 'activity' | 'system'
  created_at: string
  user?: Pick<User, 'id' | 'full_name' | 'email' | 'avatar_url'>
}

// Fetch all leads
export function useLeads(status?: string) {
  return useQuery({
    queryKey: ['leads', status],
    queryFn: async () => {
      const supabase = createClient()
      
      let query = supabase
        .from('ai_leads')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (status && status !== 'all') {
        query = query.eq('status', status)
      }
      
      const { data: leads, error } = await query
      
      if (error) throw error
      if (!leads || leads.length === 0) return []
      
      // Get unique created_by IDs
      const userIds = new Set<string>()
      leads.forEach(lead => {
        if (lead.created_by) userIds.add(lead.created_by)
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
      
      return leads.map((lead: any): AILead => ({
        ...lead,
        created_by_user: lead.created_by ? (userMap.get(lead.created_by) || undefined) : undefined,
      }))
    },
    staleTime: 30000,
  })
}

// Fetch a single lead
export function useLead(leadId: string | null | undefined) {
  return useQuery({
    queryKey: ['lead', leadId],
    queryFn: async () => {
      if (!leadId) return null
      
      const supabase = createClient()
      const { data: lead, error } = await supabase
        .from('ai_leads')
        .select('*')
        .eq('id', leadId)
        .single()
      
      if (error) throw error
      return lead as AILead
    },
    enabled: !!leadId,
  })
}

// Fetch notes for a lead
export function useLeadNotes(leadId: string | null | undefined) {
  return useQuery({
    queryKey: ['lead-notes', leadId],
    queryFn: async () => {
      if (!leadId) return []
      
      const supabase = createClient()
      const { data: notes, error } = await supabase
        .from('ai_lead_notes')
        .select('*')
        .eq('lead_id', leadId)
        .order('created_at', { ascending: false })
      
      if (error) throw error
      if (!notes || notes.length === 0) return []
      
      // Get unique user IDs
      const userIds = new Set<string>()
      notes.forEach(note => {
        if (note.user_id) userIds.add(note.user_id)
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
      
      return notes.map((note: any): LeadNote => ({
        ...note,
        user: note.user_id ? (userMap.get(note.user_id) || undefined) : undefined,
      }))
    },
    enabled: !!leadId,
    staleTime: 30000,
  })
}

// Create a lead
export function useCreateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (leadData: Partial<AILead>) => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('ai_leads')
        .insert({
          ...leadData,
          created_by: user.id,
        })
        .select()
        .single()
      
      if (error) throw error
      return data as AILead
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// Update a lead
export function useUpdateLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<AILead> & { id: string }) => {
      const supabase = createClient()
      
      const { data, error } = await supabase
        .from('ai_leads')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data as AILead
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['lead', data.id] })
    },
  })
}

// Delete a lead
export function useDeleteLead() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (leadId: string) => {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('ai_leads')
        .delete()
        .eq('id', leadId)
      
      if (error) throw error
      return { leadId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
    },
  })
}

// Add a note to a lead
export function useCreateLeadNote() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ leadId, content, noteType = 'note' }: { leadId: string; content: string; noteType?: 'note' | 'activity' | 'system' }) => {
      const supabase = createClient()
      
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('ai_lead_notes')
        .insert({
          lead_id: leadId,
          user_id: user.id,
          content: content.trim(),
          note_type: noteType,
        })
        .select()
        .single()
      
      if (error) throw error
      return data as LeadNote
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lead-notes', data.lead_id] })
    },
  })
}

// Convert lead to partner
export function useConvertLeadToPartner() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ leadId, partnerData }: { leadId: string; partnerData: any }) => {
      const supabase = createClient()
      
      // First create the partner
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data: partner, error: partnerError } = await supabase
        .from('partners')
        .insert({
          ...partnerData,
          owner_id: user.id,
        })
        .select()
        .single()
      
      if (partnerError) throw partnerError
      
      // Then update the lead to mark it as converted
      const { error: leadError } = await supabase
        .from('ai_leads')
        .update({
          status: 'converted',
          converted_to_partner_id: partner.id,
        })
        .eq('id', leadId)
      
      if (leadError) throw leadError
      
      return { partner, leadId }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] })
      queryClient.invalidateQueries({ queryKey: ['partners'] })
    },
  })
}

