'use client'

import { RoadmapSwimlane } from './RoadmapSwimlane'
import { useGoals } from '@/hooks/useGoals'
import { useEvents } from '@/hooks/useEvents'

interface RoadmapItem {
  id: string
  title: string
  startDate: string
  endDate: string
  progress?: number
  color?: string
  borderColor?: string
  type?: 'solid' | 'dashed' | 'gradient'
  category: string
}

export function RoadmapVisualization() {
  const { data: goals } = useGoals()
  const { data: events } = useEvents()

  // Transform goals and events into roadmap items
  const roadmapItems: RoadmapItem[] = []

  // Add goals as roadmap items
  goals?.forEach((goal) => {
    let color = 'bg-primary'
    let borderColor: string | undefined = undefined
    let type: 'solid' | 'dashed' | 'gradient' | undefined = undefined

    if (goal.category === 'funding') {
      color = 'bg-blue-100 dark:bg-blue-900/40'
      borderColor = 'border-blue-500'
    } else if (goal.category === 'partnerships') {
      color = 'bg-purple-100 dark:bg-purple-900/40'
      borderColor = 'border-purple-500'
    } else if (goal.category === 'team') {
      type = 'gradient'
    }

    roadmapItems.push({
      id: goal.id,
      title: goal.title,
      startDate: goal.start_date,
      endDate: goal.target_date,
      progress: goal.progress,
      category: goal.category,
      color,
      borderColor,
      type,
    })
  })

  // Group items by category
  const productItems = roadmapItems.filter((item) => item.category === 'product')
  const fundingItems = roadmapItems.filter((item) => item.category === 'funding')
  const teamItems = roadmapItems.filter((item) => item.category === 'team')
  const appItems = roadmapItems.filter((item) => item.category === 'product') // Can be filtered differently
  const partnershipItems = roadmapItems.filter((item) => item.category === 'partnerships')

  // Default items if no data
  const defaultItems: RoadmapItem[] = [
    {
      id: '1',
      title: 'MVP Beta Launch',
      startDate: '2025-01-15',
      endDate: '2025-03-30',
      category: 'product',
      color: 'bg-primary',
    },
    {
      id: '2',
      title: 'Feature V2 Expansion',
      startDate: '2025-06-01',
      endDate: '2025-07-31',
      category: 'product',
      color: 'bg-[#ecf4e7] dark:bg-[#334025]',
      borderColor: 'border-primary',
    },
    {
      id: '3',
      title: 'Seed Round Prep',
      startDate: '2025-04-01',
      endDate: '2025-05-31',
      category: 'funding',
      color: 'bg-blue-100 dark:bg-blue-900/40',
      borderColor: 'border-blue-500',
    },
    {
      id: '4',
      title: 'Ongoing Recruitment',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
      category: 'team',
      type: 'gradient',
    },
    {
      id: '5',
      title: 'Mobile App Dev',
      startDate: '2025-06-15',
      endDate: '2025-09-15',
      category: 'apps',
      color: 'bg-purple-100 dark:bg-purple-900/40',
      borderColor: 'border-purple-500',
    },
    {
      id: '6',
      title: 'Strategic Partnership',
      startDate: '2025-09-01',
      endDate: '2025-11-30',
      category: 'partnerships',
      color: 'bg-orange-100 dark:bg-orange-900/40',
      borderColor: 'border-orange-500',
    },
  ]

  const finalProductItems = productItems.length > 0 ? productItems : defaultItems.filter((i) => i.category === 'product')
  const finalFundingItems = fundingItems.length > 0 ? fundingItems : defaultItems.filter((i) => i.category === 'funding')
  const finalTeamItems = teamItems.length > 0 ? teamItems : defaultItems.filter((i) => i.category === 'team')
  const finalAppItems = appItems.length > 0 ? appItems : defaultItems.filter((i) => i.category === 'apps')
  const finalPartnershipItems =
    partnershipItems.length > 0 ? partnershipItems : defaultItems.filter((i) => i.category === 'partnerships')

  return (
    <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#dae8ce] dark:border-[#334025] flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
          </svg>
          2025 Roadmap
        </h3>
        <div className="flex gap-2">
          <button className="p-1.5 rounded hover:bg-[#ecf4e7] dark:hover:bg-[#334025] text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
          </button>
          <button className="p-1.5 rounded hover:bg-[#ecf4e7] dark:hover:bg-[#334025] text-gray-500 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm2 2V5h2v2H5zm-2 7a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H4a1 1 0 01-1-1v-4zm2 2v-2h2v2H5zm9-13a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V4a1 1 0 00-1-1h-4zm1 2h2v2h-2V5zm-8 8a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H6a1 1 0 01-1-1v-4zm2 2v-2h2v2H8z"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Timeline Container */}
      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-6">
          {/* Quarters Header */}
          <div className="grid grid-cols-12 gap-1 mb-4 text-sm font-bold text-gray-500 dark:text-gray-400">
            <div className="col-span-2"></div>
            <div className="col-span-10 grid grid-cols-4 gap-4">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, idx) => {
                const months = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec']
                return (
                  <div
                    key={quarter}
                    className="bg-[#f2f7ee] dark:bg-[#2a3820] rounded py-2 text-center text-[#131c0d] dark:text-white border border-[#ecf4e7] dark:border-[#334025]"
                  >
                    {quarter} <span className="text-xs font-normal text-gray-500 ml-1">{months[idx]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Swimlanes */}
          <div className="flex flex-col gap-6 relative">
            {/* Grid Lines Background */}
            <div className="absolute inset-0 left-[16.66%] right-0 grid grid-cols-4 pointer-events-none">
              {[0, 1, 2].map((i) => (
                <div key={i} className="border-r border-dashed border-gray-200 dark:border-gray-700 h-full"></div>
              ))}
            </div>

            <RoadmapSwimlane category="Product" icon="rocket_launch" items={finalProductItems} />
            <RoadmapSwimlane category="Funding" icon="monetization_on" items={finalFundingItems} />
            <RoadmapSwimlane category="Team" icon="group" items={finalTeamItems} />
            <RoadmapSwimlane category="Apps" icon="smartphone" items={finalAppItems} />
            <RoadmapSwimlane category="Partners" icon="handshake" items={finalPartnershipItems} />
          </div>
        </div>
      </div>
    </div>
  )
}
