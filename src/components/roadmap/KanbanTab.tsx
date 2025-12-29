'use client'

import Link from 'next/link'
import { useGoals, useUpdateGoalKanban } from '@/hooks/useRoadmap'
import { format } from 'date-fns'
import type { Goal } from '@/types/roadmap'

const columns = [
  { id: 'not_started', label: 'Not Started', color: 'bg-gray-100 dark:bg-gray-900/30' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-100 dark:bg-blue-900/30' },
  { id: 'on_track', label: 'On Track', color: 'bg-green-100 dark:bg-green-900/30' },
  { id: 'complete', label: 'Complete', color: 'bg-purple-100 dark:bg-purple-900/30' },
]

const statusConfig: Record<string, { dot: string }> = {
  on_track: { dot: 'bg-green-500' },
  at_risk: { dot: 'bg-yellow-500' },
  behind: { dot: 'bg-red-500' },
  complete: { dot: 'bg-blue-500' },
  completed: { dot: 'bg-blue-500' },
  not_started: { dot: 'bg-gray-500' },
  in_progress: { dot: 'bg-blue-500' },
}

export function KanbanTab() {
  const { data: goals = [], isLoading } = useGoals()
  const updateKanban = useUpdateGoalKanban()

  const handleMoveCard = async (goalId: string, newColumn: string) => {
    // Find goal to get current position
    const goal = goals.find(g => g.id === goalId)
    if (!goal) return

    // Count goals in new column to determine position
    const goalsInColumn = goals.filter(g => g.kanban_column === newColumn || (newColumn === 'not_started' && !g.kanban_column))
    const newPosition = goalsInColumn.length

    try {
      await updateKanban.mutateAsync({
        id: goalId,
        column: newColumn,
        position: newPosition,
      })
    } catch (error) {
      console.error('Failed to move card:', error)
    }
  }

  const getGoalsForColumn = (columnId: string): Goal[] => {
    return goals.filter(goal => {
      const kanbanColumn = goal.kanban_column || 'not_started'
      return kanbanColumn === columnId
    }).sort((a, b) => (a.kanban_position || 0) - (b.kanban_position || 0))
  }

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6">
        <div className="animate-pulse text-gray-400">Loading kanban board...</div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#ecf4e7] dark:border-[#334025] bg-[#fcfdfa] dark:bg-[#1f2a16]">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
          Kanban Board
        </h3>
      </div>

      <div className="p-6">
        {goals.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No goals found. Create goals to see them on the kanban board.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {columns.map((column) => {
              const columnGoals = getGoalsForColumn(column.id)

              return (
                <div key={column.id} className="flex flex-col gap-3">
                  {/* Column Header */}
                  <div className={`${column.color} rounded-lg p-3 border border-[#ecf4e7] dark:border-[#334025]`}>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-[#131c0d] dark:text-white text-sm">
                        {column.label}
                      </h4>
                      <span className="text-xs font-bold text-gray-600 dark:text-gray-400 bg-white dark:bg-[#1f2b15] px-2 py-0.5 rounded-full">
                        {columnGoals.length}
                      </span>
                    </div>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-3 min-h-[200px]">
                    {columnGoals.map((goal) => {
                      const status = goal.status || 'not_started'
                      const statusStyle = statusConfig[status] || statusConfig.not_started

                      return (
                        <Link
                          key={goal.id}
                          href={`/roadmap/${goal.id}`}
                          className="bg-white dark:bg-[#222e18] border border-[#ecf4e7] dark:border-[#334025] rounded-lg p-4 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <span className="text-xl flex-shrink-0">{goal.emoji || '🎯'}</span>
                              <h5 className="font-bold text-[#131c0d] dark:text-white text-sm group-hover:text-primary transition-colors line-clamp-2">
                                {goal.title}
                              </h5>
                            </div>
                            <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusStyle.dot}`}></span>
                          </div>

                          {goal.objective && (
                            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
                              {goal.objective}
                            </p>
                          )}

                          {/* Progress Bar */}
                          <div className="mb-3">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-gray-600 dark:text-gray-400">Progress</span>
                              <span className="text-xs font-bold text-gray-700 dark:text-gray-300">{goal.progress || 0}%</span>
                            </div>
                            <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary rounded-full transition-all"
                                style={{ width: `${goal.progress || 0}%` }}
                              />
                            </div>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between pt-2 border-t border-[#ecf4e7] dark:border-[#334025]">
                            <div className="flex items-center gap-2">
                              {goal.owner?.avatar_url ? (
                                <img
                                  src={goal.owner.avatar_url}
                                  alt={goal.owner.full_name}
                                  className="w-5 h-5 rounded-full"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                  {goal.owner?.full_name?.charAt(0) || 'U'}
                                </div>
                              )}
                              <span className="text-xs text-gray-600 dark:text-gray-400">
                                {goal.owner?.full_name?.split(' ')[0] || 'Unassigned'}
                              </span>
                            </div>
                            {goal.due_date || goal.target_date ? (
                              <span className="text-xs text-gray-500 dark:text-gray-500">
                                {format(new Date(goal.due_date || goal.target_date!), 'MMM d')}
                              </span>
                            ) : null}
                          </div>
                        </Link>
                      )
                    })}

                    {/* Empty State */}
                    {columnGoals.length === 0 && (
                      <div className="flex items-center justify-center min-h-[200px] border-2 border-dashed border-[#ecf4e7] dark:border-[#334025] rounded-lg">
                        <p className="text-xs text-gray-400">No items</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

