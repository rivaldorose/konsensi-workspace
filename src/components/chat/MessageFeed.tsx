'use client'

import { useEffect, useRef, useState } from 'react'
import { format, isToday, isYesterday, startOfDay } from 'date-fns'
import { Message } from './Message'
import type { Message as MessageType } from '@/hooks/useChat'
import { createClient } from '@/lib/supabase/client'

interface MessageFeedProps {
  messages: MessageType[]
  loading: boolean
  channelId: string
}

export function MessageFeed({ messages, loading, channelId }: MessageFeedProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createClient()

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Group messages by date
  const groupedMessages = () => {
    const groups: { date: Date; messages: MessageType[] }[] = []
    let currentGroup: { date: Date; messages: MessageType[] } | null = null

    messages.forEach((message) => {
      const messageDate = new Date(message.created_at)
      const messageDay = startOfDay(messageDate)

      if (!currentGroup || currentGroup.date.getTime() !== messageDay.getTime()) {
        currentGroup = { date: messageDay, messages: [] }
        groups.push(currentGroup)
      }

      currentGroup.messages.push(message)
    })

    return groups
  }

  const formatDateLabel = (date: Date) => {
    if (isToday(date)) return 'Today'
    if (isYesterday(date)) return 'Yesterday'
    return format(date, 'MMMM d, yyyy')
  }

  const [currentUserId, setCurrentUserId] = useState<string | null>(null)

  useEffect(() => {
    const getCurrentUserId = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setCurrentUserId(user?.id || null)
    }
    getCurrentUserId()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className="flex-1 overflow-y-auto p-6 flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading messages...</div>
      </div>
    )
  }

  const groups = groupedMessages()

  return (
    <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
      {groups.map((group, groupIdx) => (
        <div key={groupIdx}>
          {/* Date Separator */}
          <div className="flex items-center justify-center relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border-light"></div>
            </div>
            <span className="relative bg-white dark:bg-[#1e2a15] px-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
              {formatDateLabel(group.date)}
            </span>
          </div>

          {/* Messages */}
          <div className="space-y-6">
            {group.messages.map((message) => (
              <Message
                key={message.id}
                message={message}
                isOwn={message.user_id === currentUserId}
              />
            ))}
          </div>
        </div>
      ))}

      {messages.length === 0 && (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-400 text-lg mb-2">No messages yet</p>
            <p className="text-gray-500 text-sm">Start the conversation!</p>
          </div>
        </div>
      )}

      <div ref={messagesEndRef} />
    </div>
  )
}

