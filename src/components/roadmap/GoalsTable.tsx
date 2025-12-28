'use client'

import Link from 'next/link'
import { useGoals } from '@/hooks/useGoals'
import type { Goal } from '@/types'

const statusColors: Record<Goal['status'], string> = {
  not_started: 'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-300',
  on_track: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
  at_risk: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
  completed: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
}

const statusDots: Record<Goal['status'], string> = {
  not_started: 'bg-gray-500',
  on_track: 'bg-green-500',
  at_risk: 'bg-yellow-500',
  completed: 'bg-blue-500',
}

const statusLabels: Record<Goal['status'], string> = {
  not_started: 'Not Started',
  on_track: 'On Track',
  at_risk: 'At Risk',
  completed: 'Completed',
}

export function GoalsTable() {
  const { data: goals, isLoading, error } = useGoals()

  if (isLoading) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] overflow-hidden shadow-sm">
        <div className="p-5 animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-red-200 p-6 text-center">
        <p className="text-red-600">Error loading goals. Please try again.</p>
      </div>
    )
  }

  const mainGoals = goals?.filter((g) => !g.objective?.includes('subdirectory')) || []

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#dae8ce] dark:border-[#334025] flex justify-between items-center bg-[#fcfdfa] dark:bg-[#1f2a16]">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" />
          </svg>
          Key Goals &amp; OKRs
        </h3>
        <Link href="/roadmap?tab=goals" className="text-sm font-bold text-primary hover:text-primary-dark">
          View All Goals
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafcf8] dark:bg-[#222e18] text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide border-b border-[#dae8ce] dark:border-[#334025]">
              <th className="px-6 py-4 font-bold">Objective / Key Result</th>
              <th className="px-6 py-4">Owner</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 w-1/4">Progress</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {mainGoals.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-8 text-center text-gray-500">
                  No goals found. Create your first goal to get started.
                </td>
              </tr>
            ) : (
              mainGoals.map((goal) => (
                <tr
                  key={goal.id}
                  className="border-b border-[#ecf4e7] dark:border-[#334025] hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-[#131c0d] dark:text-white text-base">{goal.title}</span>
                      <span className="text-gray-500 text-xs">
                        {goal.category.charAt(0).toUpperCase() + goal.category.slice(1)} • {goal.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {goal.owner?.avatar_url ? (
                      <div
                        className="size-8 rounded-full bg-center bg-cover border-2 border-white dark:border-[#222e18]"
                        style={{ backgroundImage: `url("${goal.owner.avatar_url}")` }}
                        title={goal.owner.full_name}
                      ></div>
                    ) : (
                      <div className="size-8 rounded-full bg-gray-200 border-2 border-white dark:border-[#222e18] flex items-center justify-center text-xs font-bold text-gray-600">
                        {goal.owner?.full_name?.charAt(0) || 'U'}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${statusColors[goal.status]}`}
                    >
                      <span className={`size-1.5 rounded-full ${statusDots[goal.status]}`}></span>
                      {statusLabels[goal.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            goal.status === 'on_track'
                              ? 'bg-primary'
                              : goal.status === 'at_risk'
                              ? 'bg-yellow-400'
                              : goal.status === 'completed'
                              ? 'bg-blue-400'
                              : 'bg-gray-400'
                          }`}
                          style={{ width: `${goal.progress}%` }}
                        ></div>
                      </div>
                      <span className="font-bold text-gray-700 dark:text-gray-300">{goal.progress}%</span>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
