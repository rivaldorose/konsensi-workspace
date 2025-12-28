'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useGoal, useDeleteGoal } from '@/hooks/useGoals'

export default function DeleteGoalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: goal, isLoading } = useGoal(params.id)
  const deleteGoal = useDeleteGoal()
  const [deleteRelatedTasks, setDeleteRelatedTasks] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string>('')

  const handleCancel = () => {
    router.back()
  }

  const handleDelete = async () => {
    if (!goal) return

    setIsSubmitting(true)
    setError('')

    try {
      await deleteGoal.mutateAsync(goal.id)
      router.push('/roadmap')
    } catch (err) {
      console.error('Error deleting goal:', err)
      setError('Failed to delete goal. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[540px] bg-white dark:bg-[#2a1515] rounded-2xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!goal) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative w-full max-w-[540px] bg-white dark:bg-[#2a1515] rounded-2xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Goal not found</p>
          <button
            onClick={handleCancel}
            className="mt-4 px-5 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 bg-white dark:bg-transparent border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={handleCancel}
      >
        {/* Modal Container */}
        <div
          className="relative w-full max-w-[540px] flex flex-col bg-surface-light dark:bg-surface-dark rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-800 overflow-hidden transform transition-all"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center size-10 rounded-full bg-red-50 dark:bg-red-900/20 text-[#ec1313] shrink-0">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  />
                </svg>
              </div>
              <h3 className="text-[#1b0d0d] dark:text-white tracking-tight text-xl font-bold leading-tight">
                Delete Goal
              </h3>
            </div>
            <button
              aria-label="Close modal"
              onClick={handleCancel}
              className="flex items-center justify-center size-8 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-6 flex flex-col gap-6">
            {/* Main Warning Text */}
            <p className="text-[#1b0d0d] dark:text-gray-200 text-base font-normal leading-relaxed">
              Are you sure you want to delete{' '}
              <span className="font-bold text-black dark:text-white">&quot;{goal.title}&quot;</span>? This action
              cannot be undone.
            </p>

            {/* Impact List */}
            <div className="flex flex-col gap-3">
              <p className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 mb-1">
                What will be permanently removed
              </p>
              <div className="bg-background-light dark:bg-background-dark/50 rounded-xl p-1 border border-gray-100 dark:border-gray-800">
                {/* List Item 1 */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <svg className="w-5 h-5 text-[#ec1313]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                    />
                  </svg>
                  <p className="text-[#1b0d0d] dark:text-gray-300 text-sm font-medium">This Goal and its Key Results</p>
                </div>

                {/* List Item 2 */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                  <p className="text-[#1b0d0d] dark:text-gray-300 text-sm font-medium">All progress data and history</p>
                </div>

                {/* List Item 3 */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <p className="text-[#1b0d0d] dark:text-gray-300 text-sm font-medium">Team assignments</p>
                </div>

                {/* List Item 4 */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                    />
                  </svg>
                  <p className="text-[#1b0d0d] dark:text-gray-300 text-sm font-medium">Related milestones</p>
                </div>
              </div>
            </div>

            {/* Info Box */}
            <div className="flex gap-3 p-3 rounded-lg bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/30">
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                />
              </svg>
              <p className="text-sm text-blue-800 dark:text-blue-200 leading-snug">
                <strong>Note:</strong> Linked calendar events will <span className="font-bold underline">NOT</span> be
                deleted automatically.
              </p>
            </div>

            {/* Optional Checkbox */}
            <div className="flex items-center gap-3 pt-2">
              <div className="relative flex items-center">
                <input
                  className="peer size-5 cursor-pointer appearance-none rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 checked:bg-[#ec1313] checked:border-[#ec1313] transition-all focus:ring-2 focus:ring-[#ec1313]/20 focus:outline-none"
                  id="delete-tasks"
                  type="checkbox"
                  checked={deleteRelatedTasks}
                  onChange={(e) => setDeleteRelatedTasks(e.target.checked)}
                />
                <span className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100">
                  <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      fillRule="evenodd"
                    />
                  </svg>
                </span>
              </div>
              <label
                className="text-sm font-medium text-[#1b0d0d] dark:text-gray-300 cursor-pointer select-none"
                htmlFor="delete-tasks"
              >
                Also delete related tasks
              </label>
            </div>

            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 px-6 py-5 bg-gray-50 dark:bg-[#251212] border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-transparent text-gray-700 dark:text-gray-300 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors focus:ring-2 focus:ring-gray-200 dark:focus:ring-gray-700 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-[#ec1313] text-white font-bold text-sm shadow-md shadow-red-500/20 hover:bg-red-700 transition-all focus:ring-2 focus:ring-red-500/40 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                />
              </svg>
              {isSubmitting ? 'Deleting...' : 'Delete Goal'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

