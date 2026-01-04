'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useNewsArticles, useNewsSources } from '@/hooks/useNews'
import { formatDistanceToNow } from 'date-fns'

const categoryIcons: Record<string, string> = {
  finance: 'paid',
  technology: 'memory',
  policy: 'policy',
  real_estate: 'domain',
  crypto: 'currency_bitcoin',
  agritech: 'nutrition',
  general: 'article',
  other: 'category',
}

const categoryColors: Record<string, string> = {
  finance: 'text-primary',
  technology: 'text-blue-600 dark:text-blue-400',
  policy: 'text-purple-600 dark:text-purple-400',
  real_estate: 'text-orange-600 dark:text-orange-400',
  crypto: 'text-primary',
  agritech: 'text-green-600 dark:text-green-400',
  general: 'text-gray-600 dark:text-gray-400',
  other: 'text-gray-600 dark:text-gray-400',
}

export default function NewsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sourceFilter, setSourceFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  const { data: articles = [], isLoading } = useNewsArticles({
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
    source: sourceFilter !== 'all' ? sourceFilter : undefined,
    dateRange: dateFilter !== 'all' ? dateFilter : undefined,
    search: searchQuery || undefined,
  })
  
  const { data: sources = [] } = useNewsSources()

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#131d0c] dark:text-white text-3xl font-black tracking-tight">Industry News Feed</h1>
          <p className="text-[#4b5945] dark:text-gray-400 font-medium">Monitor external market updates aggregated by n8n bots</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="group flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold text-[#131d0c] dark:text-white">Add News Source</span>
          </button>
          <button className="group flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-all bg-white dark:bg-transparent">
            <svg className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-bold">Refresh</span>
          </button>
        </div>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-[#2a3620] rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col lg:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full lg:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            className="block w-full pl-10 pr-3 py-2.5 border-none rounded-lg bg-[#f7f8f5] dark:bg-[#182210]/50 text-[#131c0d] dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-shadow"
            placeholder="Search keywords in articles..."
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="w-px h-8 bg-gray-200 dark:bg-gray-600 hidden lg:block"></div>
        {/* Dropdown Filters */}
        <div className="flex flex-wrap gap-3 w-full lg:w-auto flex-1">
          <select
            className="flex items-center gap-2 px-3 py-2 bg-[#f7f8f5] dark:bg-[#182210]/50 rounded-lg text-sm font-medium text-[#131c0d] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">Category: All</option>
            <option value="finance">Finance</option>
            <option value="technology">Technology</option>
            <option value="policy">Policy</option>
            <option value="real_estate">Real Estate</option>
            <option value="crypto">Crypto</option>
            <option value="agritech">AgriTech</option>
            <option value="general">General</option>
          </select>
          <select
            className="flex items-center gap-2 px-3 py-2 bg-[#f7f8f5] dark:bg-[#182210]/50 rounded-lg text-sm font-medium text-[#131c0d] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
          >
            <option value="all">Source: All</option>
            {sources.map(source => (
              <option key={source.id} value={source.id}>{source.name}</option>
            ))}
          </select>
          <select
            className="flex items-center gap-2 px-3 py-2 bg-[#f7f8f5] dark:bg-[#182210]/50 rounded-lg text-sm font-medium text-[#131c0d] dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Date: All</option>
            <option value="last_24h">Last 24h</option>
            <option value="last_week">Last Week</option>
            <option value="last_month">Last Month</option>
          </select>
        </div>
        {/* View Toggle */}
        <div className="flex bg-[#f7f8f5] dark:bg-[#182210]/50 rounded-lg p-1 ml-auto shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                : 'text-gray-500 hover:text-[#131c0d] dark:hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-1.5 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white dark:bg-gray-700 shadow-sm text-primary'
                : 'text-gray-500 hover:text-[#131c0d] dark:hover:text-white'
            }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>

      {/* News Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading news...</div>
        </div>
      ) : articles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#2a3620] rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
          <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-primary">
            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-lg font-bold text-[#131c0d] dark:text-white mb-1">No news articles found</p>
          <p className="text-[#4b5945] text-sm">Try adjusting your filters or check back later.</p>
        </div>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid'
            ? 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'
            : 'grid-cols-1'
        }`}>
          {articles.map((article) => {
            const category = article.category || 'general'
            const iconName = categoryIcons[category] || 'article'
            const colorClass = categoryColors[category] || 'text-gray-600'
            
            return (
              <Link key={article.id} href={`/news/${article.id}`}>
                <article className={`flex flex-col bg-white dark:bg-[#2a3620] rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow group cursor-pointer ${
                  article.is_saved ? 'border-l-4 border-l-primary' : ''
                }`}>
                  {article.image_url && (
                    <div className="relative h-48 w-full overflow-hidden">
                      {article.is_saved && (
                        <div className="absolute top-3 left-3 z-10">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                            Saved
                          </span>
                        </div>
                      )}
                      <div
                        className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                        style={{ backgroundImage: `url("${article.image_url}")` }}
                      />
                    </div>
                  )}
                  <div className="flex flex-col flex-1 p-5">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mb-2">
                      {category && (
                        <span className={`flex items-center gap-1 ${colorClass}`}>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          {category.charAt(0).toUpperCase() + category.slice(1).replace('_', ' ')}
                        </span>
                      )}
                      {article.source && (
                        <>
                          <span>•</span>
                          <span className="text-[#4b5945] dark:text-gray-400">{article.source.name}</span>
                        </>
                      )}
                      <span>•</span>
                      <span>{formatDistanceToNow(new Date(article.fetched_at), { addSuffix: true })}</span>
                    </div>
                    <h3 className="text-lg font-bold text-[#131c0d] dark:text-white leading-tight mb-3 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    {article.summary && (
                      <p className="text-sm text-[#4b5945] dark:text-gray-400 line-clamp-3 mb-4 flex-1">
                        {article.summary}
                      </p>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                      <span className="text-xs font-bold text-primary hover:text-primary/80 flex items-center gap-1">
                        Read Summary
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Toggle save functionality
                          }}
                          className="text-gray-400 hover:text-primary transition-colors"
                          title="Save for later"
                        >
                          <svg className="w-5 h-5" fill={article.is_saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                        </button>
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            // Share functionality
                          }}
                          className="text-gray-400 hover:text-primary transition-colors"
                          title="Share"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
