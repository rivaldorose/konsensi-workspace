'use client'

import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { useEvents } from '@/hooks/useEvents'

export function CompletedEventsList() {
  const { data: events, isLoading } = useEvents({ status: 'completed' })

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-1">
        <div className="p-4 animate-pulse">
          <div className="h-4 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  const completedEvents = events?.slice(0, 4) || []

  if (completedEvents.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-6 text-center">
        <p className="text-gray-500">No completed events.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-1">
      <table className="w-full text-left border-collapse">
        <tbody>
          {completedEvents.map((event, idx) => {
            const endDate = parseISO(event.end_date)
            return (
              <tr
                key={event.id}
                className={`group hover:bg-background-light transition-colors ${idx < completedEvents.length - 1 ? 'border-b border-[#ecf3e7]' : ''}`}
              >
                <td className="p-4">
                  <Link href={`/events/${event.id}`} className="flex items-center gap-3">
                    <div className="bg-green-100 text-green-700 rounded-full p-1">
                      <span className="material-symbols-outlined text-[16px] block">check</span>
                    </div>
                    <span className="font-bold text-[#131b0d] text-sm">{event.name}</span>
                  </Link>
                </td>
                <td className="p-4 text-right text-xs text-gray-500">
                  {format(endDate, 'MMM d, yyyy')}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

