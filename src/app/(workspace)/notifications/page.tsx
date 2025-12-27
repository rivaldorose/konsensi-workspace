'use client'

import { useState } from 'react'

const notifications = {
  today: [
    {
      id: 1,
      type: 'mention',
      icon: 'alternate_email',
      iconColor: 'bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-400',
      borderColor: 'border-l-blue-500',
      title: 'Sarah mentioned you in',
      titleSub: 'Q3 Financial Report',
      badge: 'Mention',
      badgeColor: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10',
      message: 'Hey, can you take a quick look at the attached spreadsheet specifically regarding the marketing budget allocation?',
      time: '10:30 AM',
      actions: [
        { label: 'Reply', icon: 'reply', color: 'bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300' },
        { label: 'View Context', icon: 'visibility', color: 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300' },
      ],
    },
    {
      id: 2,
      type: 'approval',
      icon: 'fact_check',
      iconColor: 'bg-yellow-50 dark:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-l-yellow-500',
      title: 'Leave Request:',
      titleSub: 'John Doe (Oct 12-14)',
      badge: 'Approval Required',
      badgeColor: 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-500/10',
      message: 'John has requested 3 days of personal leave. No conflicts with current project deadlines found.',
      time: '9:15 AM',
      actions: [
        { label: 'Approve', icon: 'check', color: 'bg-primary text-[#131c0d] hover:bg-primary-dark hover:text-white' },
        { label: 'Reject', icon: 'close', color: 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300' },
      ],
    },
  ],
  yesterday: [
    {
      id: 3,
      type: 'update',
      icon: 'handshake',
      iconColor: 'bg-[#ecf4e7] dark:bg-primary/20 text-primary-dark dark:text-primary',
      borderColor: 'border-l-primary',
      title: 'New Contract Signed:',
      titleSub: 'Acme Corp',
      badge: 'Partner Update',
      badgeColor: 'text-primary-dark dark:text-primary bg-[#ecf4e7] dark:bg-primary/10',
      message: 'The annual service agreement has been finalized and signed by the client. Onboarding starts next week.',
      time: '4:45 PM',
      actions: [
        { label: 'View Contract', icon: 'description', color: 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300' },
      ],
    },
  ],
  thisWeek: [
    {
      id: 4,
      type: 'system',
      icon: 'security_update_warning',
      iconColor: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400',
      borderColor: 'border-l-gray-400',
      title: 'Security Alert:',
      titleSub: 'Password Expiring Soon',
      badge: 'System',
      badgeColor: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5',
      message: 'Your workspace password will expire in 3 days. Please update it to maintain access.',
      time: 'Mon',
      opacity: true,
      actions: [
        { label: 'Update Now', icon: 'lock_reset', color: 'bg-gray-800 text-white hover:bg-black' },
        { label: 'Snooze', icon: '', color: 'bg-white dark:bg-transparent border border-gray-200 dark:border-white/20 text-gray-600 dark:text-gray-400' },
      ],
    },
    {
      id: 5,
      type: 'comment',
      icon: 'comment',
      iconColor: 'bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-gray-400',
      borderColor: 'border-l-gray-400',
      title: 'New comment on',
      titleSub: 'Marketing Assets - Fall 2024',
      badge: 'Comment',
      badgeColor: 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5',
      message: 'Mike added: "This looks great, but let\'s swap the hero image for the secondary option we discussed."',
      time: 'Mon',
      actions: [
        { label: 'View Thread', icon: 'forum', color: 'bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300' },
      ],
    },
  ],
}

export default function NotificationsPage() {
  const [settingsOpen, setSettingsOpen] = useState(false)

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-black tracking-tight text-[#131c0d] dark:text-white">Notifications</h2>
            <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs font-bold px-2 py-0.5 rounded-full">12 New</span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSettingsOpen(true)}
              className="text-sm font-bold text-[#131c0d] dark:text-gray-200 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/10 px-4 py-2 rounded-lg shadow-sm transition-all flex items-center gap-2"
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
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
        <div className="space-y-8">
          {/* Today */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#131c0d] dark:text-gray-200 px-1">Today</h3>
                  {notifications.today.map((notification) => (
              <div 
                key={notification.id}
                className={`group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-l-[6px] border-gray-100 dark:border-white/5 ${notification.borderColor} hover:shadow-md transition-all ${'opacity' in notification && notification.opacity ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className={`size-10 rounded-full ${notification.iconColor} flex items-center justify-center`}>
                      <span className="material-symbols-outlined">{notification.icon}</span>
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
                    <div className="flex flex-wrap gap-2">
                      {notification.actions.map((action, idx) => (
                        <button 
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-xs font-bold rounded-lg hover:opacity-90 transition-colors`}
                        >
                          {action.icon && <span className="material-symbols-outlined text-[16px]">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">{notification.time}</span>
                    <div className="relative">
                      <button className="p-1 rounded-md text-gray-400 hover:text-[#131c0d] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Yesterday */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#131c0d] dark:text-gray-200 px-1">Yesterday</h3>
            {notifications.yesterday.map((notification) => (
              <div 
                key={notification.id}
                className={`group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-l-[6px] border-gray-100 dark:border-white/5 ${notification.borderColor} hover:shadow-md transition-all ${'opacity' in notification && notification.opacity ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className={`size-10 rounded-full ${notification.iconColor} flex items-center justify-center`}>
                      <span className="material-symbols-outlined">{notification.icon}</span>
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
                    <div className="flex flex-wrap gap-2">
                      {notification.actions.map((action, idx) => (
                        <button 
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-xs font-bold rounded-lg hover:opacity-90 transition-colors`}
                        >
                          {action.icon && <span className="material-symbols-outlined text-[16px]">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">{notification.time}</span>
                    <div className="relative">
                      <button className="p-1 rounded-md text-gray-400 hover:text-[#131c0d] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* This Week */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-[#131c0d] dark:text-gray-200 px-1">This Week</h3>
            {notifications.thisWeek.map((notification) => (
              <div 
                key={notification.id}
                className={`group bg-white dark:bg-card-dark rounded-xl p-4 shadow-sm border border-l-[6px] border-gray-100 dark:border-white/5 ${notification.borderColor} hover:shadow-md transition-all ${'opacity' in notification && notification.opacity ? 'opacity-80 hover:opacity-100' : ''}`}
              >
                <div className="flex gap-4 items-start">
                  <div className="shrink-0 mt-1">
                    <div className={`size-10 rounded-full ${notification.iconColor} flex items-center justify-center`}>
                      <span className="material-symbols-outlined">{notification.icon}</span>
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
                    <div className="flex flex-wrap gap-2">
                      {notification.actions.map((action, idx) => (
                        <button 
                          key={idx}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${action.color} text-xs font-bold rounded-lg hover:opacity-90 transition-colors ${action.color.includes('border') ? 'border' : ''}`}
                        >
                          {action.icon && <span className="material-symbols-outlined text-[16px]">{action.icon}</span>}
                          {action.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="shrink-0 flex flex-col items-end gap-2">
                    <span className="text-xs text-gray-400 font-medium">{notification.time}</span>
                    <div className="relative">
                      <button className="p-1 rounded-md text-gray-400 hover:text-[#131c0d] hover:bg-gray-100 dark:hover:bg-white/10 transition-colors opacity-0 group-hover:opacity-100">
                        <span className="material-symbols-outlined">more_vert</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="flex justify-center pt-4 pb-12">
            <button className="text-sm font-bold text-gray-500 hover:text-primary transition-colors flex items-center gap-2">
              <span className="material-symbols-outlined animate-spin" style={{ fontSize: '18px', animationDuration: '2s' }}>refresh</span>
              Load More...
            </button>
          </div>
        </div>

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
                <span className="material-symbols-outlined">close</span>
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
