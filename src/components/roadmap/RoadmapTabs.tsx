'use client'

import Link from 'next/link'
import { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'

function RoadmapTabsContent() {
  const searchParams = useSearchParams()
  const activeTab = searchParams.get('tab') || 'roadmap'

  const tabs = [
    { id: 'roadmap', label: 'Roadmap', icon: 'timeline', href: '/roadmap?tab=roadmap' },
    { id: 'goals', label: 'Goals', icon: 'flag', href: '/roadmap?tab=goals' },
    { id: 'kanban', label: 'Kanban', icon: 'view_kanban', href: '/roadmap?tab=kanban' },
    { id: 'milestones', label: 'Milestones', icon: 'verified', href: '/roadmap?tab=milestones' },
    { id: 'metrics', label: 'Metrics', icon: 'monitoring', href: '/roadmap?tab=metrics' },
  ]

  return (
    <div className="border-b border-[#dae8ce] dark:border-[#334025]">
      <div className="flex gap-8 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 transition-colors ${
                isActive
                  ? 'border-primary'
                  : 'border-transparent hover:border-[#dae8ce] dark:hover:border-[#334025] group'
              }`}
            >
              <span
                className={`material-symbols-outlined text-sm ${
                  isActive
                    ? 'font-bold text-[#131c0d] dark:text-white'
                    : 'font-medium text-[#6d9c49] group-hover:text-[#131c0d] dark:group-hover:text-white'
                }`}
              >
                {tab.icon}
              </span>
              <p
                className={`text-sm font-bold transition-colors ${
                  isActive
                    ? 'text-[#131c0d] dark:text-white'
                    : 'text-[#6d9c49] group-hover:text-[#131c0d] dark:text-[#6d9c49] dark:group-hover:text-white'
                }`}
              >
                {tab.label}
              </p>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

export function RoadmapTabs() {
  return (
    <Suspense fallback={
      <div className="border-b border-[#dae8ce] dark:border-[#334025]">
        <div className="flex gap-8 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 border-b-[3px] border-primary pb-3 px-1">
            <span className="material-symbols-outlined text-sm font-bold text-[#131c0d] dark:text-white">timeline</span>
            <p className="text-sm font-bold text-[#131c0d] dark:text-white">Roadmap</p>
          </div>
        </div>
      </div>
    }>
      <RoadmapTabsContent />
    </Suspense>
  )
}
