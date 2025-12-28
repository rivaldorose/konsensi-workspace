import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import type { Contract, ContractParty } from '@/types'

export function useContracts() {
  return useQuery({
    queryKey: ['contracts'],
    queryFn: async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contracts')
        .select('*, owner:users(*)')
        .order('created_at', { ascending: false })

      if (error) throw error
      return (data || []) as Contract[]
    },
  })
}

export function useContract(id: string | undefined) {
  return useQuery({
    queryKey: ['contract', id],
    queryFn: async () => {
      if (!id) return null
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contracts')
        .select('*, owner:users(*)')
        .eq('id', id)
        .single()

      if (error) throw error
      return data as Contract
    },
    enabled: !!id,
  })
}

export function useCreateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (contract: Omit<Contract, 'id' | 'owner' | 'created_at' | 'updated_at'>) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) throw new Error('User not authenticated')

      const { data, error } = await supabase
        .from('contracts')
        .insert({
          ...contract,
          owner_id: user.id,
        })
        .select('*, owner:users(*)')
        .single()

      if (error) throw error
      return data as Contract
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useUpdateContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ id, ...contract }: Partial<Contract> & { id: string }) => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('contracts')
        .update(contract)
        .eq('id', id)
        .select('*, owner:users(*)')
        .single()

      if (error) throw error
      return data as Contract
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useDeleteContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('contracts')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
    },
  })
}

export function useArchiveContract() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const supabase = createClient()
      const { error } = await supabase
        .from('contracts')
        .update({ status: 'archived' as Contract['status'] })
        .eq('id', id)

      if (error) throw error
      return id
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['contracts'] })
      queryClient.invalidateQueries({ queryKey: ['contract', id] })
    },
  })
}

