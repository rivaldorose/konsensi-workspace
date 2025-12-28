'use client'

import type { MarketingPost } from '@/types/marketing'
import { startOfMonth, endOfMonth, eachDayOfInterval, startOfWeek, endOfWeek, isSameMonth, isSameDay, getDate } from 'date-fns'

interface MarketingCalendarProps {
  posts: MarketingPost[]
  selectedDate: Date
  onDateSelect: (date: Date) => void
  onPostClick: (post: MarketingPost) => void
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

const getPostStatusColor = (status: MarketingPost['status']) => {
  switch (status) {
    case 'published':
      return 'border-l-primary'
    case 'scheduled':
      return 'border-l-blue-500'
    case 'draft':
      return 'border-l-gray-300'
    case 'pending_review':
      return 'border-l-yellow-400'
    default:
      return 'border-l-gray-300'
  }
}

const getPostStatusLabel = (status: MarketingPost['status']) => {
  switch (status) {
    case 'published':
      return 'Published'
    case 'scheduled':
      return 'Scheduled'
    case 'draft':
      return 'Draft'
    case 'pending_review':
      return 'Review'
    default:
      return status
  }
}

const getPlatformIcon = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <span className="text-[10px] font-bold">in</span>
    case 'instagram':
      return (
        <svg className="w-[10px] h-[10px]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case 'twitter':
    case 'x':
      return <span className="text-[10px] font-bold">X</span>
    default:
      return (
        <svg className="w-[10px] h-[10px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
  }
}

const getPlatformBg = (platform: string) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return 'bg-blue-100 text-blue-600'
    case 'instagram':
      return 'bg-pink-100 text-pink-600'
    case 'twitter':
    case 'x':
      return 'bg-sky-100 text-sky-600'
    default:
      return 'bg-gray-100 text-gray-600'
  }
}

export default function MarketingCalendar({
  posts,
  selectedDate,
  onDateSelect,
  onPostClick,
  currentMonth,
  onMonthChange
}: MarketingCalendarProps) {
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const getPostsForDate = (date: Date) => {
    return posts.filter(post => {
      if (!post.scheduled_date) return false
      const postDate = new Date(post.scheduled_date)
      return isSameDay(postDate, date)
    })
  }

  const handlePrevMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    onMonthChange(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 pb-6">
      <div className="bg-white rounded-xl shadow-sm border border-[#e9f3e7] overflow-hidden min-h-[600px] flex flex-col">
        {/* Weekday Header */}
        <div className="grid grid-cols-7 border-b border-[#e9f3e7] bg-[#fcfdfc]">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="py-3 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 flex-1 auto-rows-fr">
          {days.map((day, idx) => {
            const dayPosts = getPostsForDate(day)
            const isCurrentMonth = isSameMonth(day, currentMonth)
            const isSelected = isSameDay(day, selectedDate)
            const dayNumber = getDate(day)

            return (
              <div
                key={idx}
                className={`border-b border-r border-[#f0f5ee] p-2 min-h-[140px] relative group transition-colors ${
                  isCurrentMonth ? '' : 'bg-[#f9fcf8] opacity-50'
                } ${isSelected ? 'bg-primary/5 ring-1 ring-inset ring-primary/20' : 'hover:bg-[#fafdf9]'}`}
              >
                <div className="flex justify-between items-start mb-2">
                  {isSelected ? (
                    <div className="size-6 bg-primary text-[#101b0d] rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
                      {dayNumber}
                    </div>
                  ) : (
                    <span className={`text-sm font-bold ${isCurrentMonth ? 'text-[#101b0d]' : 'text-gray-400'}`}>
                      {dayNumber}
                    </span>
                  )}
                  {isCurrentMonth && (
                    <button
                      onClick={() => onDateSelect(day)}
                      className={`opacity-0 group-hover:opacity-100 text-primary hover:bg-[#e9f3e7] rounded p-0.5 transition-all ${isSelected ? 'opacity-100' : ''}`}
                    >
                      <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Post Cards */}
                {isCurrentMonth && dayPosts.map((post) => (
                  <div
                    key={post.id}
                    onClick={() => onPostClick(post)}
                    className={`bg-white border-l-4 ${getPostStatusColor(post.status)} rounded shadow-sm p-2 mb-2 cursor-pointer hover:shadow-md transition-shadow ${isSelected ? 'ring-2 ring-primary ring-offset-1' : ''}`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-bold uppercase tracking-wide ${
                        post.status === 'published' ? 'text-primary' :
                        post.status === 'scheduled' ? 'text-blue-600' :
                        post.status === 'pending_review' ? 'text-yellow-600' :
                        'text-gray-500'
                      }`}>
                        {getPostStatusLabel(post.status)}
                      </span>
                      {post.status === 'published' ? (
                        <svg className="w-[14px] h-[14px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                      ) : post.status === 'scheduled' ? (
                        <svg className="w-[14px] h-[14px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : post.status === 'pending_review' ? (
                        <svg className="w-[14px] h-[14px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      ) : (
                        <svg className="w-[14px] h-[14px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-xs font-bold text-[#101b0d] line-clamp-2 leading-tight">
                      {post.title}
                    </p>
                    {post.platforms.length > 0 && (
                      <div className="mt-2 flex items-center gap-1">
                        {post.platforms.slice(0, 2).map((platform) => (
                          <div key={platform} className={`size-4 rounded-full ${getPlatformBg(platform)} flex items-center justify-center`}>
                            {getPlatformIcon(platform)}
                          </div>
                        ))}
                        {post.scheduled_time && (
                          <span className="text-[10px] text-gray-500">{post.scheduled_time}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

