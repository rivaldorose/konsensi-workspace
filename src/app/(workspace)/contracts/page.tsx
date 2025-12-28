'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useContracts } from '@/hooks/useContracts'
import { format } from 'date-fns'

// Helper function to get SVG icon component based on contract type
const getTypeIcon = (type: string) => {
  switch (type) {
    case 'service':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
        </svg>
      )
    case 'employment':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
      )
    case 'partnership':
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    default:
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case 'service':
      return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
    case 'employment':
      return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
    case 'partnership':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'active':
      return {
        color: 'bg-[#ecf3e7] text-[#5abd0f] border-[#5abd0f]/20',
        dot: 'bg-[#5abd0f]',
        label: 'Active'
      }
    case 'draft':
      return {
        color: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
        dot: 'bg-gray-400',
        label: 'Draft'
      }
    case 'expired':
      return {
        color: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
        dot: 'bg-red-500',
        label: 'Expired'
      }
    case 'terminated':
      return {
        color: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
        dot: 'bg-red-500',
        label: 'Terminated'
      }
    default:
      return {
        color: 'bg-gray-100 text-gray-600 border border-gray-200',
        dot: 'bg-gray-400',
        label: status
      }
  }
}

export default function ContractsPage() {
  const { data: contracts = [], isLoading } = useContracts()
  const [expandedRow, setExpandedRow] = useState<string | null>(null)

  const toggleRow = (id: string) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8 pt-16">
        <div className="flex items-center justify-center py-20">
          <div className="text-gray-400">Loading contracts...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 px-4 sm:px-6 lg:px-8 py-8 pt-16">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[#131b0d] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
            Contracten &amp; Overeenkomsten
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1 text-sm">
            Manage, track, and organize all your legal agreements in one place.
          </p>
        </div>
        <Link 
          href="/contracts/new"
          className="flex items-center gap-2 bg-primary hover:bg-[#4da30c] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors cursor-pointer group"
        >
          <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Contract
        </Link>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="bg-white dark:bg-[#1f2b16] rounded-xl shadow-sm border border-[#ecf3e7] dark:border-[#2a3622] p-4 flex flex-col gap-4">
        {/* Top Row: Search & Filters */}
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Search */}
          <div className="relative flex-1 max-w-lg group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input 
              className="block w-full pl-10 pr-3 py-2.5 border border-[#dae7cf] dark:border-[#2a3622] rounded-lg leading-5 bg-[#fafcf8] dark:bg-[#182210] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" 
              placeholder="Search contracts by name, party, or keyword..." 
              type="text"
            />
          </div>
        </div>
        {/* Bottom Row: Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecf3e7] dark:bg-[#2a3622] text-[#131b0d] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#36442c] transition-colors whitespace-nowrap">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold transition-colors whitespace-nowrap">
            <svg className="w-[18px] h-[18px]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Active
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-[#dae7cf] dark:border-[#2a3622] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#182210] transition-colors whitespace-nowrap">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Draft
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-[#dae7cf] dark:border-[#2a3622] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#182210] transition-colors whitespace-nowrap">
            <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Expired
          </button>
        </div>
      </div>

      {/* Contracts Table */}
      {contracts.length === 0 ? (
        <div className="bg-white dark:bg-[#1f2b16] rounded-xl shadow-sm border border-[#ecf3e7] dark:border-[#2a3622] p-12">
          <div className="flex flex-col items-center justify-center text-center">
            <div className="size-16 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-[#131b0d] dark:text-white mb-2">No contracts yet</h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">Get started by creating your first contract</p>
            <Link
              href="/contracts/new"
              className="flex items-center gap-2 bg-primary hover:bg-[#4da30c] text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-sm transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create Your First Contract
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white dark:bg-[#1f2b16] rounded-xl shadow-sm border border-[#ecf3e7] dark:border-[#2a3622] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="bg-[#fafcf8] dark:bg-[#182210] border-b border-[#ecf3e7] dark:border-[#2a3622]">
                  <th className="py-4 pl-6 pr-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Contract Name</th>
                  <th className="py-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Type</th>
                  <th className="py-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Parties</th>
                  <th className="py-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Status</th>
                  <th className="py-4 px-3 text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Duration</th>
                  <th className="py-4 pl-3 pr-6 text-right text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ecf3e7] dark:divide-[#2a3622]">
                {contracts.map((contract) => {
                  const statusConfig = getStatusConfig(contract.status)
                  const isExpanded = expandedRow === contract.id
                  const typeColor = getTypeColor(contract.type)

                  return (
                    <tr 
                      key={contract.id}
                      className={`${isExpanded ? 'bg-[#fafcf8] dark:bg-[#1c2612] border-l-4 border-l-orange-500' : 'hover:bg-gray-50 dark:hover:bg-[#25321c]'} transition-colors cursor-pointer group`}
                      onClick={() => toggleRow(contract.id)}
                    >
                      <td className={`py-4 ${isExpanded ? 'pl-5 pr-3' : 'pl-6 pr-3'}`}>
                        <div className="flex items-center gap-3">
                          <div className={`size-8 rounded-lg ${typeColor} flex items-center justify-center`}>
                            {getTypeIcon(contract.type)}
                          </div>
                          <div>
                            <p className="font-bold text-[#131b0d] dark:text-white text-sm">{contract.name}</p>
                            <p className="text-xs text-gray-500">ID: {contract.id.slice(0, 8)}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-3">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 capitalize">{contract.type}</span>
                      </td>
                      <td className="py-4 px-3">
                        <div className="flex -space-x-2">
                          {contract.parties?.slice(0, 2).map((party, idx) => (
                            <div key={idx} className="size-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#1f2b16]">
                              {party.name.charAt(0).toUpperCase()}
                            </div>
                          ))}
                        </div>
                        {contract.parties && contract.parties.length > 0 && (
                          <span className="text-xs text-gray-500 ml-2">{contract.parties[0].name}</span>
                        )}
                      </td>
                      <td className="py-4 px-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusConfig.color}`}>
                          <span className={`size-1.5 rounded-full ${statusConfig.dot}`}></span>
                          {statusConfig.label}
                        </span>
                      </td>
                      <td className="py-4 px-3">
                        <p className="text-sm text-[#131b0d] dark:text-white">
                          {contract.start_date ? format(new Date(contract.start_date), 'MMM d, yyyy') : 'No start date'}
                          {contract.end_date && ` - ${format(new Date(contract.end_date), 'MMM d, yyyy')}`}
                        </p>
                        {contract.auto_renewal && (
                          <p className="text-xs text-gray-500">Auto-renewal</p>
                        )}
                      </td>
                      <td className="py-4 pl-3 pr-6 text-right">
                        {isExpanded ? (
                          <button 
                            className="text-gray-600 dark:text-gray-300 hover:text-[#131b0d] p-1 rounded-full bg-white dark:bg-[#2a3622] shadow-sm border border-gray-100 dark:border-[#36442c]"
                            onClick={(e) => { e.stopPropagation(); toggleRow(contract.id); }}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                        ) : (
                          <Link
                            href={`/contracts/${contract.id}`}
                            className="inline-block text-gray-400 hover:text-[#131b0d] dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#36442c] transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
