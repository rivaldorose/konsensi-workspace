'use client'

import { useState } from 'react'
import Link from 'next/link'
import { RoadmapTab } from '@/components/roadmap/RoadmapTab'
import { GoalsTab } from '@/components/roadmap/GoalsTab'
import { KanbanTab } from '@/components/roadmap/KanbanTab'
import { MilestonesTab } from '@/components/roadmap/MilestonesTab'
import { MetricsTab } from '@/components/roadmap/MetricsTab'

export default function RoadmapPage() {
  const [activeTab, setActiveTab] = useState<'roadmap' | 'goals' | 'kanban' | 'milestones' | 'metrics'>('roadmap')
  const [selectedYear, setSelectedYear] = useState(2025)

  const tabs = [
    { id: 'roadmap' as const, label: 'Roadmap', icon: 'timeline' },
    { id: 'goals' as const, label: 'Goals', icon: 'flag' },
    { id: 'kanban' as const, label: 'Kanban', icon: 'kanban' },
    { id: 'milestones' as const, label: 'Milestones', icon: 'verified' },
    { id: 'metrics' as const, label: 'Metrics', icon: 'monitoring' }
  ]

  const getIconSVG = (iconName: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? 'text-[#131c0d] dark:text-white' : 'text-[#6d9c49]'}`
    
    switch (iconName) {
      case 'timeline':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" />
          </svg>
        )
      case 'flag':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
          </svg>
        )
      case 'kanban':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        )
      case 'verified':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
        )
      case 'monitoring':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 pt-16">
      <main className="flex justify-center py-8 px-4 md:px-10">
        <div className="w-full max-w-[1280px] flex flex-col gap-6">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl md:text-4xl font-black text-[#131c0d] dark:text-white tracking-tight">
                Roadmap & Goals {selectedYear}
              </h1>
              <p className="text-[#6d9c49] dark:text-[#a3d977] text-base font-medium">
                Strategic planning and execution tracking for the team.
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Year Selector */}
              <div className="hidden sm:flex items-center bg-white dark:bg-[#222e18] rounded-lg border border-[#ecf4e7] dark:border-[#334025] p-1">
                <button
                  onClick={() => setSelectedYear(2025)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    selectedYear === 2025
                      ? 'bg-[#ecf4e7] dark:bg-[#334025] text-black dark:text-white shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  2025
                </button>
                <button
                  onClick={() => setSelectedYear(2026)}
                  className={`px-3 py-1.5 rounded text-xs font-bold transition-colors ${
                    selectedYear === 2026
                      ? 'bg-[#ecf4e7] dark:bg-[#334025] text-black dark:text-white shadow-sm'
                      : 'hover:bg-black/5 dark:hover:bg-white/5 text-gray-500 dark:text-gray-400'
                  }`}
                >
                  2026
                </button>
              </div>

              {/* Add Item Button */}
              <Link
                href="/roadmap/new"
                className="flex items-center gap-2 h-11 px-5 bg-primary hover:bg-[#60d60b] text-[#131c0d] text-sm font-bold rounded-lg transition-all shadow-lg shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Add Item</span>
              </Link>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="border-b border-[#dae8ce] dark:border-[#334025]">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 transition-colors ${
                      isActive
                        ? 'border-primary'
                        : 'border-transparent hover:border-[#dae8ce] dark:hover:border-[#334025]'
                    }`}
                  >
                    {getIconSVG(tab.icon, isActive)}
                    <p className={`text-sm font-bold transition-colors ${
                      isActive
                        ? 'text-[#131c0d] dark:text-white'
                        : 'text-[#6d9c49] hover:text-[#131c0d] dark:hover:text-white'
                    }`}>
                      {tab.label}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'roadmap' && <RoadmapTab year={selectedYear} />}
          {activeTab === 'goals' && <GoalsTab year={selectedYear} />}
          {activeTab === 'kanban' && <KanbanTab />}
          {activeTab === 'milestones' && <MilestonesTab year={selectedYear} />}
          {activeTab === 'metrics' && <MetricsTab />}
        </div>
      </main>
    </div>
  )
}
