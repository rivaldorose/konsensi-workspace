'use client'

import type { Channel } from '@/hooks/useChat'

interface ChatInfoProps {
  channel: Channel
  onClose: () => void
}

export function ChatInfo({ channel, onClose }: ChatInfoProps) {
  return (
    <aside className="w-[280px] flex flex-col bg-[#fafcf8] dark:bg-background-dark border-l border-border-light shrink-0 overflow-y-auto">
      {/* Header */}
      <div className="p-4 border-b border-border-light flex items-center justify-between">
        <h3 className="font-bold text-text-dark dark:text-white">Channel Info</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-text-dark dark:hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col">
        {/* About */}
        <div className="p-4 border-b border-border-light">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center">
              <div className="size-16 rounded-xl bg-[#ecf3e7] dark:bg-[#25331a] flex items-center justify-center text-text-dark dark:text-white">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" />
                </svg>
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-lg font-bold text-text-dark dark:text-white">#{channel.name}</h2>
              <p className="text-sm text-text-secondary mt-1">
                Created on {new Date(channel.created_at).toLocaleDateString()}
              </p>
            </div>
            {channel.description && (
              <div className="text-sm text-gray-600 dark:text-gray-300 text-center mt-2">
                {channel.description}
              </div>
            )}
          </div>
        </div>

        {/* Members */}
        <div className="border-b border-border-light">
          <button className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-[#1a2412] transition-colors">
            <span className="font-bold text-sm text-text-dark dark:text-white">Members</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">{channel.members.length}</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </button>
        </div>

        {/* Pinned Messages */}
        <div>
          <button className="flex items-center justify-between w-full p-4 hover:bg-gray-50 dark:hover:bg-[#1a2412] transition-colors">
            <span className="font-bold text-sm text-text-dark dark:text-white">Pinned Messages</span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500 font-medium">0</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </button>
        </div>
      </div>
    </aside>
  )
}

