'use client'

import { useState } from 'react'
import type { Channel } from '@/hooks/useChat'

interface ChatHeaderProps {
  channel: Channel
  onToggleInfo: () => void
}

export function ChatHeader({ channel, onToggleInfo }: ChatHeaderProps) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-border-light bg-white dark:bg-[#1e2a15] sticky top-0 z-10 shadow-sm">
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z" />
          </svg>
          <h1 className="text-lg font-bold text-text-dark dark:text-white">{channel.name}</h1>
        </div>
        {channel.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">
            {channel.description}
          </p>
        )}
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className={`p-2 rounded-lg transition-colors ${
            isFavorite
              ? 'text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
              : 'text-gray-400 hover:text-yellow-500 hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
        >
          <svg className="w-5 h-5" fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        </button>
        <button
          onClick={onToggleInfo}
          className="p-2 text-gray-400 hover:text-text-dark dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
          </svg>
        </button>
      </div>
    </div>
  )
}

