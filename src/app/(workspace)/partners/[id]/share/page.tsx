'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePartner } from '@/hooks/usePartners'

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  permission: 'view' | 'edit' | 'owner'
}

export default function SharePartnerPage() {
  const router = useRouter()
  const params = useParams()
  const partnerId = params.id as string
  
  const { data: partner, isLoading } = usePartner(partnerId)
  
  // Mock team members - in real app, this would come from the database
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
    {
      id: '1',
      name: 'Willem de Vries',
      email: 'willem@konsensi.com',
      permission: 'edit'
    },
    {
      id: '2',
      name: 'Lotte Jansen',
      email: 'lotte@konsensi.com',
      permission: 'view'
    }
  ])
  
  const [selectedUser, setSelectedUser] = useState('')
  const [newPermission, setNewPermission] = useState<'view' | 'edit'>('view')

  const handleClose = () => {
    router.push(`/partners/${partnerId}/edit`)
  }

  const handleDone = () => {
    // TODO: Save sharing permissions to database
    router.push(`/partners/${partnerId}/edit`)
  }

  const handleAddMember = () => {
    if (!selectedUser) return
    
    // Mock: Get user details from selectedUser
    const userMap: Record<string, { name: string; email: string }> = {
      sarah: { name: 'Sarah Jenkins', email: 'sarah@konsensi.com' },
      mike: { name: 'Mike Ross', email: 'mike@konsensi.com' },
      jessica: { name: 'Jessica Pearson', email: 'jessica@konsensi.com' }
    }
    
    const user = userMap[selectedUser]
    if (!user) return
    
    // Check if user already exists
    if (teamMembers.some(m => m.email === user.email)) {
      alert('This user is already added')
      return
    }
    
    setTeamMembers([...teamMembers, {
      id: Date.now().toString(),
      name: user.name,
      email: user.email,
      permission: newPermission
    }])
    
    setSelectedUser('')
    setNewPermission('view')
  }

  const handlePermissionChange = (memberId: string, permission: string) => {
    if (permission === 'remove') {
      setTeamMembers(teamMembers.filter(m => m.id !== memberId))
    } else {
      setTeamMembers(teamMembers.map(m => 
        m.id === memberId 
          ? { ...m, permission: permission as 'view' | 'edit' }
          : m
      ))
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#222c1b] rounded-xl p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#222c1b] rounded-xl p-8">
          <p>Partner not found</p>
          <button onClick={() => router.push('/partners')} className="mt-4 text-primary">Go back</button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Background Simulation */}
      <div className="fixed inset-0 z-0 p-8 opacity-20 dark:opacity-10 blur-sm pointer-events-none select-none flex flex-col gap-6">
        <div className="h-16 w-full bg-white dark:bg-[#222c1b] rounded-xl shadow-sm"></div>
        <div className="flex gap-6 h-full">
          <div className="w-64 h-full bg-white dark:bg-[#222c1b] rounded-xl shadow-sm hidden md:block"></div>
          <div className="flex-1 h-full bg-white dark:bg-[#222c1b] rounded-xl shadow-sm"></div>
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-10 flex h-full w-full items-center justify-center bg-[#131b0d]/40 backdrop-blur-sm p-4">
        {/* Modal Container */}
        <div className="w-full max-w-[600px] flex flex-col overflow-hidden rounded-xl bg-white dark:bg-[#222c1b] shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
          
          {/* Modal Header */}
          <div className="flex items-center justify-between border-b border-[#dae7cf] dark:border-[#36462a] px-6 py-5">
            <h3 className="text-[#131b0d] dark:text-white text-xl font-bold leading-tight">
              Share Partner - {partner.name}
            </h3>
            <button
              onClick={handleClose}
              className="group flex h-8 w-8 items-center justify-center rounded-lg hover:bg-[#f7f8f6] dark:hover:bg-[#182210] transition-colors"
            >
              <span className="material-symbols-outlined text-gray-500 dark:text-gray-400 group-hover:text-[#131b0d] dark:group-hover:text-white">close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Description */}
            <p className="text-gray-600 dark:text-gray-300 text-sm font-normal leading-normal mb-6">
              Invite team members to view or edit this partner's information.
            </p>

            {/* Add Team Member Section */}
            <div className="rounded-xl border border-[#dae7cf] dark:border-[#36462a] bg-[#f7f8f6]/50 dark:bg-[#182210]/30 p-5 mb-8">
              <label className="block text-sm font-bold text-[#131b0d] dark:text-white mb-2">
                Add Team Member
              </label>
              <div className="flex flex-col gap-4">
                {/* User Select */}
                <div className="relative w-full">
                  <select
                    className="w-full appearance-none rounded-lg border border-[#dae7cf] dark:border-[#36462a] bg-white dark:bg-[#2a3621] py-3 pl-4 pr-10 text-[#131b0d] dark:text-white placeholder-gray-400 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-sm"
                    value={selectedUser}
                    onChange={(e) => setSelectedUser(e.target.value)}
                  >
                    <option disabled value="">Select a name...</option>
                    <option value="sarah">Sarah Jenkins</option>
                    <option value="mike">Mike Ross</option>
                    <option value="jessica">Jessica Pearson</option>
                  </select>
                  <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-primary">
                    <span className="material-symbols-outlined text-xl">expand_more</span>
                  </span>
                </div>

                {/* Permissions & Add Button Row */}
                <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                  {/* Radio Group */}
                  <div className="flex gap-2">
                    <label className={`group relative flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      newPermission === 'view'
                        ? 'border-primary bg-primary/10 text-[#131b0d] dark:text-white'
                        : 'border-[#dae7cf] dark:border-[#36462a] bg-white dark:bg-[#2a3621] text-[#131b0d] dark:text-gray-200'
                    }`}>
                      <span className="mr-2 flex items-center">
                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                      </span>
                      Can view
                      <input
                        className="sr-only"
                        name="new-permission"
                        type="radio"
                        value="view"
                        checked={newPermission === 'view'}
                        onChange={() => setNewPermission('view')}
                      />
                      {newPermission === 'view' && (
                        <div className="absolute inset-0 rounded-lg ring-2 ring-primary opacity-100 pointer-events-none"></div>
                      )}
                    </label>
                    <label className={`group relative flex cursor-pointer items-center justify-center rounded-lg border px-3 py-2 text-sm font-medium transition-all ${
                      newPermission === 'edit'
                        ? 'border-primary bg-primary/10 text-[#131b0d] dark:text-white'
                        : 'border-[#dae7cf] dark:border-[#36462a] bg-white dark:bg-[#2a3621] text-[#131b0d] dark:text-gray-200'
                    }`}>
                      <span className="mr-2 flex items-center">
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </span>
                      Can edit
                      <input
                        className="sr-only"
                        name="new-permission"
                        type="radio"
                        value="edit"
                        checked={newPermission === 'edit'}
                        onChange={() => setNewPermission('edit')}
                      />
                      {newPermission === 'edit' && (
                        <div className="absolute inset-0 rounded-lg ring-2 ring-primary opacity-100 pointer-events-none"></div>
                      )}
                    </label>
                  </div>

                  {/* Add Button */}
                  <button
                    onClick={handleAddMember}
                    disabled={!selectedUser}
                    className="flex items-center justify-center gap-2 rounded-lg bg-primary/20 hover:bg-primary/30 dark:bg-primary/20 dark:hover:bg-primary/30 px-4 py-2.5 text-sm font-bold text-[#131b0d] dark:text-white transition-colors border border-transparent hover:border-primary/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="material-symbols-outlined text-lg">add</span>
                    Add Member
                  </button>
                </div>
              </div>
            </div>

            {/* Current Access List */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                Current Access
              </h4>
              <div className="flex flex-col gap-1">
                {/* Owner Row */}
                <div className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f7f8f6] dark:hover:bg-[#182210]/50 transition-colors group">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white dark:ring-[#222c1b] bg-gray-200">
                      <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                        <span className="text-[#131b0d] font-bold text-sm">Y</span>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-[#131b0d] dark:text-white">You</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Owner</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500 text-sm">
                    <span className="material-symbols-outlined text-lg">lock</span>
                    <span className="hidden sm:inline font-medium">Full access</span>
                  </div>
                </div>

                {/* Member Rows */}
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f7f8f6] dark:hover:bg-[#182210]/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full ring-2 ring-white dark:ring-[#222c1b] bg-gray-200">
                        <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                          <span className="text-[#131b0d] font-bold text-sm">
                            {member.name.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-[#131b0d] dark:text-white">
                          {member.name}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {member.email}
                        </span>
                      </div>
                    </div>
                    <div className="relative">
                      <select
                        className="cursor-pointer appearance-none rounded bg-transparent py-1 pl-2 pr-7 text-sm font-medium text-[#131b0d] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none focus:ring-1 focus:ring-primary"
                        value={member.permission}
                        onChange={(e) => handlePermissionChange(member.id, e.target.value)}
                      >
                        <option value="edit">Can edit</option>
                        <option value="view">Can view</option>
                        <option value="remove" className="text-red-500">Remove</option>
                      </select>
                      <span className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-gray-500">
                        <span className="material-symbols-outlined text-base">expand_more</span>
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs text-gray-400 dark:text-gray-500 italic">
                Note: The owner always retains full access to this partner.
              </p>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 border-t border-[#dae7cf] dark:border-[#36462a] bg-[#f7f8f6]/30 dark:bg-[#182210]/30 px-6 py-4">
            <button
              onClick={handleClose}
              className="rounded-lg px-5 py-2.5 text-sm font-bold text-[#131b0d] dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="rounded-lg bg-primary px-6 py-2.5 text-sm font-bold text-[#131b0d] hover:bg-[#64d310] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-[#222c1b]"
            >
              Done
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

