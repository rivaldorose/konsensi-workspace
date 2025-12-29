'use client'

import { useState } from 'react'
import { useCalendarPosts } from '@/hooks/useMarketingPosts'
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isToday, getDate, format, addMonths, subMonths } from 'date-fns'
import type { MarketingPost, PostPlatform } from '@/types/marketing'

interface CalendarTabProps {
  onSelectPost: (postId: string) => void
}

const getPostStatusColor = (status: MarketingPost['status']) => {
  switch (status) {
    case 'published':
      return 'border-l-primary bg-green-50 dark:bg-green-900/20'
    case 'scheduled':
      return 'border-l-blue-500 bg-blue-50 dark:bg-blue-900/20'
    case 'draft':
      return 'border-l-gray-300 bg-gray-50 dark:bg-gray-900/20'
    case 'pending_review':
      return 'border-l-yellow-400 bg-yellow-50 dark:bg-yellow-900/20'
    default:
      return 'border-l-gray-300 bg-gray-50 dark:bg-gray-900/20'
  }
}

const getPlatformIcon = (platform: PostPlatform) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <span className="text-[10px] font-bold">in</span>
    case 'instagram':
      return (
        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case 'twitter':
      return <span className="text-[10px] font-bold">tw</span>
    case 'facebook':
      return <span className="text-[10px] font-bold">fb</span>
    default:
      return <span className="text-[10px] font-bold">{platform.charAt(0).toUpperCase()}</span>
  }
}

const getPlatformBg = (platform: PostPlatform) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'instagram':
      return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    case 'twitter':
      return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
    case 'facebook':
      return 'bg-blue-200 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

export function CalendarTab({ onSelectPost }: CalendarTabProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const month = currentMonth.getMonth()
  const year = currentMonth.getFullYear()
  
  const { data: posts = [], isLoading } = useCalendarPosts(month, year)

  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)
  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      if (!post.scheduled_date) return false
      const postDate = new Date(post.scheduled_date)
      return postDate.toDateString() === date.toDateString()
    })
  }

  const handlePrevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading calendar...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-[#f9fcf8] dark:bg-[#131b0d]">
      {/* Calendar Controls */}
      <div className="flex items-center justify-between px-6 py-4 bg-white dark:bg-[#1f2b15] border-b border-[#e9f3e7] dark:border-[#334025]">
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white dark:bg-[#222e18] rounded-lg border border-[#d3e7cf] dark:border-[#334025] p-1 shadow-sm">
            <button
              onClick={handlePrevMonth}
              className="p-1 hover:bg-[#e9f3e7] dark:hover:bg-[#2a3820] rounded transition-colors"
            >
              <svg className="w-5 h-5 text-[#101b0d] dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="px-3 text-sm font-bold text-[#101b0d] dark:text-white min-w-[120px] text-center">
              {format(currentMonth, 'MMMM yyyy')}
            </span>
            <button
              onClick={handleNextMonth}
              className="p-1 hover:bg-[#e9f3e7] dark:hover:bg-[#2a3820] rounded transition-colors"
            >
              <svg className="w-5 h-5 text-[#101b0d] dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          <button className="px-3 py-1.5 bg-[#e9f3e7] dark:bg-[#334025] text-[#599a4c] dark:text-[#a3d977] text-xs font-bold rounded-lg hover:bg-[#d3e7cf] dark:hover:bg-[#3a4d2e] transition-colors">
            Today
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#e9f3e7] dark:border-[#334025] overflow-hidden shadow-sm">
          {/* Weekday Headers */}
          <div className="grid grid-cols-7 border-b border-[#e9f3e7] dark:border-[#334025] bg-[#f9fcf8] dark:bg-[#182210]">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-3 text-center text-xs font-bold text-gray-600 dark:text-gray-400">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7">
            {days.map((day, idx) => {
              const dayPosts = getPostsForDate(day)
              const isCurrentMonthDay = isSameMonth(day, currentMonth)
              const isTodayDay = isToday(day)

              return (
                <div
                  key={idx}
                  className={`min-h-[120px] border-r border-b border-[#e9f3e7] dark:border-[#334025] p-2 ${
                    isCurrentMonthDay ? 'bg-white dark:bg-[#1f2b15]' : 'bg-gray-50 dark:bg-[#182210]'
                  } ${isTodayDay ? 'ring-2 ring-primary' : ''}`}
                >
                  <div className={`text-sm font-bold mb-1 ${isCurrentMonthDay ? 'text-[#101b0d] dark:text-white' : 'text-gray-400'} ${isTodayDay ? 'text-primary' : ''}`}>
                    {getDate(day)}
                  </div>
                  <div className="space-y-1">
                    {dayPosts.slice(0, 3).map((post) => (
                      <button
                        key={post.id}
                        onClick={() => onSelectPost(post.id)}
                        className={`w-full text-left p-1.5 rounded border-l-2 ${getPostStatusColor(post.status)} hover:opacity-80 transition-opacity text-xs`}
                      >
                        <div className="flex items-center gap-1 mb-1">
                          {post.platforms.slice(0, 2).map((platform) => (
                            <div
                              key={platform}
                              className={`w-4 h-4 rounded flex items-center justify-center ${getPlatformBg(platform)}`}
                            >
                              {getPlatformIcon(platform)}
                            </div>
                          ))}
                          {post.platforms.length > 2 && (
                            <span className="text-xs text-gray-500">+{post.platforms.length - 2}</span>
                          )}
                        </div>
                        {post.scheduled_time && (
                          <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                            {post.scheduled_time}
                          </div>
                        )}
                        <div className="font-semibold text-[#101b0d] dark:text-white truncate">
                          {post.title || 'Untitled Post'}
                        </div>
                      </button>
                    ))}
                    {dayPosts.length > 3 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 px-1.5">
                        +{dayPosts.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

