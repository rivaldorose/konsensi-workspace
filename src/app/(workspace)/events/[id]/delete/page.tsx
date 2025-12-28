'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEvent, useDeleteEvent, useUpdateEvent } from '@/hooks/useEvents'

type DeleteAction = 'complete' | 'archive' | 'delete'

export default function DeleteEventPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: event, isLoading } = useEvent(params.id)
  const deleteEvent = useDeleteEvent()
  const updateEvent = useUpdateEvent()
  const [selectedAction, setSelectedAction] = useState<DeleteAction>('delete')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleCancel = () => {
    router.back()
  }

  const handleSubmit = async () => {
    if (!event) return

    setIsSubmitting(true)
    setError('')

    try {
      if (selectedAction === 'complete') {
        await updateEvent.mutateAsync({
          id: event.id,
          status: 'completed',
        })
        router.push('/events')
      } else if (selectedAction === 'archive') {
        await updateEvent.mutateAsync({
          id: event.id,
          status: 'on_hold', // Using on_hold as archive status
        })
        router.push('/events')
      } else {
        // Delete permanently
        await deleteEvent.mutateAsync(event.id)
        router.push('/events')
      }
    } catch (err) {
      console.error('Error processing action:', err)
      setError('Failed to process action. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#1b0d0d]/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-[600px] bg-white dark:bg-[#2a1212] rounded-2xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="fixed inset-0 bg-[#1b0d0d]/60 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-[600px] bg-white dark:bg-[#2a1212] rounded-2xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Event not found</p>
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

  const isActive = event.status === 'active'
  const budgetSpent = event.budget_spent ? `$${event.budget_spent.toLocaleString()}` : '$0'

  return (
    <>
      {/* Modal Backdrop */}
      <div aria-hidden="true" className="fixed inset-0 bg-[#1b0d0d]/60 backdrop-blur-sm z-40 transition-opacity"></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[600px] bg-white dark:bg-[#2a1212] rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-100 dark:border-white/10 transform transition-all">
          {/* Header */}
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-[#2a1212]">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚠️</span>
              <h2 className="text-lg font-bold text-[#1b0d0d] dark:text-white tracking-tight">Delete Event</h2>
            </div>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-red-600 transition-colors p-1 rounded-full hover:bg-gray-50 dark:hover:bg-white/5"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>

          {/* Scrollable Content */}
          <div className="px-6 py-6 overflow-y-auto max-h-[80vh]">
            {/* Title */}
            <div className="mb-6">
              <h3 className="text-2xl font-bold leading-tight text-[#1b0d0d] dark:text-white">
                Delete &quot;{event.name}&quot;?
              </h3>
            </div>

            {/* Project Summary Card */}
            <div className="bg-gray-50 dark:bg-white/5 rounded-xl p-5 mb-6 border border-gray-100 dark:border-white/5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold tracking-wider">
                    Status
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        event.status === 'active'
                          ? 'bg-green-500 animate-pulse'
                          : event.status === 'completed'
                          ? 'bg-gray-500'
                          : 'bg-yellow-500'
                      }`}
                    ></span>
                    <span className="text-[#1b0d0d] dark:text-gray-200 font-bold text-sm uppercase">
                      {event.status}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold tracking-wider">
                    Team
                  </span>
                  <span className="text-[#1b0d0d] dark:text-gray-200 font-medium text-sm">
                    {event.team_members?.length || 0} member{event.team_members?.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-gray-500 dark:text-gray-400 text-xs uppercase font-semibold tracking-wider">
                    Budget Spent
                  </span>
                  <span className="text-[#1b0d0d] dark:text-gray-200 font-medium text-sm font-mono">
                    {budgetSpent}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Warning Banner */}
            {isActive && (
              <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-600 rounded-r-lg">
                <svg className="w-5 h-5 text-red-600 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  />
                </svg>
                <div className="flex flex-col">
                  <p className="text-[#1b0d0d] dark:text-gray-100 font-bold text-sm">Warning: This event is ACTIVE.</p>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                    Consider archiving the project instead to preserve data for future audits.
                  </p>
                </div>
              </div>
            )}

            {/* Consequences Text */}
            <div className="mb-8">
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                This action will permanently remove{' '}
                <span className="font-semibold text-[#1b0d0d] dark:text-gray-200">
                  event details, milestones, budget data, team assignments, and the entire activity log
                </span>
                . This cannot be undone.
              </p>
            </div>

            {/* Alternative Actions (Radio Group) */}
            <div className="space-y-3">
              <p className="text-sm font-bold text-[#1b0d0d] dark:text-white mb-2">Select Action:</p>

              {/* Option 1: Mark as Completed */}
              <label className="group relative flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 hover:border-green-600/50 transition-all">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="delete-action"
                    value="complete"
                    checked={selectedAction === 'complete'}
                    onChange={(e) => setSelectedAction(e.target.value as DeleteAction)}
                    className="h-5 w-5 border-gray-300 text-green-600 focus:ring-green-600"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1b0d0d] dark:text-gray-100 group-hover:text-green-700 dark:group-hover:text-green-400">
                    Mark as Completed
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Preserves data but closes the project.
                  </span>
                </div>
              </label>

              {/* Option 2: Archive */}
              <label className="group relative flex items-start gap-4 p-4 rounded-xl border border-gray-200 dark:border-white/10 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/5 hover:border-blue-600/50 transition-all">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="delete-action"
                    value="archive"
                    checked={selectedAction === 'archive'}
                    onChange={(e) => setSelectedAction(e.target.value as DeleteAction)}
                    className="h-5 w-5 border-gray-300 text-blue-600 focus:ring-blue-600"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-[#1b0d0d] dark:text-gray-100 group-hover:text-blue-700 dark:group-hover:text-blue-400">
                    Move to Archive
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Removes from active view, data remains accessible.
                  </span>
                </div>
              </label>

              {/* Option 3: Delete Permanently */}
              <label className="group relative flex items-start gap-4 p-4 rounded-xl border border-red-300 dark:border-red-900/30 bg-red-50 dark:bg-red-900/20 cursor-pointer hover:bg-red-100 dark:hover:bg-red-900/30 transition-all ring-1 ring-red-300 dark:ring-red-900/50">
                <div className="flex items-center h-5">
                  <input
                    type="radio"
                    name="delete-action"
                    value="delete"
                    checked={selectedAction === 'delete'}
                    onChange={(e) => setSelectedAction(e.target.value as DeleteAction)}
                    className="h-5 w-5 border-gray-300 text-red-600 focus:ring-red-600"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-red-600 dark:text-red-400">Delete permanently</span>
                  <span className="text-xs text-red-600/80 dark:text-red-400/80 mt-0.5">
                    Destructive action. Data is unrecoverable.
                  </span>
                </div>
              </label>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 py-5 bg-gray-50 dark:bg-[#220e0e] border-t border-gray-100 dark:border-white/10 flex flex-col sm:flex-row justify-end gap-3">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                />
              </svg>
              Confirm Action
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

