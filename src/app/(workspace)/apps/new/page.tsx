'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateApp } from '@/hooks/useApps'
import { useUsers, useCurrentUser } from '@/hooks/useUsers'
import type { App } from '@/types'

export default function NewAppPage() {
  const router = useRouter()
  const createApp = useCreateApp()
  const { data: users = [] } = useUsers()
  const { data: currentUser } = useCurrentUser()
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'internal',
    status: 'development' as App['status'],
    icon: '🚀',
    production_url: '',
    staging_url: '',
    github_url: '',
    documentation_url: '',
    launch_date: '',
    tech_stack: {
      frontend: '',
      backend: '',
      ai: ''
    },
    metrics: {
      active_users: 0,
      target_users: 0
    },
    tags: '',
    notes: ''
  })

  const [teamMembers, setTeamMembers] = useState<string[]>([])
  const [newMember, setNewMember] = useState('')
  const [productOwner, setProductOwner] = useState('')

  // Set default owner to current user
  useEffect(() => {
    if (currentUser && !productOwner) {
      setProductOwner(currentUser.id)
    }
  }, [currentUser])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('App Name is required')
      return
    }

    try {
      await createApp.mutateAsync({
        name: formData.name,
        description: formData.description || undefined,
        category: formData.category,
        status: formData.status,
        icon: formData.icon,
        production_url: formData.production_url || undefined,
        staging_url: formData.staging_url || undefined,
        github_url: formData.github_url || undefined,
        launch_date: formData.launch_date || undefined,
        tech_stack: {
          frontend: formData.tech_stack.frontend ? formData.tech_stack.frontend.split(',').map(t => t.trim()) : [],
          backend: formData.tech_stack.backend ? formData.tech_stack.backend.split(',').map(t => t.trim()) : [],
          ai: formData.tech_stack.ai ? formData.tech_stack.ai.split(',').map(t => t.trim()) : []
        },
        team_members: teamMembers,
        metrics: {
          active_users: formData.metrics.active_users || undefined,
          satisfaction: undefined,
          feedback_count: undefined
        }
      })
      router.push('/apps')
    } catch (error) {
      console.error('Failed to create app:', error)
      alert('Failed to create app. Please try again.')
    }
  }

  const handleAddMember = () => {
    if (newMember.trim() && !teamMembers.includes(newMember.trim())) {
      setTeamMembers([...teamMembers, newMember.trim()])
      setNewMember('')
    }
  }

  const handleRemoveMember = (member: string) => {
    setTeamMembers(teamMembers.filter(m => m !== member))
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity"
        onClick={() => router.back()}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative z-50 flex flex-col w-full max-w-[800px] max-h-[90vh] bg-white dark:bg-[#1e2a16] rounded-2xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header (Sticky) */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1e2a16] sticky top-0 z-10">
            <h2 className="text-xl font-bold tracking-tight text-[#131b0d] dark:text-white">Add New App</h2>
            <button
              onClick={() => router.back()}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors text-gray-500 dark:text-gray-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-8 custom-scrollbar">
            {/* Section: App Information */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                </svg>
                <h3 className="text-lg font-bold">App Information</h3>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                {/* App Icon Picker */}
                <div className="flex flex-col gap-2 items-center">
                  <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-white/5 border border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center text-3xl select-none">
                    {formData.icon}
                  </div>
                  <button
                    type="button"
                    className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline"
                  >
                    Change Icon
                  </button>
                </div>

                {/* Main Info Fields */}
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 w-full">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        App Name <span className="text-red-500">*</span>
                      </span>
                      <input
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        placeholder="e.g. Konsensi Dashboard"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </label>
                    <label className="flex flex-col gap-1.5 w-full">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Category/Type</span>
                      <div className="relative">
                        <select
                          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm appearance-none pr-10"
                          value={formData.category}
                          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        >
                          <option value="internal">Internal Tool</option>
                          <option value="client">Client Facing</option>
                          <option value="utility">Utility</option>
                          <option value="service">Service</option>
                        </select>
                        <svg className="absolute right-3 top-2.5 pointer-events-none text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                    </label>
                  </div>
                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Description</span>
                    <textarea
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                      placeholder="Briefly describe what this app does..."
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <label className="flex flex-col gap-1.5 w-full">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Current Status</span>
                      <div className="flex bg-gray-50 dark:bg-white/5 p-1 rounded-lg border border-gray-200 dark:border-gray-700">
                        {(['development', 'live', 'paused'] as const).map((status) => (
                          <label key={status} className="flex-1 text-center cursor-pointer">
                            <input
                              className="peer sr-only"
                              name="status"
                              type="radio"
                              value={status}
                              checked={formData.status === status}
                              onChange={(e) => setFormData({ ...formData, status: e.target.value as App['status'] })}
                            />
                            <span className="block text-xs font-medium py-1.5 px-2 rounded-md text-gray-500 peer-checked:bg-white dark:peer-checked:bg-gray-700 peer-checked:text-black dark:peer-checked:text-white peer-checked:shadow-sm transition-all capitalize">
                              {status === 'development' ? 'Dev' : status === 'paused' ? 'Sunset' : status}
                            </span>
                          </label>
                        ))}
                      </div>
                    </label>
                    <label className="flex flex-col gap-1.5 w-full">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Target Launch Date</span>
                      <input
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                        type="date"
                        value={formData.launch_date}
                        onChange={(e) => setFormData({ ...formData, launch_date: e.target.value })}
                      />
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800"/>

            {/* Section: Links & Access */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                </svg>
                <h3 className="text-lg font-bold">Links & Access</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Production URL</span>
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" />
                    </svg>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      placeholder="https://app.konsensi.com"
                      type="url"
                      value={formData.production_url}
                      onChange={(e) => setFormData({ ...formData, production_url: e.target.value })}
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Staging / Test URL</span>
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      placeholder="https://staging.konsensi.com"
                      type="url"
                      value={formData.staging_url}
                      onChange={(e) => setFormData({ ...formData, staging_url: e.target.value })}
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">GitHub Repository</span>
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      placeholder="konsensi/workspace"
                      type="text"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    />
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Documentation Link</span>
                  <div className="relative">
                    <svg className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                    </svg>
                    <input
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      placeholder="https://notion.so/..."
                      type="url"
                      value={formData.documentation_url}
                      onChange={(e) => setFormData({ ...formData, documentation_url: e.target.value })}
                    />
                  </div>
                </label>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800"/>

            {/* Section: Team & Ownership */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <h3 className="text-lg font-bold">Team & Ownership</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Product Owner <span className="text-red-500">*</span>
                  </span>
                  <div className="flex items-center gap-3 p-2 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-white/5">
                    <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDJjBVTYpTH8jVPH59M6IZBpwIL0fip362abSrBdEgW4dxqoTWX0RfUZIEPGa0_qQZJ0LJJQz_rbL8N2gQOAJsWUokTFIX6abeGNLXxWb0MePeYm3TRr045P0ESn74c_PH-cwEr5YWyfKjLdFPfhz8xTk_LQFtwp-Kg10as_6ZB77lFfa3mFeqnBXpOXf2WWNsN2qzuRRfki1YFBLAK3w8dvq1ylX7wydnR8KHq-irsJO_gxpT4TUJelghotXYtM7acEETa3FhrH5Qf")' }}></div>
                    <select
                      className="bg-transparent w-full text-sm focus:outline-none text-gray-800 dark:text-gray-200"
                      value={productOwner}
                      onChange={(e) => setProductOwner(e.target.value)}
                      required
                    >
                      <option value="">Select owner...</option>
                      {users.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.id === currentUser?.id ? `${user.full_name || user.email} (You)` : user.full_name || user.email}
                        </option>
                      ))}
                    </select>
                  </div>
                </label>
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Development Team</span>
                  <div className="min-h-[46px] p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-white/5 flex flex-wrap gap-2 items-center">
                    {teamMembers.map((member) => (
                      <span
                        key={member}
                        className="bg-white dark:bg-white/10 px-2 py-1 rounded text-xs font-medium border border-gray-100 dark:border-gray-600 flex items-center gap-1 shadow-sm"
                      >
                        {member}
                        <button
                          type="button"
                          onClick={() => handleRemoveMember(member)}
                          className="hover:text-red-500"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      className="bg-transparent text-sm px-2 focus:outline-none w-24 flex-1"
                      placeholder="+ Add member"
                      type="text"
                      value={newMember}
                      onChange={(e) => setNewMember(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddMember()
                        }
                      }}
                    />
                  </div>
                </label>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800"/>

            {/* Section: Tech Stack */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                <h3 className="text-lg font-bold">Tech Stack</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Frontend</span>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="React, Vue..."
                    type="text"
                    value={formData.tech_stack.frontend}
                    onChange={(e) => setFormData({ ...formData, tech_stack: { ...formData.tech_stack, frontend: e.target.value } })}
                  />
                </label>
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Backend</span>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="Node, Go..."
                    type="text"
                    value={formData.tech_stack.backend}
                    onChange={(e) => setFormData({ ...formData, tech_stack: { ...formData.tech_stack, backend: e.target.value } })}
                  />
                </label>
                <label className="flex flex-col gap-1.5 w-full">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">AI / ML</span>
                  <input
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                    placeholder="OpenAI, PyTorch..."
                    type="text"
                    value={formData.tech_stack.ai}
                    onChange={(e) => setFormData({ ...formData, tech_stack: { ...formData.tech_stack, ai: e.target.value } })}
                  />
                </label>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800"/>

            {/* Section: Metrics & Related */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <h3 className="text-lg font-bold">Metrics</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Active Users</span>
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      placeholder="0"
                      type="number"
                      value={formData.metrics.active_users || ''}
                      onChange={(e) => setFormData({ ...formData, metrics: { ...formData.metrics, active_users: parseInt(e.target.value) || 0 } })}
                    />
                  </label>
                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-xs uppercase font-bold text-gray-500 tracking-wider">Target Users</span>
                    <input
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                      placeholder="0"
                      type="number"
                      value={formData.metrics.target_users || ''}
                      onChange={(e) => setFormData({ ...formData, metrics: { ...formData.metrics, target_users: parseInt(e.target.value) || 0 } })}
                    />
                  </label>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
                  </svg>
                  <h3 className="text-lg font-bold">Related To</h3>
                </div>
                <div className="space-y-3">
                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Parent App</span>
                    <select className="w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm">
                      <option value="">None (Standalone)</option>
                      <option>Main Platform</option>
                      <option>Marketing Site</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1.5 w-full">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Related Events</span>
                    <div className="min-h-[42px] p-1.5 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-white/5 flex flex-wrap gap-2 items-center">
                      <span className="bg-primary/20 text-[#131b0d] dark:text-primary px-2 py-0.5 rounded text-xs font-semibold border border-primary/20 flex items-center gap-1">
                        Q3 Launch
                        <button type="button" className="hover:text-black dark:hover:text-white">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </section>

            <hr className="border-gray-100 dark:border-gray-800"/>

            {/* Section: Additional */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M17.707 9.293a1 1 0 010 1.414l-7 7a1 1 0 01-1.414 0l-7-7A.997.997 0 012 10V5a3 3 0 013-3h5c.256 0 .512.098.707.293l7 7zM5 6a1 1 0 100-2 1 1 0 000 2z" />
                </svg>
                <h3 className="text-lg font-bold">Additional</h3>
              </div>
              <label className="flex flex-col gap-1.5 w-full">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Tags</span>
                <input
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm"
                  placeholder="e.g. #internal, #mvp, #finance"
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                />
              </label>
              <label className="flex flex-col gap-1.5 w-full">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Notes</span>
                <textarea
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-sm resize-none"
                  placeholder="Any private notes for the team..."
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                />
              </label>
            </section>
          </form>

          {/* Footer (Sticky) */}
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#1e2a16]">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-5 py-2.5 rounded-lg text-sm font-semibold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              disabled={createApp.isPending}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-[#131b0d] hover:bg-[#62d110] focus:ring-4 focus:ring-primary/30 transition-all flex items-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Add App
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgba(156, 163, 175, 0.3);
          border-radius: 20px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background-color: rgba(156, 163, 175, 0.5);
        }
      `}</style>
    </>
  )
}
