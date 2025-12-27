'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { useEvents } from '@/hooks/useEvents'

export function UpcomingEventsList() {
  const { data: events, isLoading } = useEvents({ status: 'planning' })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm divide-y divide-[#ecf3e7]">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        ))}
      </div>
    )
  }

  const upcomingEvents = events?.slice(0, 4) || []

  if (upcomingEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-6 text-center">
        <p className="text-gray-500">No upcoming events.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm divide-y divide-[#ecf3e7]">
      {upcomingEvents.map((event) => {
        const startDate = parseISO(event.start_date)
        return (
          <Link
            key={event.id}
            href={`/events/${event.id}`}
            className="p-4 flex items-center justify-between hover:bg-background-light transition-colors cursor-pointer group block"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 rounded-lg p-2 text-center min-w-[50px]">
                <span className="block text-xs font-bold text-gray-500 uppercase">
                  {format(startDate, 'MMM')}
                </span>
                <span className="block text-lg font-bold text-[#131b0d]">
                  {format(startDate, 'd')}
                </span>
              </div>
              <div>
                <h4 className="font-bold text-[#131b0d] group-hover:text-primary transition-colors">
                  {event.name}
                </h4>
                <span className="text-xs text-gray-500">
                  {event.type.charAt(0).toUpperCase() + event.type.slice(1)} • Lead: {event.owner?.full_name || 'Unknown'}
                </span>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-300">expand_more</span>
          </Link>
        )
      })}
    </div>
  )
}

