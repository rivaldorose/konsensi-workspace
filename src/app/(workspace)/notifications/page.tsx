'use client'

import { useState, useMemo } from 'react'
import React from 'react'
import { useNotifications } from '@/hooks/useNotifications'
import { format, isToday, isYesterday, startOfWeek, isWithinInterval } from 'date-fns'

// Icon component helper
const getIconSVG = (iconName: string, className: string = 'w-5 h-5'): React.ReactElement => {
  const iconMap: Record<string, React.ReactElement> = {
    settings: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    alternate_email: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.5 14.5h-3c-.28 0-.5-.22-.5-.5v-4c0-.28.22-.5.5-.5h3c.28 0 .5.22.5.5v4c0 .28-.22.5-.5.5zm-3-5.5c-.83 0-1.5-.67-1.5-1.5S9.67 8 10.5 8 12 8.67 12 9.5 11.33 11 10.5 11zm5 0c-.83 0-1.5-.67-1.5-1.5S14.67 8 15.5 8 17 8.67 17 9.5 16.33 11 15.5 11z" />
      </svg>
    ),
    fact_check: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM10 17H5v-2h5v2zm0-4H5v-2h5v2zm0-4H5V7h5v2zm4.82 6L12 12.16l1.41-1.41 1.41 1.42L17.99 9l1.42 1.42L14.82 15z" />
      </svg>
    ),
    handshake: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    security_update_warning: (
      <svg className={className} fill="currentColor" viewBox="0 0 24 24">
        <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
    comment: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    ),
    reply: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
      </svg>
    ),
    visibility: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
      </svg>
    ),
    check: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
      </svg>
    ),
    close: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    ),
    description: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    lock_reset: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
      </svg>
    ),
    forum: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    ),
    more_vert: (
      <svg className={className} fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
      </svg>
    ),
    refresh: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
  }
  return iconMap[iconName] || <div className={className} />
}

export default function NotificationsPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)
  const { data: notifications = [], isLoading } = useNotifications()

  // Group notifications by date
  const groupedNotifications = useMemo(() => {
    const today: typeof notifications = []
    const yesterday: typeof notifications = []
    const thisWeek: typeof notifications = []

    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

    notifications.forEach((notification) => {
      const notificationDate = new Date(notification.created_at)
      
      if (isToday(notificationDate)) {
        today.push(notification)
      } else if (isYesterday(notificationDate)) {
        yesterday.push(notification)
      } else if (isWithinInterval(notificationDate, { start: weekStart, end: new Date() })) {
        thisWeek.push(notification)
      }
    })

    return { today, yesterday, thisWeek }
  }, [notifications])

  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight text-[#131c0d] dark:text-white">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold px-2 py-0.5 rounded-full">
                {unreadCount} New
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSettingsOpen(true)}
              className="text-sm font-bold text-[#131c0d] dark:text-gray-200 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              {getIconSVG('settings', 'w-[18px] h-[18px]')}
              <span>Settings</span>
            </button>
            <button className="text-sm font-bold text-[#131c0d] dark:text-gray-900 bg-primary hover:bg-primary-dark hover:text-white px-4 py-2 rounded-lg shadow-sm shadow-primary/20 transition-all">
              Mark All Read
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8 overflow-x-auto no-scrollbar pb-2">
          <button className="px-4 py-1.5 rounded-lg bg-[#131c0d] text-white text-sm font-medium shadow-md whitespace-nowrap">All</button>
          <button className="px-4 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium whitespace-nowrap transition-colors">Unread</button>
          <button className="px-4 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2">
            <span className="size-2 rounded-full bg-blue-500"></span>
            Mentions
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2">
            <span className="size-2 rounded-full bg-yellow-500"></span>
            Approvals
          </button>
          <button className="px-4 py-1.5 rounded-lg bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 text-sm font-medium whitespace-nowrap transition-colors flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500"></span>
            Updates
          </button>
        </div>

        {/* Content List */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-pulse text-gray-400">Loading notifications...</div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="text-center py-20">
            <div className="size-16 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
            </div>
            <p className="text-gray-500 dark:text-gray-400 mb-2 font-medium">No notifications yet</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">You'll see notifications here when you receive them</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Today */}
            {groupedNotifications.today.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131c0d] dark:text-gray-200 px-1">Today</h3>
                {groupedNotifications.today.map((notification) => (
              <div 
                key={notification.id}
                className={`group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-l-[6px] border-gray-100 dark:border-white/5 ${notification.borderColor} hover:shadow-md transition-all ${'opacity' in notification && notification.opacity ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className={`size-10 rounded-full ${notification.iconColor} flex items-center justify-center`}>
                      {getIconSVG(notification.icon, 'w-5 h-5')}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <p className="text-base font-bold text-[#131c0d] dark:text-white">
                        {notification.title} <span className="font-normal text-gray-500 dark:text-gray-400">{notification.titleSub}</span>
                      </p>
                      <span className={`text-xs font-medium ${notification.badgeColor} px-2 py-0.5 rounded w-fit`}>
                        {notification.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {notification.actions.map((action, idx) => (
                        <button 
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-xs font-bold rounded-lg hover:opacity-90 transition-colors`}
                        >
                          {action.icon && getIconSVG(action.icon, 'w-4 h-4')}
                          {action.label}
                        </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">{notification.time}</span>
                    <div className="relative">
                      <button className="p-1 rounded-md text-gray-400 hover:text-[#131c0d] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        {getIconSVG('more_vert', 'w-5 h-5')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                ))}
              </div>
            )}

            {/* Yesterday */}
            {groupedNotifications.yesterday.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131c0d] dark:text-gray-200 px-1">Yesterday</h3>
                {groupedNotifications.yesterday.map((notification) => (
              <div 
                key={notification.id}
                className={`group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-l-[6px] border-gray-100 dark:border-white/5 ${notification.borderColor} hover:shadow-md transition-all ${'opacity' in notification && notification.opacity ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className={`size-10 rounded-full ${notification.iconColor} flex items-center justify-center`}>
                      {getIconSVG(notification.icon, 'w-5 h-5')}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <p className="text-base font-bold text-[#131c0d] dark:text-white">
                        {notification.title} <span className="font-normal text-gray-500 dark:text-gray-400">{notification.titleSub}</span>
                      </p>
                      <span className={`text-xs font-medium ${notification.badgeColor} px-2 py-0.5 rounded w-fit`}>
                        {notification.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {notification.actions.map((action, idx) => (
                        <button 
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-xs font-bold rounded-lg hover:opacity-90 transition-colors`}
                        >
                          {action.icon && getIconSVG(action.icon, 'w-4 h-4')}
                          {action.label}
                        </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">{notification.time}</span>
                    <div className="relative">
                      <button className="p-1 rounded-md text-gray-400 hover:text-[#131c0d] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        {getIconSVG('more_vert', 'w-5 h-5')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                ))}
              </div>
            )}

            {/* This Week */}
            {groupedNotifications.thisWeek.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-bold text-[#131c0d] dark:text-gray-200 px-1">This Week</h3>
                {groupedNotifications.thisWeek.map((notification) => (
              <div 
                key={notification.id}
                className={`group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-l-[6px] border-gray-100 dark:border-white/5 ${notification.borderColor} hover:shadow-md transition-all ${'opacity' in notification && notification.opacity ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className={`size-10 rounded-full ${notification.iconColor} flex items-center justify-center`}>
                      {getIconSVG(notification.icon, 'w-5 h-5')}
                    </div>
                  </div>
                  <div className="flex-grow min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-1">
                      <p className="text-base font-bold text-[#131c0d] dark:text-white">
                        {notification.title} <span className="font-normal text-gray-500 dark:text-gray-400">{notification.titleSub}</span>
                      </p>
                      <span className={`text-xs font-medium ${notification.badgeColor} px-2 py-0.5 rounded w-fit`}>
                        {notification.badge}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{notification.message}</p>
                    {notification.actions && notification.actions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {notification.actions.map((action, idx) => (
                        <button 
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-xs font-bold rounded-lg hover:opacity-90 transition-colors ${action.color.includes('border') ? 'border' : ''}`}
                        >
                          {action.icon && getIconSVG(action.icon, 'w-4 h-4')}
                          {action.label}
                        </button>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">{notification.time}</span>
                    <div className="relative">
                      <button className="p-1 rounded-md text-gray-400 hover:text-[#131c0d] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        {getIconSVG('more_vert', 'w-5 h-5')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
                ))}
              </div>
            )}
          </div>
        )}

      {/* Settings Modal */}
      {settingsOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#131c0d]/80 backdrop-blur-sm"
          onClick={() => setSettingsOpen(false)}
        >
          <div 
            className="bg-white dark:bg-card-dark w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-100 dark:border-white/10 flex items-center justify-between bg-white dark:bg-card-dark sticky top-0 z-10">
              <h3 className="text-xl font-bold text-[#131c0d] dark:text-white">Notification Settings</h3>
              <button 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                onClick={() => setSettingsOpen(false)}
              >
                {getIconSVG('close', 'w-5 h-5')}
              </button>
            </div>
            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-8">
              {/* Channels */}
              <section>
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Channels &amp; Types</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#131c0d] dark:text-white">Email Notifications</p>
                      <p className="text-xs text-gray-500">Get important updates in your inbox</p>
                    </div>
                    <button className="w-11 h-6 bg-primary rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <span className="absolute left-0.5 top-0.5 bg-white size-5 rounded-full shadow-sm transform translate-x-5 transition-transform"></span>
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#131c0d] dark:text-white">Push Notifications</p>
                      <p className="text-xs text-gray-500">Real-time alerts on your browser</p>
                    </div>
                    <button className="w-11 h-6 bg-primary rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <span className="absolute left-0.5 top-0.5 bg-white size-5 rounded-full shadow-sm transform translate-x-5 transition-transform"></span>
                    </button>
                  </div>
                  <div className="pt-2 pl-4 border-l-2 border-gray-100 dark:border-white/10 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">Mentions &amp; DMs</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input checked className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">Approval Requests</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">Comments on My Items</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                      <input className="peer h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                      <span className="text-sm text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">All Workspace Activity</span>
                    </label>
                  </div>
                </div>
              </section>
              {/* Frequency */}
              <section>
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Frequency</h4>
                <div className="grid grid-cols-1 gap-4">
                  <label className="block">
                    <span className="text-sm font-bold text-[#131c0d] dark:text-white mb-1 block">Digest Frequency</span>
                    <select className="block w-full rounded-lg border-gray-300 dark:border-white/20 dark:bg-white/5 text-sm focus:border-primary focus:ring-primary py-2.5">
                      <option>Real-time (Immediate)</option>
                      <option>Daily Digest (9:00 AM)</option>
                      <option>Weekly Summary (Monday)</option>
                    </select>
                  </label>
                </div>
              </section>
              {/* Quiet Hours */}
              <section>
                <h4 className="text-xs uppercase tracking-wider text-gray-500 font-bold mb-4">Quiet Hours</h4>
                <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold text-[#131c0d] dark:text-white">Enable Quiet Hours</p>
                      <p className="text-xs text-gray-500">Mute notifications during specific times</p>
                    </div>
                    <button className="w-11 h-6 bg-gray-200 dark:bg-white/10 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                      <span className="absolute left-0.5 top-0.5 bg-white size-5 rounded-full shadow-sm transform transition-transform"></span>
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-4 opacity-50 pointer-events-none">
                    <label>
                      <span className="text-xs font-semibold text-gray-500 mb-1 block">Start Time</span>
                      <input className="block w-full rounded-lg border-gray-300 dark:border-white/20 dark:bg-transparent text-sm" type="time" defaultValue="18:00" />
                    </label>
                    <label>
                      <span className="text-xs font-semibold text-gray-500 mb-1 block">End Time</span>
                      <input className="block w-full rounded-lg border-gray-300 dark:border-white/20 dark:bg-transparent text-sm" type="time" defaultValue="09:00" />
                    </label>
                  </div>
                  <div className="flex items-center gap-3 opacity-50 pointer-events-none">
                    <input checked className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary" type="checkbox" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Pause on Weekends</span>
                  </div>
                </div>
              </section>
            </div>
            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-black/20 flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 transition-colors"
                onClick={() => setSettingsOpen(false)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 rounded-lg text-sm font-bold bg-primary text-[#131c0d] hover:bg-primary-dark hover:text-white transition-colors"
                onClick={() => setSettingsOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
// TypeScript fix verified
