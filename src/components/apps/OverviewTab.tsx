'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import type { App } from '@/types'

interface OverviewTabProps {
  app: App
}

export function OverviewTab({ app }: OverviewTabProps) {
  const keyFeatures = app.key_features || []
  
  // Mock recent activity for now (can be replaced with real data later)
  const recentActivity = [
    {
      type: 'deploy',
      title: 'Deployed version 2.1.0',
      time: '2 hours ago',
      user: app.owner?.full_name || 'System'
    },
    {
      type: 'config',
      title: 'Updated database configuration',
      time: '1 day ago',
      user: app.owner?.full_name || 'System'
    }
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Quick Info */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Quick Info</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Status</p>
            <p className="font-semibold text-[#131b0d] dark:text-white capitalize">{app.status}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Category</p>
            <p className="font-semibold text-[#131b0d] dark:text-white">{app.category}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Owner</p>
            <p className="font-semibold text-[#131b0d] dark:text-white">{app.owner?.full_name || 'Unknown'}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Version</p>
            <p className="font-semibold text-[#131b0d] dark:text-white">{app.version || 'N/A'}</p>
          </div>
          {app.launch_date && (
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Launch Date</p>
              <p className="font-semibold text-[#131b0d] dark:text-white">
                {format(new Date(app.launch_date), 'MMM d, yyyy')}
              </p>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Last Updated</p>
            <p className="font-semibold text-[#131b0d] dark:text-white">
              {format(new Date(app.updated_at), 'MMM d, yyyy')}
            </p>
          </div>
        </div>
      </div>

      {/* Key Features */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Key Features</h3>
        {keyFeatures.length > 0 ? (
          <ul className="space-y-2">
            {keyFeatures.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <svg className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
                <span className="text-gray-700 dark:text-gray-300">{feature}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-sm">No features added yet</p>
        )}
      </div>

      {/* Recent Activity */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="flex items-start gap-3 pb-4 border-b border-gray-100 dark:border-white/5 last:border-0 last:pb-0">
              <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-[#131b0d] dark:text-white">{activity.title}</p>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600 dark:text-gray-400">
                  <span>{activity.user}</span>
                  <span>•</span>
                  <span>{activity.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 p-6">
        <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-4">Quick Links</h3>
        <div className="grid grid-cols-2 gap-3">
          {app.production_url && (
            <a
              href={app.production_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Production
            </a>
          )}
          {app.staging_url && (
            <a
              href={app.staging_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
              </svg>
              Staging
            </a>
          )}
          {app.github_url && (
            <a
              href={app.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-50 hover:bg-gray-100 dark:bg-gray-900/20 dark:hover:bg-gray-900/30 text-gray-700 dark:text-gray-300 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          )}
          {app.docs_url && (
            <a
              href={app.docs_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-4 py-3 bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/20 dark:hover:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg font-medium text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
              </svg>
              Docs
            </a>
          )}
        </div>
      </div>
    </div>
  )
}


