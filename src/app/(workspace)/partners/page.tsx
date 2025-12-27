'use client'

import Link from 'next/link'

const activePartners = [
  {
    id: 1,
    name: 'Delta Co',
    sector: 'Retail',
    since: '2022',
    initials: 'DC',
    avatarBg: 'bg-lime-100',
    avatarText: 'text-lime-800',
    contractValue: '€120k / yr',
    nextReview: 'Oct 2024',
    accountMgr: { initials: 'A', name: 'Alex K.', bg: 'bg-primary', text: 'text-[#131d0c]' },
    health: { status: 'Good', color: 'green' },
  },
  {
    id: 2,
    name: 'Konsensi Zuid',
    sector: 'Regional',
    since: '2021',
    initials: 'KZ',
    avatarBg: 'bg-blue-50',
    avatarText: 'text-blue-700',
    contractValue: 'Internal',
    nextReview: 'Dec 2024',
    accountMgr: { initials: 'M', name: 'Mike R.', bg: 'bg-orange-100', text: 'text-orange-800' },
    health: { status: 'Maintenance', color: 'gray' },
  },
]

const inGesprek = [
  {
    id: 3,
    name: 'John Doe Ltd',
    initials: 'JD',
    avatarBg: 'bg-purple-100',
    avatarText: 'text-purple-700',
    nextAction: 'Meeting: Tomorrow 2pm',
    priority: 'High',
    icon: 'calendar_month',
    iconColor: 'text-orange-600 dark:text-orange-400',
  },
  {
    id: 4,
    name: 'Green Solutions',
    initials: 'GS',
    avatarBg: 'bg-teal-100',
    avatarText: 'text-teal-700',
    nextAction: 'Terms negotiation',
    priority: 'Med',
    icon: 'forum',
    iconColor: 'text-gray-500 dark:text-gray-400',
  },
  {
    id: 5,
    name: 'Gamma LLC',
    initials: 'GL',
    avatarBg: 'bg-pink-100',
    avatarText: 'text-pink-700',
    nextAction: 'Proposal Sent',
    priority: 'High',
    icon: 'description',
    iconColor: 'text-purple-600 dark:text-purple-400',
  },
]

const toContact = [
  {
    id: 6,
    name: 'Acme Corp',
    initials: 'AC',
    avatarBg: 'bg-indigo-100',
    avatarText: 'text-indigo-700',
    nextAction: 'Follow up: Oct 24',
    priority: 'High',
    icon: 'event_busy',
    iconColor: 'text-red-600 dark:text-red-400',
  },
  {
    id: 7,
    name: 'Beta Inc.',
    initials: 'BI',
    avatarBg: 'bg-orange-100',
    avatarText: 'text-orange-700',
    nextAction: 'Initial outreach',
    priority: 'Med',
    icon: 'schedule',
    iconColor: 'text-gray-500 dark:text-gray-400',
  },
  {
    id: 8,
    name: 'Novus Logistics',
    initials: 'NL',
    avatarBg: 'bg-gray-100',
    avatarText: 'text-gray-700',
    nextAction: 'info@novus.nl',
    priority: 'Low',
    icon: 'mail',
    iconColor: 'text-gray-500 dark:text-gray-400',
  },
  {
    id: 9,
    name: 'StartUp Hub',
    initials: 'SH',
    avatarBg: 'bg-gray-100',
    avatarText: 'text-gray-500',
    nextAction: 'Website Inquiry',
    priority: null,
    icon: 'link',
    iconColor: 'text-gray-500 dark:text-gray-400',
    opacity: true,
  },
]

export default function PartnersPage() {
  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-8 px-4 md:px-8 py-8">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span>Workspace</span>
              <span className="material-symbols-outlined text-[16px]">chevron_right</span>
              <span className="text-[#131d0c] dark:text-gray-200 font-medium">Partners</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-[#131d0c] dark:text-white tracking-tight">Partners</h1>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input 
                className="block w-full py-2.5 pl-10 pr-3 text-sm text-[#131d0c] dark:text-white bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-gray-700 rounded-lg placeholder-gray-400 focus:ring-primary focus:border-primary focus:outline-none shadow-sm" 
                placeholder="Search partners..." 
                type="text"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">filter_list</span>
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
                <span className="material-symbols-outlined text-[20px]">swap_vert</span>
                <span>Sort</span>
              </button>
            </div>
            <Link 
              href="/partners/new"
              className="flex items-center justify-center gap-2 bg-[#131d0c] dark:bg-primary hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white dark:text-[#131d0c] px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              Add Partner
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-[#1f2b15] p-5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-primary/20 text-[#131d0c] dark:text-primary">
                <span className="material-symbols-outlined text-[24px]">verified</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-300 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +2
              </span>
            </div>
            <h3 className="text-3xl font-black text-[#131d0c] dark:text-white">8</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Partners</p>
          </div>

          <div className="bg-white dark:bg-[#1f2b15] p-5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400">
                <span className="material-symbols-outlined text-[24px]">forum</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#131d0c] dark:text-white">3</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">In Gesprek</p>
          </div>

          <div className="bg-white dark:bg-[#1f2b15] p-5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400">
                <span className="material-symbols-outlined text-[24px]">contact_phone</span>
              </div>
              <span className="flex items-center gap-1 text-xs font-bold text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-300 px-2 py-1 rounded-full">
                <span className="material-symbols-outlined text-[14px]">priority_high</span>
                1 Urgent
              </span>
            </div>
            <h3 className="text-3xl font-black text-[#131d0c] dark:text-white">4</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">To Contact</p>
          </div>

          <div className="bg-white dark:bg-[#1f2b15] p-5 rounded-xl border border-gray-200 dark:border-white/5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-2">
              <div className="p-2 rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300">
                <span className="material-symbols-outlined text-[24px]">groups</span>
              </div>
            </div>
            <h3 className="text-3xl font-black text-[#131d0c] dark:text-white">15</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Pipeline</p>
          </div>
        </div>

        {/* Active Partners Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
              Active Partners
              <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs px-2 py-0.5 rounded-full">8</span>
            </h2>
            <button className="text-sm font-bold text-primary hover:underline">View All</button>
          </div>
          <div className="flex flex-col gap-4">
            {activePartners.map((partner) => (
              <div 
                key={partner.id}
                className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 shadow-card p-5 flex flex-col lg:flex-row gap-6 items-start lg:items-center group hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-4 min-w-[240px]">
                  <div className={`w-12 h-12 rounded-full ${partner.avatarBg} flex items-center justify-center ${partner.avatarText} font-bold text-lg`}>
                    {partner.initials}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg text-[#131d0c] dark:text-white leading-tight">{partner.name}</h3>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{partner.sector} • Since {partner.since}</p>
                  </div>
                </div>
                <div className="hidden lg:block w-px h-10 bg-gray-100 dark:bg-white/10"></div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 flex-1 w-full lg:w-auto">
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Contract Value</p>
                    <div className="flex items-center gap-1.5 text-sm font-bold text-[#131d0c] dark:text-gray-200">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">payments</span>
                      {partner.contractValue}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Next Review</p>
                    <div className="flex items-center gap-1.5 text-sm font-medium text-[#131d0c] dark:text-gray-200">
                      <span className="material-symbols-outlined text-[16px] text-gray-400">event</span>
                      {partner.nextReview}
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Account Mgr</p>
                    <div className="flex items-center gap-1.5">
                      <div className={`w-5 h-5 rounded-full ${partner.accountMgr.bg} flex items-center justify-center text-[9px] ${partner.accountMgr.text} font-bold`}>
                        {partner.accountMgr.initials}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300">{partner.accountMgr.name}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1">Health</p>
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold ${
                      partner.health.color === 'green' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {partner.health.color === 'green' && <span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>}
                      {partner.health.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2 w-full lg:w-auto mt-2 lg:mt-0 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-white/5">
                  <button className="flex-1 lg:flex-none h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" title="Add Note">
                    <span className="material-symbols-outlined text-[20px]">edit_note</span>
                  </button>
                  <button className="flex-1 lg:flex-none h-10 w-10 flex items-center justify-center rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-500 dark:text-gray-400 transition-colors" title="Schedule Meeting">
                    <span className="material-symbols-outlined text-[20px]">calendar_add_on</span>
                  </button>
                  <Link 
                    href={`/partners/${partner.id}`}
                    className="flex-1 lg:flex-none h-10 px-4 bg-[#131d0c] dark:bg-primary text-white dark:text-[#131d0c] rounded-lg text-sm font-bold hover:opacity-90 transition-opacity flex items-center justify-center"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Layout - In Gesprek & To Contact */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* In Gesprek */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                In Gesprek
                <span className="bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">3</span>
              </h2>
              <button className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                Expand All <span className="material-symbols-outlined text-[16px]">expand_all</span>
              </button>
            </div>
            <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
              {inGesprek.map((partner, index) => (
                <Link 
                  key={partner.id}
                  href={`/partners/${partner.id}`}
                  className={`p-4 ${index < inGesprek.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''} hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group block`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${partner.avatarBg} ${partner.avatarText} flex items-center justify-center text-xs font-bold`}>
                        {partner.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#131d0c] dark:text-white">{partner.name}</h4>
                        <p className={`text-xs ${partner.iconColor} font-medium flex items-center gap-1 mt-0.5`}>
                          <span className="material-symbols-outlined text-[14px]">{partner.icon}</span>
                          {partner.nextAction}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {partner.priority && (
                        <span className={`hidden sm:inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          partner.priority === 'High' 
                            ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30'
                            : 'bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900/30'
                        }`}>
                          {partner.priority}
                        </span>
                      )}
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* To Contact */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                To Contact
                <span className="bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">4</span>
              </h2>
              <button className="text-xs font-bold text-gray-500 dark:text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                Expand All <span className="material-symbols-outlined text-[16px]">expand_all</span>
              </button>
            </div>
            <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
              {toContact.map((partner, index) => (
                <Link 
                  key={partner.id}
                  href={`/partners/${partner.id}`}
                  className={`p-4 ${index < toContact.length - 1 ? 'border-b border-gray-100 dark:border-white/5' : ''} hover:bg-gray-50 dark:hover:bg-white/5 transition-colors cursor-pointer group block ${partner.opacity ? 'opacity-75' : ''}`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${partner.avatarBg} ${partner.avatarText} flex items-center justify-center text-xs font-bold`}>
                        {partner.initials}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#131d0c] dark:text-white">{partner.name}</h4>
                        <p className={`text-xs ${partner.iconColor} font-medium flex items-center gap-1 mt-0.5`}>
                          <span className="material-symbols-outlined text-[14px]">{partner.icon}</span>
                          {partner.nextAction}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {partner.priority && (
                        <span className={`hidden sm:inline-block px-2 py-1 rounded text-[10px] font-bold uppercase ${
                          partner.priority === 'High' 
                            ? 'bg-red-50 text-red-600 border border-red-100 dark:bg-red-900/20 dark:text-red-300 dark:border-red-900/30'
                            : partner.priority === 'Med'
                            ? 'bg-yellow-50 text-yellow-600 border border-yellow-100 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-900/30'
                            : 'bg-green-50 text-green-600 border border-green-100 dark:bg-green-900/20 dark:text-green-300 dark:border-green-900/30'
                        }`}>
                          {partner.priority}
                        </span>
                      )}
                      <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
      </div>
    </div>
  )
}
