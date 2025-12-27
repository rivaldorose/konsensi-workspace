'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDocument } from '@/hooks/useDocuments'

interface TeamMember {
  id: string
  name: string
  email: string
  avatar?: string
  permission: 'view' | 'edit' | 'owner'
}

export default function ShareDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string
  
  const { data: document, isLoading } = useDocument(documentId)
  
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [inviteEmail, setInviteEmail] = useState('')
  const [newPermission, setNewPermission] = useState<'view' | 'edit'>('view')
  const [accessLevel, setAccessLevel] = useState<'restricted' | 'view' | 'edit'>('edit')
  const [preventAccessChange, setPreventAccessChange] = useState(true)
  const [disableDownload, setDisableDownload] = useState(false)
  const [notifyOnShare, setNotifyOnShare] = useState(true)

  // Mock team members - in real app, this would come from the database
  // Initialize with owner if document exists
  useEffect(() => {
    if (document?.owner_id && teamMembers.length === 0) {
      setTeamMembers([{
        id: document.owner_id,
        name: 'You',
        email: '',
        permission: 'owner'
      }])
    }
  }, [document, teamMembers.length])

  const handleClose = () => {
    router.push('/docs')
  }

  const handleDone = () => {
    // TODO: Save sharing permissions to database
    router.push('/docs')
  }

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    
    // Check if user already exists
    if (teamMembers.some(m => m.email === inviteEmail.trim())) {
      alert('This user is already added')
      return
    }
    
    setTeamMembers([...teamMembers, {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail.trim(),
      permission: newPermission
    }])
    
    setInviteEmail('')
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

  const handleCopyLink = async () => {
    const link = `${window.location.origin}/docs/${documentId}`
    try {
      await navigator.clipboard.writeText(link)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy link:', err)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1a2016] rounded-xl p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1a2016] rounded-xl p-8">
          <p>Document not found</p>
        </div>
      </div>
    )
  }

  const documentLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/docs/${documentId}`

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        aria-hidden="true" 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[#fafcf8] dark:bg-[#1a2016] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden border border-[#ecf3e7] dark:border-[#2d3a24]">
          {/* Header */}
          <header className="flex items-center justify-between px-6 py-5 border-b border-[#ecf3e7] dark:border-[#2d3a24]">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-[#ecf3e7] dark:bg-[#2d3a24] text-[#131b0d] dark:text-white">
                <span className="material-symbols-outlined text-xl">description</span>
              </div>
              <h2 className="text-xl font-bold text-[#131b0d] dark:text-white leading-tight">
                Share "{document.title}"
              </h2>
            </div>
            <button 
              onClick={handleClose}
              className="flex items-center justify-center size-8 rounded-full hover:bg-[#ecf3e7] dark:hover:bg-[#2d3a24] text-[#131b0d] dark:text-white transition-colors cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="overflow-y-auto flex-1">
            <div className="p-6 space-y-8">
              {/* Add People Section */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#131b0d] dark:text-white">
                  Add people and groups
                </label>
                <div className="flex gap-3">
                  <div className="relative flex-1">
                    <input
                      className="w-full h-12 pl-4 pr-10 rounded-lg border border-[#dae7cf] dark:border-[#445536] bg-white dark:bg-[#131b0d] text-[#131b0d] dark:text-white placeholder-[#6e9a4c] focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                      placeholder="Enter names or emails..."
                      type="text"
                      value={inviteEmail}
                      onChange={(e) => setInviteEmail(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleInvite()
                        }
                      }}
                    />
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-[#6e9a4c]">
                      person_add
                    </span>
                  </div>
                  <button
                    onClick={handleInvite}
                    className="bg-[#ecf3e7] dark:bg-[#2d3a24] hover:bg-[#dae7cf] dark:hover:bg-[#3a4b2f] text-[#131b0d] dark:text-white font-semibold px-6 rounded-lg text-sm transition-colors border border-transparent h-12"
                  >
                    Invite
                  </button>
                </div>
              </div>

              {/* Who has access List */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#131b0d] dark:text-white uppercase tracking-wider opacity-70">
                  Who has access
                </h3>
                <div className="flex flex-col gap-1">
                  {/* Owner */}
                  {teamMembers.filter(m => m.permission === 'owner').map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f2f7ef] dark:hover:bg-[#222c1b] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {member.avatar ? (
                            <div
                              className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-[#ecf3e7] dark:border-[#2d3a24]"
                              style={{ backgroundImage: `url(${member.avatar})` }}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                              <span className="material-symbols-outlined text-xl">person</span>
                            </div>
                          )}
                          <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#131b0d] rounded-full p-[2px]">
                            <div className="bg-primary size-2.5 rounded-full border border-white dark:border-[#131b0d]"></div>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-[#131b0d] dark:text-white">
                            {member.name} {member.permission === 'owner' && '(You)'}
                          </p>
                          <p className="text-xs text-[#6e9a4c]">{member.email}</p>
                        </div>
                      </div>
                      <span className="text-xs font-medium text-[#131b0d] dark:text-white px-3 py-1 bg-[#ecf3e7] dark:bg-[#2d3a24] rounded-full">
                        Owner
                      </span>
                    </div>
                  ))}

                  {/* Other Members */}
                  {teamMembers.filter(m => m.permission !== 'owner').map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg hover:bg-[#f2f7ef] dark:hover:bg-[#222c1b] transition-colors group"
                    >
                      <div className="flex items-center gap-3">
                        {member.avatar ? (
                          <div
                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10 border border-[#ecf3e7] dark:border-[#2d3a24]"
                            style={{ backgroundImage: `url(${member.avatar})` }}
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                            <span className="material-symbols-outlined text-xl">person</span>
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-bold text-[#131b0d] dark:text-white">{member.name}</p>
                          <p className="text-xs text-[#6e9a4c]">{member.email}</p>
                        </div>
                      </div>
                      <div className="relative group/dropdown">
                        <button className="flex items-center gap-1 text-xs font-medium text-[#131b0d] dark:text-white px-3 py-1.5 hover:bg-white dark:hover:bg-[#131b0d] border border-transparent hover:border-[#dae7cf] dark:hover:border-[#445536] rounded-md transition-all">
                          Can {member.permission}
                          <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* General Access */}
              <div className="space-y-4 pt-2 border-t border-[#ecf3e7] dark:border-[#2d3a24]">
                <h3 className="text-sm font-semibold text-[#131b0d] dark:text-white uppercase tracking-wider opacity-70 mt-4">
                  General Access
                </h3>
                <div className="flex flex-col gap-3">
                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center pt-0.5">
                      <input
                        className="peer sr-only"
                        name="access_level"
                        type="radio"
                        checked={accessLevel === 'restricted'}
                        onChange={() => setAccessLevel('restricted')}
                      />
                      <div className="size-5 rounded-full border-2 border-[#dae7cf] peer-checked:border-primary peer-checked:bg-white relative transition-colors flex items-center justify-center">
                        <div className={`size-2.5 rounded-full bg-primary transition-opacity ${accessLevel === 'restricted' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#131b0d] dark:text-white group-hover:text-primary transition-colors">
                        Restricted
                      </span>
                      <span className="text-xs text-[#6e9a4c]">Only people with access can open with the link</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center pt-0.5">
                      <input
                        className="peer sr-only"
                        name="access_level"
                        type="radio"
                        checked={accessLevel === 'view'}
                        onChange={() => setAccessLevel('view')}
                      />
                      <div className="size-5 rounded-full border-2 border-[#dae7cf] peer-checked:border-primary peer-checked:bg-white relative transition-colors flex items-center justify-center">
                        <div className={`size-2.5 rounded-full bg-primary transition-opacity ${accessLevel === 'view' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#131b0d] dark:text-white group-hover:text-primary transition-colors">
                        Anyone with link can view
                      </span>
                      <span className="text-xs text-[#6e9a4c]">Anyone on the internet with the link can view</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer group">
                    <div className="relative flex items-center pt-0.5">
                      <input
                        className="peer sr-only"
                        name="access_level"
                        type="radio"
                        checked={accessLevel === 'edit'}
                        onChange={() => setAccessLevel('edit')}
                      />
                      <div className="size-5 rounded-full border-2 border-[#dae7cf] peer-checked:border-primary peer-checked:bg-white relative transition-colors flex items-center justify-center">
                        <div className={`size-2.5 rounded-full bg-primary transition-opacity ${accessLevel === 'edit' ? 'opacity-100' : 'opacity-0'}`}></div>
                      </div>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-[#131b0d] dark:text-white group-hover:text-primary transition-colors">
                        Anyone with link can edit
                      </span>
                      <span className="text-xs text-[#6e9a4c]">Anyone on the internet with the link can edit</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Link Sharing */}
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-[#131b0d] dark:text-white">
                  Link sharing
                </label>
                <div className="flex items-center gap-0 w-full rounded-lg border border-[#dae7cf] dark:border-[#445536] bg-[#fafcf8] dark:bg-[#131b0d] overflow-hidden focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                  <div className="pl-3 text-[#6e9a4c]">
                    <span className="material-symbols-outlined text-[20px]">link</span>
                  </div>
                  <input
                    className="flex-1 h-12 px-3 bg-transparent text-sm text-[#131b0d] dark:text-white outline-none truncate"
                    readOnly
                    type="text"
                    value={documentLink}
                  />
                  <button
                    onClick={handleCopyLink}
                    className="h-12 px-4 text-sm font-bold text-primary hover:bg-[#ecf3e7] dark:hover:bg-[#2d3a24] transition-colors flex items-center gap-2 border-l border-[#dae7cf] dark:border-[#445536]"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              {/* Advanced Settings */}
              <div className="pt-2 border-t border-[#ecf3e7] dark:border-[#2d3a24]">
                <h3 className="text-sm font-semibold text-[#131b0d] dark:text-white uppercase tracking-wider opacity-70 mt-4 mb-3">
                  Advanced Settings
                </h3>
                <div className="space-y-3">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      checked={preventAccessChange}
                      onChange={(e) => setPreventAccessChange(e.target.checked)}
                      className="rounded border-[#dae7cf] text-primary focus:ring-primary size-4 mt-0.5"
                      type="checkbox"
                    />
                    <span className="text-sm text-[#131b0d] dark:text-white">
                      Prevent editors from changing access and adding new people
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      checked={disableDownload}
                      onChange={(e) => setDisableDownload(e.target.checked)}
                      className="rounded border-[#dae7cf] text-primary focus:ring-primary size-4 mt-0.5"
                      type="checkbox"
                    />
                    <span className="text-sm text-[#131b0d] dark:text-white">
                      Disable options to download, print, and copy for commenters and viewers
                    </span>
                  </label>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      checked={notifyOnShare}
                      onChange={(e) => setNotifyOnShare(e.target.checked)}
                      className="rounded border-[#dae7cf] text-primary focus:ring-primary size-4 mt-0.5"
                      type="checkbox"
                    />
                    <span className="text-sm text-[#131b0d] dark:text-white">
                      Notify people when sharing
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="p-6 border-t border-[#ecf3e7] dark:border-[#2d3a24] bg-[#fafcf8] dark:bg-[#1a2016] flex justify-end gap-3 z-10 rounded-b-xl">
            <button
              onClick={handleClose}
              className="px-6 h-10 rounded-lg border border-[#dae7cf] dark:border-[#445536] text-[#131b0d] dark:text-white text-sm font-bold hover:bg-[#f2f7ef] dark:hover:bg-[#222c1b] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDone}
              className="px-6 h-10 rounded-lg bg-primary text-white text-sm font-bold shadow-sm hover:brightness-95 transition-all"
            >
              Done
            </button>
          </footer>
        </div>
      </div>
    </>
  )
}

