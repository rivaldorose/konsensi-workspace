'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useContract } from '@/hooks/useContracts'
import Link from 'next/link'

type TabType = 'overview' | 'documents' | 'reminders' | 'activity'

export default function ContractDetailPage() {
  const router = useRouter()
  const params = useParams()
  const contractId = params.id as string
  const { data: contract, isLoading } = useContract(contractId)
  const [activeTab, setActiveTab] = useState<TabType>('overview')

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#182210] rounded-2xl p-8">
          <div className="animate-pulse">Loading contract...</div>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-[#182210] rounded-2xl p-8">
          <p className="text-red-500">Contract not found</p>
          <button onClick={() => router.push('/contracts')} className="mt-4 px-4 py-2 bg-primary text-white rounded">
            Back to Contracts
          </button>
        </div>
      </div>
    )
  }

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return 'N/A'
    const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : currency === 'gbp' ? '£' : 'Rp'
    return `${currencySymbol}${value.toLocaleString()}`
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity" onClick={() => router.push('/contracts')}></div>

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
      <div
        className="relative w-full max-w-5xl h-[90vh] flex flex-col bg-[#fafcf8] dark:bg-[#182210] rounded-2xl shadow-2xl overflow-hidden border border-[#dae7cf] dark:border-[#2a3621] pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="shrink-0 border-b border-[#dae7cf] dark:border-[#2a3621] bg-[#fafcf8] dark:bg-[#182210] p-6 pb-0">
          {/* Title & Actions Row */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl md:text-[32px] font-bold text-[#131b0d] dark:text-white leading-tight">
                  {contract.name}
                </h1>
                <div className="flex gap-2">
                  {/* Status Badge */}
                  <div className="flex h-7 items-center justify-center gap-x-1.5 rounded-full bg-primary/10 pl-3 pr-3 border border-primary/20">
                    <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      />
                    </svg>
                    <p className="text-primary text-xs font-bold uppercase tracking-wide">{contract.status}</p>
                  </div>
                  {/* Type Badge */}
                  <div className="flex h-7 items-center justify-center rounded-full bg-[#ecf3e7] dark:bg-[#2a3621] px-3">
                    <p className="text-[#131b0d] dark:text-gray-200 text-xs font-medium">{contract.type}</p>
                  </div>
                </div>
              </div>
              <p className="text-[#6e9a4c] dark:text-gray-400 text-sm font-medium">
                Contract ID: {contract.id} • Last updated {contract.updated_at ? formatDate(contract.updated_at) : 'N/A'}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {/* Edit Button */}
              <button
                onClick={() => router.push(`/contracts/${contract.id}/edit`)}
                className="hidden sm:flex h-9 items-center justify-center rounded-lg px-4 bg-[#ecf3e7] dark:bg-[#2a3621] hover:bg-[#dce9d5] dark:hover:bg-[#35422a] text-[#131b0d] dark:text-white text-sm font-bold transition-colors"
              >
                Edit
              </button>
              {/* Download Button */}
              <button className="flex h-9 items-center justify-center rounded-lg px-4 bg-[#ecf3e7] dark:bg-[#2a3621] hover:bg-[#dce9d5] dark:hover:bg-[#35422a] text-[#131b0d] dark:text-white gap-2 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  />
                </svg>
                <span className="text-sm font-bold whitespace-nowrap">Download All</span>
              </button>
              {/* Close Button */}
              <button
                onClick={() => router.push('/contracts')}
                aria-label="Close modal"
                className="flex h-9 w-9 items-center justify-center rounded-lg hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {(
              [
                { id: 'overview', label: 'Overview' },
                { id: 'documents', label: 'Documents' },
                { id: 'reminders', label: 'Reminders' },
                { id: 'activity', label: 'Activity' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`cursor-pointer group flex flex-col items-center justify-center pb-[13px] pt-2 min-w-16 border-b-[3px] transition-all ${
                  activeTab === tab.id
                    ? 'border-primary'
                    : 'border-transparent'
                }`}
              >
                <span
                  className={`${
                    activeTab === tab.id
                      ? 'text-[#131b0d] dark:text-white'
                      : 'text-[#6e9a4c] dark:text-gray-400 group-hover:text-primary'
                  } font-bold text-sm tracking-[0.015em]`}
                >
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#fafcf8] dark:bg-[#182210]">
          {/* 1. OVERVIEW CONTENT */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621]">
                  <p className="text-[#6e9a4c] dark:text-gray-400 text-xs font-semibold uppercase mb-1">Total Value</p>
                  <p className="text-2xl font-bold text-[#131b0d] dark:text-white">
                    {formatCurrency(contract.value, contract.currency)}{' '}
                    <span className="text-sm font-normal text-gray-500">{contract.currency?.toUpperCase() || ''}</span>
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621]">
                  <p className="text-[#6e9a4c] dark:text-gray-400 text-xs font-semibold uppercase mb-1">Start Date</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      />
                    </svg>
                    <p className="text-lg font-bold text-[#131b0d] dark:text-white">{formatDate(contract.start_date)}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621]">
                  <p className="text-[#6e9a4c] dark:text-gray-400 text-xs font-semibold uppercase mb-1">End Date</p>
                  <div className="flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                      />
                    </svg>
                    <p className="text-lg font-bold text-[#131b0d] dark:text-white">{formatDate(contract.end_date)}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621]">
                  <p className="text-[#6e9a4c] dark:text-gray-400 text-xs font-semibold uppercase mb-1">Payment Terms</p>
                  <p className="text-lg font-bold text-[#131b0d] dark:text-white">Net 30</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Parties Section (Takes 2 cols) */}
                <div className="lg:col-span-2 flex flex-col gap-4">
                  <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Contract Parties</h3>
                  <div className="rounded-xl border border-[#dae7cf] dark:border-[#2a3621] bg-white dark:bg-[#1e2a16] overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#ecf3e7] dark:bg-[#2a3621] border-b border-[#dae7cf] dark:border-[#2a3621]">
                        <tr>
                          <th className="px-5 py-3 font-semibold text-[#131b0d] dark:text-gray-200">Entity Name</th>
                          <th className="px-5 py-3 font-semibold text-[#131b0d] dark:text-gray-200">Role</th>
                          <th className="px-5 py-3 font-semibold text-[#131b0d] dark:text-gray-200">Contact</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#dae7cf] dark:divide-[#2a3621]">
                        {contract.parties?.map((party, index) => (
                          <tr key={index} className="group hover:bg-[#fafcf8] dark:hover:bg-[#23301a] transition-colors">
                            <td className="px-5 py-4">
                              <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                  {party.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="font-medium text-[#131b0d] dark:text-white">{party.name}</span>
                              </div>
                            </td>
                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300 capitalize">{party.role}</td>
                            <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{party.email}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Renewal & Related (Takes 1 col) */}
                <div className="flex flex-col gap-6">
                  {/* Renewal Card */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Renewal Terms</h3>
                    <div className="p-5 rounded-xl bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621] space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6e9a4c] dark:text-gray-400">Auto-renewal</span>
                        <span className="text-sm font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                          {contract.auto_renewal ? 'Yes' : 'No'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-[#6e9a4c] dark:text-gray-400">Notice Period</span>
                        <span className="text-sm font-bold text-[#131b0d] dark:text-white">
                          {contract.renewal_notice_days || 'N/A'} Days
                        </span>
                      </div>
                      {contract.end_date && contract.auto_renewal && (
                        <div className="pt-3 border-t border-[#dae7cf] dark:border-[#2a3621]">
                          <p className="text-xs text-[#6e9a4c] dark:text-gray-400 mb-1">Next Action</p>
                          <div className="flex items-start gap-2">
                            <svg className="w-4 h-4 text-amber-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path
                                fillRule="evenodd"
                                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                              />
                            </svg>
                            <p className="text-sm font-medium text-[#131b0d] dark:text-white">
                              Review by {contract.renewal_notice_days ? new Date(contract.end_date).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Related Info */}
                  <div className="flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Related</h3>
                    <div className="p-5 rounded-xl bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621] space-y-3">
                      {contract.related_partner_id && (
                        <div>
                          <p className="text-xs text-[#6e9a4c] dark:text-gray-400 mb-1">Partner Profile</p>
                          <Link
                            href={`/partners/${contract.related_partner_id}/edit`}
                            className="flex items-center gap-1 text-primary hover:underline text-sm font-semibold"
                          >
                            View Partner Profile
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                          </Link>
                        </div>
                      )}
                      {contract.notes && (
                        <div>
                          <p className="text-xs text-[#6e9a4c] dark:text-gray-400 mb-1">Notes</p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 italic">&quot;{contract.notes}&quot;</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. DOCUMENTS CONTENT */}
          {activeTab === 'documents' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Attached Files (0)</h3>
                <button className="flex h-9 items-center justify-center rounded-lg px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm transition-colors gap-2">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                    <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                  </svg>
                  Upload New
                </button>
              </div>
              <div className="bg-white dark:bg-[#1e2a16] border border-[#dae7cf] dark:border-[#2a3621] rounded-xl overflow-hidden">
                {contract.document_url ? (
                  <div className="flex items-center justify-between p-4 border-b border-[#dae7cf] dark:border-[#2a3621] hover:bg-[#fafcf8] dark:hover:bg-[#23301a] group transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 dark:text-red-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#131b0d] dark:text-white group-hover:text-primary transition-colors">
                          {contract.document_url.split('/').pop()}
                        </p>
                        <p className="text-xs text-[#6e9a4c] dark:text-gray-400">Document</p>
                      </div>
                    </div>
                    <a
                      href={contract.document_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3621] text-gray-500 hover:text-[#131b0d] dark:text-gray-400 transition-colors"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                        />
                      </svg>
                    </a>
                  </div>
                ) : (
                  <div className="p-8 text-center text-gray-500">No documents attached</div>
                )}
              </div>
            </div>
          )}

          {/* 3. REMINDERS CONTENT */}
          {activeTab === 'reminders' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-[#131b0d] dark:text-white">Scheduled Reminders</h3>
                <button className="flex h-9 items-center justify-center rounded-lg px-4 bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-sm transition-colors gap-2">
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                  </svg>
                  Add Reminder
                </button>
              </div>
              <div className="grid gap-4">
                {contract.renewal_notice_days && contract.end_date && contract.auto_renewal && (
                  <div className="flex items-center p-4 bg-white dark:bg-[#1e2a16] border-l-4 border-l-amber-500 border-y border-r border-r-[#dae7cf] dark:border-r-[#2a3621] border-y-[#dae7cf] dark:border-y-[#2a3621] rounded-r-xl shadow-sm">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded">
                          Upcoming
                        </span>
                        <span className="text-xs text-[#6e9a4c] dark:text-gray-400">• Renewal Notice</span>
                      </div>
                      <p className="text-sm font-bold text-[#131b0d] dark:text-white">
                        Send {contract.renewal_notice_days}-day renewal notice to Client
                      </p>
                    </div>
                    <div className="text-right px-4 border-l border-[#dae7cf] dark:border-[#2a3621]">
                      <p className="text-xs text-[#6e9a4c] dark:text-gray-400 uppercase font-bold">Due Date</p>
                      <p className="text-sm font-bold text-[#131b0d] dark:text-white">
                        {new Date(contract.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="pl-4">
                      <button className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3621] text-gray-400">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )}
                {!contract.auto_renewal && (
                  <div className="p-8 text-center text-gray-500">No reminders scheduled</div>
                )}
              </div>
            </div>
          )}

          {/* 4. ACTIVITY CONTENT */}
          {activeTab === 'activity' && (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-lg font-bold text-[#131b0d] dark:text-white mb-6">Activity Timeline</h3>
              <div className="relative pl-8 border-l-2 border-[#dae7cf] dark:border-[#2a3621] space-y-8 ml-3">
                {/* Contract Created */}
                <div className="relative">
                  <div className="absolute -left-[41px] h-6 w-6 rounded-full bg-primary border-4 border-white dark:border-[#182210] shadow-sm"></div>
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                    <div>
                      <p className="text-sm font-bold text-[#131b0d] dark:text-white">Contract Created</p>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Contract created by <span className="font-semibold text-[#131b0d] dark:text-white">{contract.owner?.full_name || 'Unknown'}</span>
                      </p>
                    </div>
                    <span className="text-xs font-medium text-[#6e9a4c] dark:text-gray-500 whitespace-nowrap">
                      {formatDate(contract.created_at)}
                    </span>
                  </div>
                </div>
                {/* Contract Updated */}
                {contract.updated_at && contract.updated_at !== contract.created_at && (
                  <div className="relative">
                    <div className="absolute -left-[41px] h-6 w-6 rounded-full bg-[#ecf3e7] border-4 border-white dark:border-[#182210]"></div>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
      <div>
                        <p className="text-sm font-bold text-[#131b0d] dark:text-white">Contract Updated</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          Last updated by <span className="font-semibold text-[#131b0d] dark:text-white">{contract.owner?.full_name || 'Unknown'}</span>
                        </p>
                      </div>
                      <span className="text-xs font-medium text-[#6e9a4c] dark:text-gray-500 whitespace-nowrap">
                        {formatDate(contract.updated_at)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 p-4 border-t border-[#dae7cf] dark:border-[#2a3621] bg-gray-50 dark:bg-[#1a2312] flex justify-between items-center text-xs text-[#6e9a4c] dark:text-gray-500">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
              />
            </svg>
            <span>Confidential • Visible to Admin &amp; Legal Team</span>
          </div>
          <span>Konsensi Workspace v2.4</span>
        </div>
      </div>
    </div>
    </>
  )
}
