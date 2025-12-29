'use client'

import { useRoadmapItems } from '@/hooks/useRoadmap'
import { format } from 'date-fns'

interface RoadmapTabProps {
  year: number
}

export function RoadmapTab({ year }: RoadmapTabProps) {
  const { data: items = [], isLoading } = useRoadmapItems(year)

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] p-6">
        <div className="animate-pulse text-gray-400">Loading roadmap...</div>
      </div>
    )
  }

  // Group items by category
  const categoryGroups: Record<string, typeof items> = {}
  items.forEach(item => {
    if (!categoryGroups[item.category]) {
      categoryGroups[item.category] = []
    }
    categoryGroups[item.category].push(item)
  })

  const categories = ['Product', 'Funding', 'Team', 'Apps', 'Partners']

  return (
    <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-[#ecf4e7] dark:border-[#334025] overflow-hidden shadow-sm">
      <div className="p-5 border-b border-[#ecf4e7] dark:border-[#334025] bg-[#fcfdfa] dark:bg-[#1f2a16]">
        <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
          </svg>
          {year} Roadmap Timeline
        </h3>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[800px] p-6">
          {/* Quarters Header */}
          <div className="grid grid-cols-12 gap-1 mb-4">
            <div className="col-span-2"></div>
            <div className="col-span-10 grid grid-cols-4 gap-4">
              {['Q1', 'Q2', 'Q3', 'Q4'].map((quarter, idx) => {
                const months = ['Jan-Mar', 'Apr-Jun', 'Jul-Sep', 'Oct-Dec']
                return (
                  <div
                    key={quarter}
                    className="bg-[#f2f7ee] dark:bg-[#2a3820] rounded py-2 text-center text-[#131c0d] dark:text-white border border-[#ecf4e7] dark:border-[#334025] text-sm font-bold"
                  >
                    {quarter} <span className="text-xs font-normal text-gray-500 ml-1">{months[idx]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Swimlanes by Category */}
          {items.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No roadmap items for {year}. Create goals to see them on the roadmap.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {categories.map((category) => {
                const categoryItems = categoryGroups[category] || []
                if (categoryItems.length === 0) return null

                const getQuarterPosition = (quarter: string): number => {
                  const quarterMap: Record<string, number> = { Q1: 0, Q2: 1, Q3: 2, Q4: 3 }
                  return quarterMap[quarter] || 0
                }

                const getQuarterSpan = (startQ: string, endQ: string): number => {
                  const start = getQuarterPosition(startQ)
                  const end = getQuarterPosition(endQ)
                  return Math.max(1, end - start + 1)
                }

                return (
                  <div key={category} className="flex flex-col gap-2">
                    {/* Category Label */}
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: categoryItems[0]?.color || '#10b981' }}></div>
                      <span className="text-sm font-bold text-[#131c0d] dark:text-white">{category}</span>
                    </div>

                    {/* Items Row */}
                    <div className="grid grid-cols-12 gap-1 min-h-[60px] relative">
                      {/* Category Column */}
                      <div className="col-span-2"></div>

                      {/* Timeline Items */}
                      <div className="col-span-10 grid grid-cols-4 gap-4 relative">
                        {categoryItems.map((item) => {
                          const startPos = getQuarterPosition(item.quarter_start)
                          const span = getQuarterSpan(item.quarter_start, item.quarter_end)
                          
                          return (
                            <div
                              key={item.id}
                              className="rounded-lg p-3 border-2 text-sm font-medium text-white relative"
                              style={{
                                gridColumn: `span ${span} / span ${span}`,
                                gridColumnStart: startPos + 1,
                                backgroundColor: item.color || '#10b981',
                                borderColor: item.color || '#10b981',
                              }}
                            >
                              <div className="font-bold text-white mb-1">{item.title}</div>
                              {item.start_date && item.end_date && (
                                <div className="text-xs text-white/80">
                                  {format(new Date(item.start_date), 'MMM d')} - {format(new Date(item.end_date), 'MMM d')}
                                </div>
                              )}
                              {item.progress !== undefined && (
                                <div className="mt-2 h-1.5 bg-white/20 rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-white rounded-full transition-all"
                                    style={{ width: `${item.progress}%` }}
                                  />
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
