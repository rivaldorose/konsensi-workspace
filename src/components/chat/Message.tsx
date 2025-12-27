'use client'

import { format, isToday, isYesterday } from 'date-fns'
import type { Message as MessageType } from '@/hooks/useChat'

interface MessageProps {
  message: MessageType
  isOwn?: boolean
}

export function Message({ message, isOwn = false }: MessageProps) {
  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) {
      return format(date, 'h:mm a')
    } else if (isYesterday(date)) {
      return `Yesterday ${format(date, 'h:mm a')}`
    } else {
      return format(date, 'MMM d, h:mm a')
    }
  }

  const userName = message.user?.full_name || 'Unknown User'
  const userAvatar = message.user?.avatar_url || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(userName)

  return (
    <div className={`flex gap-4 group ${isOwn ? 'flex-row-reverse' : ''}`}>
      <div className="shrink-0">
        <div
          className="w-10 h-10 rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url("${userAvatar}")` }}
        />
      </div>
      <div className={`flex flex-col gap-1 max-w-[70%] ${isOwn ? 'items-end' : ''}`}>
        <div className={`flex items-baseline gap-2 ${isOwn ? 'flex-row-reverse' : ''}`}>
          <span className="font-bold text-text-dark dark:text-white">{isOwn ? 'You' : userName}</span>
          <span className="text-xs text-gray-400">{formatTime(message.created_at)}</span>
        </div>
        <div
          className={`${
            isOwn
              ? 'bg-[#f0f9e8] dark:bg-[#344e1f] border border-[#dffcbd] dark:border-transparent rounded-l-2xl rounded-br-2xl text-text-dark dark:text-white'
              : 'bg-white dark:bg-[#25331a] border border-gray-100 dark:border-transparent rounded-r-2xl rounded-bl-2xl text-text-dark dark:text-gray-100'
          } p-3 lg:p-4 shadow-sm text-[15px] leading-relaxed`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        {message.reactions && message.reactions.length > 0 && (
          <div className="flex gap-2 mt-1">
            {message.reactions.map((reaction, idx) => (
              <div
                key={idx}
                className="flex items-center gap-1 bg-gray-50 dark:bg-[#25331a] px-2 py-1 rounded-full border border-gray-200 dark:border-gray-700 hover:bg-white cursor-pointer transition-colors"
              >
                <span className="text-sm">{reaction.emoji}</span>
                <span className="text-xs font-bold text-gray-600 dark:text-gray-300">
                  {reaction.users.length}
                </span>
              </div>
            ))}
          </div>
        )}
        {isOwn && (
          <span className="text-xs text-gray-400 font-medium mr-1">Seen by everyone</span>
        )}
      </div>
    </div>
  )
}

