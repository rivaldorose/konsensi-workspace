'use client'

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

interface RoadmapSwimlaneProps {
  category: string
  icon: string
  items: RoadmapItem[]
}

export function RoadmapSwimlane({ category, icon, items }: RoadmapSwimlaneProps) {
  const getQuarterPosition = (date: string): number => {
    const d = new Date(date)
    const month = d.getMonth()
    if (month < 3) return 0 // Q1
    if (month < 6) return 1 // Q2
    if (month < 9) return 2 // Q3
    return 3 // Q4
  }

  const getQuarterWidth = (startDate: string, endDate: string): number => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startQ = getQuarterPosition(startDate)
    const endQ = getQuarterPosition(endDate)
    return Math.max(1, endQ - startQ + 1) / 4 // Convert to percentage
  }

  const getQuarterStart = (date: string): number => {
    const d = new Date(date)
    const month = d.getMonth()
    const quarter = Math.floor(month / 3)
    return quarter / 4 // Position within the 4 quarters
  }

  return (
    <div className="grid grid-cols-12 gap-1 items-center group/lane relative z-10">
      <div className="col-span-2 flex items-center gap-2 pr-4">
        <div className="bg-[#ecf4e7] dark:bg-[#2a3820] p-1.5 rounded-lg text-primary">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        <span className="font-bold text-sm text-[#131c0d] dark:text-white">{category}</span>
      </div>

      <div className="col-span-10 relative h-10 bg-gray-50 dark:bg-white/5 rounded-lg">
        {items.map((item) => {
          const left = getQuarterStart(item.startDate) * 100
          const width = getQuarterWidth(item.startDate, item.endDate) * 100
          const bgColor = item.color || 'bg-primary'
          const borderColor = item.borderColor || 'border-primary'

          if (item.type === 'gradient') {
            return (
              <div
                key={item.id}
                className="absolute top-1.5 bottom-1.5 rounded-md border border-dashed border-primary flex items-center px-3 cursor-pointer group/item"
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                  background: 'linear-gradient(to right, rgba(178, 255, 120, 0.2), rgba(178, 255, 120, 0.05))',
                }}
              >
                <span className="text-xs font-bold text-[#131c0d] dark:text-white truncate">
                  {item.title}
                </span>
              </div>
            )
          }

          if (item.type === 'dashed' || item.borderColor) {
            const borderClass = item.borderColor === 'border-blue-500' 
              ? 'border-blue-500/30 hover:border-blue-500'
              : item.borderColor === 'border-purple-500'
              ? 'border-purple-500/30 hover:border-purple-500'
              : item.borderColor === 'border-orange-500'
              ? 'border-orange-500/30 hover:border-orange-500'
              : 'border-primary/30 hover:border-primary'
            
            return (
              <div
                key={item.id}
                className={`absolute top-1.5 bottom-1.5 ${bgColor} border ${borderClass} rounded-md shadow-sm cursor-pointer flex items-center px-3`}
                style={{
                  left: `${left}%`,
                  width: `${width}%`,
                }}
              >
                <span className="text-xs font-bold text-[#131c0d] dark:text-white truncate">
                  {item.title}
                </span>
              </div>
            )
          }

          return (
            <div
              key={item.id}
              className={`absolute top-1.5 bottom-1.5 ${bgColor} hover:bg-primary-dark rounded-md shadow-sm cursor-pointer transition-colors flex items-center px-3 group/item`}
              style={{
                left: `${left}%`,
                width: `${width}%`,
              }}
            >
              <span className="text-xs font-bold text-[#131c0d] truncate">{item.title}</span>
              
              {/* Tooltip */}
              <div className="hidden group-hover/item:block absolute bottom-full mb-2 left-0 w-48 bg-black dark:bg-white text-white dark:text-black p-2 rounded text-xs z-50">
                <p className="font-bold">{item.title}</p>
                <p className="opacity-80">
                  {new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} -{' '}
                  {new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

