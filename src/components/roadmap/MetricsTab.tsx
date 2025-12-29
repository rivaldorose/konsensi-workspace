'use client'

import Link from 'next/link'
import { useGoalMetrics } from '@/hooks/useRoadmap'
import { useGoals } from '@/hooks/useRoadmap'

export function MetricsTab() {
  const { data: metrics, isLoading: metricsLoading } = useGoalMetrics()
  const { data: goals = [] } = useGoals()

  if (metricsLoading) {
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6">
        <div className="animate-pulse text-gray-400">Loading metrics...</div>
      </div>
    )
  }

  if (!metrics) {
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6">
        <div className="text-center py-12 text-gray-500">
          <p>No metrics available. Create goals to see analytics.</p>
        </div>
      </div>
    )
  }

  // Calculate percentages
  const onTrackPercent = metrics.total_goals > 0 ? Math.round((metrics.on_track / metrics.total_goals) * 100) : 0
  const atRiskPercent = metrics.total_goals > 0 ? Math.round((metrics.at_risk / metrics.total_goals) * 100) : 0
  const completePercent = metrics.total_goals > 0 ? Math.round((metrics.complete / metrics.total_goals) * 100) : 0
  const behindPercent = metrics.total_goals > 0 ? Math.round((metrics.behind / metrics.total_goals) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Goals */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Goals</span>
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
            </svg>
          </div>
          <p className="text-3xl font-bold text-[#131c0d] dark:text-white">{metrics.total_goals}</p>
        </div>

        {/* On Track */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">On Track</span>
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#131c0d] dark:text-white">{metrics.on_track}</p>
            <span className="text-sm font-medium text-green-600 dark:text-green-400">{onTrackPercent}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-green-500 rounded-full" style={{ width: `${onTrackPercent}%` }} />
          </div>
        </div>

        {/* At Risk */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">At Risk</span>
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#131c0d] dark:text-white">{metrics.at_risk}</p>
            <span className="text-sm font-medium text-yellow-600 dark:text-yellow-400">{atRiskPercent}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${atRiskPercent}%` }} />
          </div>
        </div>

        {/* Complete */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-5 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Complete</span>
            <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-[#131c0d] dark:text-white">{metrics.complete}</p>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{completePercent}%</span>
          </div>
          <div className="mt-2 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${completePercent}%` }} />
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Progress */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#131c0d] dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
            </svg>
            Progress by Category
          </h3>
          <div className="space-y-4">
            {metrics.category_progress.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No category data available</p>
            ) : (
              metrics.category_progress.map((cat) => (
                <div key={cat.category} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400">{cat.goal_count} goals</span>
                      <span className="text-sm font-bold text-[#131c0d] dark:text-white">{Math.round(cat.progress)}%</span>
                    </div>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${cat.progress}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Overall Progress */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#131c0d] dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" />
            </svg>
            Overall Progress
          </h3>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="relative w-48 h-48 mb-4">
              <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  className="text-gray-200 dark:text-gray-700"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="45"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${metrics.average_progress * 2.827} 282.7`}
                  className="text-primary"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <p className="text-4xl font-bold text-[#131c0d] dark:text-white">{Math.round(metrics.average_progress)}%</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Average</p>
                </div>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Average progress across all goals
            </p>
          </div>
        </div>
      </div>

      {/* Top Performers & Needs Attention */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Performers */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#131c0d] dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
            </svg>
            Top Performers
          </h3>
          <div className="space-y-3">
            {metrics.top_performers.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">No top performers yet</p>
            ) : (
              metrics.top_performers.map((item, idx) => (
                <Link
                  key={item.goal.id}
                  href={`/roadmap/${item.goal.id}`}
                  className="flex items-center justify-between p-3 bg-[#fcfdfa] dark:bg-[#222e18] rounded-lg border border-[#ecf4e7] dark:border-[#334025] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-xs font-bold text-green-700 dark:text-green-300">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#131c0d] dark:text-white text-sm group-hover:text-primary transition-colors truncate">
                        {item.goal.title}
                      </p>
                      {item.goal.owner && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.goal.owner.full_name || item.goal.owner.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-green-600 dark:text-green-400 w-12 text-right">
                      {item.progress}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Needs Attention */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6 shadow-sm">
          <h3 className="text-lg font-bold text-[#131c0d] dark:text-white mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
            </svg>
            Needs Attention
          </h3>
          <div className="space-y-3">
            {metrics.needs_attention.length === 0 ? (
              <p className="text-sm text-gray-500 text-center py-4">All goals are on track! 🎉</p>
            ) : (
              metrics.needs_attention.map((item, idx) => (
                <Link
                  key={item.goal.id}
                  href={`/roadmap/${item.goal.id}`}
                  className="flex items-center justify-between p-3 bg-[#fcfdfa] dark:bg-[#222e18] rounded-lg border border-[#ecf4e7] dark:border-[#334025] hover:shadow-sm transition-all group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-xs font-bold text-red-700 dark:text-red-300">
                      {idx + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[#131c0d] dark:text-white text-sm group-hover:text-primary transition-colors truncate">
                        {item.goal.title}
                      </p>
                      {item.goal.owner && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.goal.owner.full_name || item.goal.owner.email}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${item.progress}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-red-600 dark:text-red-400 w-12 text-right">
                      {item.progress}%
                    </span>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

