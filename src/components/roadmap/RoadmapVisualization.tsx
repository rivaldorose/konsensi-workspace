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

  // Group items by category - only show real data, no defaults
  const productItems = roadmapItems.filter((item) => item.category === 'product')
  const fundingItems = roadmapItems.filter((item) => item.category === 'funding')
  const teamItems = roadmapItems.filter((item) => item.category === 'team')
  const appItems = roadmapItems.filter((item) => item.category === 'product') // Can be filtered differently
  const partnershipItems = roadmapItems.filter((item) => item.category === 'partnerships')

  return (
    <div className="flex-1 bg-surface-light dark:bg-surface-dark rounded-xl border border-[#dae8ce] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#dae8ce] dark:border-[#334025] flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
          </svg>
          2025 Roadmap
        </h3>
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

          {/* Swimlanes - Only show if there's data */}
          {roadmapItems.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No roadmap items yet. Create goals to see them on the roadmap.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6 relative">
              {/* Grid Lines Background */}
              <div className="absolute inset-0 left-[16.66%] right-0 grid grid-cols-4 pointer-events-none">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="border-r border-dashed border-gray-200 dark:border-gray-700 h-full"></div>
                ))}
              </div>

              {productItems.length > 0 && <RoadmapSwimlane category="Product" icon="rocket_launch" items={productItems} />}
              {fundingItems.length > 0 && <RoadmapSwimlane category="Funding" icon="monetization_on" items={fundingItems} />}
              {teamItems.length > 0 && <RoadmapSwimlane category="Team" icon="group" items={teamItems} />}
              {appItems.length > 0 && <RoadmapSwimlane category="Apps" icon="smartphone" items={appItems} />}
              {partnershipItems.length > 0 && <RoadmapSwimlane category="Partners" icon="handshake" items={partnershipItems} />}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
