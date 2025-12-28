'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'
import { useApps } from '@/hooks/useApps'
import { usePartners } from '@/hooks/usePartners'
import { useEvents } from '@/hooks/useEvents'
import { useGoals } from '@/hooks/useGoals'
import { format } from 'date-fns'
import Link from 'next/link'
import { Card } from '@/components/ui/card'

async function fetchUserProfile() {
  const supabase = createClient()
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return null
  }

  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, full_name, email, avatar_url')
    .eq('id', user.id)
    .single()

  if (profileError) {
    console.error('Error fetching user profile:', profileError)
    return { id: user.id, full_name: user.email || 'User', email: user.email || 'N/A' }
  }

  return profile
}

export default function DashboardPage() {
  const { data: userProfile } = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 5 * 60 * 1000,
  })

  const { data: apps = [], isLoading: appsLoading } = useApps()
  const { data: partners = [], isLoading: partnersLoading } = usePartners()
  const { data: events = [], isLoading: eventsLoading } = useEvents()
  const { data: goals = [], isLoading: goalsLoading } = useGoals()

  // Calculate stats
  const activeApps = apps.filter(app => app.status === 'live' || app.status === 'beta').length
  const activePartners = partners.filter(p => p.status === 'active').length
  const activeGoals = goals.filter(g => g.status === 'on_track' || g.status === 'completed')
  const goalsProgress = goals.length > 0 
    ? Math.round((activeGoals.length / goals.length) * 100)
    : 0

  // Get upcoming event
  const now = new Date()
  const upcomingEvents = events
    .filter(e => {
      const eventDate = new Date(e.start_date)
      return eventDate >= now && e.status === 'planning' || e.status === 'active'
    })
    .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
  const nextEvent = upcomingEvents[0]

  // Get current quarter
  const currentMonth = now.getMonth() + 1
  const currentQuarter = `Q${Math.ceil(currentMonth / 3)}`

  // Get user first name
  const firstName = userProfile?.full_name?.split(' ')[0] || 'User'

  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Welcome Section */}
      <section className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-secondary tracking-tight">
            Hey, {firstName}! 👋
          </h2>
          <p className="text-text-muted mt-2 font-medium">
            Here&apos;s what&apos;s happening in your workspace today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center h-10 px-4 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 transition-colors text-text-main font-bold text-sm">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
            </svg>
            <span>{format(new Date(), 'MMM d, yyyy')}</span>
          </button>
          <Link
            href="/notifications"
            className="flex items-center justify-center size-10 bg-white border border-gray-200 shadow-sm rounded-lg hover:bg-gray-50 transition-colors relative"
          >
            <svg className="w-5 h-5 text-text-main" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
            </svg>
            <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full"></span>
          </Link>
        </div>
      </section>

      {/* Stats Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Apps Overview */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wide">Apps Overview</p>
            <Link href="/apps" className="block">
              <h3 className="text-2xl font-extrabold text-secondary mt-1 hover:text-primary transition-colors">
                {appsLoading ? '...' : `${activeApps} Active`}
              </h3>
            </Link>
          </div>
        </Card>

        {/* Team Status - Simplified for now */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-primary/20 text-secondary-light rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.076 13.308-5.076 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.24 0 1 1 0 01-1.415-1.415 5 5 0 017.07 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
              </svg>
            </div>
          </div>
          <div>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wide mb-2">Team</p>
            <p className="text-lg font-bold text-secondary">Workspace</p>
          </div>
        </Card>

        {/* Partners */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
            </div>
            <Link href="/partners" className="text-xs font-bold text-primary-dark hover:text-secondary hover:underline">View</Link>
          </div>
          <div>
            <p className="text-text-muted text-sm font-semibold uppercase tracking-wide">Partners</p>
            <Link href="/partners" className="block">
              <div className="flex items-baseline gap-2 mt-1">
                <h3 className="text-2xl font-extrabold text-secondary hover:text-primary transition-colors">
                  {partnersLoading ? '...' : activePartners}
                </h3>
                <p className="text-xs text-text-muted font-medium">Active</p>
              </div>
            </Link>
          </div>
        </Card>

        {/* Goals Progress */}
        <Card className="bg-card-light rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between h-full group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
              </svg>
            </div>
            <span className="text-xs font-bold text-gray-500">{currentQuarter}</span>
          </div>
          <div>
            <div className="flex justify-between items-end mb-1">
              <p className="text-text-muted text-sm font-semibold uppercase tracking-wide">Goals Progress</p>
              <Link href="/roadmap">
                <span className="text-sm font-bold text-secondary hover:text-primary transition-colors">
                  {goalsLoading ? '...' : `${goalsProgress}%`}
                </span>
              </Link>
            </div>
            <Link href="/roadmap" className="block">
              <div className="w-full bg-gray-100 rounded-full h-2 cursor-pointer hover:opacity-80 transition-opacity">
                <div 
                  className="bg-primary h-2 rounded-full transition-all" 
                  style={{ width: `${goalsProgress}%` }}
                ></div>
              </div>
            </Link>
          </div>
        </Card>
      </section>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Recent Items */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Recent Apps */}
          <Card className="bg-card-light rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                </svg>
                Recent Apps
              </h3>
              <Link href="/apps" className="text-sm font-semibold text-primary-dark hover:text-secondary transition-colors">View All</Link>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {appsLoading ? (
                <div className="text-center py-8 text-gray-400">Loading apps...</div>
              ) : apps.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No apps yet</p>
                  <Link href="/apps/new" className="text-primary hover:underline font-medium">
                    Create your first app
                  </Link>
                </div>
              ) : (
                apps.slice(0, 3).map((app) => (
                  <Link
                    key={app.id}
                    href={`/apps/${app.id}`}
                    className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-primary/30 cursor-pointer transition-all group shadow-sm"
                  >
                    <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center text-2xl">
                      {app.icon || '📱'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-base font-bold text-secondary group-hover:text-primary transition-colors truncate">
                        {app.name}
                      </h4>
                      <p className="text-sm text-text-muted truncate">{app.category}</p>
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))
              )}
            </div>
          </Card>

          {/* Recent Events */}
          <Card className="bg-card-light rounded-xl shadow-sm border border-gray-100 flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                </svg>
                Upcoming Events
              </h3>
              <Link href="/events" className="text-sm font-semibold text-primary-dark hover:text-secondary transition-colors">View All</Link>
            </div>
            <div className="p-6 flex flex-col gap-4">
              {eventsLoading ? (
                <div className="text-center py-8 text-gray-400">Loading events...</div>
              ) : events.filter(e => {
                const eventDate = new Date(e.start_date)
                return eventDate >= now && (e.status === 'planning' || e.status === 'active')
              }).length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 mb-4">No upcoming events</p>
                  <Link href="/events/new" className="text-primary hover:underline font-medium">
                    Create an event
                  </Link>
                </div>
              ) : (
                events
                  .filter(e => {
                    const eventDate = new Date(e.start_date)
                    return eventDate >= now && (e.status === 'planning' || e.status === 'active')
                  })
                  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
                  .slice(0, 3)
                  .map((event) => (
                    <Link
                      key={event.id}
                      href={`/events/${event.id}`}
                      className="flex items-center gap-4 p-4 rounded-xl border border-gray-100 hover:bg-gray-50 hover:border-primary/30 cursor-pointer transition-all group shadow-sm"
                    >
                      <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <svg className="w-6 h-6 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-base font-bold text-secondary group-hover:text-primary transition-colors truncate">
                          {event.name}
                        </h4>
                        <p className="text-sm text-text-muted">
                          {format(new Date(event.start_date), 'MMM d, yyyy')}
                        </p>
                      </div>
                      <svg className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Recent Activity & Upcoming */}
        <section className="lg:col-span-1 flex flex-col gap-6">
          {/* Recent Goals */}
          <Card className="bg-card-light rounded-xl shadow-sm border border-gray-100 flex flex-col h-full">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-base font-bold text-secondary flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
                </svg>
                Recent Goals
              </h3>
              <Link href="/roadmap" className="text-xs font-semibold text-gray-400 hover:text-secondary transition-colors">View all</Link>
            </div>
            <div className="p-5 flex-1">
              {goalsLoading ? (
                <div className="text-center py-8 text-gray-400 text-sm">Loading goals...</div>
              ) : goals.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400 text-sm mb-2">No goals yet</p>
                  <Link href="/roadmap/new" className="text-primary hover:underline text-sm font-medium">
                    Create a goal
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {goals.slice(0, 3).map((goal) => (
                    <Link
                      key={goal.id}
                      href={`/roadmap/${goal.id}/edit`}
                      className="block p-3 rounded-lg border border-gray-100 hover:bg-gray-50 hover:border-primary/30 transition-all group"
                    >
                      <p className="text-sm font-bold text-secondary group-hover:text-primary transition-colors mb-1">
                        {goal.title}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span className="capitalize">{goal.status.replace('_', ' ')}</span>
                        <span>•</span>
                        <span>{format(new Date(goal.target_date), 'MMM d')}</span>
                      </div>
                      <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                        <div
                          className="bg-primary h-1.5 rounded-full"
                          style={{ width: `${goal.progress || 0}%` }}
                        ></div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            <div className="mt-auto border-t border-gray-100 p-5 bg-gray-50 rounded-b-xl">
              <p className="text-xs font-bold text-text-muted uppercase mb-3">Quick Actions</p>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/events/new" className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all text-secondary">
                  <svg className="w-6 h-6 mb-1 text-primary-dark" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                  <span className="text-[10px] font-bold">New Event</span>
                </Link>
                <Link href="/apps/new" className="flex flex-col items-center justify-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-sm transition-all text-secondary">
                  <svg className="w-6 h-6 mb-1 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <span className="text-[10px] font-bold">New App</span>
                </Link>
              </div>
            </div>
          </Card>

          {/* Upcoming Event */}
          {nextEvent && (
            <div className="bg-secondary rounded-xl p-5 shadow-sm text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
                <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z"></path>
                </svg>
              </div>
              <p className="text-xs font-bold text-primary mb-1 uppercase tracking-wider">Upcoming</p>
              <Link href={`/events/${nextEvent.id}`}>
                <h4 className="text-lg font-bold mb-3 hover:text-primary transition-colors">{nextEvent.name}</h4>
              </Link>
              <div className="flex items-center gap-2 text-sm text-gray-300 mb-4">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                </svg>
                <span>{format(new Date(nextEvent.start_date), 'EEEE, MMM d, h:mm a')}</span>
              </div>
              <Link 
                href={`/events/${nextEvent.id}`}
                className="block w-full py-2 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold transition-colors text-center"
              >
                View Event
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
