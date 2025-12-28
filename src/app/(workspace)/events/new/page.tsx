'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateEvent } from '@/hooks/useEvents'
import { useCurrentUser, useUsers } from '@/hooks/useUsers'
import type { Event } from '@/types'

interface TeamMember {
  id: string
  full_name: string
  avatar_url?: string
}

export default function NewEventPage() {
  const router = useRouter()
  const { data: currentUser } = useCurrentUser()
  const { data: allUsers } = useUsers()
  const createEvent = useCreateEvent()

  const [formData, setFormData] = useState({
    name: '',
    type: '' as Event['type'] | '',
    start_date: '',
    end_date: '',
    priority: 'high' as Event['priority'],
    description: '',
    success_criteria: '',
    budget_total: '',
    use_template: false,
  })
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([])
  const [memberInput, setMemberInput] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  const addTeamMember = (userId: string) => {
    const user = allUsers?.find((u) => u.id === userId)
    if (user && !teamMembers.find((m) => m.id === user.id)) {
      setTeamMembers([...teamMembers, { id: user.id, full_name: user.full_name || '', avatar_url: user.avatar_url }])
      setMemberInput('')
    }
  }

  const removeTeamMember = (userId: string) => {
    setTeamMembers(teamMembers.filter((m) => m.id !== userId))
  }

  const handleMemberInputChange = (value: string) => {
    setMemberInput(value)
    // Auto-select if exact match
    if (value && allUsers) {
      const matched = allUsers.find(
        (u) => u.full_name?.toLowerCase() === value.toLowerCase() || u.email?.toLowerCase() === value.toLowerCase()
      )
      if (matched) {
        addTeamMember(matched.id)
        return
      }
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required'
    }
    if (!formData.type) {
      newErrors.type = 'Event type is required'
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Start date is required'
    }
    if (!formData.end_date) {
      newErrors.end_date = 'End date is required'
    }
    if (formData.start_date && formData.end_date && new Date(formData.start_date) > new Date(formData.end_date)) {
      newErrors.end_date = 'End date must be after start date'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !currentUser) return

    setIsSubmitting(true)

    try {
      // Parse success criteria from textarea (split by newlines or commas)
      const successCriteriaArray = formData.success_criteria
        ? formData.success_criteria
            .split(/[\n,]/)
            .map((c) => c.trim())
            .filter((c) => c.length > 0)
        : []

      const eventData = {
        name: formData.name.trim(),
        type: formData.type as Event['type'], // Validated in validateForm
        status: 'planning' as const,
        priority: formData.priority,
        start_date: formData.start_date,
        end_date: formData.end_date,
        description: formData.description.trim() || '',
        progress: 0,
        owner_id: currentUser.id, // Will be overwritten by hook but required for type
        team_members: teamMembers.map((m) => m.id),
        budget_total: formData.budget_total ? parseFloat(formData.budget_total) : undefined,
        budget_spent: 0,
        success_criteria: successCriteriaArray,
        tags: [],
      }

      await createEvent.mutateAsync(eventData)
      router.push('/events')
    } catch (error) {
      console.error('Error creating event:', error)
      setErrors({ submit: 'Failed to create event. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCancel = () => {
    router.push('/events')
  }

  // Filter users for member input suggestions
  const suggestedUsers = allUsers?.filter(
    (u) =>
      memberInput &&
      u.id !== currentUser?.id &&
      !teamMembers.find((m) => m.id === u.id) &&
      (u.full_name?.toLowerCase().includes(memberInput.toLowerCase()) ||
        u.email?.toLowerCase().includes(memberInput.toLowerCase()))
  )

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleCancel()
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="relative w-full max-w-3xl bg-[#fafcf8] dark:bg-[#1f2b15] rounded-xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#d9e9ce] dark:border-[#344625]">
          <h3 className="text-[#131c0d] dark:text-white text-2xl font-bold leading-tight tracking-tight">
            Create New Event/Project
          </h3>
          <button
            onClick={handleCancel}
            className="flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer text-[#131c0d] dark:text-white"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar px-6 py-6 space-y-6">
          {/* Row 1: Event Name */}
          <div className="flex flex-col gap-2">
            <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
              Event Name*
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] h-12 px-4 placeholder:text-[#6d9e47] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
              placeholder="e.g. Q3 Marketing Summit"
            />
            {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
          </div>

          {/* Row 2: Type & Owner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
                Event Type*
              </label>
              <div className="relative">
                <select
                  value={formData.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full appearance-none rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] h-12 px-4 pr-10 focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                >
                  <option value="">Select type</option>
                  <option value="pilot">Pilot</option>
                  <option value="launch">Launch</option>
                  <option value="funding">Funding</option>
                  <option value="partnership">Partnership</option>
                  <option value="campaign">Campaign</option>
                  <option value="other">Other</option>
                </select>
                <svg
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d9e47] pointer-events-none w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </div>
              {errors.type && <p className="text-red-500 text-xs">{errors.type}</p>}
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">Owner*</label>
              <div className="relative">
                <div className="flex items-center w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] h-12 px-2">
                  {currentUser && (
                    <>
                      <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold ml-2">
                        {currentUser.full_name?.charAt(0) || currentUser.email.charAt(0)}
                      </div>
                      <span className="ml-3 text-[#131c0d] dark:text-white text-sm font-medium">
                        {currentUser.full_name || currentUser.email}
                      </span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Row 3: Timeline & Priority */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
                Timeline & Priority*
              </label>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              {/* Start Date */}
              <div className="md:col-span-3">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleInputChange('start_date', e.target.value)}
                    className="w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] h-12 px-4 pr-10 placeholder:text-[#6d9e47] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d9e47] pointer-events-none w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    />
                  </svg>
                </div>
                {errors.start_date && <p className="text-red-500 text-xs mt-1">{errors.start_date}</p>}
              </div>

              {/* End Date */}
              <div className="md:col-span-3">
                <div className="relative">
                  <input
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleInputChange('end_date', e.target.value)}
                    className="w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] h-12 px-4 pr-10 placeholder:text-[#6d9e47] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6d9e47] pointer-events-none w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    />
                  </svg>
                </div>
                {errors.end_date && <p className="text-red-500 text-xs mt-1">{errors.end_date}</p>}
              </div>

              {/* Priority Radio Group */}
              <div className="md:col-span-6 flex items-center h-12 bg-white dark:bg-[#2a381e] border border-[#d9e9ce] dark:border-[#344625] rounded-lg p-1">
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="critical"
                    checked={formData.priority === 'critical'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center h-full w-full rounded text-xs font-bold text-red-600 peer-checked:bg-red-50 peer-checked:ring-1 peer-checked:ring-red-200 transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                    Critical
                  </div>
                </label>
                <div className="w-px h-6 bg-[#d9e9ce] dark:bg-[#344625] mx-1"></div>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="high"
                    checked={formData.priority === 'high'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center h-full w-full rounded text-xs font-bold text-orange-600 peer-checked:bg-orange-50 peer-checked:ring-1 peer-checked:ring-orange-200 transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                    High
                  </div>
                </label>
                <div className="w-px h-6 bg-[#d9e9ce] dark:bg-[#344625] mx-1"></div>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="medium"
                    checked={formData.priority === 'medium'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center h-full w-full rounded text-xs font-bold text-[#6d9e47] peer-checked:bg-[#f2f9ec] peer-checked:ring-1 peer-checked:ring-[#d9e9ce] transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                    Medium
                  </div>
                </label>
                <div className="w-px h-6 bg-[#d9e9ce] dark:bg-[#344625] mx-1"></div>
                <label className="flex-1 cursor-pointer">
                  <input
                    type="radio"
                    name="priority"
                    value="low"
                    checked={formData.priority === 'low'}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="peer sr-only"
                  />
                  <div className="flex items-center justify-center h-full w-full rounded text-xs font-bold text-gray-500 peer-checked:bg-gray-100 peer-checked:ring-1 peer-checked:ring-gray-200 transition-all hover:bg-gray-50 dark:hover:bg-white/5">
                    Low
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Row 4: Team Members */}
          <div className="flex flex-col gap-2">
            <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
              Team Members
            </label>
            <div className="min-h-[3rem] w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] px-2 py-1.5 flex flex-wrap gap-2 items-center focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-shadow relative">
              {/* Selected Member Chips */}
              {teamMembers.map((member) => (
                <div
                  key={member.id}
                  className="bg-[#f2f9ec] dark:bg-primary/20 border border-[#d9e9ce] dark:border-primary/30 rounded-full pl-1 pr-3 py-1 flex items-center gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                    {member.full_name.charAt(0)}
                  </div>
                  <span className="text-xs font-bold text-[#131c0d] dark:text-white">{member.full_name}</span>
                  <button
                    type="button"
                    onClick={() => removeTeamMember(member.id)}
                    className="hover:text-red-500 text-gray-400 dark:text-gray-300 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      />
                    </svg>
                  </button>
                </div>
              ))}

              {/* Member Input */}
              <div className="flex-1 min-w-[120px] relative">
                <input
                  type="text"
                  value={memberInput}
                  onChange={(e) => handleMemberInputChange(e.target.value)}
                  className="bg-transparent border-none outline-none text-sm h-8 placeholder:text-[#6d9e47] dark:text-white flex-1 w-full"
                  placeholder="Add member..."
                />
                {/* Suggestions Dropdown */}
                {memberInput && suggestedUsers && suggestedUsers.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#2a381e] border border-[#d9e9ce] dark:border-[#344625] rounded-lg shadow-lg z-10 max-h-40 overflow-y-auto">
                    {suggestedUsers.slice(0, 5).map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => addTeamMember(user.id)}
                        className="w-full px-3 py-2 hover:bg-gray-50 dark:hover:bg-white/5 flex items-center gap-2 text-left"
                      >
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold">
                          {user.full_name?.charAt(0) || user.email.charAt(0)}
                        </div>
                        <span className="text-sm text-[#131c0d] dark:text-white">
                          {user.full_name || user.email}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Row 5: Budget & Template */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="flex flex-col gap-2">
              <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
                Budget (USD)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#131c0d] dark:text-gray-300 font-medium">
                  $
                </span>
                <input
                  type="number"
                  step="0.01"
                  value={formData.budget_total}
                  onChange={(e) => handleInputChange('budget_total', e.target.value)}
                  className="w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] h-12 pl-8 pr-4 placeholder:text-[#6d9e47] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-8">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={formData.use_template}
                  onChange={(e) => handleInputChange('use_template', e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-gray-300 dark:border-gray-500 focus:ring-primary focus:ring-offset-0 transition-colors cursor-pointer checked:bg-primary checked:border-primary"
                />
                <div className="flex flex-col">
                  <span className="text-[#131c0d] dark:text-white font-semibold text-sm">Use Template?</span>
                  <span className="text-xs text-[#6d9e47]">Autofill description based on event type</span>
                </div>
              </label>
            </div>
          </div>

          {/* Row 6: Description */}
          <div className="flex flex-col gap-2">
            <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] p-4 min-h-[100px] placeholder:text-[#6d9e47] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y transition-shadow"
              placeholder="Describe the purpose and goals of this event..."
            />
          </div>

          {/* Row 7: Success Criteria */}
          <div className="flex flex-col gap-2">
            <label className="text-[#131c0d] dark:text-gray-200 text-sm font-semibold leading-normal">
              Success Criteria
            </label>
            <textarea
              value={formData.success_criteria}
              onChange={(e) => handleInputChange('success_criteria', e.target.value)}
              className="w-full rounded-lg border border-[#d9e9ce] bg-white dark:bg-[#2a381e] dark:border-[#344625] dark:text-white text-[#131c0d] p-4 min-h-[80px] placeholder:text-[#6d9e47] focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none resize-y transition-shadow"
              placeholder="e.g. 500+ attendees, 20% conversion rate..."
            />
          </div>

          {errors.submit && <p className="text-red-500 text-sm">{errors.submit}</p>}
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end px-6 py-5 border-t border-[#d9e9ce] bg-[#f7f8f5] dark:bg-[#1f2b15] dark:border-[#344625] gap-3">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 h-10 rounded-lg text-[#131c0d] dark:text-white text-sm font-bold hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-6 h-10 rounded-lg bg-primary text-[#131c0d] text-sm font-bold hover:bg-[#6ee018] transition-colors flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Create Event
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}
