'use client'

import Link from 'next/link'
import { format, differenceInDays, differenceInWeeks } from 'date-fns'
import type { Event } from '@/types'

interface EventCardProps {
  event: Event
}

const typeColors: Record<Event['type'], string> = {
  launch: 'bg-blue-50 text-blue-700',
  partnership: 'bg-purple-50 text-purple-700',
  pilot: 'bg-green-50 text-green-700',
  funding: 'bg-yellow-50 text-yellow-700',
  campaign: 'bg-pink-50 text-pink-700',
  other: 'bg-gray-50 text-gray-700',
}

const priorityColors: Record<Event['priority'], string> = {
  critical: 'bg-red-50 text-red-700',
  high: 'bg-red-50 text-red-700',
  medium: 'bg-yellow-50 text-yellow-700',
  low: 'bg-green-50 text-green-700',
}

const priorityIcons: Record<Event['priority'], string> = {
  critical: 'priority_high',
  high: 'priority_high',
  medium: 'equalizer',
  low: 'low_priority',
}

const getProgressColor = (event: Event): string => {
  if (event.status === 'completed') return 'bg-primary'
  if (event.status === 'on_hold') return 'bg-yellow-400'
  if (event.progress < 30) return 'bg-red-400'
  return 'bg-primary'
}

function getStatusDisplay(event: Event) {
  const now = new Date()
  const endDate = new Date(event.end_date)
  const daysRemaining = differenceInDays(endDate, now)
  
  if (event.status === 'active') {
    if (daysRemaining < 0) {
      return { text: 'Overdue', color: 'text-red-600', icon: 'error' }
    } else if (daysRemaining <= 14) {
      return { text: `${daysRemaining} days remaining`, color: 'text-orange-600', icon: 'schedule' }
    } else {
      const weeks = differenceInWeeks(endDate, now)
      return { text: `${weeks} weeks remaining`, color: 'text-orange-600', icon: 'schedule' }
    }
  }
  
  if (event.status === 'planning') {
    return { text: 'Early stages', color: 'text-green-600', icon: 'check_circle' }
  }
  
  return { text: 'In progress', color: 'text-blue-600', icon: 'schedule' }
}

export function EventCard({ event }: EventCardProps) {
  const statusDisplay = getStatusDisplay(event)
  const startDate = new Date(event.start_date)
  const endDate = new Date(event.end_date)
  const progressColor = getProgressColor(event)

  const getBorderColor = () => {
    if (event.priority === 'critical' || event.priority === 'high') return 'bg-primary'
    if (event.priority === 'medium') return 'bg-yellow-400'
    return 'bg-primary'
  }

  return (
    <div className="bg-white rounded-xl border border-[#ecf3e7] shadow-sm p-6 relative overflow-hidden group hover:border-primary/50 transition-colors">
      <div className={`absolute top-0 left-0 w-1 h-full ${getBorderColor()}`}></div>
      
      <div className="flex flex-col md:flex-row justify-between md:items-start gap-4 mb-6">
        <div>
          <div className="flex flex-wrap gap-2 mb-2">
            <span className={`${typeColors[event.type]} text-xs font-bold px-2.5 py-1 rounded-md capitalize`}>
              {event.type}
            </span>
            <span className={`${priorityColors[event.priority]} text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1`}>
              <span className="material-symbols-outlined text-[14px]">{priorityIcons[event.priority]}</span>
              {event.priority === 'critical' ? 'High' : event.priority.charAt(0).toUpperCase() + event.priority.slice(1)} Priority
            </span>
          </div>
          <h3 className="text-xl font-bold text-[#131b0d]">{event.name}</h3>
          <p className="text-gray-500 text-sm mt-1">{event.description || 'No description provided.'}</p>
        </div>
        <button className="text-gray-400 hover:text-[#131b0d]">
          <span className="material-symbols-outlined">more_horiz</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {/* Owner & Team */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Team</p>
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {event.owner && (
                <div 
                  className="size-8 rounded-full ring-2 ring-white bg-cover bg-center"
                  style={{ 
                    backgroundImage: event.owner.avatar_url 
                      ? `url("${event.owner.avatar_url}")` 
                      : `linear-gradient(to bottom right, #B2FF78, #8ecf5b)`
                  }}
                  title={event.owner.full_name}
                ></div>
              )}
              {event.team_members.slice(0, 2).map((memberId, idx) => (
                <div 
                  key={memberId}
                  className="size-8 rounded-full ring-2 ring-white bg-gray-200"
                  title={`Team member ${idx + 1}`}
                ></div>
              ))}
              {event.team_members.length > 2 && (
                <div className="size-8 rounded-full ring-2 ring-white bg-[#ecf3e7] flex items-center justify-center text-xs font-bold text-[#131b0d]">
                  +{event.team_members.length - 2}
                </div>
              )}
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
            <span className="material-symbols-outlined text-gray-400 text-[20px]">date_range</span>
            {format(startDate, 'MMM d')} - {format(endDate, 'MMM d, yyyy')}
          </div>
          <div className={`text-xs ${statusDisplay.color} font-medium mt-1 flex items-center gap-1`}>
            <span className="material-symbols-outlined text-[14px]">{statusDisplay.icon}</span>
            {statusDisplay.text}
          </div>
        </div>

        {/* Stats */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Quick Stats</p>
          <div className="flex items-center gap-4">
            <div>
              <span className="block text-lg font-bold">{event.progress}%</span>
              <span className="text-xs text-gray-500">Progress</span>
            </div>
            <div className="h-8 w-px bg-gray-200"></div>
            <div>
              <span className={`block text-lg font-bold ${event.status === 'active' ? 'text-green-600' : 'text-gray-600'}`}>
                {event.status === 'active' ? 'Active' : event.status.charAt(0).toUpperCase() + event.status.slice(1)}
              </span>
              <span className="text-xs text-gray-500">Status</span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <span className="text-sm font-medium text-[#131b0d]">Overall Progress</span>
          <span className="text-sm font-bold text-primary">{event.progress}%</span>
        </div>
        <div className="w-full bg-[#ecf3e7] rounded-full h-2.5">
          <div className={`${progressColor} h-2.5 rounded-full`} style={{ width: `${event.progress}%` }}></div>
        </div>
        {event.success_criteria && event.success_criteria.length > 0 && (
          <div className="flex items-center gap-2 mt-3 text-sm text-gray-600 bg-background-light p-2 rounded-md border border-dashed border-gray-300">
            <span className={`material-symbols-outlined text-[18px] ${progressColor.includes('primary') ? 'text-primary' : progressColor.includes('yellow') ? 'text-yellow-500' : 'text-red-500'}`}>flag</span>
            <span><strong>Next Milestone:</strong> {event.success_criteria[0]}</span>
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
          <span className="material-symbols-outlined text-[18px]">edit_note</span>
          Update Status
        </button>
        <button className="flex-1 md:flex-none py-2 px-4 rounded-lg border border-dashed border-gray-300 text-gray-500 text-sm font-bold hover:border-primary hover:text-primary transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          Add Milestone
        </button>
      </div>
    </div>
  )
}

