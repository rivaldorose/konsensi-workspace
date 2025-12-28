'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateGoal } from '@/hooks/useGoals'
import { useCurrentUser, useUsers } from '@/hooks/useUsers'
import { useEvents } from '@/hooks/useEvents'
import type { Goal } from '@/types'

interface KeyResult {
  id: string
  outcome: string
  current: number | ''
  target: number | ''
}

export default function NewGoalPage() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { data: allUsers } = useUsers()
  const { data: allEvents } = useEvents()
  const createGoal = useCreateGoal()

  const [formData, setFormData] = useState({
    title: '',
    objective: '',
    category: '' as Goal['category'] | '',
    quarter: 'Q1',
    start_date: '',
    target_date: '',
    priority: 'high' as Goal['priority'],
    owner_id: '',
    success_criteria: '',
  })

  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { id: '1', outcome: 'Achieve NPS of 50', current: 32, target: 50 },
    { id: '2', outcome: '', current: '', target: '' },
  ])

  const [dependencies, setDependencies] = useState<string[]>(['Q1 Marketing Campaign', 'Backend Migration'])
  const [dependencyInput, setDependencyInput] = useState('')
  const [relatedEventId, setRelatedEventId] = useState('')
  const [eventSearchQuery, setEventSearchQuery] = useState('')
  const [showOwnerDropdown, setShowOwnerDropdown] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Set current user as default owner
  useEffect(() => {
    if (currentUser && !formData.owner_id) {
      setFormData((prev) => ({ ...prev, owner_id: currentUser.id }))
    }
  }, [currentUser, formData.owner_id])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const handleKeyResultChange = (id: string, field: keyof KeyResult, value: string | number) => {
    setKeyResults((prev) =>
      prev.map((kr) => (kr.id === id ? { ...kr, [field]: value } : kr))
    )
  }

  const addKeyResult = () => {
    setKeyResults([...keyResults, { id: Date.now().toString(), outcome: '', current: '', target: '' }])
  }

  const removeKeyResult = (id: string) => {
    setKeyResults(keyResults.filter((kr) => kr.id !== id))
  }

  const addDependency = () => {
    if (dependencyInput.trim() && !dependencies.includes(dependencyInput.trim())) {
      setDependencies([...dependencies, dependencyInput.trim()])
      setDependencyInput('')
    }
  }

  const removeDependency = (dep: string) => {
    setDependencies(dependencies.filter((d) => d !== dep))
  }

  const handleDependencyKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addDependency()
    }
  }

  const selectedOwner = allUsers?.find((u) => u.id === formData.owner_id)
  const filteredEvents = allEvents?.filter(
    (e) => e.name.toLowerCase().includes(eventSearchQuery.toLowerCase())
  ) || []

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
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    }
    if (!formData.target_date) {
      newErrors.target_date = 'Target date is required'
    }
    if (formData.start_date && formData.target_date && new Date(formData.start_date) > new Date(formData.target_date)) {
      newErrors.target_date = 'Target date must be after start date'
    }
    if (!formData.owner_id) {
      newErrors.owner_id = 'Owner is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (isDraft: boolean = false) => {
    if (!validateForm() || !currentUser) return

    setIsSubmitting(true)

    try {
      const goalData: Omit<Goal, 'id' | 'created_at' | 'updated_at' | 'owner' | 'event'> = {
        title: formData.title,
        objective: formData.objective,
        category: formData.category as Goal['category'],
        quarter: formData.quarter,
        start_date: formData.start_date,
        target_date: formData.target_date,
        priority: formData.priority,
        owner_id: formData.owner_id,
        status: isDraft ? 'not_started' : 'not_started',
        progress: 0,
        event_id: relatedEventId || undefined,
      }

      await createGoal.mutateAsync(goalData)
      router.push('/roadmap')
    } catch (error) {
      console.error('Error creating goal:', error)
      alert('Failed to create goal. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/roadmap')
  }

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowOwnerDropdown(false)
    }
    if (showOwnerDropdown) {
      document.addEventListener('click', handleClickOutside)
      return () => document.removeEventListener('click', handleClickOutside)
    }
  }, [showOwnerDropdown])

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4"
      onClick={handleCancel}
    >
      {/* Modal Container */}
      <div
        className="relative w-full max-w-[800px] max-h-[90vh] flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-2xl overflow-hidden border border-[#dae7cf] dark:border-[#3f5232]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dae7cf] dark:border-[#3f5232] bg-surface-light dark:bg-surface-dark z-10 shrink-0">
          <h2 className="text-[#131b0d] dark:text-white text-[22px] font-bold leading-tight tracking-[-0.015em]">
            Create New Goal
          </h2>
          <button
            onClick={handleCancel}
            className="text-[#131b0d] dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-full p-2 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-6 custom-scrollbar">
          {/* Section: Goal Information */}
          <div className="mb-8">
            <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                />
              </svg>
              Goal Information
            </h3>
            <div className="grid gap-5">
              {/* Goal Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Goal Title*</label>
                <input
                  className={`w-full rounded-lg border ${
                    errors.title ? 'border-red-500' : 'border-[#dae7cf] dark:border-[#3f5232]'
                  } bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 placeholder:text-[#6e9a4c]`}
                  placeholder="e.g. Increase User Retention by 20%"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                />
                {errors.title && <p className="text-red-500 text-xs">{errors.title}</p>}
              </div>

              {/* Objective */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Objective*</label>
                <textarea
                  className={`w-full rounded-lg border ${
                    errors.objective ? 'border-red-500' : 'border-[#dae7cf] dark:border-[#3f5232]'
                  } bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] p-4 resize-none placeholder:text-[#6e9a4c]`}
                  placeholder="Describe the high-level objective and why it matters..."
                  value={formData.objective}
                  onChange={(e) => handleInputChange('objective', e.target.value)}
                />
                {errors.objective && <p className="text-red-500 text-xs">{errors.objective}</p>}
              </div>

              {/* Category */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Category*</label>
                <div className="relative">
                  <select
                    className={`w-full appearance-none rounded-lg border ${
                      errors.category ? 'border-red-500' : 'border-[#dae7cf] dark:border-[#3f5232]'
                    } bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 pr-10`}
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                  >
                    <option disabled value="">
                      Select category
                    </option>
                    <option value="marketing">Growth &amp; Marketing</option>
                    <option value="product">Product Development</option>
                    <option value="operations">Operations &amp; HR</option>
                    <option value="funding">Financial</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#6e9a4c]">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </div>
                </div>
                {errors.category && <p className="text-red-500 text-xs">{errors.category}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#dae7cf] dark:bg-[#3f5232] w-full mb-8"></div>

          {/* Section: Timeline */}
          <div className="mb-8">
            <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                />
              </svg>
              Timeline
            </h3>
            <div className="grid gap-5">
              {/* Quarter Selection */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Quarter</label>
                <div className="flex bg-background-light dark:bg-background-dark p-1 rounded-lg border border-[#dae7cf] dark:border-[#3f5232]">
                  {['Q1', 'Q2', 'Q3', 'Q4'].map((q) => (
                    <label key={q} className="flex-1 cursor-pointer">
                      <input
                        className="peer sr-only"
                        name="quarter"
                        type="radio"
                        checked={formData.quarter === q}
                        onChange={() => handleInputChange('quarter', q)}
                      />
                      <div className="flex items-center justify-center py-2 rounded text-sm font-medium text-[#6e9a4c] peer-checked:bg-white dark:peer-checked:bg-[#2c3a21] peer-checked:text-[#131b0d] dark:peer-checked:text-white peer-checked:shadow-sm transition-all">
                        {q}
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[#131b0d] dark:text-white text-sm font-medium">Start Date</label>
                  <input
                    className={`w-full rounded-lg border ${
                      errors.start_date ? 'border-red-500' : 'border-[#dae7cf] dark:border-[#3f5232]'
                    } bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 placeholder:text-[#6e9a4c]`}
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                  />
                  {errors.start_date && <p className="text-red-500 text-xs">{errors.start_date}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[#131b0d] dark:text-white text-sm font-medium">Target Date</label>
                  <input
                    className={`w-full rounded-lg border ${
                      errors.target_date ? 'border-red-500' : 'border-[#dae7cf] dark:border-[#3f5232]'
                    } bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent h-12 px-4 placeholder:text-[#6e9a4c]`}
                    type="date"
                    value={formData.target_date}
                    onChange={(e) => handleInputChange('target_date', e.target.value)}
                  />
                  {errors.target_date && <p className="text-red-500 text-xs">{errors.target_date}</p>}
                </div>
              </div>
            </div>
          </div>

          <div className="h-px bg-[#dae7cf] dark:bg-[#3f5232] w-full mb-8"></div>

          {/* Section: Priority & Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Priority */}
            <div>
              <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                  />
                </svg>
                Priority*
              </h3>
              <div className="flex flex-col gap-3">
                {(['critical', 'high', 'medium', 'low'] as const).map((priority) => (
                  <label key={priority} className="flex items-center gap-3 cursor-pointer group">
                    <input
                      className="peer sr-only"
                      name="priority"
                      type="radio"
                      checked={formData.priority === priority}
                      onChange={() => handleInputChange('priority', priority)}
                    />
                    <div className="w-5 h-5 rounded-full border border-[#dae7cf] peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                    </div>
                    <span className="text-[#131b0d] dark:text-white group-hover:text-primary transition-colors text-sm font-medium capitalize">
                      {priority}
                    </span>
                    {priority === 'critical' && (
                      <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">Highest</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Owner */}
            <div>
              <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Owner*
              </h3>
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Assign Owner</label>
                <div className="relative group">
                  <div
                    onClick={() => setShowOwnerDropdown(!showOwnerDropdown)}
                    className="w-full flex items-center justify-between rounded-lg border border-[#dae7cf] dark:border-[#3f5232] bg-background-light dark:bg-background-dark h-14 px-4 hover:border-primary transition-colors cursor-pointer"
                  >
                    {selectedOwner ? (
                      <div className="flex items-center gap-3">
                        {selectedOwner.avatar_url ? (
                          <div
                            className="w-8 h-8 rounded-full bg-center bg-cover border border-primary/30"
                            style={{ backgroundImage: `url("${selectedOwner.avatar_url}")` }}
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/30">
                            {selectedOwner.full_name?.charAt(0) || 'U'}
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-[#131b0d] dark:text-white leading-tight">
                            {selectedOwner.full_name}
                          </span>
                          <span className="text-xs text-[#6e9a4c] leading-tight">Team Member</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-[#6e9a4c]">Select owner...</span>
                    )}
                    <svg className="w-5 h-5 text-[#6e9a4c]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </div>

                  {/* Dropdown */}
                  {showOwnerDropdown && (
                    <div
                      className="absolute z-50 w-full mt-1 bg-white dark:bg-[#232d1b] border border-[#dae7cf] dark:border-[#3f5232] rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {allUsers?.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            handleInputChange('owner_id', user.id)
                            setShowOwnerDropdown(false)
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-background-light dark:hover:bg-background-dark cursor-pointer"
                        >
                          {user.avatar_url ? (
                            <div
                              className="w-8 h-8 rounded-full bg-center bg-cover border border-primary/30"
                              style={{ backgroundImage: `url("${user.avatar_url}")` }}
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary border border-primary/30">
                              {user.full_name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <div className="flex flex-col">
                            <span className="text-sm font-semibold text-[#131b0d] dark:text-white">
                              {user.full_name}
                            </span>
                            <span className="text-xs text-[#6e9a4c]">{user.email}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {errors.owner_id && <p className="text-red-500 text-xs">{errors.owner_id}</p>}
              </div>
            </div>
          </div>

          <div className="h-px bg-[#dae7cf] dark:bg-[#3f5232] w-full mb-8"></div>

          {/* Section: Key Results (OKRs) */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                  />
                </svg>
                Key Results (OKRs)
              </h3>
              <button
                onClick={addKeyResult}
                className="text-xs font-bold text-primary hover:text-[#5bc10e] uppercase tracking-wide flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add Result
              </button>
            </div>
            <div className="flex flex-col gap-3">
              {keyResults.map((kr) => (
                <div
                  key={kr.id}
                  className={`p-4 rounded-lg ${
                    kr.outcome ? 'bg-background-light dark:bg-background-dark border border-[#dae7cf] dark:border-[#3f5232]' : 'border border-dashed border-[#dae7cf] dark:border-[#3f5232] hover:bg-background-light/50 dark:hover:bg-background-dark/50'
                  } flex flex-col md:flex-row gap-4 items-start md:items-center transition-colors`}
                >
                  <div className="flex-1 w-full">
                    <label className="text-xs text-[#6e9a4c] font-medium mb-1 block">Measurable Outcome</label>
                    <input
                      className="w-full bg-transparent border-b border-[#dae7cf] focus:border-primary focus:outline-none text-sm text-[#131b0d] dark:text-white pb-1"
                      placeholder={kr.outcome ? '' : 'Describe outcome'}
                      type="text"
                      value={kr.outcome}
                      onChange={(e) => handleKeyResultChange(kr.id, 'outcome', e.target.value)}
                    />
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <div className="w-24">
                      <label className="text-xs text-[#6e9a4c] font-medium mb-1 block">Current</label>
                      <input
                        className="w-full bg-white dark:bg-[#232d1b] rounded border border-[#dae7cf] dark:border-[#3f5232] px-2 py-1 text-sm text-[#131b0d] dark:text-white focus:outline-none focus:border-primary"
                        type="number"
                        value={kr.current}
                        onChange={(e) => handleKeyResultChange(kr.id, 'current', e.target.value ? Number(e.target.value) : '')}
                      />
                    </div>
                    <div className="w-24">
                      <label className="text-xs text-[#6e9a4c] font-medium mb-1 block">Target</label>
                      <input
                        className="w-full bg-white dark:bg-[#232d1b] rounded border border-[#dae7cf] dark:border-[#3f5232] px-2 py-1 text-sm text-[#131b0d] dark:text-white focus:outline-none focus:border-primary"
                        type="number"
                        value={kr.target}
                        onChange={(e) => handleKeyResultChange(kr.id, 'target', e.target.value ? Number(e.target.value) : '')}
                      />
                    </div>
                    <button
                      onClick={() => removeKeyResult(kr.id)}
                      className="mt-5 text-[#6e9a4c] hover:text-red-500 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-px bg-[#dae7cf] dark:bg-[#3f5232] w-full mb-8"></div>

          {/* Section: Related To */}
          <div className="mb-8">
            <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                />
              </svg>
              Related To
            </h3>
            <div className="grid gap-5">
              {/* Link to Event/Project */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Link to Event/Project</label>
                <div className="relative">
                  <svg
                    className="absolute left-3 top-3 w-5 h-5 text-[#6e9a4c]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                    />
                  </svg>
                  <input
                    className="w-full rounded-lg border border-[#dae7cf] dark:border-[#3f5232] bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent h-12 pl-10 pr-4 placeholder:text-[#6e9a4c]"
                    placeholder="Search project or event..."
                    value={eventSearchQuery}
                    onChange={(e) => setEventSearchQuery(e.target.value)}
                  />
                  {eventSearchQuery && filteredEvents.length > 0 && (
                    <div
                      className="absolute z-50 w-full mt-1 bg-white dark:bg-[#232d1b] border border-[#dae7cf] dark:border-[#3f5232] rounded-lg shadow-lg max-h-60 overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {filteredEvents.map((event) => (
                        <div
                          key={event.id}
                          onClick={() => {
                            setRelatedEventId(event.id)
                            setEventSearchQuery(event.name)
                          }}
                          className="px-4 py-3 hover:bg-background-light dark:hover:bg-background-dark cursor-pointer"
                        >
                          <span className="text-sm text-[#131b0d] dark:text-white">{event.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Dependencies */}
              <div className="flex flex-col gap-2">
                <label className="text-[#131b0d] dark:text-white text-sm font-medium">Dependencies</label>
                <div className="w-full rounded-lg border border-[#dae7cf] dark:border-[#3f5232] bg-background-light dark:bg-background-dark p-2 min-h-[56px] flex flex-wrap gap-2 items-center">
                  {dependencies.map((dep) => (
                    <div
                      key={dep}
                      className="bg-surface-light dark:bg-[#2c3a21] border border-[#dae7cf] dark:border-[#3f5232] rounded pl-2 pr-1 py-1 flex items-center gap-1"
                    >
                      <span className="text-xs font-medium text-[#131b0d] dark:text-white">{dep}</span>
                      <button
                        onClick={() => removeDependency(dep)}
                        className="hover:bg-black/10 dark:hover:bg-white/10 rounded-full p-0.5"
                      >
                        <svg className="w-4 h-4 text-[#6e9a4c]" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <input
                    className="bg-transparent border-none focus:ring-0 text-sm text-[#131b0d] dark:text-white placeholder:text-[#6e9a4c] min-w-[120px] p-1"
                    placeholder="Add dependency..."
                    value={dependencyInput}
                    onChange={(e) => setDependencyInput(e.target.value)}
                    onKeyPress={handleDependencyKeyPress}
                    onBlur={addDependency}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section: Success Criteria */}
          <div className="mb-2">
            <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight mb-4 flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
              Success Criteria
            </h3>
            <div className="flex flex-col gap-2">
              <label className="text-[#131b0d] dark:text-white text-sm font-medium">Definition of Done</label>
              <textarea
                className="w-full rounded-lg border border-[#dae7cf] dark:border-[#3f5232] bg-background-light dark:bg-background-dark text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary focus:border-transparent min-h-[100px] p-4 resize-none placeholder:text-[#6e9a4c]"
                placeholder="What does success look like qualitatively?"
                value={formData.success_criteria}
                onChange={(e) => handleInputChange('success_criteria', e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#dae7cf] dark:border-[#3f5232] bg-surface-light dark:bg-surface-dark shrink-0">
          <button
            onClick={handleCancel}
            className="h-10 px-6 rounded-lg text-[#131b0d] dark:text-white font-medium text-sm hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={isSubmitting}
            className="h-10 px-6 rounded-lg border border-[#dae7cf] dark:border-[#3f5232] text-[#131b0d] dark:text-white font-medium text-sm hover:bg-background-light dark:hover:bg-background-dark transition-colors disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(false)}
            disabled={isSubmitting}
            className="h-10 px-6 rounded-lg bg-primary text-[#131b0d] font-bold text-sm hover:opacity-90 transition-opacity shadow-sm disabled:opacity-50"
          >
            {isSubmitting ? 'Creating...' : 'Create Goal'}
          </button>
        </div>
      </div>
    </div>
  )
}

