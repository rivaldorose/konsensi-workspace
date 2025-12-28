'use client'

interface AnalyticsTabProps {
  appId: string
}

export function AnalyticsTab({ appId }: AnalyticsTabProps) {
  // Mock analytics data - can be replaced with real data later
  const kpis = [
    { label: 'Daily Active Users', value: '1,240', change: 12, trend: 'up' },
    { label: 'Monthly Active Users', value: '28,500', change: 8, trend: 'up' },
    { label: 'Avg Session Duration', value: '4m 32s', change: -3, trend: 'down' },
    { label: 'Bounce Rate', value: '42%', change: -5, trend: 'up' },
    { label: 'Conversion Rate', value: '3.2%', change: 15, trend: 'up' },
    { label: 'Revenue (MTD)', value: '€12,450', change: 22, trend: 'up' }
  ]

  const featureUsage = [
    { name: 'Dashboard', usage: 85 },
    { name: 'Reports', usage: 62 },
    { name: 'Settings', usage: 38 },
    { name: 'Export', usage: 24 }
  ]

  return (
    <div className="space-y-6">
      {/* Date Range Selector */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Analytics</h3>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Growth Chart */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h4 className="text-base font-bold text-[#131b0d] dark:text-white mb-4">User Growth</h4>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg">
            <p className="text-gray-400 text-sm">Chart visualization</p>
          </div>
        </div>

        {/* Satisfaction Chart */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h4 className="text-base font-bold text-[#131b0d] dark:text-white mb-4">User Satisfaction</h4>
          <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-200 dark:border-white/10 rounded-lg">
            <p className="text-gray-400 text-sm">Chart visualization</p>
          </div>
        </div>

        {/* Feature Usage */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h4 className="text-base font-bold text-[#131b0d] dark:text-white mb-4">Feature Usage</h4>
          <div className="space-y-4">
            {featureUsage.map((feature, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{feature.name}</span>
                  <span className="text-sm font-bold text-[#131b0d] dark:text-white">{feature.usage}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-white/10 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all"
                    style={{ width: `${feature.usage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top KPIs Table */}
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
          <h4 className="text-base font-bold text-[#131b0d] dark:text-white mb-4">Key Performance Indicators</h4>
          <div className="space-y-4">
            {kpis.map((kpi, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-white/5 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{kpi.label}</p>
                  <p className="text-xl font-bold text-[#131b0d] dark:text-white mt-1">{kpi.value}</p>
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    {kpi.trend === 'up' ? (
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" />
                    ) : (
                      <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v3.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 4.707 6.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z" />
                    )}
                  </svg>
                  {Math.abs(kpi.change)}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

