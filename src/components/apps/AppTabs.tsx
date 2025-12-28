'use client'

interface AppTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const tabs = [
  { id: 'overview', label: 'Overview' },
  { id: 'details', label: 'Details' },
  { id: 'team', label: 'Team' },
  { id: 'analytics', label: 'Analytics' },
  { id: 'activity', label: 'Activity' }
]

export function AppTabs({ activeTab, onTabChange }: AppTabsProps) {
  return (
    <div className="sticky top-[73px] z-10 bg-[#f7f8f6] dark:bg-[#131d0c] border-b border-gray-200 dark:border-white/10 -mx-4 md:-mx-8 lg:-mx-12 px-4 md:px-8 lg:px-12">
      <div className="flex gap-8 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex flex-col items-center justify-center border-b-[3px] pb-3 pt-4 min-w-fit px-2 font-medium text-sm transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'border-b-primary text-[#131b0d] dark:text-white'
                : 'border-b-transparent text-gray-600 dark:text-gray-400 hover:text-primary'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}

