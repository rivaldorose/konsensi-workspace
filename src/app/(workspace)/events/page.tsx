'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useEvents } from '@/hooks/useEvents'
import Link from 'next/link'
import { format } from 'date-fns'

export default function EventsPage() {
  const router = useRouter()
  const { data: events, isLoading } = useEvents()
  const [searchQuery, setSearchQuery] = useState('')

  // Helper function to determine event status based on dates
  const getEventStatus = (event: any) => {
    // If status is explicitly set to completed, keep it
    if (event.status === 'completed' || event.status === 'on_hold') {
      return event.status
    }
    
    const now = new Date()
    const startDate = new Date(event.start_date)
    const endDate = new Date(event.end_date)
    
    // If end date has passed, it's completed
    if (endDate < now) {
      return 'completed'
    }
    
    // If start date has passed but end date hasn't, it's active
    if (startDate <= now && endDate >= now) {
      return 'active'
    }
    
    // If start date is in the future, it's planning/upcoming
    return 'planning'
  }

  // Calculate stats with date-based status
  const activeEvents = events?.filter(e => getEventStatus(e) === 'active') || []
  const upcomingEvents = events?.filter(e => getEventStatus(e) === 'planning') || []
  const completedEvents = events?.filter(e => getEventStatus(e) === 'completed') || []
  const totalEvents = events?.length || 0

  // Filter events based on search
  const filteredActiveEvents = activeEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter upcoming events
  const filteredUpcomingEvents = upcomingEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filter completed events
  const filteredCompletedEvents = completedEvents.filter(event =>
    event.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <main className="flex-1 py-8 px-4 md:px-8 flex justify-center">
        <div className="w-full max-w-[1024px] flex flex-col gap-8">
          <div className="animate-pulse">Loading events...</div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 py-8 px-4 md:px-8 flex justify-center">
      <div className="w-full max-w-[1024px] flex flex-col gap-8">
        {/* Page Heading */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#131b0d] tracking-tight">Events & Projects</h1>
            <p className="text-gray-500 text-sm mt-1">Manage your team's initiatives and track progress.</p>
          </div>
          <Link
            href="/events/new"
            className="bg-primary hover:bg-[#5bc20e] text-[#131b0d] font-bold py-2.5 px-5 rounded-lg flex items-center gap-2 shadow-sm transition-colors shadow-primary/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            New Event
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
              Active
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-[#131b0d]">{activeEvents.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
              Upcoming
              <svg className="w-5 h-5 text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-[#131b0d]">{upcomingEvents.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
              Completed
              <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-[#131b0d]">{completedEvents.length}</p>
          </div>
          <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
            <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
              Total Projects
              <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-[#131b0d]">{totalEvents}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 pb-2 border-b border-[#ecf3e7]">
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-[#ecf3e7] hover:border-gray-300 text-[#131b0d] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <span>Timeline: All</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-[#ecf3e7] hover:border-gray-300 text-[#131b0d] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <span>Type: All</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
          <div className="relative group">
            <button className="flex items-center gap-2 bg-white border border-[#ecf3e7] hover:border-gray-300 text-[#131b0d] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              <span>Status: All</span>
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </button>
          </div>
          <button className="ml-auto text-sm font-medium text-gray-500 hover:text-[#131b0d] flex items-center gap-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
            </svg>
            Clear Filters
          </button>
        </div>

        {/* Active Events Section */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-[#131b0d]">Active Events</h2>
          </div>
          <div className="flex flex-col gap-6">
            {filteredActiveEvents.length === 0 ? (
              <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-12 text-center">
                <p className="text-gray-500">No active events found</p>
              </div>
            ) : (
              filteredActiveEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            )}
          </div>
        </section>

        {/* Upcoming & Completed Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upcoming Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#131b0d]">Upcoming Events</h2>
              <button className="text-primary text-sm font-bold hover:text-[#5bc20e]">Expand All</button>
            </div>
            <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm divide-y divide-[#ecf3e7]">
              {filteredUpcomingEvents.length === 0 ? (
                <div className="p-8 text-center text-gray-500">No upcoming events</div>
              ) : (
                filteredUpcomingEvents.slice(0, 4).map((event) => (
                  <UpcomingEventItem key={event.id} event={event} />
                ))
              )}
            </div>
          </section>

          {/* Completed Events */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-[#131b0d]">Completed</h2>
              <a className="text-gray-500 text-sm font-medium hover:text-[#131b0d] flex items-center gap-1" href="#">
                View Archive
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" />
                </svg>
              </a>
            </div>
            <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-1">
              <table className="w-full text-left border-collapse">
                <tbody>
                  {filteredCompletedEvents.length === 0 ? (
                    <tr>
                      <td className="p-8 text-center text-gray-500">No completed events</td>
                    </tr>
                  ) : (
                    filteredCompletedEvents.slice(0, 4).map((event) => (
                      <CompletedEventRow key={event.id} event={event} />
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}

// Event Card Component
function EventCard({ event }: { event: any }) {
  const getBorderColor = () => {
    if (event.priority === 'critical' || event.priority === 'high') return 'bg-primary'
    if (event.priority === 'medium') return 'bg-yellow-400'
    return 'bg-gray-300'
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      launch: 'bg-blue-50 text-blue-700',
      partnership: 'bg-purple-50 text-purple-700',
      pilot: 'bg-green-50 text-green-700',
      funding: 'bg-orange-50 text-orange-700',
      campaign: 'bg-pink-50 text-pink-700',
    }
    return colors[type] || 'bg-gray-50 text-gray-700'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-50 text-red-700',
      high: 'bg-red-50 text-red-700',
      medium: 'bg-yellow-50 text-yellow-700',
      low: 'bg-gray-50 text-gray-700',
    }
    return colors[priority] || 'bg-gray-50 text-gray-700'
  }

  const getStatusText = () => {
    if (event.progress >= 80) return { text: 'On Track', color: 'text-green-600' }
    if (event.progress >= 50) return { text: 'At Risk', color: 'text-yellow-500' }
    return { text: 'Behind', color: 'text-red-500' }
  }

  const statusInfo = getStatusText()
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const daysRemaining = Math.ceil((endDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))

  return (
    <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
      <div className={`absolute top-0 left-0 w-1 h-full ${getBorderColor()}`}></div>
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`${getTypeColor(event.type)} text-xs font-bold px-2.5 py-1 rounded-md capitalize`}>
              {event.type}
            </span>
            <span className={`${getPriorityColor(event.priority)} text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1`}>
              {event.priority === 'critical' || event.priority === 'high' ? (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              ) : (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              )}
              {event.priority === 'critical' || event.priority === 'high' ? 'High Priority' : event.priority === 'medium' ? 'Medium Priority' : 'Low Priority'}
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#131b0d]">{event.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{event.description}</p>
        </div>
        <button className="text-gray-400 hover:text-[#131b0d]">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Owner & Team */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Team</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {/* Team member avatars - simplified for now */}
              <div className="size-8 rounded-full ring-2 ring-white bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                {event.owner?.full_name?.charAt(0) || 'U'}
              </div>
            </div>
            <div className="text-sm">
              <span className="text-gray-400 text-xs block">Owner</span>
              <span className="font-medium">{event.owner?.full_name || 'Unknown'}</span>
            </div>
          </div>
        </div>
        {/* Timeline */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Timeline</p>
          <div className="flex items-center gap-2 text-sm font-medium text-[#131b0d]">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </div>
          <div className={`text-xs font-medium mt-1 flex items-center gap-1 ${daysRemaining > 14 ? 'text-green-600' : daysRemaining > 0 ? 'text-orange-600' : 'text-red-600'}`}>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
            </svg>
            {daysRemaining > 0 ? `${daysRemaining} days remaining` : 'Overdue'}
          </div>
        </div>
        {/* Stats */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Stats</p>
          <div className="flex items-center gap-4">
            <div>
              <span className="block text-lg font-bold">{event.progress || 0}%</span>
              <span className="text-xs text-gray-500">Progress</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <span className={`block text-lg font-bold ${statusInfo.color}`}>{statusInfo.text}</span>
              <span className="text-xs text-gray-500">Status</span>
            </div>
          </div>
        </div>
      </div>
      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-[#131b0d]">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{event.progress || 0}%</span>
        </div>
        <div className="w-full bg-[#ecf3e7] rounded-full h-2.5">
          <div className={`${getBorderColor()} h-2.5 rounded-full`} style={{ width: `${event.progress || 0}%` }}></div>
        </div>
        {event.end_date && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 bg-background-light p-2 rounded-md border border-dashed border-gray-300">
            <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
            </svg>
            <span><strong>Next Milestone:</strong> Project Completion (Due {format(endDate, 'MMM d')})</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-3 pt-4 border-t border-[#ecf3e7]">
        <Link
          href={`/events/${event.id}`}
          className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-gray-200 text-sm font-bold text-[#131b0d] hover:bg-gray-50 transition-colors"
        >
          View Details
        </Link>
        <button className="flex-1 md:flex-none py-2 px-4 rounded-lg bg-[#ecf3e7] text-[#131b0d] text-sm font-bold hover:bg-[#dcebd3] transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Update Status
        </button>
        <button className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          Add Milestone
        </button>
      </div>
    </div>
  )
}

// Upcoming Event Item Component
function UpcomingEventItem({ event }: { event: any }) {
  const router = useRouter()
  const startDate = new Date(event.start_date)
  const month = format(startDate, 'MMM')
  const day = format(startDate, 'dd')

  return (
    <div 
      className="p-4 flex items-center justify-between hover:bg-background-light transition-colors cursor-pointer group"
      onClick={() => router.push(`/events/${event.id}`)}
    >
      <div className="flex items-center gap-4">
        <div className="bg-gray-100 rounded-lg p-2 text-center min-w-[50px]">
          <span className="block text-xs font-bold text-gray-500 uppercase">{month}</span>
          <span className="block text-lg font-bold text-[#131b0d]">{day}</span>
        </div>
        <div>
          <h4 className="font-bold text-[#131b0d] group-hover:text-primary transition-colors">{event.name}</h4>
          <span className="text-xs text-gray-500 capitalize">{event.type} • Lead: {event.owner?.full_name || 'Unknown'}</span>
        </div>
      </div>
      <svg className="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
      </svg>
    </div>
  )
}

// Completed Event Row Component
function CompletedEventRow({ event }: { event: any }) {
  const router = useRouter()
  const completedDate = new Date(event.end_date || event.updated_at || event.created_at)

  return (
    <tr 
      className="group hover:bg-background-light transition-colors border-b border-[#ecf3e7] last:border-0 cursor-pointer"
      onClick={() => router.push(`/events/${event.id}`)}
    >
      <td className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-green-100 text-green-700 rounded-full p-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
            </svg>
          </div>
          <span className="font-bold text-[#131b0d] text-sm">{event.name}</span>
        </div>
      </td>
      <td className="p-4 text-right text-xs text-gray-500">{format(completedDate, 'MMM d, yyyy')}</td>
    </tr>
  )
}
