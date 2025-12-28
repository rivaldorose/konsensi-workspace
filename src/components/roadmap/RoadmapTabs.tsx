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

  const getIconSVG = (iconName: string) => {
    switch (iconName) {
      case 'timeline':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
          </svg>
        )
      case 'flag':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" />
          </svg>
        )
      case 'view_kanban':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        )
      case 'verified':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
        )
      case 'monitoring':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        )
      default:
        return null
    }
  }

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
                className={`text-sm ${
                  isActive
                    ? 'font-bold text-[#131c0d] dark:text-white'
                    : 'font-medium text-[#6d9c49] group-hover:text-[#131c0d] dark:group-hover:text-white'
                }`}
              >
                {getIconSVG(tab.icon)}
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
    <Suspense
      fallback={
        <div className="border-b border-[#dae8ce] dark:border-[#334025]">
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 border-b-[3px] border-primary pb-3 px-1">
              <svg className="w-4 h-4 font-bold text-[#131c0d] dark:text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
              </svg>
              <p className="text-sm font-bold text-[#131c0d] dark:text-white">Roadmap</p>
            </div>
          </div>
        </div>
      }
    >
      <RoadmapTabsContent />
    </Suspense>
  )
}
