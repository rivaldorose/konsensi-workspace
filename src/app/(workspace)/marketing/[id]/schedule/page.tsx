'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMarketingPost, useUpdateMarketingPost } from '@/hooks/useMarketing'
import { startOfMonth, endOfMonth, getDaysInMonth, format, addMonths, subMonths, getDay, isSameDay, startOfWeek } from 'date-fns'

export default function ScheduleMarketingPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const { data: post, isLoading } = useMarketingPost(postId)
  const updatePost = useUpdateMarketingPost()

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState('09:00')
  const [timezone, setTimezone] = useState('(GMT+07:00) Jakarta')
  const [repeatOption, setRepeatOption] = useState<'one-time' | 'daily' | 'weekly' | 'monthly'>('one-time')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (post?.scheduled_date && post?.scheduled_time) {
      const date = new Date(`${post.scheduled_date}T${post.scheduled_time}`)
      setSelectedDate(date)
      setSelectedTime(post.scheduled_time)
      setCurrentMonth(date)
    } else {
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      setSelectedDate(tomorrow)
    }
  }, [post])

  const handleClose = () => {
    router.back()
  }

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1))
  }

  const handleDayClick = (day: number) => {
    if (day === 0) return // Disabled day
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    setSelectedDate(newDate)
  }

  const handleSchedule = async () => {
    if (!post || !selectedDate) return

    setIsSubmitting(true)

    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd')
      await updatePost.mutateAsync({
        id: post.id,
        scheduled_date: dateStr,
        scheduled_time: selectedTime,
        status: 'scheduled',
      })
      router.back()
    } catch (error) {
      console.error('Error scheduling post:', error)
      alert('Failed to schedule post. Please try again.')
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-[900px] bg-white dark:bg-[#222e18] rounded-xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
        <div className="w-full max-w-[900px] bg-white dark:bg-[#222e18] rounded-xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Post not found</p>
          <button onClick={handleClose} className="mt-4 px-4 py-2 bg-primary text-white rounded-lg">
            Go Back
          </button>
        </div>
      </div>
    )
  }

  // Generate calendar days
  const monthStart = startOfMonth(currentMonth)
  const monthEnd = endOfMonth(currentMonth)
  const daysInMonth = getDaysInMonth(currentMonth)
  const startDay = getDay(monthStart)

  const calendarDays: (number | null)[] = []
  // Add empty cells for days before month start
  for (let i = 0; i < startDay; i++) {
    calendarDays.push(null)
  }
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const isSelectedDay = (day: number | null) => {
    if (!selectedDate || !day) return false
    return isSameDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), selectedDate)
  }

  const isToday = (day: number | null) => {
    if (!day) return false
    return isSameDay(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day), new Date())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      {/* Modal Container */}
      <div className="w-full max-w-[900px] bg-white dark:bg-[#222e18] rounded-xl shadow-2xl flex flex-col max-h-[95vh] border border-[#dae7cf] dark:border-[#3a4d2c]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#dae7cf] dark:border-[#3a4d2c]">
          <h3 className="text-[#131b0d] dark:text-white text-xl font-bold leading-tight">Schedule Post</h3>
          <button
            onClick={handleClose}
            className="text-[#6e9a4c] hover:text-[#131b0d] dark:text-gray-400 dark:hover:text-white transition-colors rounded-full p-1 hover:bg-[#ecf3e7] dark:hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto px-6 py-6 scrollbar-hide">
          {/* Section: Post Preview */}
          <div className="mb-8">
            <p className="text-sm font-semibold text-[#6e9a4c] mb-3 uppercase tracking-wider">Post Preview</p>
            <div className="bg-gray-50 dark:bg-gray-900/30 border border-[#dae7cf] dark:border-[#3a4d2c] rounded-xl p-4 flex gap-5 items-start">
              {/* Preview Image */}
              {post.media_url && (
                <div
                  className="w-24 h-24 sm:w-32 sm:h-24 shrink-0 bg-center bg-cover bg-no-repeat rounded-lg"
                  style={{ backgroundImage: `url(${post.media_url})` }}
                />
              )}
              {/* Preview Content */}
              <div className="flex-1 min-w-0">
                <div className="flex gap-2 mb-2">
                  {post.platforms?.map((platform) => (
                    <div
                      key={platform}
                      className="flex h-6 items-center justify-center gap-x-1.5 rounded-full bg-[#ecf3e7] dark:bg-[#5abd0f]/20 pl-2 pr-3 border border-[#dae7cf] dark:border-[#5abd0f]/30"
                    >
                      <p className="text-[#131b0d] dark:text-white text-xs font-semibold leading-normal capitalize">
                        {platform}
                      </p>
                    </div>
                  ))}
                </div>
                <h4 className="text-[#131b0d] dark:text-white text-base font-bold leading-tight truncate mb-1">
                  {post.title || 'Untitled Post'}
                </h4>
                <p className="text-[#6e9a4c] dark:text-gray-400 text-sm font-normal leading-relaxed line-clamp-2">
                  {post.caption || 'No caption'}
                </p>
              </div>
            </div>
          </div>

          {/* Section: Scheduling Controls */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Calendar */}
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-[#6e9a4c] mb-3 uppercase tracking-wider">Select Date</p>
              <div className="bg-gray-50 dark:bg-gray-900/30 border border-[#dae7cf] dark:border-[#3a4d2c] rounded-xl p-4">
                <div className="flex flex-col gap-0.5 w-full">
                  <div className="flex items-center p-1 justify-between mb-2">
                    <button
                      onClick={handlePreviousMonth}
                      className="p-1 hover:bg-[#ecf3e7] dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-[#131b0d] dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        />
                      </svg>
                    </button>
                    <p className="text-[#131b0d] dark:text-white text-base font-bold leading-tight flex-1 text-center">
                      {format(currentMonth, 'MMMM yyyy')}
                    </p>
                    <button
                      onClick={handleNextMonth}
                      className="p-1 hover:bg-[#ecf3e7] dark:hover:bg-white/10 rounded-full transition-colors"
                    >
                      <svg className="w-5 h-5 text-[#131b0d] dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-y-1">
                    {/* Day headers */}
                    {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day) => (
                      <p
                        key={day}
                        className="text-[#6e9a4c] dark:text-gray-400 text-xs font-bold uppercase text-center pb-2"
                      >
                        {day}
                      </p>
                    ))}

                    {/* Calendar days */}
                    {calendarDays.map((day, index) => {
                      if (day === null) {
                        return (
                          <button
                            key={`empty-${index}`}
                            disabled
                            className="h-10 w-full text-gray-400 dark:text-gray-600 text-sm font-medium cursor-default"
                          >
                            <div className="flex size-full items-center justify-center rounded-full"></div>
                          </button>
                        )
                      }

                      const selected = isSelectedDay(day)
                      const today = isToday(day)

                      return (
                        <button
                          key={day}
                          onClick={() => handleDayClick(day)}
                          className={`h-10 w-full text-sm font-medium rounded-full relative group ${
                            selected
                              ? 'text-white'
                              : today
                                ? 'text-[#131b0d] dark:text-white'
                                : 'text-[#131b0d] dark:text-white hover:bg-[#ecf3e7] dark:hover:bg-white/10'
                          }`}
                        >
                          {selected && (
                            <div className="absolute inset-0 bg-primary rounded-full shadow-md shadow-primary/30"></div>
                          )}
                          <div className="relative flex size-full items-center justify-center rounded-full">{day}</div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Time & Settings */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Time & Timezone */}
              <div className="flex flex-col gap-5">
                <p className="text-sm font-semibold text-[#6e9a4c] uppercase tracking-wider">Time Settings</p>

                <label className="flex flex-col">
                  <span className="text-[#131b0d] dark:text-gray-300 text-sm font-medium leading-normal pb-1.5">
                    Time
                  </span>
                  <div className="relative">
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dae7cf] dark:border-[#3a4d2c] bg-[#fafcf8] dark:bg-gray-900/30 focus:border-primary h-12 px-4 text-base font-normal leading-normal"
                    />
                  </div>
                </label>

                <label className="flex flex-col">
                  <span className="text-[#131b0d] dark:text-gray-300 text-sm font-medium leading-normal pb-1.5">
                    Timezone
                  </span>
                  <div className="relative">
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/20 border border-[#dae7cf] dark:border-[#3a4d2c] bg-[#fafcf8] dark:bg-gray-900/30 focus:border-primary h-12 px-4 pr-10 text-base font-normal leading-normal appearance-none"
                    >
                      <option>(GMT+07:00) Jakarta</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT-05:00) New York</option>
                    </select>
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e9a4c]">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        />
                      </svg>
                    </span>
                  </div>
                </label>
              </div>

              {/* Repeat Options */}
              <div className="flex flex-col gap-3 mt-2">
                <p className="text-sm font-semibold text-[#6e9a4c] uppercase tracking-wider">Repeat Options</p>
                <div className="flex flex-col gap-2">
                  <label
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors relative ${
                      repeatOption === 'one-time'
                        ? 'border-primary bg-primary/5'
                        : 'border-[#dae7cf] dark:border-[#3a4d2c] hover:bg-[#ecf3e7] dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <input
                        type="radio"
                        name="repeat"
                        value="one-time"
                        checked={repeatOption === 'one-time'}
                        onChange={() => setRepeatOption('one-time')}
                        className="w-4 h-4 text-primary focus:ring-primary/50 border-gray-300 bg-transparent"
                      />
                    </div>
                    <span className="text-[#131b0d] dark:text-white text-sm font-medium">One-time</span>
                    {repeatOption === 'one-time' && (
                      <span className="absolute right-3">
                        <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                          />
                        </svg>
                      </span>
                    )}
                  </label>

                  {(['daily', 'weekly', 'monthly'] as const).map((option) => (
                    <label
                      key={option}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        repeatOption === option
                          ? 'border-primary bg-primary/5'
                          : 'border-[#dae7cf] dark:border-[#3a4d2c] hover:bg-[#ecf3e7] dark:hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-center">
                        <input
                          type="radio"
                          name="repeat"
                          value={option}
                          checked={repeatOption === option}
                          onChange={() => setRepeatOption(option)}
                          className="w-4 h-4 text-primary focus:ring-primary/50 border-gray-300 bg-transparent"
                        />
                      </div>
                      <span className="text-[#131b0d] dark:text-white text-sm font-medium capitalize">{option}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-[#dae7cf] dark:border-[#3a4d2c] bg-[#fafcf8] dark:bg-[#222e18] rounded-b-xl">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg text-[#131b0d] dark:text-gray-300 text-sm font-bold hover:bg-[#ecf3e7] dark:hover:bg-white/10 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSchedule}
            disabled={isSubmitting || !selectedDate || updatePost.isPending}
            className="px-6 py-2.5 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-bold shadow-lg shadow-primary/30 transition-all transform active:scale-95 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
            Schedule Post
          </button>
        </div>
      </div>
    </div>
  )
}

