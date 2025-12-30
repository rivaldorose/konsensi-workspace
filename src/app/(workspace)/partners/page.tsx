'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePartners, usePartnerStats } from '@/hooks/usePartners'
import { PartnerStatsCards } from '@/components/partners/PartnerStatsCards'
import { PartnerCard } from '@/components/partners/PartnerCard'

export default function PartnersPage() {
  const { data: partners, isLoading } = usePartners()
  const stats = usePartnerStats(partners)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedPartners, setExpandedPartners] = useState<string[]>([])

  const toggleExpand = (partnerId: string) => {
    setExpandedPartners(prev =>
      prev.includes(partnerId)
        ? prev.filter(id => id !== partnerId)
        : [...prev, partnerId]
    )
  }

  const expandAll = (status: string) => {
    const partnerIds = partners
      ?.filter(p => p.status === status)
      .map(p => p.id) || []
    setExpandedPartners(prev => [...new Set([...prev, ...partnerIds])])
  }

  // Filter partners
  const filteredPartners = partners?.filter(partner =>
    partner.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.sector?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    partner.contact_name?.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  // Group by status
  const activePartners = filteredPartners.filter(p => p.status === 'active')
  const inGesprekPartners = filteredPartners.filter(p => p.status === 'in_gesprek')
  const toContactPartners = filteredPartners.filter(p => p.status === 'to_contact')

  return (
    <div className="w-full max-w-[1400px] mx-auto flex flex-col gap-8 px-4 md:px-8 py-8">
      {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
              <span>Workspace</span>
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
            </svg>
              <span className="text-[#131d0c] dark:text-gray-200 font-medium">Partners</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#131d0c] dark:text-white tracking-tight">
            Partners
          </h1>
        </div>

        {/* Search & Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
              </svg>
              </div>
              <input 
                className="block w-full py-2.5 pl-10 pr-3 text-sm text-[#131d0c] dark:text-white bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-gray-700 rounded-lg placeholder-gray-400 focus:ring-primary focus:border-primary focus:outline-none shadow-sm" 
                placeholder="Search partners..." 
                type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" />
              </svg>
                <span>Filter</span>
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/5 transition-colors shadow-sm">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h7a1 1 0 100-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM15 8a1 1 0 10-2 0v5.586l-1.293-1.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L15 13.586V8z" />
              </svg>
                <span>Sort</span>
              </button>
            </div>

            <Link 
              href="/partners/new"
              className="flex items-center justify-center gap-2 bg-[#131d0c] dark:bg-primary hover:bg-opacity-90 dark:hover:bg-opacity-90 text-white dark:text-[#131d0c] px-5 py-2.5 rounded-lg font-bold text-sm shadow-md transition-all active:scale-95 whitespace-nowrap"
            >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
            </svg>
              Add Partner
            </Link>
          </div>
        </div>

      {/* Stats Cards */}
      <PartnerStatsCards stats={stats} loading={isLoading} />

        {/* Active Partners Section */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
              Active Partners
            <span className="bg-primary/20 text-primary-dark dark:text-primary text-xs px-2 py-0.5 rounded-full">
              {activePartners.length}
            </span>
            </h2>
          <button className="text-sm font-bold text-primary hover:underline">
            View All
          </button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 p-5 animate-pulse">
                <div className="h-20"></div>
              </div>
            ))}
          </div>
        ) : activePartners.length === 0 ? (
          <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 p-8 text-center">
            <p className="text-gray-500 dark:text-gray-400">No active partners yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {activePartners.map(partner => (
              <PartnerCard
                key={partner.id}
                partner={partner}
                variant="full"
              />
            ))}
          </div>
        )}
        </div>

      {/* In Gesprek & To Contact Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* In Gesprek */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                In Gesprek
              <span className="bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {inGesprekPartners.length}
              </span>
              </h2>
            </div>

            <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
            {inGesprekPartners.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No partners in gesprek
              </div>
            ) : (
              inGesprekPartners.map(partner => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  variant="compact"
                  isExpanded={expandedPartners.includes(partner.id)}
                  onToggle={toggleExpand}
                />
              ))
            )}
            </div>
          </div>

          {/* To Contact */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                To Contact
              <span className="bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400 text-xs px-2 py-0.5 rounded-full">
                {toContactPartners.length}
              </span>
              </h2>
            </div>

            <div className="bg-white dark:bg-[#1f2b15] rounded-xl border border-gray-200 dark:border-white/5 overflow-hidden shadow-sm">
            {toContactPartners.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                No partners to contact
              </div>
            ) : (
              toContactPartners.map(partner => (
                <PartnerCard
                  key={partner.id}
                  partner={partner}
                  variant="compact"
                  isExpanded={expandedPartners.includes(partner.id)}
                  onToggle={toggleExpand}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
