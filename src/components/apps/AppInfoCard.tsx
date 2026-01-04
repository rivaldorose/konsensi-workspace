'use client'

import type { App } from '@/types'

interface AppInfoCardProps {
  app: App
}

const getStatusConfig = (status: App['status']) => {
  switch (status) {
    case 'live':
      return {
        label: 'Live',
        className: 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/40 dark:text-green-300 dark:border-green-800'
      }
    case 'beta':
      return {
        label: 'Beta',
        className: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800'
      }
    case 'development':
      return {
        label: 'Development',
        className: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800'
      }
    case 'paused':
      return {
        label: 'Paused',
        className: 'bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/40 dark:text-slate-300 dark:border-slate-800'
      }
    case 'archived':
      return {
        label: 'Archived',
        className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800'
      }
    default:
      return {
        label: 'Idea',
        className: 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/40 dark:text-gray-300 dark:border-gray-800'
      }
  }
}

export function AppInfoCard({ app }: AppInfoCardProps) {
  const statusConfig = getStatusConfig(app.status)

  return (
    <div className="flex flex-col md:flex-row md:items-start gap-6 p-6 bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/10 shadow-sm">
      {/* App Icon */}
      <div className="flex-shrink-0">
        <div className="size-20 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center text-4xl border border-primary/20">
          {app.icon || '📱'}
        </div>
      </div>

      {/* App Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-3xl font-bold text-[#131b0d] dark:text-white mb-2">
              {app.name}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
              <span className="font-medium">{app.category}</span>
              <span>•</span>
              <span>{app.owner?.full_name || 'Unknown Owner'}</span>
            </div>
          </div>
          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${statusConfig.className}`}>
            <span className="size-2 rounded-full bg-current"></span>
            {statusConfig.label}
          </span>
        </div>
        
        {app.description && (
          <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
            {app.description}
          </p>
        )}
      </div>
    </div>
  )
}


