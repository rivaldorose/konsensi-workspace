'use client'

import { useState } from 'react'
import type { Event } from '@/types'

interface EventFiltersProps {
  onFilterChange: (filters: {
    status?: Event['status']
    type?: Event['type']
    priority?: Event['priority']
  }) => void
}

export function EventFilters({ onFilterChange }: EventFiltersProps) {
  const [timelineFilter, setTimelineFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState<Event['type'] | 'All'>('All')
  const [statusFilter, setStatusFilter] = useState<Event['status'] | 'All'>('All')

  const handleClearFilters = () => {
    setTimelineFilter('All')
    setTypeFilter('All')
    setStatusFilter('All')
    onFilterChange({})
  }

  const handleStatusChange = (status: Event['status'] | 'All') => {
    setStatusFilter(status)
    onFilterChange({
      status: status === 'All' ? undefined : status,
      type: typeFilter === 'All' ? undefined : typeFilter,
    })
  }

  const handleTypeChange = (type: Event['type'] | 'All') => {
    setTypeFilter(type)
    onFilterChange({
      status: statusFilter === 'All' ? undefined : statusFilter,
      type: type === 'All' ? undefined : type,
    })
  }

  return (
    <div className="flex flex-wrap gap-3 pb-2 border-b border-[#ecf3e7]">
      <div className="relative group">
        <button className="flex items-center gap-2 bg-white border border-[#ecf3e7] hover:border-gray-300 text-[#131b0d] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>Timeline: {timelineFilter}</span>
          <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
        </button>
      </div>

      <div className="relative group">
        <button className="flex items-center gap-2 bg-white border border-[#ecf3e7] hover:border-gray-300 text-[#131b0d] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>Type: {typeFilter}</span>
          <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
        </button>
      </div>

      <div className="relative group">
        <button className="flex items-center gap-2 bg-white border border-[#ecf3e7] hover:border-gray-300 text-[#131b0d] px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <span>Status: {statusFilter}</span>
          <span className="material-symbols-outlined text-[18px] text-gray-400">expand_more</span>
        </button>
      </div>

      <button
        onClick={handleClearFilters}
        className="ml-auto text-sm font-medium text-gray-500 hover:text-[#131b0d] flex items-center gap-1"
      >
        <span className="material-symbols-outlined text-[18px]">filter_list_off</span>
        Clear Filters
      </button>
    </div>
  )
}

