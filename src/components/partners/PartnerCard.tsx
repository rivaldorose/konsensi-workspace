import type { Partner } from '@/types'

interface PartnerCardProps {
  partner: Partner
  variant: 'full' | 'compact'
  isExpanded?: boolean
  onToggle?: (id: string) => void
}

export function PartnerCard({ partner, variant, isExpanded, onToggle }: PartnerCardProps) {
  // Get initials for avatar
  const initials = partner.name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  // Avatar color based on name
  const avatarColors = ['bg-lime-100 text-lime-800', 'bg-blue-50 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-teal-100 text-teal-700', 'bg-pink-100 text-pink-700', 'bg-indigo-100 text-indigo-700', 'bg-orange-100 text-orange-700']
  const colorIndex = partner.name.charCodeAt(0) % avatarColors.length
  const avatarColor = avatarColors[colorIndex]


  if (variant === 'full') {
    // Full Active Partner Card
    return (
      <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 shadow-card p-5 flex flex-col lg:flex-row gap-6 items-start lg:items-center group hover:border-primary/50 transition-colors">
        {/* Partner Info */}
        <div className="flex items-center gap-4 min-w-[240px]">
          <div className={`w-12 h-12 rounded-full ${avatarColor} flex items-center justify-center font-bold text-lg`}>
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-lg text-[#131d0c] dark:text-white leading-tight">
              {partner.name}
            </h3>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {partner.sector} • Since {partner.partnership_start ? new Date(partner.partnership_start).getFullYear() : 'N/A'}
            </p>
          </div>
        </div>

        <div className="hidden lg:block w-px h-10 bg-gray-100 dark:bg-white/10"></div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full lg:w-auto">
          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Contract Value</p>
            <div className="flex items-center gap-1.5 text-sm font-bold text-[#131d0c] dark:text-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
                <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" />
              </svg>
              {partner.annual_value ? `€${(partner.annual_value / 1000).toFixed(0)}k / yr` : 'Internal'}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Next Review</p>
            <div className="flex items-center gap-1.5 text-sm font-medium text-[#131d0c] dark:text-gray-200">
              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" />
              </svg>
              {partner.contract_end ? new Date(partner.contract_end).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'N/A'}
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Account Mgr</p>
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[9px] text-[#131d0c] font-bold">
                A
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Assigned
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Health</p>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
              Good
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-white/5">
          <button 
            className="flex-1 lg:flex-none h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" 
            title="Add Note"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </button>
          <button 
            className="flex-1 lg:flex-none h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" 
            title="Schedule Meeting"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="flex-1 lg:flex-none h-10 px-4 bg-[#131d0c] dark:bg-primary text-white dark:text-[#131d0c] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity">
            View Details
          </button>
        </div>
      </div>
    )
  }

  // Compact Card (for In Gesprek / To Contact)
  return (
    <div 
      className="p-4 border-b last:border-b-0 border-gray-100 dark:border-white/5 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group"
      onClick={() => onToggle?.(partner.id)}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold`}>
            {initials}
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#131d0c] dark:text-white">
              {partner.name}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1 mt-0.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              {partner.contact_email || partner.next_action || 'No action set'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <svg className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
          </svg>
        </div>
      </div>
    </div>
  )
}

