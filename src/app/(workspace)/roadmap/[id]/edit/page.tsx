'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useGoal, useUpdateGoal } from '@/hooks/useGoals'
import { useUsers } from '@/hooks/useUsers'
import type { Goal } from '@/types'

type Tab = 'overview' | 'key-results' | 'timeline' | 'team' | 'updates'

export default function EditGoalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: goal, isLoading } = useGoal(params.id)
  const { data: allUsers } = useUsers()
  const updateGoal = useUpdateGoal()
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    category: '' as Goal['category'] | '',
    quarter: 'Q1',
    start_date: '',
    target_date: '',
    priority: 'high' as Goal['priority'],
    status: 'not_started' as Goal['status'],
  })

  useEffect(() => {
    if (goal) {
      setFormData({
        title: goal.title || '',
        objective: goal.objective || '',
        category: goal.category || '',
        quarter: goal.quarter || 'Q1',
        start_date: goal.start_date || '',
        target_date: goal.target_date || '',
        priority: goal.priority || 'high',
        status: goal.status || 'not_started',
      })
    }
  }, [goal])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Goal title is required'
    }
    if (!formData.objective.trim()) {
      newErrors.objective = 'Objective is required'
    }
    if (!formData.category) {
      newErrors.category = 'Category is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!goal || !validateForm()) return

    setIsSubmitting(true)
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        title: formData.title,
        objective: formData.objective,
        category: formData.category as Goal['category'],
        quarter: formData.quarter,
        start_date: formData.start_date,
        target_date: formData.target_date,
        priority: formData.priority,
        status: formData.status,
      })
      router.push('/roadmap')
    } catch (error) {
      console.error('Error updating goal:', error)
      alert('Failed to update goal. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  const handleMarkDone = async () => {
    if (!goal) return

    setIsSubmitting(true)
    try {
      await updateGoal.mutateAsync({
        id: goal.id,
        status: 'completed',
        progress: 100,
      })
      router.push('/roadmap')
    } catch (error) {
      console.error('Error updating goal:', error)
      setIsSubmitting(false)
    }
  }

  const handleArchive = async () => {
    if (!goal) return
    router.push(`/roadmap/${goal.id}/delete`)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="bg-background-light dark:bg-background-dark w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="bg-background-light dark:bg-background-dark w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex items-center justify-center">
          <p className="text-gray-500">Goal not found</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const owner = goal.owner || allUsers?.find((u) => u.id === goal.owner_id)

  const statusColors: Partial<Record<Goal['status'], string>> = {
    not_started: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
    in_progress: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    on_track: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    at_risk: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    behind: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    complete: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    completed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  }

  const statusLabels: Partial<Record<Goal['status'], string>> = {
    not_started: 'Not Started',
    in_progress: 'In Progress',
    on_track: 'On Track',
    at_risk: 'At Risk',
    behind: 'Behind',
    complete: 'Complete',
    completed: 'Completed',
  }

  const currentStatus = goal.status || 'not_started'

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4" onClick={handleCancel}>
      {/* Modal Container */}
      <div
        className="bg-background-light dark:bg-background-dark w-full max-w-5xl h-[90vh] rounded-xl shadow-2xl flex flex-col relative overflow-hidden ring-1 ring-black/5 dark:ring-white/10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header (Sticky) */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-[#dae7cf] dark:border-white/10 bg-background-light dark:bg-background-dark z-10 shrink-0">
          <div className="flex flex-col gap-1">
            <h3 className="text-[#131b0d] dark:text-white tracking-tight text-2xl font-bold leading-tight">Edit Goal</h3>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-[#6e9a4c] dark:text-[#a0c980]">
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
                Created by {owner?.full_name || 'Unknown'}
              </span>
              <span className="text-[#dae7cf] dark:text-gray-600">•</span>
              <div
                className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide ${statusColors[currentStatus]}`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-current opacity-75"></span>
                {statusLabels[currentStatus]}
              </div>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-500 dark:text-gray-400"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Tabs (Sticky under header) */}
        <div className="px-8 border-b border-[#dae7cf] dark:border-white/10 bg-background-light dark:bg-background-dark shrink-0">
          <div className="flex gap-8">
            {(['overview', 'key-results', 'timeline', 'team', 'updates'] as Tab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 cursor-pointer transition-colors ${
                  activeTab === tab
                    ? 'border-b-primary text-[#131b0d] dark:text-white'
                    : 'border-b-transparent text-[#6e9a4c] dark:text-gray-400 hover:text-[#131b0d] dark:hover:text-white'
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em] capitalize">
                  {tab === 'key-results' ? 'Key Results' : tab}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Content (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 bg-white/50 dark:bg-white/5 custom-scrollbar">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-12 gap-8">
              {/* Main Info Section */}
              <div className="col-span-12 lg:col-span-8 space-y-6">
                {/* Title */}
                <div className="space-y-2">
                  <label className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">
                    Goal Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    className={`w-full rounded-lg bg-background-light dark:bg-background-dark border ${
                      errors.title ? 'border-red-500' : 'border-[#dae7cf] dark:border-white/20'
                    } px-4 py-3 text-lg font-medium text-[#131b0d] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all`}
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                  />
                  {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
                </div>

                {/* Objective */}
                <div className="space-y-2">
                  <label className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">
                    Objective <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className={`w-full rounded-lg bg-background-light dark:bg-background-dark border ${
                      errors.objective ? 'border-red-500' : 'border-[#dae7cf] dark:border-white/20'
                    } px-4 py-3 text-base font-normal text-[#131b0d] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary min-h-[120px] resize-y transition-all placeholder:text-gray-400`}
                    value={formData.objective}
                    onChange={(e) => handleInputChange('objective', e.target.value)}
                  />
                  {errors.objective && <p className="text-red-500 text-xs">{errors.objective}</p>}
                </div>

                {/* Key Results Section */}
                <div className="pt-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-bold text-[#131b0d] dark:text-white">Key Results (OKRs)</h4>
                    <button className="text-primary hover:text-green-600 dark:hover:text-green-400 text-sm font-bold flex items-center gap-1">
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                      </svg>
                      Add Another Key Result
                    </button>
                  </div>
                  <div className="space-y-3">
                    {/* KR Item 1 - Mock data */}
                    <div className="bg-white dark:bg-white/5 border border-[#dae7cf] dark:border-white/10 rounded-lg p-4 flex flex-col gap-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-[#131b0d] dark:text-white">Sign 5 paid pilot contracts</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated 2 days ago by Mike</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 text-xs px-2 py-1 rounded font-medium">
                            On Track
                          </span>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-primary w-[60%]"></div>
                        </div>
                        <span className="text-sm font-bold text-[#131b0d] dark:text-white min-w-[3rem] text-right">3/5</span>
                      </div>
                    </div>

                    {/* KR Item 2 - Mock data */}
                    <div className="bg-white dark:bg-white/5 border border-[#dae7cf] dark:border-white/10 rounded-lg p-4 flex flex-col gap-3 shadow-sm">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-bold text-[#131b0d] dark:text-white">Generate $15k in pilot revenue</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Last updated 5 days ago by Sarah</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 text-xs px-2 py-1 rounded font-medium">
                            Behind
                          </span>
                          <button className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded text-gray-500">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-400 w-[20%]"></div>
                        </div>
                        <span className="text-sm font-bold text-[#131b0d] dark:text-white min-w-[3rem] text-right">$3k</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="bg-background-light dark:bg-white/5 p-5 rounded-lg border border-[#dae7cf] dark:border-white/10 mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-[#131b0d] dark:text-white">Overall Progress</span>
                    <span className="text-2xl font-bold text-primary">{goal.progress || 0}%</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-4">
                    <div
                      className="h-full bg-primary shadow-[0_0_10px_rgba(113,236,19,0.4)]"
                      style={{ width: `${goal.progress || 0}%` }}
                    ></div>
                  </div>
                  <button className="w-full py-2 bg-white dark:bg-white/10 border border-[#dae7cf] dark:border-white/20 rounded-lg text-sm font-bold text-[#131b0d] dark:text-white hover:bg-gray-50 dark:hover:bg-white/20 transition-colors">
                    Update Progress Manually
                  </button>
                </div>
              </div>

              {/* Sidebar Info */}
              <div className="col-span-12 lg:col-span-4 space-y-6">
                {/* Metadata Card */}
                <div className="bg-white dark:bg-white/5 border border-[#dae7cf] dark:border-white/10 rounded-xl p-5 space-y-5 shadow-sm">
                  {/* Category */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Category *
                    </label>
                    <div className="relative">
                      <select
                        className={`w-full appearance-none bg-background-light dark:bg-background-dark border ${
                          errors.category ? 'border-red-500' : 'border-[#dae7cf] dark:border-white/20'
                        } text-[#131b0d] dark:text-white rounded-lg px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-primary`}
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                      >
                        <option value="">Select category</option>
                        <option value="product">Product</option>
                        <option value="partnerships">Business Development</option>
                        <option value="marketing">Marketing</option>
                        <option value="funding">Funding</option>
                        <option value="operations">Operations</option>
                        <option value="team">Team</option>
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          />
                        </svg>
                      </div>
                    </div>
                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                  </div>

                  {/* Timeline */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Timeline
                    </label>
                    <div className="flex gap-2 mb-3">
                      {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                        <label key={q} className="flex-1 cursor-pointer">
                          <input
                            className="peer sr-only"
                            name="quarter"
                            type="radio"
                            checked={formData.quarter === q}
                            onChange={() => handleInputChange('quarter', q)}
                          />
                          <span className="flex items-center justify-center py-1.5 rounded border border-[#dae7cf] dark:border-white/20 text-xs font-bold text-gray-600 dark:text-gray-400 peer-checked:bg-primary peer-checked:border-primary peer-checked:text-[#131b0d] transition-all">
                            {q}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[11px] text-gray-500 mb-1">Start Date</p>
                        <input
                          className="w-full bg-background-light dark:bg-background-dark border border-[#dae7cf] dark:border-white/20 rounded-lg px-3 py-2 text-sm text-[#131b0d] dark:text-white focus:outline-none focus:border-primary"
                          type="date"
                          value={formData.start_date}
                          onChange={(e) => handleInputChange('start_date', e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-500 mb-1">End Date</p>
                        <input
                          className="w-full bg-background-light dark:bg-background-dark border border-[#dae7cf] dark:border-white/20 rounded-lg px-3 py-2 text-sm text-[#131b0d] dark:text-white focus:outline-none focus:border-primary"
                          type="date"
                          value={formData.target_date}
                          onChange={(e) => handleInputChange('target_date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Priority */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">
                      Priority
                    </label>
                    <div className="flex items-center gap-4">
                      {(['low', 'medium', 'high'] as const).map((priority) => (
                        <label key={priority} className="flex items-center gap-2 cursor-pointer group">
                          <input
                            className="accent-primary w-4 h-4"
                            name="priority"
                            type="radio"
                            checked={formData.priority === priority}
                            onChange={() => handleInputChange('priority', priority)}
                          />
                          <span className="text-sm text-[#131b0d] dark:text-white group-hover:text-gray-600 dark:group-hover:text-gray-300 capitalize">
                            {priority}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Owner */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
                      Owner
                    </label>
                    <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 cursor-pointer border border-transparent hover:border-[#dae7cf] dark:hover:border-white/10 transition-all">
                      {owner?.avatar_url ? (
                        <div
                          className="w-8 h-8 rounded-full bg-center bg-cover"
                          style={{ backgroundImage: `url("${owner.avatar_url}")` }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                          {owner?.full_name?.charAt(0) || 'U'}
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm font-bold text-[#131b0d] dark:text-white">{owner?.full_name || 'Unknown'}</p>
                        <p className="text-xs text-gray-500">Product Manager</p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Related Items */}
                <div className="bg-white dark:bg-white/5 border border-[#dae7cf] dark:border-white/10 rounded-xl p-5 space-y-4 shadow-sm">
                  <h5 className="text-sm font-bold text-[#131b0d] dark:text-white border-b border-[#dae7cf] dark:border-white/10 pb-2">
                    Related Items
                  </h5>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-orange-100 text-orange-600 flex items-center justify-center shrink-0">
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#131b0d] dark:text-white hover:underline cursor-pointer">
                        Pilot Kickoff Meeting
                      </p>
                      <p className="text-xs text-gray-500">Apr 12 • 2:00 PM</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#131b0d] dark:text-white hover:underline cursor-pointer">
                        Dependency: Backend API v2
                      </p>
                      <p className="text-xs text-gray-500">Blocked</p>
                    </div>
                  </div>
                </div>

                {/* Team */}
                <div>
                  <h5 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wide">
                    Team &amp; Contributors
                  </h5>
                  <div className="flex -space-x-2 overflow-hidden mb-2">
                    {allUsers?.slice(0, 3).map((user) => (
                      <div
                        key={user.id}
                        className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#182210] bg-gray-200"
                        title={user.full_name}
                      >
                        {user.avatar_url ? (
                          <div
                            className="h-full w-full rounded-full bg-center bg-cover"
                            style={{ backgroundImage: `url("${user.avatar_url}")` }}
                          />
                        ) : (
                          <div className="h-full w-full rounded-full flex items-center justify-center text-xs font-bold text-gray-600">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                      </div>
                    ))}
                    {allUsers && allUsers.length > 3 && (
                      <div className="h-8 w-8 rounded-full ring-2 ring-white dark:ring-[#182210] bg-gray-100 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-500 cursor-pointer hover:bg-gray-200 transition-colors">
                        +{allUsers.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs would go here - simplified for now */}
          {activeTab !== 'overview' && (
            <div className="text-center text-gray-500 py-12">
              <p>Content for {activeTab} tab coming soon</p>
            </div>
          )}

          {/* Recent Activity (Bottom of content) */}
          <div className="border-t border-[#dae7cf] dark:border-white/10 pt-6">
            <h5 className="text-sm font-bold text-[#131b0d] dark:text-white mb-4">Recent Activity</h5>
            <div className="space-y-4">
              <div className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs shrink-0">
                  S
                </div>
                <div>
                  <p className="text-[#131b0d] dark:text-gray-300">
                    <span className="font-bold">Sarah</span> updated the status to{' '}
                    <span className="font-medium text-yellow-600 dark:text-yellow-400">In Progress</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">2 hours ago</p>
                </div>
              </div>
              <div className="flex gap-3 text-sm">
                <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-xs shrink-0">
                  M
                </div>
                <div>
                  <p className="text-[#131b0d] dark:text-gray-300">
                    <span className="font-bold">Mike</span> added a new Key Result: "Sign 5 paid pilot contracts"
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">Yesterday at 4:30 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer (Sticky) */}
        <div className="px-8 py-4 border-t border-[#dae7cf] dark:border-white/10 bg-background-light dark:bg-background-dark shrink-0 flex items-center justify-between">
          <div>
            <button
              onClick={handleArchive}
              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-bold flex items-center gap-1.5 px-2 py-2 rounded hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path
                  fillRule="evenodd"
                  d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                />
              </svg>
              Archive Goal
            </button>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleCancel}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#6e9a4c] dark:text-gray-300 hover:text-[#131b0d] dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleMarkDone}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-[#131b0d] dark:text-white bg-white dark:bg-white/10 border border-[#dae7cf] dark:border-white/20 hover:bg-gray-50 dark:hover:bg-white/20 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
              Mark Done
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-bold text-[#131b0d] bg-primary hover:bg-[#62d210] transition-colors shadow-lg shadow-primary/20 flex items-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

