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

  const getIconSVG = (iconName: string) => {
    switch (iconName) {
      case 'rocket_launch':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" />
          </svg>
        )
      case 'monetization_on':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" />
          </svg>
        )
      case 'group':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
          </svg>
        )
      case 'smartphone':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7 2a2 2 0 00-2 2v12a2 2 0 002 2h6a2 2 0 002-2V4a2 2 0 00-2-2H7zm3 14a1 1 0 100-2 1 1 0 000 2z" />
          </svg>
        )
      case 'handshake':
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
          </svg>
        )
    }
  }

  return (
    <div className="grid grid-cols-12 gap-1 items-center group/lane relative z-10">
      <div className="col-span-2 flex items-center gap-2 pr-4">
        <div className="bg-[#ecf4e7] dark:bg-[#2a3820] p-1.5 rounded-lg text-primary">
          {getIconSVG(icon)}
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
            const borderClass =
              item.borderColor === 'border-blue-500'
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
