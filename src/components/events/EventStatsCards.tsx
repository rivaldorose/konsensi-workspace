'use client'

import { useEventStats } from '@/hooks/useEvents'

export function EventStatsCards() {
  const { data: stats, isLoading } = useEventStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    )
  }

  const statsData = stats || { active: 0, upcoming: 0, completed: 0, total: 0 }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
          Active
          <span className="material-symbols-outlined text-primary text-[20px]">play_circle</span>
        </div>
        <p className="text-3xl font-bold text-[#131b0d]">{statsData.active}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
          Upcoming
          <span className="material-symbols-outlined text-orange-400 text-[20px]">calendar_month</span>
        </div>
        <p className="text-3xl font-bold text-[#131b0d]">{statsData.upcoming}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
          Completed
          <span className="material-symbols-outlined text-blue-400 text-[20px]">check_circle</span>
        </div>
        <p className="text-3xl font-bold text-[#131b0d]">{statsData.completed}</p>
      </div>

      <div className="bg-white p-5 rounded-xl border border-[#ecf3e7] shadow-sm flex flex-col gap-1">
        <div className="flex items-center justify-between text-gray-500 text-sm font-medium">
          Total Projects
          <span className="material-symbols-outlined text-gray-400 text-[20px]">folder</span>
        </div>
        <p className="text-3xl font-bold text-[#131b0d]">{statsData.total}</p>
      </div>
    </div>
  )
}

