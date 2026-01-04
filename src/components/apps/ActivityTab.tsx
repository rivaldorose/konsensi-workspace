'use client'

import { useState } from 'react'
import { format } from 'date-fns'

interface ActivityTabProps {
  appId: string
}

interface Activity {
  id: string
  type: 'deploy' | 'config' | 'security' | 'feature' | 'bug_fix'
  emoji: string
  title: string
  description?: string
  details: string[]
  user_name?: string
  is_system: boolean
  border_color: string
  created_at: string
}

export function ActivityTab({ appId }: ActivityTabProps) {
  // Mock activities - can be replaced with real data later
  const activities: Activity[] = [
    {
      id: '1',
      type: 'deploy',
      emoji: '🚀',
      title: 'Deployed version 2.1.0',
      description: 'Production deployment completed successfully',
      details: ['Build time: 3m 24s', 'Deployment time: 1m 12s', 'Zero downtime deployment'],
      user_name: 'System',
      is_system: true,
      border_color: 'border-green-500',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      type: 'config',
      emoji: '⚙️',
      title: 'Updated database configuration',
      description: 'Increased connection pool size',
      details: ['Pool size: 10 → 20', 'Timeout: 30s → 60s'],
      user_name: 'John Doe',
      is_system: false,
      border_color: 'border-blue-500',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      type: 'feature',
      emoji: '✨',
      title: 'Added new dashboard feature',
      description: 'Implemented real-time analytics',
      details: ['Component: Dashboard', 'Feature: Real-time updates', 'Status: Active'],
      user_name: 'Jane Smith',
      is_system: false,
      border_color: 'border-purple-500',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <select className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Types</option>
          <option>Deploy</option>
          <option>Config</option>
          <option>Security</option>
          <option>Feature</option>
          <option>Bug Fix</option>
        </select>
        <select className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Users</option>
          <option>System</option>
          <option>Team Members</option>
        </select>
        <select className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-white/10 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary">
          <option>All Time</option>
          <option>Last 24 hours</option>
          <option>Last 7 days</option>
          <option>Last 30 days</option>
        </select>
      </div>

      {/* Activity Timeline */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-6">Activity Timeline</h3>
        
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-white/10"></div>

          <div className="space-y-6">
            {activities.map((activity, index) => (
              <div key={activity.id} className="relative pl-20">
                {/* Timeline Dot */}
                <div className="absolute left-6 top-2">
                  <div className="size-4 rounded-full bg-white dark:bg-[#1f2b15] border-2 border-gray-300 dark:border-white/20 flex items-center justify-center">
                    <div className="size-2 rounded-full bg-primary"></div>
                  </div>
                </div>

                {/* Activity Card */}
                <div className={`bg-gray-50 dark:bg-white/5 rounded-lg border-l-4 ${activity.border_color} p-4 hover:shadow-md transition-shadow`}>
                  <div className="flex items-start gap-3 mb-2">
                    <span className="text-2xl">{activity.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#131b0d] dark:text-white mb-1">
                        {activity.title}
                      </h4>
                      {activity.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          {activity.description}
                        </p>
                      )}
                      {activity.details.length > 0 && (
                        <ul className="space-y-1 mb-3">
                          {activity.details.map((detail, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                              <span className="size-1 rounded-full bg-gray-400"></span>
                              {detail}
                            </li>
                          ))}
                        </ul>
                      )}
                      <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>{activity.user_name}</span>
                        <span>•</span>
                        <span>{format(new Date(activity.created_at), 'MMM d, yyyy HH:mm')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Load More Button */}
        <div className="mt-6 text-center">
          <button className="px-6 py-2 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors">
            Load More
          </button>
        </div>
      </div>
    </div>
  )
}


