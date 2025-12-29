'use client'

import Link from 'next/link'
import { useMilestones } from '@/hooks/useRoadmap'
import { format } from 'date-fns'

interface MilestonesTabProps {
  year: number
}

const statusConfig: Record<string, { bg: string; text: string; border: string; icon: string }> = {
  on_track: {
    bg: 'bg-green-100 dark:bg-green-900/30',
    text: 'text-green-700 dark:text-green-300',
    border: 'border-green-200 dark:border-green-800',
    icon: '✓',
  },
  at_risk: {
    bg: 'bg-yellow-100 dark:bg-yellow-900/30',
    text: 'text-yellow-700 dark:text-yellow-300',
    border: 'border-yellow-200 dark:border-yellow-800',
    icon: '⚠',
  },
  behind: {
    bg: 'bg-red-100 dark:bg-red-900/30',
    text: 'text-red-700 dark:text-red-300',
    border: 'border-red-200 dark:border-red-800',
    icon: '⚠',
  },
  complete: {
    bg: 'bg-blue-100 dark:bg-blue-900/30',
    text: 'text-blue-700 dark:text-blue-300',
    border: 'border-blue-200 dark:border-blue-800',
    icon: '✓',
  },
}

export function MilestonesTab({ year }: MilestonesTabProps) {
  const { data: milestones = [], isLoading } = useMilestones(year)

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6">
        <div className="animate-pulse text-gray-400">Loading milestones...</div>
      </div>
    )
  }

  // Sort milestones by start date
  const sortedMilestones = [...milestones].sort((a, b) => 
    new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
  )

  return (
    <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#ecf4e7] dark:border-[#334025] bg-[#fcfdfa] dark:bg-[#1f2a16] flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
          Milestones Timeline
        </h3>
        <Link
          href="/roadmap/new"
          className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-[#60d60b] text-[#131c0d] text-sm font-bold rounded-lg transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
          </svg>
          New Milestone
        </Link>
      </div>

      <div className="p-6">
        {sortedMilestones.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No milestones for {year}. Create goals to see milestones.</p>
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-[#ecf4e7] dark:bg-[#334025]"></div>

            {/* Milestones */}
            <div className="space-y-8">
              {sortedMilestones.map((milestone, index) => {
                const status = milestone.status || 'on_track'
                const statusStyle = statusConfig[status] || statusConfig.on_track

                return (
                  <div key={milestone.id} className="relative flex items-start gap-4">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex-shrink-0">
                      <div className={`w-16 h-16 rounded-full ${statusStyle.bg} ${statusStyle.border} border-2 flex items-center justify-center text-2xl`}>
                        {milestone.emoji || '🎯'}
                      </div>
                    </div>

                    {/* Content */}
                    <Link
                      href={`/roadmap/${milestone.id}`}
                      className="flex-1 bg-white dark:bg-[#222e18] border border-[#ecf4e7] dark:border-[#334025] rounded-lg p-5 hover:shadow-md transition-all group"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-bold text-lg text-[#131c0d] dark:text-white group-hover:text-primary transition-colors">
                              {milestone.title}
                            </h4>
                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                              <span>{statusStyle.icon}</span>
                              {status === 'on_track' ? 'On Track' : status === 'at_risk' ? 'At Risk' : status === 'behind' ? 'Behind' : 'Complete'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            {milestone.start_date && milestone.end_date && (
                              <span className="flex items-center gap-1.5">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                {format(new Date(milestone.start_date), 'MMM d')} - {format(new Date(milestone.end_date), 'MMM d, yyyy')}
                              </span>
                            )}
                            {milestone.owner && (
                              <span className="flex items-center gap-1.5">
                                {milestone.owner.avatar_url ? (
                                  <img
                                    src={milestone.owner.avatar_url}
                                    alt={milestone.owner.full_name}
                                    className="w-4 h-4 rounded-full"
                                  />
                                ) : (
                                  <div className="w-4 h-4 rounded-full bg-primary/20 flex items-center justify-center text-[8px] font-bold text-primary">
                                    {milestone.owner.full_name?.charAt(0) || 'U'}
                                  </div>
                                )}
                                {milestone.owner.full_name || milestone.owner.email}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
                          <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{milestone.progress}%</span>
                        </div>
                        <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all"
                            style={{ width: `${milestone.progress}%` }}
                          />
                        </div>
                      </div>

                      {/* Key Milestones */}
                      {milestone.key_milestones && milestone.key_milestones.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-[#ecf4e7] dark:border-[#334025]">
                          <p className="text-xs font-bold text-gray-600 dark:text-gray-400 mb-2">Key Milestones</p>
                          <div className="flex flex-col gap-2">
                            {milestone.key_milestones.map((keyMilestone, idx) => (
                              <div key={idx} className="flex items-center gap-2 text-sm">
                                {keyMilestone.status === 'complete' ? (
                                  <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                                  </svg>
                                ) : keyMilestone.status === 'in_progress' ? (
                                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                                  </svg>
                                ) : (
                                  <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                                  </svg>
                                )}
                                <span className="text-gray-700 dark:text-gray-300">{keyMilestone.title}</span>
                                {keyMilestone.date && (
                                  <span className="text-xs text-gray-500 dark:text-gray-500 ml-auto">
                                    {format(new Date(keyMilestone.date), 'MMM d')}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
