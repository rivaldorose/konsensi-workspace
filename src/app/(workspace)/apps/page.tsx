'use client'

import Link from 'next/link'

const apps = [
  {
    id: 1,
    name: 'Leave Tracker',
    category: 'HR Management Tool',
    icon: '🌴',
    status: 'Live',
    statusColor: 'green',
    activeUsers: 1240,
    userChange: 12,
    trend: 'up',
    rating: 4.8,
    ratingCount: 120,
    healthScore: 98,
    lastUpdated: '2h ago',
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconBorder: 'border-green-200 dark:border-green-800',
  },
  {
    id: 2,
    name: 'Growth Kit',
    category: 'Marketing Analytics',
    icon: '🚀',
    status: 'Beta',
    statusColor: 'blue',
    activeUsers: 86,
    userChange: 45,
    trend: 'up',
    rating: 4.2,
    ratingCount: 18,
    progress: 65,
    progressLabel: 'Beta Rollout',
    lastUpdated: '1d ago',
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconBorder: 'border-blue-200 dark:border-blue-800',
  },
  {
    id: 3,
    name: 'Expense Hub',
    category: 'Finance & Reimbursement',
    icon: '💰',
    status: 'Dev',
    statusColor: 'yellow',
    testers: 12,
    milestone: 'v0.9.1',
    progress: 85,
    progressLabel: 'Development',
    lastUpdated: '5h ago',
    iconBg: 'bg-amber-100 dark:bg-amber-900/30',
    iconBorder: 'border-amber-200 dark:border-amber-800',
  },
  {
    id: 4,
    name: 'Team Pulse',
    category: 'Culture & Feedback',
    icon: '❤️',
    status: 'Live',
    statusColor: 'green',
    activeUsers: 450,
    userChange: 2,
    trend: 'down',
    rating: 4.9,
    ratingCount: 56,
    progress: 92,
    progressLabel: 'Engagement',
    lastUpdated: '12h ago',
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconBorder: 'border-purple-200 dark:border-purple-800',
  },
  {
    id: 5,
    name: 'StockOp',
    category: 'Inventory Management',
    icon: '📦',
    status: 'Live',
    statusColor: 'green',
    activeUsers: 28,
    userChange: 5,
    trend: 'up',
    rating: 4.5,
    ratingCount: 12,
    progress: 99,
    progressLabel: 'Uptime',
    lastUpdated: '3d ago',
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconBorder: 'border-orange-200 dark:border-orange-800',
  },
]

export default function AppsPage() {
  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-8 px-4 md:px-10">
          {/* Page Header */}
          <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-text-main dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
                Apps Overview
              </h1>
              <p className="text-text-subtle dark:text-gray-400 mt-1">
                Manage and monitor all internal business applications.
              </p>
            </div>
            <Link 
              href="/apps/new"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-[#a2ef69] transition-colors h-12 px-6 rounded-lg text-dark-nav text-sm font-bold shadow-sm shadow-primary/20 group"
            >
              <span className="material-symbols-outlined text-[20px] transition-transform group-hover:rotate-90">add</span>
              <span>Add New App</span>
            </Link>
          </header>

          {/* Filters & Sort */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-color dark:border-dark-border pb-6">
            {/* Chips */}
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
              <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-dark-nav text-white text-sm font-medium transition-colors">
                All Apps
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border hover:border-primary/50 text-text-subtle dark:text-gray-300 text-sm font-medium transition-colors">
                Marketing
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border hover:border-primary/50 text-text-subtle dark:text-gray-300 text-sm font-medium transition-colors">
                HR
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border hover:border-primary/50 text-text-subtle dark:text-gray-300 text-sm font-medium transition-colors">
                Finance
              </button>
              <button className="flex h-9 shrink-0 items-center justify-center px-4 rounded-lg bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border hover:border-primary/50 text-text-subtle dark:text-gray-300 text-sm font-medium transition-colors">
                Operations
              </button>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-text-subtle dark:text-gray-400 text-sm font-medium whitespace-nowrap">Sort by:</span>
              <div className="relative min-w-[160px]">
                <select className="appearance-none w-full bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border text-text-main dark:text-gray-200 text-sm font-medium rounded-lg h-10 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary">
                  <option>Last Updated</option>
                  <option>Name (A-Z)</option>
                  <option>Most Used</option>
                  <option>Lowest Rating</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-text-subtle">
                  <span className="material-symbols-outlined text-[20px]">expand_more</span>
                </div>
              </div>
            </div>
          </div>

          {/* App Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {apps.map((app) => (
              <article 
                key={app.id}
                className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-dark-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5 flex flex-col gap-4 h-full">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className={`size-12 rounded-lg ${app.iconBg} flex items-center justify-center text-2xl border ${app.iconBorder}`}>
                        {app.icon}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">{app.name}</h3>
                        <p className="text-xs text-text-subtle dark:text-gray-400">{app.category}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center rounded-full ${
                      app.statusColor === 'green' ? 'bg-green-50 dark:bg-green-900/40 text-green-700 dark:text-green-300 ring-green-600/20' :
                      app.statusColor === 'blue' ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 ring-blue-600/20' :
                      'bg-yellow-50 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 ring-yellow-600/20'
                    } px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset`}>
                      {app.status}
                    </span>
                  </div>

                  <hr className="border-border-color dark:border-dark-border opacity-50" />

                  {/* Metrics Row */}
                  <div className="flex justify-between items-center py-1">
                    <div>
                      <p className="text-xs text-text-subtle dark:text-gray-400 mb-0.5">
                        {app.activeUsers ? 'Active Users' : 'Testers'}
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-xl font-bold text-text-main dark:text-white">
                          {app.activeUsers || app.testers}
                        </span>
                        {app.activeUsers && app.userChange && (
                          <span className={`text-xs font-semibold ${
                            app.trend === 'up' ? 'text-green-600' : 'text-red-500'
                          } flex items-center`}>
                            <span className="material-symbols-outlined text-[14px]">
                              {app.trend === 'up' ? 'trending_up' : 'trending_down'}
                            </span>
                            {app.userChange}%
                          </span>
                        )}
                        {app.testers && (
                          <span className="text-xs font-medium text-gray-500 flex items-center">Internal</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      {app.rating ? (
                        <>
                          <p className="text-xs text-text-subtle dark:text-gray-400 mb-0.5">Rating</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-sm font-bold text-text-main dark:text-white">{app.rating}</span>
                            <span className="material-symbols-outlined text-yellow-400 text-[16px] fill-1">star</span>
                            <span className="text-xs text-text-subtle dark:text-gray-500">({app.ratingCount})</span>
                          </div>
                        </>
                      ) : (
                        <>
                          <p className="text-xs text-text-subtle dark:text-gray-400 mb-0.5">Milestone</p>
                          <div className="flex items-center gap-1 justify-end">
                            <span className="text-sm font-bold text-text-main dark:text-white">{app.milestone}</span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Progress Section */}
                  {(app.healthScore !== undefined || app.progress !== undefined) && (
                    <div className="mt-auto pt-2">
                      <div className="flex justify-between text-xs text-text-subtle dark:text-gray-400 mb-1.5">
                        <span>{app.progressLabel || 'Health Score'}</span>
                        <span>{app.healthScore || app.progress}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${
                            app.healthScore ? 'bg-primary' :
                            app.statusColor === 'blue' ? 'bg-blue-400' :
                            app.statusColor === 'yellow' ? 'bg-amber-400' :
                            'bg-primary'
                          } rounded-full`}
                          style={{ width: `${app.healthScore || app.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between gap-3 pt-4 mt-2 border-t border-border-color dark:border-dark-border">
                    <span className="text-xs text-text-subtle dark:text-gray-500 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span>
                      {app.lastUpdated}
                    </span>
                    <div className="flex gap-2">
                      {app.status === 'Dev' ? (
                        <Link 
                          href={`/apps/${app.id}`}
                          className="h-8 px-4 flex items-center justify-center rounded-lg bg-white border border-gray-200 dark:bg-transparent dark:border-gray-700 dark:text-white text-dark-nav text-sm font-bold hover:bg-gray-50 dark:hover:bg-white/5 transition-all w-full"
                        >
                          Manage
                        </Link>
                      ) : (
                        <>
                          <button className="size-8 flex items-center justify-center rounded-lg bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 text-text-subtle transition-colors">
                            <span className="material-symbols-outlined text-[20px]">
                              {app.status === 'Beta' ? 'bug_report' : 'settings'}
                            </span>
                          </button>
                          <button className="h-8 px-4 flex items-center justify-center rounded-lg bg-primary text-dark-nav text-sm font-bold hover:brightness-105 transition-all">
                            Launch
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}

            {/* Add New App Card */}
            <Link 
              href="/apps/new"
              className="group relative flex flex-col justify-center items-center bg-transparent border-2 border-dashed border-border-color dark:border-dark-border rounded-xl min-h-[280px] hover:border-primary/50 hover:bg-white/30 dark:hover:bg-white/5 transition-all cursor-pointer"
            >
              <div className="flex flex-col items-center gap-3 text-center p-6">
                <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px]">add</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-text-main dark:text-white">Create New App</h3>
                  <p className="text-sm text-text-subtle dark:text-gray-400 mt-1">Start from a template or scratch</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Footer Pagination/Info */}
          <div className="flex items-center justify-between pt-6 border-t border-border-color dark:border-dark-border text-sm text-text-subtle dark:text-gray-400">
            <p>Showing 5 of 12 apps</p>
            <div className="flex gap-2">
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1 rounded hover:bg-gray-100 dark:hover:bg-surface-dark transition-colors">
                Next
              </button>
            </div>
          </div>
    </div>
  )
}
