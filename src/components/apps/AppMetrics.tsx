'use client'

import type { App } from '@/types'

interface AppMetricsProps {
  app: App
}

export function AppMetrics({ app }: AppMetricsProps) {
  const metrics = app.metrics || {}
  
  // Default values if metrics not set
  const activeUsers = metrics.active_users || 0
  const userGrowth = metrics.user_growth_percentage || 0
  const monthlyCost = metrics.monthly_cost || 0
  const costChange = metrics.cost_change_percentage || 0
  const uptime = metrics.uptime_percentage || 99.9
  const uptimeChange = metrics.uptime_change_percentage || 0
  const openIssues = metrics.open_issues || 0

  const metricsData = [
    {
      label: 'Active Users',
      value: activeUsers.toLocaleString(),
      change: userGrowth,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      ),
      iconColor: 'text-blue-500'
    },
    {
      label: 'Monthly Cost',
      value: `€${monthlyCost.toLocaleString()}`,
      change: costChange,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
          <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
        </svg>
      ),
      iconColor: 'text-green-500'
    },
    {
      label: 'Uptime',
      value: `${uptime.toFixed(1)}%`,
      change: uptimeChange,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
        </svg>
      ),
      iconColor: 'text-primary'
    },
    {
      label: 'Open Issues',
      value: openIssues.toString(),
      change: null,
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" />
        </svg>
      ),
      iconColor: 'text-orange-500'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {metricsData.map((metric, index) => (
        <div
          key={index}
          className="p-5 bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between mb-3">
            <div className={`p-2 rounded-lg bg-gray-50 dark:bg-white/5 ${metric.iconColor}`}>
              {metric.icon}
            </div>
            {metric.change !== null && (
              <div className={`flex items-center gap-1 text-sm font-semibold ${
                metric.change >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  {metric.change >= 0 ? (
                    <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                  ) : (
                    <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 4.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" />
                  )}
                </svg>
                {Math.abs(metric.change)}%
              </div>
            )}
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{metric.label}</p>
            <p className="text-2xl font-bold text-[#131b0d] dark:text-white">{metric.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}


