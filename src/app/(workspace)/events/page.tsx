'use client'

import { useState } from 'react'
import Link from 'next/link'
import { EventStatsCards } from '@/components/events/EventStatsCards'
import { EventFilters } from '@/components/events/EventFilters'
import { ActiveEventsList } from '@/components/events/ActiveEventsList'
import { UpcomingEventsList } from '@/components/events/UpcomingEventsList'
import { CompletedEventsList } from '@/components/events/CompletedEventsList'
import type { Event } from '@/types'

export default function EventsPage() {
  const [filters, setFilters] = useState<{
    status?: Event['status']
    type?: Event['type']
    priority?: Event['priority']
  }>({})

  return (
    <div className="w-full max-w-[1024px] mx-auto flex flex-col gap-8 py-8 px-4 md:px-8">
      {/* Page Heading */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[#131b0d] tracking-tight">Events &amp; Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your team&apos;s initiatives and track progress.</p>
        </div>
        <Link
          href="/events/new"
          className="bg-primary hover:bg-[#5bc20e] text-[#131b0d] font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-colors shadow-primary/20"
        >
          <span className="material-symbols-outlined text-[20px]">add</span>
          New Event
        </Link>
      </div>

      {/* Stats Cards */}
      <EventStatsCards />

      {/* Filters */}
      <EventFilters onFilterChange={setFilters} />

      {/* Active Events Section */}
      <section>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold text-[#131b0d]">Active Events</h2>
        </div>
        <ActiveEventsList />
      </section>

      {/* Upcoming & Completed Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#131b0d]">Upcoming Events</h2>
            <Link href="/events?status=planning" className="text-primary text-sm font-bold hover:text-[#5bc20e]">
              Expand All
            </Link>
          </div>
          <UpcomingEventsList />
        </section>

        {/* Completed Events */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#131b0d]">Completed</h2>
            <Link
              href="/events?status=completed"
              className="text-gray-500 text-sm font-medium hover:text-[#131b0d] flex items-center gap-1"
            >
              View Archive
              <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
            </Link>
          </div>
          <CompletedEventsList />
        </section>
      </div>
    </div>
  )
}
