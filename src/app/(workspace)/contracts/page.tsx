'use client'

import { ContractsNav } from '@/components/layout/ContractsNav'
import Link from 'next/link'
import { useState } from 'react'

const contracts = [
  {
    id: 1,
    name: 'SaaS Licensing Agreement',
    contractId: 'K-2024-001',
    type: 'Software License',
    typeIcon: 'description',
    typeColor: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    partyName: 'Acme Corp',
    partyAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7pWPXBEYu6Jl4WCYi4fvvymwCqy-h9OmPUJvsI7g2bYzgOBXN9lBcYDQyXBH00FjzeMvoSiFxCd6zuF1WjTgq3UNKK_jfuYKqh_qDn8RoRKGO7VWno8BjBHjGE-d986tNrDFfgQvQY6qUpPYOOieGq942BCCFIY67HOcOudLX-U0YBvC843dsvyCO8_NQA6ZjckTh3dadX_lHF98YOo3udc2aZGRDQt1Jf5-hfZSmDUhbaSe0-zWv52pZNRVBYhR72AsKuI9RQzTf',
    status: 'Active',
    statusColor: 'bg-[#ecf3e7] text-[#5abd0f] border-[#5abd0f]/20',
    statusDot: 'bg-[#5abd0f]',
    duration: 'Jan 01 - Dec 31, 2024',
    durationNote: 'Auto-renewal',
    expanded: false,
  },
  {
    id: 2,
    name: 'Marketing Service Retainer',
    contractId: 'K-2023-089',
    type: 'Service',
    typeIcon: 'handshake',
    typeColor: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    partyName: 'Creative Agency',
    partyAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAKCii20f4CCTnZCC9UJGjmaPxEO17qWdG2U8j7hTmRP2be2SoC-1gnjg5MMBLfHxXuCCfLShg931Yth6trg19SCuglgl5zZQ7hdvUmbYktJ25-_t_1Ow6Z2iFs_eNYjHnkP3o8ETh-lmp7bP4nl57llDU8BHc1ov9W9g9Ia0oKG7GICDrwHS6t5ydMtimNJ_10F1a-3DHDSpqaw-z1JTsxONTdOlQjwZkDmssitEb_NPciJoVdyUhtjtpgOTbSAGBIIEkGlYntCNzR',
    status: 'Expiring Soon',
    statusColor: 'bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/20 dark:border-orange-800',
    statusDot: 'bg-orange-500 animate-pulse',
    duration: 'Sep 01 - Aug 31, 2024',
    durationNote: '14 days left',
    durationNoteColor: 'text-red-500',
    expanded: true,
    details: {
      totalValue: '€24,000.00',
      paymentTerms: 'Net 30',
      renewalType: 'Manual Review',
      noticePeriod: '60 Days',
      owner: {
        name: 'Sarah De Vries',
        role: 'Internal Owner',
        avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCSQPhgE--TkVIbXjxF_oXx275IKYzqiZ_sE_yxzK3Tqg7aAEB3z0OAYuxV99JkQLisNipvjh7hRwm-qViCaHNxRPrFrY3LMVTD72g0I1wsk6ysOVJV3btsWEXRXwy7N0X6q6hl7Q-BfoGZwFGFfThVc0vWhHYrV0ymUVP8GmYC4ojkCmtdK54w7ztHufQe3PkKwIjz471M1H7_9D8QuiCVp2SUZ5Z3cyZxfaE35bxjdLn2kAly9UiBzbTXj6m2pCYhS4BJTcOxrXFC',
      },
      document: 'marketing_agreement_v2_signed.pdf',
    },
  },
  {
    id: 3,
    name: 'Employment: J. Doe',
    contractId: 'K-2024-HR05',
    type: 'Employment',
    typeIcon: 'badge',
    typeColor: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
    partyName: 'John Doe',
    partyAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDaRqRcuMlgsAn6s0QG0HlcHYNsHQRmfRxgF_N47HAMthzTrCkSQ0Dtj_nxDmOxlINmvd4wU4v3OMW5Uszsxy8S_3YzO5DxbOpBpUokSgNttO2zDP9z10ZE94V2TmQjYGgDPPswRvd_KVKjTPaXWCndxTmBBmqHJBqIPTli89uv4vanpN4XoINT5a097sUGzt_72aa2StpRuWry8soBDM1L0UsFk8bRV9t5UkKJXUWwus_0-aKUheSz3T97FpRIcwySk4cyKePKzU9F',
    status: 'Pending Sig',
    statusColor: 'bg-gray-100 text-gray-600 border border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700',
    statusDot: 'bg-gray-400',
    duration: 'Start: Mar 01, 2024',
    durationNote: 'Indefinite',
    expanded: false,
  },
  {
    id: 4,
    name: 'Office Lease - Old',
    contractId: 'K-2020-001',
    type: 'Real Estate',
    typeIcon: 'history_edu',
    typeColor: 'bg-gray-100 dark:bg-gray-800 text-gray-500',
    partyName: 'PropCo Ltd',
    partyAvatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBFAp9gaioV7TcInOSRMp4XUkCwbcVQ7ngeV6GIgAH-O7MMH6LwxJdaSOr9M09pjclacGpbEtifk_ok9LfMtMVs5Z5uGHYZ21uF5GNUFle4RHcVGFj3vTb3o7oHFg2Aa4EtytEnNcCVDLTeGXslqRyzhPaKRpIcVEHuD7JVfoCz-YSV-CWurNTmuIrOHL-WApDfIICX0XegGclwgiBq1dtNB7fK9SFvbC7tR-lvASztTlLl3gyBEqX1hbYtYxJoiKeWE1yvuCQlztje',
    status: 'Expired',
    statusColor: 'bg-red-50 text-red-600 border border-red-200 dark:bg-red-900/20 dark:border-red-800',
    statusIcon: 'close',
    duration: 'Jan 01, 2020 - Dec 31, 2023',
    expanded: false,
    opacity: true,
  },
]

export default function ContractsPage() {
  const [expandedRow, setExpandedRow] = useState<number | null>(2)

  const toggleRow = (id: number) => {
    setExpandedRow(expandedRow === id ? null : id)
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display antialiased text-[#131b0d] dark:text-gray-100 min-h-screen flex flex-col">
      <ContractsNav />
      <main className="flex-1 flex justify-center w-full px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full max-w-7xl flex flex-col gap-6">
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
              <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">add</span>
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
                  <span className="material-symbols-outlined text-gray-400 group-focus-within:text-primary transition-colors">search</span>
                </div>
                <input 
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#dae7cf] dark:border-[#2a3622] rounded-lg leading-5 bg-[#fafcf8] dark:bg-[#182210] placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-shadow" 
                  placeholder="Search contracts by name, party, or keyword..." 
                  type="text"
                />
              </div>
              {/* Dropdowns */}
              <div className="flex flex-wrap gap-3">
                <div className="relative">
                  <select className="appearance-none bg-[#fafcf8] dark:bg-[#182210] border border-[#dae7cf] dark:border-[#2a3622] text-[#131b0d] dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
                    <option>All Types</option>
                    <option>Service Agreement</option>
                    <option>NDA</option>
                    <option>Employment</option>
                    <option>Vendor Contract</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <span className="material-symbols-outlined text-sm">expand_more</span>
                  </div>
                </div>
                <div className="relative">
                  <select className="appearance-none bg-[#fafcf8] dark:bg-[#182210] border border-[#dae7cf] dark:border-[#2a3622] text-[#131b0d] dark:text-gray-200 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary cursor-pointer">
                    <option>This Year</option>
                    <option>Last Year</option>
                    <option>Custom Range</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <span className="material-symbols-outlined text-sm">calendar_today</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Bottom Row: Chips */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ecf3e7] dark:bg-[#2a3622] text-[#131b0d] dark:text-white text-sm font-medium hover:bg-gray-200 dark:hover:bg-[#36442c] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                All
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px] fill-1">play_circle</span>
                Active
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-[#dae7cf] dark:border-[#2a3622] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#182210] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">schedule</span>
                Pending
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-[#dae7cf] dark:border-[#2a3622] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#182210] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">warning</span>
                Expiring Soon
              </button>
              <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-transparent border border-[#dae7cf] dark:border-[#2a3622] text-gray-600 dark:text-gray-300 text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#182210] transition-colors whitespace-nowrap">
                <span className="material-symbols-outlined text-[18px]">cancel</span>
                Expired
              </button>
            </div>
          </div>

          {/* Contracts Table */}
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
                  {contracts.map((contract) => (
                    <>
                      <tr 
                        key={contract.id}
                        className={`${contract.expanded ? 'bg-[#fafcf8] dark:bg-[#1c2612] border-l-4 border-l-orange-500' : 'hover:bg-gray-50 dark:hover:bg-[#25321c]'} transition-colors cursor-pointer group ${contract.opacity ? 'opacity-60 hover:opacity-100' : ''}`}
                        onClick={() => contract.details && toggleRow(contract.id)}
                      >
                        <td className={`py-4 ${contract.expanded ? 'pl-5 pr-3' : 'pl-6 pr-3'}`}>
                          <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-lg ${contract.typeColor} flex items-center justify-center`}>
                              <span className="material-symbols-outlined text-lg">{contract.typeIcon}</span>
                            </div>
                            <div>
                              <p className="font-bold text-[#131b0d] dark:text-white text-sm">{contract.name}</p>
                              <p className="text-xs text-gray-500">ID: {contract.contractId}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-3">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{contract.type}</span>
                        </td>
                        <td className="py-4 px-3">
                          <div className="flex -space-x-2">
                            <div className="size-7 rounded-full bg-[#131b0d] text-white flex items-center justify-center text-[10px] font-bold border-2 border-white dark:border-[#1f2b16]">KW</div>
                            <div 
                              className="size-7 rounded-full bg-gray-200 bg-center bg-cover border-2 border-white dark:border-[#1f2b16]"
                              style={{ backgroundImage: `url("${contract.partyAvatar}")` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">{contract.partyName}</span>
                        </td>
                        <td className="py-4 px-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border ${contract.statusColor}`}>
                            {contract.statusIcon ? (
                              <span className="material-symbols-outlined text-[14px]">{contract.statusIcon}</span>
                            ) : (
                              <span className={`size-1.5 rounded-full ${contract.statusDot || contract.statusColor}`}></span>
                            )}
                            {contract.status}
                          </span>
                        </td>
                        <td className="py-4 px-3">
                          <p className="text-sm text-[#131b0d] dark:text-white">{contract.duration}</p>
                          <p className={`text-xs ${contract.durationNoteColor || 'text-gray-500'}`}>{contract.durationNote}</p>
                        </td>
                        <td className="py-4 pl-3 pr-6 text-right">
                          {contract.expanded ? (
                            <button 
                              className="text-gray-600 dark:text-gray-300 hover:text-[#131b0d] p-1 rounded-full bg-white dark:bg-[#2a3622] shadow-sm border border-gray-100 dark:border-[#36442c]"
                              onClick={(e) => { e.stopPropagation(); toggleRow(contract.id); }}
                            >
                              <span className="material-symbols-outlined text-[20px]">expand_less</span>
                            </button>
                          ) : (
                            <button 
                              className="text-gray-400 hover:text-[#131b0d] dark:hover:text-white p-1 rounded-full hover:bg-gray-100 dark:hover:bg-[#36442c] transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <span className="material-symbols-outlined">more_vert</span>
                            </button>
                          )}
                        </td>
                      </tr>
                      {contract.details && expandedRow === contract.id && (
                        <tr className="bg-[#fafcf8] dark:bg-[#1c2612]">
                          <td className="px-6 pb-6 pt-0" colSpan={6}>
                            <div className="bg-white dark:bg-[#25321c] rounded-lg border border-[#ecf3e7] dark:border-[#36442c] p-6 shadow-sm">
                              <div className="flex flex-col md:flex-row gap-8">
                                {/* Column 1: Overview */}
                                <div className="flex-1 space-y-4">
                                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wide mb-2">Overview</h4>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Total Value</p>
                                      <p className="text-sm font-bold text-[#131b0d] dark:text-white">{contract.details.totalValue}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Payment Terms</p>
                                      <p className="text-sm font-medium text-[#131b0d] dark:text-white">{contract.details.paymentTerms}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Renewal Type</p>
                                      <p className="text-sm font-medium text-[#131b0d] dark:text-white">{contract.details.renewalType}</p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Notice Period</p>
                                      <p className="text-sm font-medium text-[#131b0d] dark:text-white">{contract.details.noticePeriod}</p>
                                    </div>
                                  </div>
                                </div>
                                <div className="w-px bg-gray-100 dark:bg-[#36442c] hidden md:block"></div>
                                {/* Column 2: Contacts & Docs */}
                                <div className="flex-1 space-y-4">
                                  <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wide mb-2">Key Contacts</h4>
                                  <div className="flex items-center gap-3 mb-2">
                                    <div 
                                      className="size-8 rounded-full bg-gray-200 bg-center bg-cover"
                                      style={{ backgroundImage: `url("${contract.details.owner.avatar}")` }}
                                    ></div>
                                    <div>
                                      <p className="text-sm font-bold text-[#131b0d] dark:text-white">{contract.details.owner.name}</p>
                                      <p className="text-xs text-gray-500">{contract.details.owner.role}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                                    <span className="material-symbols-outlined text-[18px]">attachment</span>
                                    <span className="text-sm font-medium">{contract.details.document}</span>
                                  </div>
                                </div>
                                <div className="w-px bg-gray-100 dark:bg-[#36442c] hidden md:block"></div>
                                {/* Column 3: Actions */}
                                <div className="flex-1 flex flex-col justify-between">
                                  <div>
                                    <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wide mb-2">Actions</h4>
                                    <p className="text-xs text-gray-500 mb-4">This contract expires in 14 days. Review is required.</p>
                                  </div>
                                  <div className="flex gap-2">
                                    <button className="flex-1 bg-[#131b0d] hover:bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-bold transition-colors">Renew</button>
                                    <button className="flex-1 bg-white dark:bg-transparent border border-gray-200 dark:border-[#36442c] text-red-600 px-3 py-2 rounded-lg text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors">Terminate</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Pagination Footer */}
            <div className="flex items-center justify-between border-t border-[#ecf3e7] dark:border-[#2a3622] px-6 py-3 bg-[#fafcf8] dark:bg-[#182210]">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Showing <span className="font-bold text-[#131b0d] dark:text-white">1</span> to <span className="font-bold text-[#131b0d] dark:text-white">4</span> of <span className="font-bold text-[#131b0d] dark:text-white">12</span> results
                  </p>
                </div>
                <div>
                  <nav aria-label="Pagination" className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                    <a className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-[#dae7cf] dark:border-[#2a3622] bg-white dark:bg-[#1f2b16] text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-[#25321c]" href="#">
                      <span className="material-symbols-outlined text-lg">chevron_left</span>
                    </a>
                    <a aria-current="page" className="relative inline-flex items-center px-4 py-2 border border-[#dae7cf] dark:border-[#2a3622] bg-primary/10 text-sm font-bold text-primary hover:bg-primary/20" href="#">
                      1
                    </a>
                    <a className="relative inline-flex items-center px-4 py-2 border border-[#dae7cf] dark:border-[#2a3622] bg-white dark:bg-[#1f2b16] text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-[#25321c]" href="#">
                      2
                    </a>
                    <a className="relative inline-flex items-center px-4 py-2 border border-[#dae7cf] dark:border-[#2a3622] bg-white dark:bg-[#1f2b16] text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-[#25321c]" href="#">
                      3
                    </a>
                    <a className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-[#dae7cf] dark:border-[#2a3622] bg-white dark:bg-[#1f2b16] text-sm font-medium text-gray-500 hover:bg-gray-50 dark:hover:bg-[#25321c]" href="#">
                      <span className="material-symbols-outlined text-lg">chevron_right</span>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
