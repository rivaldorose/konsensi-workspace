'use client'

import Link from 'next/link'
import { useGoals } from '@/hooks/useRoadmap'
import { format } from 'date-fns'
import type { Goal } from '@/types/roadmap'

interface GoalsTabProps {
  year: number
}

const statusConfig: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  on_track: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    dot: 'bg-green-500',
  },
  at_risk: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    dot: 'bg-yellow-500',
  },
  behind: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    dot: 'bg-red-500',
  },
  complete: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  completed: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
  not_started: {
    bg: 'bg-gray-100 dark:bg-gray-900/30',
    text: 'text-gray-700 dark:text-gray-300',
    border: 'border-gray-200 dark:border-gray-800',
    dot: 'bg-gray-500',
  },
  in_progress: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    dot: 'bg-blue-500',
  },
}

const priorityConfig: Record<string, { bg: string; text: string }> = {
  critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-600 dark:text-red-400' },
  high: { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-600 dark:text-orange-400' },
  medium: { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-600 dark:text-yellow-400' },
  low: { bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-600 dark:text-gray-400' },
  none: { bg: 'bg-gray-50 dark:bg-gray-900/20', text: 'text-gray-500 dark:text-gray-500' },
}

export function GoalsTab({ year }: GoalsTabProps) {
  const { data: goals = [], isLoading } = useGoals({ year })

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6">
        <div className="animate-pulse text-gray-400">Loading goals...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#ecf4e7] dark:border-[#334025] bg-[#fcfdfa] dark:bg-[#1f2a16] flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
          </svg>
          Goals & OKRs
        </h3>
        <Link
          href="/roadmap/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#60d60b] text-[#131c0d] text-sm font-bold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          New Goal
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafcf8] dark:bg-[#222e18] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-[#ecf4e7] dark:border-[#334025]">
              <th className="px-6 py-4">Goal</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Priority</th>
              <th className="px-6 py-4 w-1/4">Progress</th>
              <th className="px-6 py-4">Due Date</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {goals.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p className="font-medium">No goals found</p>
                    <p className="text-sm text-gray-400">Create your first goal to get started</p>
                  </div>
                </td>
              </tr>
            ) : (
              goals.map((goal) => {
                const status = goal.status || 'not_started'
                const statusStyle = statusConfig[status] || statusConfig.not_started
                const priority = goal.priority || 'none'
                const priorityStyle = priorityConfig[priority] || priorityConfig.none

                return (
                  <tr
                    key={goal.id}
                    className="border-b border-[#ecf4e7] dark:border-[#334025] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <Link href={`/roadmap/${goal.id}`} className="flex items-center gap-3 group">
                        <span className="text-2xl">{goal.emoji || '🎯'}</span>
                        <div className="flex flex-col gap-1">
                          <span className="font-bold text-[#131c0d] dark:text-white text-base group-hover:text-primary transition-colors">
                            {goal.title}
                          </span>
                          {goal.objective && (
                            <span className="text-gray-500 text-xs">{goal.objective}</span>
                          )}
                        </div>
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {goal.category || 'Product'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {goal.owner ? (
                        <div className="flex items-center gap-2">
                          {goal.owner.avatar_url ? (
                            <img
                              src={goal.owner.avatar_url}
                              alt={goal.owner.full_name}
                              className="w-6 h-6 rounded-full"
                            />
                          ) : (
                            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                              {goal.owner.full_name?.charAt(0) || 'U'}
                            </div>
                          )}
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {goal.owner.full_name || goal.owner.email}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400 text-sm">Unassigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${statusStyle.dot}`}></span>
                        {(() => {
                          const statusStr = String(status)
                          if (statusStr === 'on_track') return 'On Track'
                          if (statusStr === 'at_risk') return 'At Risk'
                          if (statusStr === 'behind') return 'Behind'
                          if (statusStr === 'complete' || statusStr === 'completed') return 'Complete'
                          if (statusStr === 'in_progress') return 'In Progress'
                          return 'Not Started'
                        })()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {priority !== 'none' && (
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${priorityStyle.bg} ${priorityStyle.text}`}>
                          {priority.charAt(0).toUpperCase() + priority.slice(1)}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${goal.progress || 0}%` }}
                          />
                        </div>
                        <span className="text-xs font-bold text-gray-600 dark:text-gray-400 min-w-[3ch] text-right">
                          {goal.progress || 0}%
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-gray-600 dark:text-gray-400 text-sm">
                        {goal.due_date || goal.target_date ? format(new Date(goal.due_date || goal.target_date!), 'MMM d, yyyy') : '-'}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

