'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useUploadAvatar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (file: File) => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }
      
      // Create a unique file name
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.id}/avatar-${Date.now()}.${fileExt}`
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true, // Replace existing avatar if it exists
          contentType: file.type,
        })
      
      if (uploadError) {
        throw uploadError
      }
      
      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName)
      
      // Update user record with new avatar URL
      const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      return { url: publicUrl, user: data }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

export function useDeleteAvatar() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('Not authenticated')
      }
      
      // Delete all avatars for this user
      const { data: files, error: listError } = await supabase.storage
        .from('avatars')
        .list(user.id)
      
      if (listError) {
        // If folder doesn't exist, that's okay
        if (listError.message.includes('not found')) {
          // Continue to update user record
        } else {
          throw listError
        }
      } else if (files && files.length > 0) {
        const filePaths = files.map(file => `${user.id}/${file.name}`)
        const { error: deleteError } = await supabase.storage
          .from('avatars')
          .remove(filePaths)
        
        if (deleteError) {
          throw deleteError
        }
      }
      
      // Update user record to remove avatar URL
      const { data, error } = await supabase
        .from('users')
        .update({ avatar_url: null })
        .eq('id', user.id)
        .select()
        .single()
      
      if (error) {
        throw error
      }
      
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] })
      queryClient.invalidateQueries({ queryKey: ['users'] })
    },
  })
}

