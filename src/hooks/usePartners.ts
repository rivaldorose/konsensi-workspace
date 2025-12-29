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
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePartners.ts:62',message:'useCreatePartner mutation called',data:{partnerRaw:partner},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'ALL'})}).catch(()=>{});
      // #endregion
      
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePartners.ts:67',message:'User auth check',data:{hasUser:!!user,userId:user?.id,partnerOwnerId:partner.owner_id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
      // #endregion
      
      // Use partner.owner_id if provided, otherwise use current user
      const ownerId = partner.owner_id || user?.id
      
      if (!ownerId) {
        throw new Error('Owner ID is required')
      }
      
      // Clean up partner data - remove undefined values and convert empty strings to null for optional fields
      const cleanPartner: any = {}
      for (const [key, value] of Object.entries(partner)) {
        if (value !== undefined) {
          // Convert empty strings to null for optional contact fields (database expects null, not empty string)
          if ((key === 'contact_email' || key === 'contact_phone') && value === '') {
            cleanPartner[key] = null
          } else {
            cleanPartner[key] = value
          }
        }
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePartners.ts:76',message:'Partner data cleaned',data:{cleanPartner,hasEmail:!!cleanPartner.contact_email,hasPhone:!!cleanPartner.contact_phone,emailValue:cleanPartner.contact_email,phoneValue:cleanPartner.contact_phone,sector:cleanPartner.sector},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      
      const insertData = {
        ...cleanPartner,
        owner_id: ownerId
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePartners.ts:82',message:'Final insert data before Supabase',data:insertData,timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
      // #endregion
      
      console.log('Inserting partner with data:', JSON.stringify(insertData, null, 2))
      
      const { data, error } = await supabase
        .from('partners')
        .insert(insertData)
        .select('*')
        .single()
      
      if (error) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePartners.ts:95',message:'Supabase insert error',data:{errorCode:error.code,errorMessage:error.message,errorDetails:error.details,errorHint:error.hint,insertData},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'ALL'})}).catch(()=>{});
        // #endregion
        
        console.error('Create partner error:', error)
        console.error('Error code:', error.code)
        console.error('Error message:', error.message)
        console.error('Error details:', error.details)
        console.error('Error hint:', error.hint)
        console.error('Partner data that was sent:', JSON.stringify(insertData, null, 2))
        throw error
      }
      
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'usePartners.ts:107',message:'Partner created successfully',data:{partnerId:data?.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'ALL'})}).catch(()=>{});
      // #endregion
      
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
