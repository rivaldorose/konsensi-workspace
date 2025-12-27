'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp, useUpdateApp } from '@/hooks/useApps'
import type { App } from '@/types'

export default function EditAppPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: app, isLoading } = useApp(params.id)
  const updateApp = useUpdateApp()
  
  const [activeTab, setActiveTab] = useState('info')
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'live' as App['status'],
    category: '',
    version: '',
    icon: '🚀',
    production_url: '',
    staging_url: '',
    github_url: '',
    tags: [] as string[],
    tech_stack: {
      frontend: [] as string[],
      backend: [] as string[],
      ai: [] as string[]
    },
    metrics: {
      active_users: 0,
      satisfaction: 0,
      feedback_count: 0
    }
  })
  
  const [newTag, setNewTag] = useState('')
  const [newFrontend, setNewFrontend] = useState('')
  const [newBackend, setNewBackend] = useState('')

  useEffect(() => {
    if (app) {
      setFormData({
        name: app.name || '',
        description: app.description || '',
        status: app.status || 'live',
        category: app.category || '',
        version: '',
        icon: app.icon || '🚀',
        production_url: app.production_url || '',
        staging_url: app.staging_url || '',
        github_url: app.github_url || '',
        tags: [],
        tech_stack: {
          frontend: app.tech_stack?.frontend || [],
          backend: app.tech_stack?.backend || [],
          ai: app.tech_stack?.ai || []
        },
        metrics: {
          active_users: app.metrics?.active_users || 0,
          satisfaction: app.metrics?.satisfaction || 0,
          feedback_count: app.metrics?.feedback_count || 0
        }
      })
    }
  }, [app])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!app) return

    try {
      await updateApp.mutateAsync({
        id: app.id,
        name: formData.name,
        description: formData.description,
        status: formData.status,
        category: formData.category,
        icon: formData.icon,
        production_url: formData.production_url || undefined,
        staging_url: formData.staging_url || undefined,
        github_url: formData.github_url || undefined,
        tech_stack: formData.tech_stack,
        metrics: formData.metrics
      })
      router.back()
    } catch (error) {
      console.error('Failed to update app:', error)
    }
  }

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      })
      setNewTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    })
  }

  const handleAddTech = (type: 'frontend' | 'backend', value: string) => {
    if (value.trim()) {
      const techStack = { ...formData.tech_stack }
      if (!techStack[type].includes(value.trim())) {
        techStack[type] = [...techStack[type], value.trim()]
        setFormData({ ...formData, tech_stack: techStack })
      }
      if (type === 'frontend') setNewFrontend('')
      if (type === 'backend') setNewBackend('')
    }
  }

  const handleRemoveTech = (type: 'frontend' | 'backend', value: string) => {
    const techStack = { ...formData.tech_stack }
    techStack[type] = techStack[type].filter(t => t !== value)
    setFormData({ ...formData, tech_stack: techStack })
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#131b0d]/20 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="fixed inset-0 bg-[#131b0d]/20 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="text-white">App not found</div>
      </div>
    )
  }

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-[#131b0d]/20 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => router.back()}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-4xl bg-[#fafcf8] dark:bg-[#1f2b15] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#dae7cf] dark:border-[#3a4d2a]">
            <h1 className="text-xl font-bold tracking-tight text-[#131b0d] dark:text-white">
              Edit App - {formData.name}
            </h1>
            <button
              onClick={() => router.back()}
              className="p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#131b0d] dark:text-white"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>

          {/* Tabs */}
          <div className="px-6 border-b border-[#dae7cf] dark:border-[#3a4d2a] bg-[#fafcf8] dark:bg-[#1f2b15]">
            <div className="flex space-x-6 overflow-x-auto no-scrollbar">
              {['info', 'metrics', 'team', 'tech', 'links', 'notes'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex items-center py-4 border-b-2 whitespace-nowrap font-bold text-sm transition-colors capitalize ${
                    activeTab === tab
                      ? 'border-primary text-[#131b0d] dark:text-white'
                      : 'border-transparent text-[#6e9a4c] dark:text-[#a3c988] hover:text-[#131b0d] dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Content Body (Scrollable) */}
          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-8 bg-[#f7f8f6] dark:bg-background-dark">
            {activeTab === 'info' && (
              <>
                {/* Section: Info Form */}
                <div className="grid grid-cols-12 gap-6">
                  {/* Icon */}
                  <div className="col-span-12 sm:col-span-2">
                    <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Icon</label>
                    <div className="flex items-center justify-center w-full aspect-square bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] rounded-lg cursor-pointer hover:border-primary transition-colors group relative">
                      <span className="text-4xl">{formData.icon}</span>
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 rounded-lg transition-opacity">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  {/* Main Info */}
                  <div className="col-span-12 sm:col-span-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">
                        App Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        className="w-full h-12 px-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-[#6e9a4c]/50"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="col-span-1 sm:col-span-2">
                      <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Description</label>
                      <textarea
                        className="w-full h-24 px-4 py-3 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-[#6e9a4c]/50 resize-none"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      />
                    </div>
                  </div>

                  {/* Secondary Info */}
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">
                      Status <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select
                        className="w-full h-12 px-4 appearance-none rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as App['status'] })}
                        required
                      >
                        <option value="live">Live</option>
                        <option value="beta">Beta</option>
                        <option value="development">Development</option>
                      </select>
                      <svg className="absolute right-4 top-3 pointer-events-none text-[#6e9a4c] w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Category</label>
                    <div className="relative">
                      <select
                        className="w-full h-12 px-4 appearance-none rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all cursor-pointer"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="internal">Internal Tool</option>
                        <option value="saas">SaaS Product</option>
                        <option value="marketing">Marketing Site</option>
                      </select>
                      <svg className="absolute right-4 top-3 pointer-events-none text-[#6e9a4c] w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                    </div>
                  </div>
                  <div className="col-span-12 sm:col-span-4">
                    <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Version</label>
                    <input
                      className="w-full h-12 px-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                      type="text"
                      value={formData.version}
                      onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                    />
                  </div>
                </div>

                <hr className="border-[#dae7cf] dark:border-[#3a4d2a]"/>

                {/* Section: Metrics Preview */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Current Metrics</h3>
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Live Data</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                    <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                      <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Active Users</p>
                      <p className="text-xl font-bold text-[#131b0d] dark:text-white">{formData.metrics.active_users || 0}</p>
                      <div className="flex items-center mt-2 text-primary text-xs font-bold">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <span>+12%</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                      <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Growth</p>
                      <p className="text-xl font-bold text-[#131b0d] dark:text-white">8.5%</p>
                      <div className="flex items-center mt-2 text-primary text-xs font-bold">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                        </svg>
                        <span>MoM</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                      <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Satisfaction</p>
                      <p className="text-xl font-bold text-[#131b0d] dark:text-white">{formData.metrics.satisfaction || 0}%</p>
                      <div className="flex items-center mt-2 text-[#6e9a4c] dark:text-[#a3c988] text-xs font-bold">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>CSAT</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                      <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Feedback</p>
                      <p className="text-xl font-bold text-[#131b0d] dark:text-white">{formData.metrics.feedback_count || 0}</p>
                      <div className="flex items-center mt-2 text-[#6e9a4c] dark:text-[#a3c988] text-xs font-bold">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
                        </svg>
                        <span>Pending</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                      <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Avg Rating</p>
                      <p className="text-xl font-bold text-[#131b0d] dark:text-white">4.8</p>
                      <div className="flex items-center mt-2 text-yellow-500 text-xs font-bold">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span>Stars</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'links' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Links</h3>
                <div className="space-y-3">
                  <div className="relative">
                    <svg className="absolute left-3 top-3.5 text-[#6e9a4c] w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" />
                    </svg>
                    <input
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                      placeholder="Production URL"
                      type="text"
                      value={formData.production_url}
                      onChange={(e) => setFormData({ ...formData, production_url: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-3.5 text-[#6e9a4c] w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
                    </svg>
                    <input
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                      placeholder="Staging URL"
                      type="text"
                      value={formData.staging_url}
                      onChange={(e) => setFormData({ ...formData, staging_url: e.target.value })}
                    />
                  </div>
                  <div className="relative">
                    <svg className="absolute left-3 top-3.5 text-[#6e9a4c] w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" />
                    </svg>
                    <input
                      className="w-full h-12 pl-10 pr-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
                      placeholder="GitHub Repo"
                      type="text"
                      value={formData.github_url}
                      onChange={(e) => setFormData({ ...formData, github_url: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'tech' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Tech Stack & Tags</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Frontend</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tech_stack.frontend.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-[#e3f2fd] text-[#1565c0] text-xs font-bold border border-[#bbdefb] flex items-center gap-1"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech('frontend', tech)}
                            className="hover:text-red-500"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="px-3 py-1 rounded-full bg-[#f3e5f5] text-[#7b1fa2] text-xs font-bold border border-[#e1bee7] hover:bg-[#e1bee7] transition-colors cursor-pointer placeholder-[#7b1fa2]"
                        placeholder="+ Add"
                        value={newFrontend}
                        onChange={(e) => setNewFrontend(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTech('frontend', newFrontend)
                          }
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Backend</label>
                    <div className="flex flex-wrap gap-2">
                      {formData.tech_stack.backend.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold border border-[#c8e6c9] flex items-center gap-1"
                        >
                          {tech}
                          <button
                            type="button"
                            onClick={() => handleRemoveTech('backend', tech)}
                            className="hover:text-red-500"
                          >
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                            </svg>
                          </button>
                        </span>
                      ))}
                      <input
                        type="text"
                        className="px-3 py-1 rounded-full bg-[#e8f5e9] text-[#2e7d32] text-xs font-bold border border-[#c8e6c9] hover:bg-[#c8e6c9] transition-colors cursor-pointer placeholder-[#2e7d32]"
                        placeholder="+ Add"
                        value={newBackend}
                        onChange={(e) => setNewBackend(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddTech('backend', newBackend)
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#131b0d] dark:text-white mb-2">Tags</label>
                  <div className="p-3 bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] rounded-lg flex flex-wrap gap-2 min-h-[60px] items-center">
                    {formData.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded bg-[#f7f8f6] dark:bg-[#3a4d2a] text-[#131b0d] dark:text-white text-xs border border-[#dae7cf] dark:border-[#4d6638] flex items-center gap-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-red-500"
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                          </svg>
                        </button>
                      </span>
                    ))}
                    <input
                      className="bg-transparent text-sm outline-none text-[#131b0d] dark:text-white placeholder-[#6e9a4c]/60 flex-1 min-w-[80px]"
                      placeholder="Add a tag..."
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          handleAddTag()
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'team' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Team</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#6e9a4c] dark:text-[#a3c988] uppercase mb-2">Product Owner</label>
                    <div className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                      <div className="w-8 h-8 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD6udaZYXCqaj230lhsG-R1AnBZZcW5blsFsSffiqXMjKrAyJieeOKg4f-gExYxf2hUKnOuUbsVs8s_qWoZBe7SwPd7dQ_jLvCyKvUChp9DtUnFsuFXYI-MyCx0YASOKxifiWotBy_m8Nk3LZWcnEWwhWFJ5TqSCXOJefS2_XuY90C8YyIyPhqz97z_mjqZpOM_bp73EzNvIB8FT1d4uBZZW1dth23Ng8SEb8GUJJu_RkW3HKp8jibMZ8r6vodVQpGn2UXA3uTc_iFt")' }}></div>
                      <span className="text-sm font-medium text-[#131b0d] dark:text-white">Sarah Jenkins</span>
                      <svg className="ml-auto w-5 h-5 text-[#6e9a4c] cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6e9a4c] dark:text-[#a3c988] uppercase mb-2">Dev Team</label>
                    <div className="flex flex-wrap gap-2">
                      <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                        <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDp8EpHbvM8e-zpbdcq36uQV3a6fRrh4t-cM5IvuYiDIrfAINHEMzY_pYBLtmET0b2_eRz0AQEni8Hf2QAnPBZxGU8DFArQQIZBuNHqUoh-6sNJJjP6eUxOXXjXg-YylFQWOKUZstvhBgYDfQ01pv2iI3PzNy5yluu4q7YFD2xd_3mWNjbVMmPOkKnqunXyXjULp6dzOG12CM3UUAvXYTWCZVVaAKRAWhbI7FxrDCrliDC72lHGOrrykbXat5_hkgSRhOUhDWMs5i2e")' }}></div>
                        <span className="text-xs font-medium text-[#131b0d] dark:text-white">Mark</span>
                        <svg className="w-3 h-3 text-[#6e9a4c] cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                      <div className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                        <div className="w-6 h-6 rounded-full bg-cover bg-center" style={{ backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOUMn4B6f_DdEjuP_ak8etcJQRehu0UI6EPP0SeUQD8nJPolG6EjsoUcYqnBuPX6QgYJVbiuIhYULXVVW5DMNGhqZ9gtRZAD0EN9U2LQSShE7Xn-Lg8PpQZrMQp-uTkSxl_UPjiv__vGdeRsmC1gsrBsKso0CLMxButpiNIiU0YPkyPEqRR6viG4TvP_-VtvCjTDtrZIY4pbqcBZn1RfN_XEKCi2vP42AQf6nz2evEDzn8g2u_jTLv5TGbTugtcOUBQ57Bas0ZhdAM")' }}></div>
                        <span className="text-xs font-medium text-[#131b0d] dark:text-white">Elena</span>
                        <svg className="w-3 h-3 text-[#6e9a4c] cursor-pointer" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                        </svg>
                      </div>
                      <button className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 hover:bg-primary/30 text-primary-dark transition-colors border border-dashed border-primary">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'metrics' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Current Metrics</h3>
                  <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded">Live Data</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                    <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Active Users</p>
                    <p className="text-xl font-bold text-[#131b0d] dark:text-white">{formData.metrics.active_users || 0}</p>
                    <div className="flex items-center mt-2 text-primary text-xs font-bold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                      <span>+12%</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                    <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Growth</p>
                    <p className="text-xl font-bold text-[#131b0d] dark:text-white">8.5%</p>
                    <div className="flex items-center mt-2 text-primary text-xs font-bold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                      </svg>
                      <span>MoM</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                    <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Satisfaction</p>
                    <p className="text-xl font-bold text-[#131b0d] dark:text-white">{formData.metrics.satisfaction || 0}%</p>
                    <div className="flex items-center mt-2 text-[#6e9a4c] dark:text-[#a3c988] text-xs font-bold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>CSAT</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                    <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Feedback</p>
                    <p className="text-xl font-bold text-[#131b0d] dark:text-white">{formData.metrics.feedback_count || 0}</p>
                    <div className="flex items-center mt-2 text-[#6e9a4c] dark:text-[#a3c988] text-xs font-bold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
                      </svg>
                      <span>Pending</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a]">
                    <p className="text-xs text-[#6e9a4c] dark:text-[#a3c988] font-semibold mb-1">Avg Rating</p>
                    <p className="text-xl font-bold text-[#131b0d] dark:text-white">4.8</p>
                    <div className="flex items-center mt-2 text-yellow-500 text-xs font-bold">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span>Stars</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Notes</h3>
                <textarea
                  className="w-full h-48 px-4 py-3 rounded-lg bg-white dark:bg-[#2a381e] border border-[#dae7cf] dark:border-[#3a4d2a] text-[#131b0d] dark:text-white focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all placeholder-[#6e9a4c]/50 resize-none"
                  placeholder="Add notes about this app..."
                />
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#dae7cf] dark:border-[#3a4d2a] bg-[#fafcf8] dark:bg-[#1f2b15]">
            <button
              type="button"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#6e9a4c] hover:text-primary dark:text-[#a3c988] dark:hover:text-white transition-colors font-bold text-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
              View Analytics
            </button>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2.5 rounded-lg text-[#131b0d] dark:text-white font-bold text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                onClick={handleSubmit}
                disabled={updateApp.isPending}
                className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary-dark text-[#131b0d] font-bold text-sm shadow-sm transition-all flex items-center gap-2 disabled:opacity-50"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
