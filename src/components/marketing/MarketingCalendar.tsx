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
      return <i className="not-italic font-bold text-[10px]">in</i>
    case 'instagram':
      return <span className="material-symbols-outlined text-[10px]">photo_camera</span>
    case 'twitter':
    case 'x':
      return <i className="not-italic font-bold text-[10px]">X</i>
    default:
      return <span className="material-symbols-outlined text-[10px]">public</span>
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
                      <span className="material-symbols-outlined text-[18px]">add</span>
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
                      <span className="material-symbols-outlined text-gray-400 text-[14px]">
                        {post.status === 'published' ? 'public' :
                         post.status === 'scheduled' ? 'schedule' :
                         post.status === 'pending_review' ? 'rate_review' :
                         'edit_note'}
                      </span>
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

