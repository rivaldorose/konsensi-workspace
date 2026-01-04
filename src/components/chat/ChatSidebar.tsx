'use client'

import { useState } from 'react'
import type { Channel } from '@/hooks/useChat'
import { useCurrentUser } from '@/hooks/useUsers'

interface ChatSidebarProps {
  channels: Channel[]
  selectedChannelId?: string
  onSelectChannel: (channelId: string) => void
}

export function ChatSidebar({
  channels,
  selectedChannelId,
  onSelectChannel
}: ChatSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const { data: currentUser } = useCurrentUser()

  // Filter channels by search
  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <aside className="w-[240px] flex flex-col bg-[#fafcf8] dark:bg-background-dark border-r border-border-light shrink-0 h-full overflow-hidden">
      <div className="flex flex-col h-full overflow-y-auto">
        {/* Search */}
        <div className="p-4 border-b border-border-light">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
            </div>
            <input
              type="text"
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-[#25331a] text-text-dark dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Search channels..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          <div>
            <div className="px-2 mb-2 flex items-center justify-between group">
              <h3 className="text-xs font-bold text-text-dark dark:text-white uppercase tracking-wider opacity-70">Channels</h3>
              <button className="opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4 text-gray-400 hover:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </button>
            </div>
            <div className="space-y-1">
              {filteredChannels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => onSelectChannel(channel.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                    selectedChannelId === channel.id
                      ? 'bg-[#ecf3e7] dark:bg-[#25331a] text-text-dark dark:text-white font-bold'
                      : 'hover:bg-gray-100 dark:hover:bg-[#25331a] text-gray-600 dark:text-gray-300'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" />
                  </svg>
                  <span className="text-sm flex-1 text-left truncate">{channel.name}</span>
                </button>
              ))}
              {filteredChannels.length === 0 && (
                <p className="text-xs text-gray-400 px-3 py-2">No channels found</p>
              )}
            </div>
          </div>
        </div>

        {/* User Status Footer */}
        <div className="mt-auto p-4 border-t border-border-light bg-gray-50 dark:bg-[#1a2412]">
          {currentUser && (
            <div className="flex items-center gap-3">
              <div className="relative">
                {currentUser.avatar_url ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url("${currentUser.avatar_url}")` }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary">
                      {currentUser.full_name?.charAt(0)?.toUpperCase() || currentUser.email?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
                <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-primary border-2 border-white dark:border-background-dark rounded-full" />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold leading-none text-text-dark dark:text-white truncate">
                  {currentUser.full_name || currentUser.email || 'User'}
                </span>
                <span className="text-xs text-text-secondary">Active</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}

