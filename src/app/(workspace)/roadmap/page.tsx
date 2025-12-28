'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RoadmapTabs } from '@/components/roadmap/RoadmapTabs'
import { RoadmapVisualization } from '@/components/roadmap/RoadmapVisualization'
import { OKRScoreCard } from '@/components/roadmap/OKRScoreCard'
import { TeamVelocityCard } from '@/components/roadmap/TeamVelocityCard'
import { GoalsTable } from '@/components/roadmap/GoalsTable'

export default function RoadmapPage() {
  const [selectedYear, setSelectedYear] = useState('2025')

  return (
    <div className="w-full max-w-[1280px] mx-auto flex flex-col gap-6 py-8 px-4 md:px-10">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl md:text-4xl font-black text-[#131c0d] dark:text-white tracking-tight">
            Roadmap &amp; Goals {selectedYear}
          </h1>
          <p className="text-[#6d9c49] dark:text-[#a3d977] text-base font-medium">
            Strategic planning and execution tracking for the team.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center bg-white dark:bg-[#222e18] rounded-lg border border-[#ecf4e7] dark:border-[#334025] p-1">
            <button
              onClick={() => setSelectedYear('2025')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                selectedYear === '2025'
                  ? 'bg-[#ecf4e7] dark:bg-[#334025] text-black dark:text-white shadow-sm'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
              }`}
            >
              2025
            </button>
            <button
              onClick={() => setSelectedYear('2026')}
              className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                selectedYear === '2026'
                  ? 'bg-[#ecf4e7] dark:bg-[#334025] text-black dark:text-white shadow-sm'
                  : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
              }`}
            >
              2026
            </button>
          </div>
          <Link
            href="/roadmap/new"
            className="flex items-center gap-2 h-11 px-5 bg-primary hover:bg-primary-dark text-[#131c0d] text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary/20"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
            <span>Add Item</span>
          </Link>
        </div>
      </div>

      {/* Tabs */}
      <RoadmapTabs />

      {/* Main Layout: Roadmap + Quick Stats */}
      <div className="flex flex-col xl:flex-row gap-6">
        {/* Roadmap Visualization (Main) */}
        <RoadmapVisualization />

        {/* Sidebar / Metrics Summary */}
        <div className="w-full xl:w-80 flex flex-col gap-6">
          <OKRScoreCard />
          <TeamVelocityCard />
        </div>
      </div>

      {/* Detailed Goals / OKR Table */}
      <GoalsTable />
    </div>
  )
}
