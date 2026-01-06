'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useLeads, useCreateLead } from '@/hooks/useLeads'

export default function AIDiscoveryPage() {
  const router = useRouter()
  const [searchCriteria, setSearchCriteria] = useState({
    industry: '',
    companySize: '',
    location: '',
    targetRole: '',
    keywords: '',
  })
  const [filter, setFilter] = useState<'all' | 'discovered' | 'saved' | 'dismissed'>('all')
  
  const { data: leads = [], isLoading } = useLeads(filter === 'all' ? undefined : filter)
  const createLead = useCreateLead()

  const handleGenerateLeads = async () => {
    if (!searchCriteria.industry && !searchCriteria.location && !searchCriteria.targetRole && !searchCriteria.keywords) {
      alert('Please fill in at least one search criteria')
      return
    }

    setIsGenerating(true)
    try {
      // Call Apollo API via our server-side route
      const response = await fetch('/api/apollo/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(searchCriteria),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Failed to search for leads')
      }

      const { leads } = await response.json()

      if (!leads || leads.length === 0) {
        alert('No leads found with the given criteria. Try adjusting your search.')
        return
      }

      // Create leads in database
      for (const leadData of leads) {
        try {
          await createLead.mutateAsync({
            ...leadData,
            status: 'new',
            generated_by_user_id: undefined, // Will be set by the hook
          } as any)
        } catch (error: any) {
          console.error('Error creating lead:', error)
          // Continue with other leads even if one fails
        }
      }

      alert(`Successfully generated ${leads.length} lead(s)!`)
      
      // Clear form
      setSearchCriteria({
        industry: '',
        companySize: '',
        location: '',
        targetRole: '',
        keywords: '',
      })
    } catch (error) {
      console.error('Error generating leads:', error)
      alert('Failed to generate leads. Please try again.')
    }
  }

  const handleClearAll = () => {
    setSearchCriteria({
      industry: '',
      companySize: '',
      location: '',
      targetRole: '',
      keywords: '',
    })
  }

  return (
    <div className="w-full max-w-[1024px] mx-auto flex flex-col gap-8 px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-sm text-[#6d9c49] font-medium mb-1">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
            </svg>
            <span>Partners</span>
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
            <span>Discovery</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#131d0c] dark:text-white tracking-tight">
            AI Lead Discovery
          </h1>
          <p className="text-[#6d9c49] text-base font-normal max-w-2xl">
            Configure AI parameters to discover potential partners and clients based on specific business criteria.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#6d9c49] bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            History
          </button>
        </div>
      </div>

      {/* Input Section */}
      <section className="bg-white dark:bg-[#1e2915] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#233018] flex items-center justify-between">
          <h3 className="text-[#131d0c] dark:text-white text-lg font-bold leading-tight flex items-center gap-2">
            <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
              <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
            </svg>
            Lead Criteria Input
          </h3>
          <button 
            onClick={handleClearAll}
            className="text-xs font-bold text-[#6d9c49] uppercase tracking-wide hover:underline"
          >
            Clear all
          </button>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Row 1 */}
          <label className="flex flex-col gap-2">
            <span className="text-[#131d0c] dark:text-gray-200 text-sm font-semibold">Target Industry</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d9c49]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#182210] focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4 text-sm placeholder:text-gray-400 transition-shadow dark:text-white"
                placeholder="e.g. SaaS, FinTech, Healthcare"
                value={searchCriteria.industry}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, industry: e.target.value })}
              />
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[#131d0c] dark:text-gray-200 text-sm font-semibold">Company Size</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d9c49]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <select
                className="form-select w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#182210] focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-10 text-sm text-[#131d0c] dark:text-white"
                value={searchCriteria.companySize}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, companySize: e.target.value })}
              >
                <option value="">Select size range</option>
                <option>1-10 employees</option>
                <option>11-50 employees</option>
                <option>51-200 employees</option>
                <option>201-500 employees</option>
                <option>500+ employees</option>
              </select>
            </div>
          </label>
          {/* Row 2 */}
          <label className="flex flex-col gap-2">
            <span className="text-[#131d0c] dark:text-gray-200 text-sm font-semibold">Geographic Location</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d9c49]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#182210] focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4 text-sm placeholder:text-gray-400 dark:text-white"
                placeholder="e.g. Berlin, Germany or Remote"
                value={searchCriteria.location}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, location: e.target.value })}
              />
            </div>
          </label>
          <label className="flex flex-col gap-2">
            <span className="text-[#131d0c] dark:text-gray-200 text-sm font-semibold">Target Role</span>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#6d9c49]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                </svg>
              </div>
              <input
                className="form-input w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#182210] focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-10 pr-4 text-sm placeholder:text-gray-400 dark:text-white"
                placeholder="e.g. CTO, Head of Marketing"
                value={searchCriteria.targetRole}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, targetRole: e.target.value })}
              />
            </div>
          </label>
          {/* Row 3 - Full Width */}
          <label className="flex flex-col gap-2 md:col-span-2">
            <span className="text-[#131d0c] dark:text-gray-200 text-sm font-semibold">Specific Keywords / Services</span>
            <div className="relative">
              <div className="absolute top-3 left-3 flex items-start pointer-events-none text-[#6d9c49]">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <textarea
                className="form-textarea w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-[#182210] focus:border-primary focus:ring-1 focus:ring-primary min-h-[80px] pl-10 pr-4 py-3 text-sm placeholder:text-gray-400 dark:text-white resize-y"
                placeholder="e.g. seeking automation partners, using HubSpot, sustainable energy focus..."
                value={searchCriteria.keywords}
                onChange={(e) => setSearchCriteria({ ...searchCriteria, keywords: e.target.value })}
              />
            </div>
          </label>
        </div>
        <div className="px-6 py-4 bg-gray-50 dark:bg-[#233018] border-t border-gray-200 dark:border-gray-700 flex justify-end">
          <button
            onClick={handleGenerateLeads}
            disabled={createLead.isPending}
            className="flex items-center justify-center gap-2 bg-primary hover:bg-[#56bd09] text-[#131d0c] font-bold py-3 px-8 rounded-lg shadow-sm transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
              <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
            </svg>
            {createLead.isPending ? 'Generating...' : 'Generate Leads'}
          </button>
        </div>
      </section>

      {/* Discovered Leads Section */}
      <section className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-[#131d0c] dark:text-white">Discovered Leads</h3>
          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="flex items-center bg-white dark:bg-[#1e2915] border border-gray-200 dark:border-gray-700 rounded-lg p-1">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                  filter === 'all'
                    ? 'bg-gray-100 dark:bg-gray-700 text-[#131d0c] dark:text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-[#6d9c49]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('discovered')}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                  filter === 'discovered'
                    ? 'bg-gray-100 dark:bg-gray-700 text-[#131d0c] dark:text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-[#6d9c49]'
                }`}
              >
                New
              </button>
              <button
                onClick={() => setFilter('saved')}
                className={`px-3 py-1.5 text-xs font-bold rounded transition-colors ${
                  filter === 'saved'
                    ? 'bg-gray-100 dark:bg-gray-700 text-[#131d0c] dark:text-white'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-[#6d9c49]'
                }`}
              >
                Saved
              </button>
            </div>
            <button className="flex items-center justify-center w-9 h-9 bg-white dark:bg-[#1e2915] border border-gray-200 dark:border-gray-700 rounded-lg text-[#131d0c] dark:text-white hover:border-primary transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 000 2v11a2 2 0 002 2h14a1 1 0 100-2H5V5a1 1 0 00-1-1z" />
                <path d="M13 7a1 1 0 100-2h-2.586l-1.707-1.707A1 1 0 008 4H6a1 1 0 000 2h2.586l1.707 1.707A1 1 0 009.414 7H13z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Results List */}
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-gray-400">Loading leads...</div>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#1e2915] rounded-xl border border-dashed border-gray-300 dark:border-gray-600">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-primary">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-lg font-bold text-[#131d0c] dark:text-white mb-1">No leads generated yet</p>
            <p className="text-[#6d9c49] text-sm">Specify your criteria above and click "Generate Leads" to start.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {leads.map((lead) => (
              <Link key={lead.id} href={`/partners/discovery/${lead.id}`}>
                <article className="group relative bg-white dark:bg-[#1e2915] rounded-xl p-5 border border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex flex-col md:flex-row gap-5 items-start">
                    {/* Company Logo / Placeholder */}
                    <div className="shrink-0">
                      <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 flex items-center justify-center text-blue-600 dark:text-blue-400">
                        <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap justify-between items-start gap-2 mb-2">
                        <div>
                          <h4 className="text-lg font-bold text-[#131d0c] dark:text-white leading-tight group-hover:text-primary transition-colors">
                            {lead.company_name}
                          </h4>
                          <div className="flex items-center gap-2 text-xs text-[#6d9c49] mt-1 flex-wrap">
                            {lead.industry && (
                              <>
                                <span className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                                  </svg>
                                  {lead.industry}
                                </span>
                                {lead.location && <span className="w-1 h-1 rounded-full bg-gray-300"></span>}
                              </>
                            )}
                            {lead.location && (
                              <>
                                <span className="flex items-center gap-1">
                                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                  {lead.location}
                                </span>
                                {lead.company_size && <span className="w-1 h-1 rounded-full bg-gray-300"></span>}
                              </>
                            )}
                            {lead.company_size && <span>{lead.company_size}</span>}
                          </div>
                        </div>
                        {lead.status === 'discovered' && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-bold bg-green-50 text-[#6d9c49] dark:bg-green-900/30 dark:text-green-400">
                            New Match
                          </span>
                        )}
                      </div>
                      {lead.ai_summary && (
                        <div className="bg-gray-50 dark:bg-[#233018] rounded-lg p-3 mb-3 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-start gap-2">
                            <svg className="w-4.5 h-4.5 text-primary mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <div>
                              <p className="text-sm text-[#131d0c] dark:text-gray-200 leading-relaxed">
                                <span className="font-bold">
                                  {lead.relevance_score === 'high' ? 'High' : lead.relevance_score === 'medium' ? 'Medium' : 'Low'} Relevance:
                                </span>{' '}
                                {lead.ai_summary}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      {lead.suggested_contact_name && (
                        <div className="flex items-center gap-2 text-sm text-[#131d0c] dark:text-gray-300">
                          <span className="font-medium text-[#6d9c49]">Suggested Contact:</span>
                          <div className="flex items-center gap-1.5 bg-gray-50 dark:bg-white/5 px-2 py-1 rounded border border-gray-100 dark:border-white/10">
                            <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
                            </svg>
                            <span>{lead.suggested_contact_name}{lead.target_role && ` (${lead.target_role})`}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

