'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useGoals } from '@/hooks/useGoals'
import { useDocuments } from '@/hooks/useDocuments'
import { usePartners } from '@/hooks/usePartners'
import { useApps } from '@/hooks/useApps'

type FilterType = 'all' | 'docs' | 'goals' | 'chats' | 'partners' | 'apps' | 'people'

function SearchPageContent() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ''

  const [activeFilter, setActiveFilter] = useState<FilterType>('all')
  const [sortBy, setSortBy] = useState('relevance')
  const [modifiedFilter, setModifiedFilter] = useState('anytime')

  // Fetch data (mock filtering for now - in real app would search all tables)
  const { data: allGoals } = useGoals()
  const { data: allDocuments } = useDocuments()
  const { data: allPartners } = usePartners()
  const { data: allApps } = useApps()

  // Filter results based on query (simplified - in real app would use full-text search)
  const filteredGoals = allGoals?.filter((goal) =>
    goal.title.toLowerCase().includes(query.toLowerCase())
  ) || []
  const filteredDocuments = allDocuments?.filter((doc) =>
    doc.title.toLowerCase().includes(query.toLowerCase())
  ) || []
  const filteredPartners = allPartners?.filter((partner) =>
    partner.name.toLowerCase().includes(query.toLowerCase())
  ) || []
  const filteredApps = allApps?.filter((app) =>
    app.name.toLowerCase().includes(query.toLowerCase())
  ) || []

  // Mock chat messages (would need actual chat messages hook)
  const mockChatMessages = [
    {
      id: '1',
      user: { full_name: 'Alex Morgan', avatar_url: '' },
      channel: 'marketing-general',
      message: `Hey team, did anyone see the updated folder for ${query} assets? I can't find the logos.`,
      time: '10:42 AM',
      online: true,
    },
    {
      id: '2',
      user: { full_name: 'Emily Chen', avatar_url: '' },
      channel: 'announcements',
      message: `Just a reminder that the ${query} kickoff meeting is happening tomorrow at 2 PM.`,
      time: 'Yesterday',
      online: false,
    },
  ]

  const filters: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'docs', label: 'Docs' },
    { id: 'goals', label: 'Goals' },
    { id: 'chats', label: 'Chats' },
    { id: 'partners', label: 'Partners' },
    { id: 'apps', label: 'Apps' },
    { id: 'people', label: 'People' },
  ]

  const highlightText = (text: string, query: string) => {
    if (!query) return text
    const parts = text.split(new RegExp(`(${query})`, 'gi'))
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="bg-primary/20 text-[#3f8807] dark:text-[#65da0b] font-bold px-1 rounded">
          {part}
        </span>
      ) : (
        part
      )
    )
  }

  return (
    <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Page Header & Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
            Search results for '<span className="text-primary">{query || '...'}</span>'
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Found {filteredDocuments.length + filteredGoals.length + mockChatMessages.length + filteredPartners.length + filteredApps.length} results in 0.42 seconds
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 dark:hover:bg-surface-hover-dark transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-10zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
            </svg>
            Advanced Filters
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-4 mb-10 pb-4 border-b border-gray-200 dark:border-gray-800">
        {/* Pills */}
        <div className="flex-1 overflow-x-auto hide-scrollbar">
          <div className="flex items-center gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full font-semibold text-sm transition-colors ${
                  activeFilter === filter.id
                    ? 'bg-primary text-[#131c0d]'
                    : 'bg-gray-100 dark:bg-surface-dark text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-hover-dark font-medium'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        {/* Sort Dropdowns */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center">
            <span className="text-xs font-semibold uppercase text-gray-500 mr-2">Sort by:</span>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white hover:text-primary">
              Relevance
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>
          <div className="h-4 w-px bg-gray-300 dark:bg-gray-700"></div>
          <div className="relative flex items-center">
            <span className="text-xs font-semibold uppercase text-gray-500 mr-2">Modified:</span>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-900 dark:text-white hover:text-primary">
              Any time
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Results Sections */}
      <div className="space-y-12">
        {/* Section: Documents */}
        {(activeFilter === 'all' || activeFilter === 'docs') && filteredDocuments.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  />
                </svg>
                Documents ({filteredDocuments.length})
              </h3>
              <Link
                href="/docs"
                className="text-sm font-semibold text-primary hover:text-[#5bc40a] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDocuments.slice(0, 3).map((doc) => (
                <div
                  key={doc.id}
                  className="group bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-[#2a3620] rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                      </svg>
                    </div>
                    <button className="text-gray-400 hover:text-primary">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </button>
                  </div>
                  <h4 className="font-bold text-lg mb-2 text-gray-900 dark:text-white group-hover:text-primary transition-colors">
                    {highlightText(doc.title, query)}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 flex-1">
                    {highlightText(doc.title, query)}...
                  </p>
                  <div className="mt-auto pt-4 border-t border-gray-100 dark:border-[#2a3620] flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        Edited {doc.last_edited ? new Date(doc.last_edited).toLocaleDateString() : 'recently'}
                      </span>
                    </div>
                    <Link
                      href={`/docs/${doc.id}`}
                      className="text-xs font-bold text-primary hover:underline"
                    >
                      Open Document
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Goals */}
        {(activeFilter === 'all' || activeFilter === 'goals') && filteredGoals.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                  />
                </svg>
                Goals ({filteredGoals.length})
              </h3>
              <Link
                href="/roadmap"
                className="text-sm font-semibold text-primary hover:text-[#5bc40a] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredGoals.slice(0, 2).map((goal) => (
                <div
                  key={goal.id}
                  className="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-[#2a3620] rounded-xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4"
                >
                  <div className="size-12 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 w-full">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-gray-900 dark:text-white">
                        {highlightText(goal.title, query)}
                      </h4>
                      <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                        {goal.status === 'on_track' ? 'ON TRACK' : goal.status?.toUpperCase() || 'NOT STARTED'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                      <span>Due {goal.target_date ? new Date(goal.target_date).toLocaleDateString() : 'N/A'}</span>
                      <span>•</span>
                      <span>Owner: {goal.owner?.full_name || 'Unknown'}</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${goal.progress || 0}%` }}
                      ></div>
                    </div>
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                        {goal.progress || 0}% Complete
                      </span>
                    </div>
                  </div>
                  <Link
                    href={`/roadmap/${goal.id}/edit`}
                    className="shrink-0 text-sm font-semibold text-gray-500 hover:text-primary whitespace-nowrap px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                  >
                    View Goal
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Chat Messages */}
        {(activeFilter === 'all' || activeFilter === 'chats') && mockChatMessages.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                  />
                </svg>
                Chat Messages ({mockChatMessages.length})
              </h3>
              <Link
                href="/chat"
                className="text-sm font-semibold text-primary hover:text-[#5bc40a] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-[#2a3620] rounded-xl divide-y divide-gray-100 dark:divide-[#2a3620]">
              {mockChatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 hover:bg-surface-hover-light dark:hover:bg-surface-hover-dark transition-colors flex gap-4"
                >
                  <div className="relative shrink-0">
                    <div className="size-10 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-xs font-bold text-gray-600">
                        {msg.user.full_name.charAt(0)}
                      </span>
                    </div>
                    {msg.online && (
                      <div className="absolute bottom-0 right-0 size-3 bg-green-500 border-2 border-white dark:border-[#223018] rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-2">
                        <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                          {msg.user.full_name}
                        </h5>
                        <span className="text-xs text-gray-500">in #{msg.channel}</span>
                      </div>
                      <span className="text-xs text-gray-400">{msg.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {highlightText(msg.message, query)}
                    </p>
                  </div>
                  <Link
                    href="/chat"
                    className="self-center opacity-0 group-hover:opacity-100 px-3 py-1.5 text-xs font-bold text-primary border border-primary/20 rounded-lg hover:bg-primary hover:text-black transition-all"
                  >
                    Jump to
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Partners */}
        {(activeFilter === 'all' || activeFilter === 'partners') && filteredPartners.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Partners ({filteredPartners.length})
              </h3>
              <Link
                href="/partners"
                className="text-sm font-semibold text-primary hover:text-[#5bc40a] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPartners.slice(0, 1).map((partner) => (
                <div
                  key={partner.id}
                  className="group bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-[#2a3620] rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 flex items-center gap-4"
                >
                  <div className="size-12 rounded-lg bg-gray-100 dark:bg-white/10 flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {highlightText(partner.name, query)}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">
                      Partner since {partner.partnership_start ? new Date(partner.partnership_start).getFullYear() : 'N/A'} • {partner.sector}
                    </p>
                  </div>
                  <Link
                    href={`/partners/${partner.id}/edit`}
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Apps */}
        {(activeFilter === 'all' || activeFilter === 'apps') && filteredApps.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Apps ({filteredApps.length})
              </h3>
              <Link
                href="/apps"
                className="text-sm font-semibold text-primary hover:text-[#5bc40a] transition-colors"
              >
                View All
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredApps.slice(0, 1).map((app) => (
                <div
                  key={app.id}
                  className="group bg-surface-light dark:bg-surface-dark border border-gray-100 dark:border-[#2a3620] rounded-xl p-5 hover:shadow-lg hover:border-primary/30 transition-all duration-200 flex items-center gap-4"
                >
                  <div className="size-12 rounded-lg bg-blue-600 flex items-center justify-center shrink-0 text-white">
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {highlightText(app.name, query)}
                    </h4>
                    <p className="text-xs text-gray-500 truncate">{app.category || 'App'}</p>
                  </div>
                  <Link
                    href={`/apps/${app.id}/edit`}
                    className="shrink-0 text-sm font-semibold text-primary hover:underline"
                  >
                    View
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Pagination / Load More */}
      <div className="mt-16 flex justify-center pb-12">
        <button className="px-6 py-2.5 rounded-lg bg-white dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-sm font-semibold hover:bg-gray-50 dark:hover:bg-surface-hover-dark transition-colors shadow-sm">
          Load more results
        </button>
      </div>
    </main>
  )
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
      </div>
        </main>
      }
    >
      <SearchPageContent />
    </Suspense>
  )
}
