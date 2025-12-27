'use client'

import { useEvents } from '@/hooks/useEvents'
import { EventCard } from './EventCard'

export function ActiveEventsList() {
  const { data: events, isLoading, error } = useEvents({ status: 'active' })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-6 animate-pulse">
            <div className="h-6 bg-gray-200 rounded mb-4 w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded mb-6"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl border border-red-200 p-6 text-center">
        <p className="text-red-600">Error loading events. Please try again.</p>
      </div>
    )
  }

  if (!events || events.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#ecf3e7] p-6 text-center">
        <p className="text-gray-500">No active events found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}

