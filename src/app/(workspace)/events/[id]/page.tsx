'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useEvent } from '@/hooks/useEvents'
import { format, differenceInDays } from 'date-fns'

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: event, isLoading } = useEvent(params.id)
  const [activeTab, setActiveTab] = useState('overview')

  if (isLoading) {
    return (
      <main className="flex-1 py-8 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <div className="animate-pulse">Loading event...</div>
        </div>
      </main>
    )
  }

  if (!event) {
    return (
      <main className="flex-1 py-8 px-4 md:px-8">
        <div className="max-w-[1280px] mx-auto">
          <p>Event not found</p>
          <Link href="/events" className="text-primary">Back to Events</Link>
        </div>
      </main>
    )
  }

  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const daysRemaining = differenceInDays(endDate, new Date())

  return (
    <main className="flex-1 py-8 px-4 md:px-8">
      <div className="max-w-[1280px] mx-auto w-full px-6 lg:px-10 py-5">
        {/* Breadcrumbs */}
        <div className="flex flex-wrap gap-2 pb-4 pt-2">
          <Link
            href="/events"
            className="text-[#6e9a4c] hover:text-primary transition-colors text-sm font-medium leading-normal flex items-center gap-1"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
            </svg>
            Back to Events
          </Link>
        </div>

        {/* Page Heading */}
        <div className="flex flex-wrap justify-between gap-3 pb-6 border-b border-[#ecf3e7] dark:border-white/10 items-end">
          <div className="flex min-w-72 flex-col gap-2">
            <p className="text-[#131b0d] dark:text-white text-4xl font-black leading-tight tracking-[-0.033em]">{event.name}</p>
            <div className="flex items-center gap-3">
              <span className="bg-[#ecf3e7] dark:bg-white/10 text-[#6e9a4c] dark:text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide capitalize">
                {event.type}
              </span>
              <p className="text-[#6e9a4c] dark:text-gray-400 text-base font-normal leading-normal capitalize">
                {event.priority} Priority • Started {format(startDate, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-white border border-[#dae7cf] hover:bg-gray-50 text-[#131b0d] text-sm font-bold shadow-sm transition-colors">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 2a1 1 0 000 2h2a1 1 0 100-2H8z" />
                <path d="M3 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v6h-4.586l1.293-1.293a1 1 0 00-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L10.414 13H15v3a2 2 0 01-2 2H5a2 2 0 01-2-2V5zM15 11h2a1 1 0 110 2h-2v-2z" />
              </svg>
              Duplicate
            </button>
            <Link
              href={`/events/${event.id}/edit`}
              className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-4 bg-primary hover:bg-green-600 text-white text-sm font-bold shadow-sm transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Edit Event
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="pb-6 pt-2">
          <div className="flex border-b border-[#dae7cf] dark:border-white/10 gap-8 overflow-x-auto">
            {['overview', 'timeline', 'team', 'budget', 'docs', 'updates'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex flex-col items-center justify-center border-b-[3px] pb-[13px] pt-4 min-w-fit px-2 capitalize ${
                  activeTab === tab
                    ? 'border-b-primary text-[#131b0d] dark:text-white'
                    : 'border-b-transparent text-[#6e9a4c] dark:text-gray-400 hover:text-primary transition-colors'
                }`}
              >
                <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-20">
            {/* Left Column (8 cols) */}
            <div className="lg:col-span-8 flex flex-col gap-6">
              {/* Quick Stats & Details Combined */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Details Card */}
                <div className="bg-white dark:bg-[#1e2a16] p-5 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm md:col-span-1">
                  <div className="flex items-center gap-2 mb-4">
                    <svg className="w-5 h-5 text-[#6e9a4c]" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" />
                    </svg>
                    <h3 className="text-[#131b0d] dark:text-white font-bold text-base">Event Details</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-xs text-[#6e9a4c] dark:text-gray-400 font-medium">Status</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="size-2 rounded-full bg-primary animate-pulse"></span>
                        <span className="text-sm font-bold capitalize">{event.status === 'active' ? 'In Progress' : event.status}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6e9a4c] dark:text-gray-400 font-medium">Owner</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="size-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                          {event.owner?.full_name?.charAt(0) || 'U'}
                        </div>
                        <span className="text-sm font-bold">{event.owner?.full_name || 'Unknown'}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-[#6e9a4c] dark:text-gray-400 font-medium">Timeline</p>
                      <span className="text-sm font-bold">
                        {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Quick Stats Card */}
                <div className="bg-white dark:bg-[#1e2a16] p-5 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm md:col-span-2">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <svg className="w-5 h-5 text-[#6e9a4c]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                      </svg>
                      <h3 className="text-[#131b0d] dark:text-white font-bold text-base">Quick Stats</h3>
                    </div>
                    <div className="flex items-center gap-1 bg-[#ecf3e7] dark:bg-white/10 px-2 py-1 rounded text-xs font-bold text-primary">
                      <span className="size-2 rounded-full bg-primary"></span>
                      Healthy
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-[#6e9a4c] dark:text-gray-400">Progress</p>
                      <p className="text-2xl font-black text-[#131b0d] dark:text-white">{event.progress || 0}%</p>
                      <div className="w-full bg-[#ecf3e7] h-1.5 rounded-full mt-1">
                        <div className="bg-primary h-1.5 rounded-full" style={{ width: `${event.progress || 0}%` }}></div>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <p className="text-xs text-[#6e9a4c] dark:text-gray-400">Days Left</p>
                      <p className="text-2xl font-black text-[#131b0d] dark:text-white">{daysRemaining > 0 ? daysRemaining : 0}</p>
                      <p className="text-[10px] text-gray-400">Ends {format(endDate, 'MMM d')}</p>
                    </div>
                    {event.budget_total && (
                      <>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-[#6e9a4c] dark:text-gray-400">Budget</p>
                          <p className="text-2xl font-black text-[#131b0d] dark:text-white">
                            ${((event.budget_total || 0) / 1000).toFixed(0)}k
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          <p className="text-xs text-[#6e9a4c] dark:text-gray-400">Spent</p>
                          <p className="text-2xl font-black text-[#131b0d] dark:text-white">
                            ${((event.budget_spent || 0) / 1000).toFixed(0)}k
                          </p>
                          <p className="text-[10px] text-primary flex items-center">
                            <svg className="w-2.5 h-2.5 mr-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                            </svg>
                            {event.budget_total ? Math.round(((event.budget_spent || 0) / event.budget_total) * 100) : 0}%
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="bg-white dark:bg-[#1e2a16] p-6 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm">
                <h3 className="text-[#131b0d] dark:text-white font-bold text-lg mb-3">Description</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {event.description || 'No description provided.'}
                </p>
                {event.success_criteria && event.success_criteria.length > 0 && (
                  <div className="bg-[#fafcf8] dark:bg-white/5 p-4 rounded-lg border border-[#ecf3e7] dark:border-white/5">
                    <p className="text-xs font-bold uppercase text-[#6e9a4c] mb-2 tracking-wide">Success Criteria</p>
                    <ul className="list-disc list-inside text-sm text-[#131b0d] dark:text-white space-y-1">
                      {event.success_criteria.map((criterion, index) => (
                        <li key={index}>{criterion}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Milestones & Timeline */}
              <div className="bg-white dark:bg-[#1e2a16] p-6 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#131b0d] dark:text-white font-bold text-lg">Milestones & Timeline</h3>
                  <button className="text-primary text-sm font-bold hover:underline">View Full Timeline</button>
                </div>
                <div className="space-y-4">
                  {/* Simplified milestones - would need milestone data structure */}
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-center gap-1 min-w-[50px]">
                      <span className="text-xs font-bold text-gray-400">{format(startDate, 'MMM').toUpperCase()}</span>
                      <span className="text-lg font-black text-[#131b0d] dark:text-white">{format(startDate, 'd')}</span>
                    </div>
                    <div className="flex-1 p-3 bg-[#f7f8f6] dark:bg-white/5 rounded-lg border-l-4 border-primary flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-[#131b0d] dark:text-white">Project Start</p>
                        <p className="text-xs text-gray-500">Event initiated</p>
                      </div>
                      <span className="px-2 py-1 bg-primary/20 text-primary text-xs font-bold rounded">Started</span>
                    </div>
                  </div>
                  {daysRemaining > 0 && (
                    <div className="flex items-center gap-4">
                      <div className="flex flex-col items-center gap-1 min-w-[50px]">
                        <span className="text-xs font-bold text-gray-400">{format(endDate, 'MMM').toUpperCase()}</span>
                        <span className="text-lg font-black text-[#131b0d] dark:text-white">{format(endDate, 'd')}</span>
                      </div>
                      <div className="flex-1 p-3 bg-[#f7f8f6] dark:bg-white/5 rounded-lg border-l-4 border-yellow-400 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold text-[#131b0d] dark:text-white">Project Completion</p>
                          <p className="text-xs text-gray-500">Target end date</p>
                        </div>
                        <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded">
                          {daysRemaining} days left
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Updates Section */}
              <div className="bg-white dark:bg-[#1e2a16] p-6 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-[#131b0d] dark:text-white font-bold text-lg">Recent Updates</h3>
                  <button className="bg-[#ecf3e7] hover:bg-[#dce9d5] dark:bg-white/10 dark:hover:bg-white/20 text-[#131b0d] dark:text-white text-xs font-bold px-3 py-1.5 rounded transition-colors">
                    + Add Update
                  </button>
                </div>
                <div className="space-y-6 relative before:absolute before:left-[19px] before:top-2 before:bottom-4 before:w-[2px] before:bg-gray-100 dark:before:bg-white/10">
                  {/* Placeholder for updates - would need updates data structure */}
                  <div className="relative pl-10">
                    <div className="absolute left-0 top-1 size-10 rounded-full border-4 border-white dark:border-[#1e2a16] bg-gray-100 flex items-center justify-center z-10">
                      <div className="size-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {event.owner?.full_name?.charAt(0) || 'U'}
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-[#131b0d] dark:text-white">{event.owner?.full_name || 'Unknown'}</span>
                        <span className="text-xs text-gray-400">{format(new Date(event.created_at), 'MMM d')}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">Event created and started.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column (4 cols) */}
            <div className="lg:col-span-4 flex flex-col gap-6">
              {/* Next Actions Checklist */}
              <div className="bg-white dark:bg-[#1e2a16] p-5 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm">
                <h3 className="text-[#131b0d] dark:text-white font-bold text-base mb-4">Next Actions</h3>
                <div className="space-y-3">
                  {/* Placeholder tasks - would need tasks data structure */}
                  <label className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded cursor-pointer transition-colors">
                    <input className="rounded border-gray-300 text-primary focus:ring-primary mt-1" type="checkbox" />
                    <span className="text-sm text-[#131b0d] dark:text-white">Review progress metrics</span>
                  </label>
                  <label className="flex items-start gap-3 p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded cursor-pointer transition-colors">
                    <input className="rounded border-gray-300 text-primary focus:ring-primary mt-1" type="checkbox" />
                    <span className="text-sm text-[#131b0d] dark:text-white">Update stakeholders</span>
                  </label>
                </div>
                <button className="w-full mt-4 py-2 border border-dashed border-gray-300 dark:border-white/20 rounded-lg text-xs font-bold text-gray-500 hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Add Task
                </button>
              </div>

              {/* Budget Breakdown Widget */}
              {event.budget_total && (
                <div className="bg-white dark:bg-[#1e2a16] p-5 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-[#131b0d] dark:text-white font-bold text-base">Budget Breakdown</h3>
                    <span className="text-xs text-gray-500">${((event.budget_total || 0) / 1000).toFixed(0)}k Total</span>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="font-bold">Total Budget</span>
                        <span className="text-gray-500">
                          ${((event.budget_spent || 0) / 1000).toFixed(0)}k / ${((event.budget_total || 0) / 1000).toFixed(0)}k
                        </span>
                      </div>
                      <div className="w-full bg-[#f0f0f0] h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-primary h-full rounded-full"
                          style={{ width: `${event.budget_total ? ((event.budget_spent || 0) / event.budget_total) * 100 : 0}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/5 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500">Spent</p>
                      <p className="text-lg font-bold text-[#131b0d] dark:text-white">${((event.budget_spent || 0) / 1000).toFixed(0)}k</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Remaining</p>
                      <p className="text-lg font-bold text-primary">
                        ${(((event.budget_total || 0) - (event.budget_spent || 0)) / 1000).toFixed(0)}k
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Widget */}
              <div className="bg-white dark:bg-[#1e2a16] p-5 rounded-xl border border-[#ecf3e7] dark:border-white/5 shadow-sm">
                <h3 className="text-[#131b0d] dark:text-white font-bold text-base mb-4">Team & Responsibilities</h3>
                <div className="space-y-3">
                  {event.owner && (
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {event.owner.full_name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#131b0d] dark:text-white">{event.owner.full_name}</p>
                        <p className="text-xs text-gray-500">Product Owner</p>
                      </div>
                    </div>
                  )}
                  {event.team_members && event.team_members.length > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold">
                        {event.team_members.length}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#131b0d] dark:text-white">Team Members</p>
                        <p className="text-xs text-gray-500">{event.team_members.length} member{event.team_members.length !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  )}
                </div>
                <button className="w-full mt-4 text-xs font-bold text-primary hover:underline">Manage Team</button>
              </div>

              {/* Risks Widget */}
              <div className="bg-white dark:bg-[#1e2a16] p-5 rounded-xl border border-red-100 dark:border-red-900/30 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2 opacity-10">
                  <svg className="w-12 h-12 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                  </svg>
                </div>
                <h3 className="text-[#131b0d] dark:text-white font-bold text-base mb-3 relative z-10">Risks & Issues</h3>
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-100 dark:border-red-900/30 relative z-10">
                  <div className="flex items-start gap-2">
                    <svg className="w-4 h-4 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" />
                    </svg>
      <div>
                      <p className="text-xs font-bold text-red-700 dark:text-red-400">Monitor Progress</p>
                      <p className="text-[10px] text-red-600/80 dark:text-red-300/70 mt-1">
                        Keep track of milestones and deadlines to ensure project stays on schedule.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs placeholder */}
        {activeTab !== 'overview' && (
          <div className="py-12 text-center text-gray-400">
            <p>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} tab coming soon...</p>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="flex justify-between items-center py-6 border-t border-[#ecf3e7] dark:border-white/10 mt-auto">
          <Link
            href={`/events/${event.id}/delete`}
            className="text-red-500 hover:text-red-700 text-sm font-bold px-4 py-2 rounded transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
            </svg>
            Delete Event
          </Link>
          <div className="flex gap-4">
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-white border border-[#dae7cf] hover:bg-gray-50 text-[#131b0d] text-sm font-bold shadow-sm transition-colors">
              Save as Template
            </button>
            <button className="flex cursor-pointer items-center justify-center rounded-lg h-10 px-6 bg-primary hover:bg-green-600 text-white text-sm font-bold shadow-sm transition-colors">
              Duplicate for Next Pilot
            </button>
          </div>
        </div>
      </div>
    </main>
  )
}
