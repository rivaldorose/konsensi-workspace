'use client'

import { useGoalStats } from '@/hooks/useGoals'

export function OKRScoreCard() {
  const { data: stats, isLoading } = useGoalStats()

  const overallProgress = stats?.overallProgress || 68
  const circumference = 2 * Math.PI * 15.9155 // radius = 15.9155
  const strokeDasharray = `${(overallProgress / 100) * circumference}, ${circumference}`

  if (isLoading) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] p-5 shadow-sm animate-pulse">
        <div className="h-32 bg-gray-200 rounded mb-4"></div>
      </div>
    )
  }

  return (
    <div className="bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] p-5 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-bold text-[#131c0d] dark:text-white">Overall Progress</h3>
        <button className="text-gray-400 hover:text-black dark:hover:text-white">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      </div>

      <div className="flex flex-col items-center">
        <div className="relative size-32">
          <svg className="size-full -rotate-90" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
            <path
              className="text-gray-200 dark:text-gray-700"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
            ></path>
            <path
              className="text-primary"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeDasharray={strokeDasharray}
              strokeWidth="3"
            ></path>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-black text-[#131c0d] dark:text-white">{overallProgress}%</span>
            <span className="text-xs text-gray-500 uppercase tracking-wide font-bold">On Track</span>
          </div>
        </div>

        <div className="w-full mt-4 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-gray-500">Product</span>
            <span className="text-[#131c0d] dark:text-white font-bold">82%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary w-[82%]"></div>
          </div>

          <div className="flex justify-between text-xs font-medium pt-1">
            <span className="text-gray-500">Growth</span>
            <span className="text-[#131c0d] dark:text-white font-bold">45%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-orange-400 w-[45%]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
