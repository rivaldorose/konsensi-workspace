'use client'

import { useState } from 'react'
import { useMarketingAnalytics } from '@/hooks/useMarketingPosts'

export function AnalyticsTab() {
  const [timeframe, setTimeframe] = useState('30_days')
  const { data: analytics, isLoading } = useMarketingAnalytics(timeframe)

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading analytics...</div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-gray-500">
          <p>No analytics data available.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#f9fcf8] dark:bg-[#131b0d]">
      {/* Timeframe Selector */}
      <div className="mb-6 flex justify-end">
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-[#e9f3e7] dark:border-[#334025] rounded-lg text-sm text-[#101b0d] dark:text-white"
        >
          <option value="7_days">Last 7 days</option>
          <option value="30_days">Last 30 days</option>
          <option value="90_days">Last 90 days</option>
        </select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard
          label="Total Reach"
          value={analytics.total_reach.toLocaleString()}
          change={analytics.reach_change}
          trend="up"
        />
        <MetricCard
          label="Total Engagement"
          value={analytics.total_engagement.toLocaleString()}
          change={analytics.engagement_change}
          trend="up"
        />
        <MetricCard
          label="Avg Performance"
          value={`${analytics.avg_performance.toFixed(1)}%`}
          change={analytics.performance_change}
          trend={analytics.performance_change > 0 ? 'up' : 'down'}
        />
        <MetricCard
          label="Net Growth"
          value={analytics.net_growth.toLocaleString()}
          change={null}
          trend="up"
        />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Posts"
          value={analytics.total_posts}
        />
        <StatCard
          label="Avg Likes"
          value={Math.round(analytics.avg_likes)}
          change={analytics.likes_change}
        />
        <StatCard
          label="Avg Comments"
          value={Math.round(analytics.avg_comments)}
          change={analytics.comments_change}
        />
        <StatCard
          label="Avg Shares"
          value={Math.round(analytics.avg_shares)}
          change={analytics.shares_change}
        />
      </div>

      {/* Charts Placeholder */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#e9f3e7] dark:border-[#334025] p-6">
        <h3 className="text-lg font-bold text-[#101b0d] dark:text-white mb-4">Engagement Trend</h3>
        <div className="h-64 flex items-center justify-center text-gray-400 border border-dashed border-[#e9f3e7] dark:border-[#334025] rounded-lg">
          Chart visualization coming soon
        </div>
      </div>
    </div>
  )
}

function MetricCard({ label, value, change, trend }: { label: string; value: string; change: number | null; trend: 'up' | 'down' }) {
  return (
    <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#e9f3e7] dark:border-[#334025] p-5">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</div>
      <div className="text-2xl font-bold text-[#101b0d] dark:text-white mb-1">{value}</div>
      {change !== null && (
        <div className={`text-sm font-medium flex items-center gap-1 ${trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            {trend === 'up' ? (
              <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
            )}
          </svg>
          {Math.abs(change)}%
        </div>
      )}
    </div>
  )
}

function StatCard({ label, value, change }: { label: string; value: number; change?: number }) {
  return (
    <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#e9f3e7] dark:border-[#334025] p-5">
      <div className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">{label}</div>
      <div className="text-xl font-bold text-[#101b0d] dark:text-white">{value}</div>
      {change !== undefined && (
        <div className={`text-xs mt-1 ${change > 0 ? 'text-green-600 dark:text-green-400' : change < 0 ? 'text-red-600 dark:text-red-400' : 'text-gray-500'}`}>
          {change > 0 ? '+' : ''}{change}%
        </div>
      )}
    </div>
  )
}

