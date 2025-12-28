'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useApps } from '@/hooks/useApps'
import { format } from 'date-fns'

export default function AppsPage() {
  const { data: apps = [], isLoading } = useApps()
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Filter apps by category
  const filteredApps = selectedCategory === 'all' 
    ? apps 
    : apps.filter(app => app.category === selectedCategory)

  // Get unique categories from apps
  const categories = Array.from(new Set(apps.map(app => app.category))).filter(Boolean)

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-8 px-4 md:px-10">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading apps...</div>
        </div>
      </div>
    )
  }

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
          <svg className="w-5 h-5 transition-transform group-hover:rotate-90" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          <span>Add New App</span>
        </Link>
      </header>

      {/* Filters & Sort */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-color dark:border-dark-border pb-6">
        {/* Category Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'all'
                ? 'bg-dark-nav text-white'
                : 'bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border hover:border-primary/50 text-text-subtle dark:text-gray-300'
            }`}
          >
            All Apps
          </button>
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`flex h-9 shrink-0 items-center justify-center px-4 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? 'bg-dark-nav text-white'
                  : 'bg-white dark:bg-surface-dark border border-border-color dark:border-dark-border hover:border-primary/50 text-text-subtle dark:text-gray-300'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* App Grid */}
      {filteredApps.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-text-main dark:text-white mb-2">
            {selectedCategory === 'all' ? 'No apps yet' : `No apps in ${selectedCategory}`}
          </h3>
          <p className="text-text-subtle dark:text-gray-400 mb-6">
            {selectedCategory === 'all' 
              ? 'Get started by creating your first app'
              : `Try selecting a different category or create a new app`
            }
          </p>
          <Link
            href="/apps/new"
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#a2ef69] transition-colors h-12 px-6 rounded-lg text-dark-nav text-sm font-bold shadow-sm"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            <span>Create Your First App</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredApps.map((app) => {
            const statusColors: Record<string, { bg: string; text: string; ring: string }> = {
              live: { bg: 'bg-green-50 dark:bg-green-900/40', text: 'text-green-700 dark:text-green-300', ring: 'ring-green-600/20' },
              beta: { bg: 'bg-blue-50 dark:bg-blue-900/40', text: 'text-blue-700 dark:text-blue-300', ring: 'ring-blue-600/20' },
              development: { bg: 'bg-yellow-50 dark:bg-yellow-900/40', text: 'text-yellow-800 dark:text-yellow-300', ring: 'ring-yellow-600/20' },
              idea: { bg: 'bg-gray-50 dark:bg-gray-900/40', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-600/20' },
              paused: { bg: 'bg-orange-50 dark:bg-orange-900/40', text: 'text-orange-700 dark:text-orange-300', ring: 'ring-orange-600/20' },
              archived: { bg: 'bg-gray-50 dark:bg-gray-900/40', text: 'text-gray-700 dark:text-gray-300', ring: 'ring-gray-600/20' },
            }

            const statusConfig = statusColors[app.status.toLowerCase()] || statusColors.idea
            const statusLabel = app.status.charAt(0).toUpperCase() + app.status.slice(1)

            return (
              <article
                key={app.id}
                className="group relative flex flex-col bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm border border-border-color dark:border-dark-border overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-5 flex flex-col gap-4 h-full">
                  {/* Card Header */}
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl border border-primary/20">
                        {app.icon || '📱'}
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-text-main dark:text-white leading-tight">{app.name}</h3>
                        <p className="text-xs text-text-subtle dark:text-gray-400">{app.category || 'Uncategorized'}</p>
                      </div>
                    </div>
                    <span
                      className={`inline-flex items-center rounded-full ${statusConfig.bg} ${statusConfig.text} ring-1 ring-inset ${statusConfig.ring} px-2.5 py-0.5 text-xs font-semibold`}
                    >
                      {statusLabel}
                    </span>
                  </div>

                  <hr className="border-border-color dark:border-dark-border opacity-50" />

                  {/* Description */}
                  {app.description && (
                    <p className="text-sm text-text-subtle dark:text-gray-400 line-clamp-2">
                      {app.description}
                    </p>
                  )}

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between gap-3 pt-4 mt-auto border-t border-border-color dark:border-dark-border">
                    <span className="text-xs text-text-subtle dark:text-gray-500 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                      </svg>
                      {app.updated_at ? format(new Date(app.updated_at), 'MMM d, yyyy') : 'No date'}
                    </span>
                    <Link
                      href={`/apps/${app.id}`}
                      className="h-8 px-4 flex items-center justify-center rounded-lg bg-primary text-dark-nav text-sm font-bold hover:brightness-105 transition-all"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}

          {/* Add New App Card */}
          <Link
            href="/apps/new"
            className="group relative flex flex-col justify-center items-center bg-transparent border-2 border-dashed border-border-color dark:border-dark-border rounded-xl min-h-[280px] hover:border-primary/50 hover:bg-white/30 dark:hover:bg-white/5 transition-all cursor-pointer"
          >
            <div className="flex flex-col items-center gap-3 text-center p-6">
              <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-text-main dark:text-white">Create New App</h3>
                <p className="text-sm text-text-subtle dark:text-gray-400 mt-1">Start from a template or scratch</p>
              </div>
            </div>
          </Link>
        </div>
      )}
    </div>
  )
}
