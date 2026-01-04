'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useLead, useLeadNotes, useUpdateLead, useDeleteLead, useCreateLeadNote, useConvertLeadToPartner } from '@/hooks/useLeads'
import { formatDistanceToNow } from 'date-fns'

export default function LeadDetailPage() {
  const params = useParams()
  const router = useRouter()
  const leadId = params.id as string
  
  const { data: lead, isLoading } = useLead(leadId)
  const { data: notes = [] } = useLeadNotes(leadId)
  const updateLead = useUpdateLead()
  const deleteLead = useDeleteLead()
  const createNote = useCreateLeadNote()
  const convertToPartner = useConvertLeadToPartner()
  
  const [noteText, setNoteText] = useState('')

  const handleDismiss = async () => {
    if (!lead || !confirm('Are you sure you want to dismiss this lead?')) return
    
    try {
      await updateLead.mutateAsync({
        id: lead.id,
        status: 'dismissed',
      } as any)
    } catch (error) {
      console.error('Error dismissing lead:', error)
      alert('Failed to dismiss lead. Please try again.')
    }
  }

  const handleSave = async () => {
    if (!lead) return
    
    try {
      await updateLead.mutateAsync({
        id: lead.id,
        status: 'saved',
      } as any)
    } catch (error) {
      console.error('Error saving lead:', error)
      alert('Failed to save lead. Please try again.')
    }
  }

  const handleAddNote = async () => {
    if (!noteText.trim() || !leadId) return
    
    try {
      await createNote.mutateAsync({
        leadId,
        content: noteText.trim(),
        noteType: 'note',
      })
      setNoteText('')
    } catch (error) {
      console.error('Error adding note:', error)
      alert('Failed to add note. Please try again.')
    }
  }

  const handleConvertToPartner = async () => {
    if (!lead || !confirm('Convert this lead to a partner?')) return
    
    try {
      await convertToPartner.mutateAsync({
        leadId: lead.id,
        partnerData: {
          name: lead.company_name,
          type: 'client',
          sector: lead.industry || 'Other',
          contact_name: lead.suggested_contact_name || 'Unknown',
          contact_email: lead.suggested_contact_email || null,
          contact_phone: null,
          status: 'to_contact',
          notes: lead.ai_summary,
        },
      })
      router.push('/partners')
    } catch (error) {
      console.error('Error converting lead:', error)
      alert('Failed to convert lead. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading lead...</div>
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-2">Lead not found</p>
          <Link href="/partners/discovery" className="text-primary hover:underline">
            Back to Discovery
          </Link>
        </div>
      </div>
    )
  }

  const insights = lead.ai_insights || {}

  return (
    <div className="w-full max-w-[1400px] mx-auto px-6 py-8">
      {/* Breadcrumb & Header */}
      <div className="mb-8">
        <Link 
          href="/partners/discovery"
          className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-primary font-medium mb-4 transition-colors"
        >
          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to AI Lead Discovery
        </Link>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center shadow-sm p-2">
              <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#131d0c] dark:text-white leading-tight">{lead.company_name}</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Discovered {formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })} via AI Matching
              </p>
            </div>
          </div>
          {/* Action Toolbar */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleDismiss}
              className="group flex items-center gap-2 px-4 py-2.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors text-sm font-bold bg-white dark:bg-transparent dark:border-red-900/50 dark:text-red-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
              </svg>
              Dismiss Lead
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-gray-300 text-[#131d0c] hover:bg-gray-50 transition-colors text-sm font-bold bg-white dark:bg-transparent dark:border-gray-600 dark:text-gray-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 3a1 1 0 000 2v11a2 2 0 002 2h14a1 1 0 100-2H5V5a1 1 0 00-1-1z" />
              </svg>
              Edit Lead Criteria
            </button>
            <button
              onClick={handleConvertToPartner}
              className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-[#131d0c] text-sm font-bold rounded-lg shadow-sm transition-colors"
            >
              Add to Partners Pipeline
            </button>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (Main Info) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Lead Information Card */}
          <div className="bg-white dark:bg-[#1e2915] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-start justify-between mb-6">
              <h2 className="text-xl font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                Lead Information
              </h2>
              {lead.ai_confidence !== undefined && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full border border-green-100 dark:border-green-900/50">
                  <div className="relative w-5 h-5">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-gray-200 dark:text-gray-700"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="text-primary"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                        fill="none"
                        stroke="currentColor"
                        strokeDasharray={`${lead.ai_confidence}, 100`}
                        strokeWidth="4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-bold text-green-800 dark:text-green-400">{lead.ai_confidence}% AI Confidence</span>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
              {lead.industry && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Industry</p>
                  <p className="font-medium text-[#131d0c] dark:text-gray-200">{lead.industry}</p>
                </div>
              )}
              {lead.location && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                  <p className="font-medium text-[#131d0c] dark:text-gray-200">{lead.location}</p>
                </div>
              )}
              {lead.company_size && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Company Size</p>
                  <p className="font-medium text-[#131d0c] dark:text-gray-200">{lead.company_size}</p>
                </div>
              )}
              {lead.website && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Website</p>
                  <a
                    href={lead.website.startsWith('http') ? lead.website : `https://${lead.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-primary hover:underline flex items-center gap-1"
                  >
                    {lead.website}
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                  </a>
                </div>
              )}
            </div>
            {lead.ai_summary && (
              <div className="bg-gray-50 dark:bg-white/5 rounded-lg p-4 border border-gray-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4.5 h-4.5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase">AI Summary</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lead.ai_summary}</p>
              </div>
            )}
          </div>

          {/* AI Insights & Analysis Card */}
          {(insights.activities || insights.signals || insights.synergies) && (
            <div className="bg-white dark:bg-[#1e2915] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-[#131d0c] dark:text-white flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                  </svg>
                  AI Insights & Analysis
                </h2>
              </div>
              <div className="space-y-6">
                {/* Key Activities & News Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {insights.activities && Array.isArray(insights.activities) && insights.activities.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-[#131d0c] dark:text-white mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span> Key Business Activities
                      </h3>
                      <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                        {insights.activities.map((activity: string, idx: number) => (
                          <li key={idx} className="pl-3 border-l-2 border-gray-100 dark:border-gray-700">{activity}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {insights.signals && Array.isArray(insights.signals) && insights.signals.length > 0 && (
                    <div>
                      <h3 className="text-sm font-bold text-[#131d0c] dark:text-white mb-3 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span> Recent Signals
                      </h3>
                      <div className="space-y-3">
                        {insights.signals.map((signal: any, idx: number) => (
                          <a key={idx} className="block group" href={signal.url} target="_blank" rel="noopener noreferrer">
                            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 group-hover:text-primary transition-colors">{signal.title}</p>
                            <p className="text-xs text-gray-400 mt-0.5">{signal.source} • {signal.date}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {insights.synergies && Array.isArray(insights.synergies) && insights.synergies.length > 0 && (
                  <>
                    <hr className="border-gray-100 dark:border-gray-800" />
                    <div>
                      <h3 className="text-sm font-bold text-[#131d0c] dark:text-white mb-3">Potential Synergies</h3>
                      <div className="flex flex-wrap gap-2">
                        {insights.synergies.map((synergy: string, idx: number) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-50 text-green-700 border border-green-100 text-sm dark:bg-green-900/30 dark:text-green-300 dark:border-green-900"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            {synergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Person Card */}
          {(lead.suggested_contact_name || lead.suggested_contact_email) && (
            <div className="bg-white dark:bg-[#1e2915] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#131d0c] dark:text-white text-sm uppercase tracking-wider">Contact Person</h3>
                <span className="text-[10px] font-bold bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded">AI SUGGESTION</span>
              </div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-[#131d0c] dark:text-white">{lead.suggested_contact_name || 'Unknown'}</h4>
                  {lead.target_role && <p className="text-sm text-gray-500">{lead.target_role}</p>}
                </div>
              </div>
              <div className="space-y-3 mb-5">
                {lead.suggested_contact_email && (
                  <a
                    href={`mailto:${lead.suggested_contact_email}`}
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                    {lead.suggested_contact_email}
                  </a>
                )}
                {lead.suggested_contact_linkedin && (
                  <a
                    href={lead.suggested_contact_linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors p-2 hover:bg-gray-50 dark:hover:bg-white/5 rounded-lg"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    LinkedIn Profile
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Activity Timeline */}
          <div className="bg-white dark:bg-[#1e2915] rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5">
            <h3 className="font-bold text-[#131d0c] dark:text-white text-sm uppercase tracking-wider mb-4">Activity Timeline</h3>
            <div className="relative pl-4 border-l border-gray-200 dark:border-gray-700 space-y-6 mb-6">
              {notes.map((note, idx) => (
                <div key={note.id} className="relative">
                  <div className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full ring-4 ring-white dark:ring-[#1e2915] ${
                    idx === 0 ? 'bg-primary' : 'bg-gray-300'
                  }`}></div>
                  <p className="text-xs text-gray-400 mb-0.5">
                    {formatDistanceToNow(new Date(note.created_at), { addSuffix: true })}
                  </p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {note.note_type === 'system' ? (
                      <>
                        Generated by <span className="font-bold text-primary">Konsensi AI</span>.
                      </>
                    ) : (
                      <>
                        <span className="font-bold">{note.user?.full_name || note.user?.email || 'Unknown'}</span> {note.content}
                      </>
                    )}
                  </p>
                </div>
              ))}
              {notes.length === 0 && (
                <div className="relative">
                  <div className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-4 ring-white dark:ring-[#1e2915]"></div>
                  <p className="text-xs text-gray-400 mb-0.5">{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true })}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Generated by <span className="font-bold text-primary">Konsensi AI</span>.
                  </p>
                </div>
              )}
            </div>
            {/* Add Note Input */}
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <label className="block text-xs font-bold text-gray-500 mb-2 uppercase">Add Note</label>
              <div className="relative">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && noteText.trim()) {
                      handleAddNote()
                    }
                  }}
                  className="w-full bg-gray-50 dark:bg-black/20 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none resize-none min-h-[80px]"
                  placeholder="Type your notes here... (Cmd/Ctrl + Enter to save)"
                />
                <button
                  onClick={handleAddNote}
                  disabled={!noteText.trim() || createNote.isPending}
                  className="absolute bottom-2 right-2 p-1.5 bg-white dark:bg-gray-800 rounded-md shadow-sm text-primary hover:bg-gray-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

