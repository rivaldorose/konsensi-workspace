'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMarketingPosts } from '@/hooks/useMarketing'
import type { MarketingPost } from '@/types/marketing'
import MarketingCalendar from '@/components/marketing/MarketingCalendar'
import PostPreviewPanel from '@/components/marketing/PostPreviewPanel'
import { format, startOfMonth } from 'date-fns'

export default function MarketingPage() {
  const router = useRouter()
  const { data: posts = [], isLoading } = useMarketingPosts()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date()))
  const [selectedPost, setSelectedPost] = useState<MarketingPost | null>(null)
  const [activeTab, setActiveTab] = useState<'calendar' | 'queue' | 'published' | 'analytics'>('calendar')
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month')
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
  }

  const handlePostClick = (post: MarketingPost) => {
    setSelectedPost(post)
  }

  const handleClosePanel = () => {
    setSelectedPost(null)
  }

  const handleApprove = (id: string) => {
    // TODO: Implement approve functionality
    console.log('Approve post:', id)
  }

  const handleSaveDraft = (id: string) => {
    // TODO: Implement save draft functionality
    console.log('Save draft:', id)
  }

  const handleDelete = (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete post:', id)
  }


  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  // Filter posts based on selected filters
  const filteredPosts = posts.filter(post => {
    const matchesPlatform = selectedPlatform === 'all' || post.platforms.includes(selectedPlatform)
    const matchesStatus = selectedStatus === 'all' || post.status === selectedStatus
    return matchesPlatform && matchesStatus
  })

  const queueCount = posts.filter(p => p.status === 'draft' || p.status === 'pending_review').length

  if (isLoading) {
    return (
      <main className="flex-1 flex flex-col w-full max-w-[1400px] mx-auto px-4 md:px-8 py-8">
        <div className="animate-pulse">Loading...</div>
      </main>
    )
  }

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* Left: Calendar & Content */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0 bg-[#f9fcf8] relative">
        {/* Page Heading & Tabs */}
        <div className="px-6 pt-6 pb-0 border-b border-[#e9f3e7] bg-white sticky top-0 z-10">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
            <div className="flex min-w-72 flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                <span>Workspace</span>
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Marketing</span>
              </div>
              <h1 className="text-[#101b0d] text-3xl font-black leading-tight tracking-[-0.033em]">
                Marketing Hub
              </h1>
              <p className="text-[#599a4c] text-sm font-medium">
                Manage content schedule and campaigns
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-white border border-[#d3e7cf] text-[#101b0d] text-sm font-bold hover:bg-[#f6f8f6] transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
                </svg>
                <span>Filter</span>
              </button>
              <button
                onClick={() => router.push('/marketing/new')}
                className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary text-[#101b0d] text-sm font-bold shadow-sm shadow-primary/30 hover:bg-[#2bc40e] transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                <span>Create Post</span>
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 text-sm transition-colors ${
                activeTab === 'calendar'
                  ? 'border-primary text-[#101b0d] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#599a4c] font-medium'
              }`}
            >
              <svg className="w-5 h-5" fill={activeTab === 'calendar' ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={activeTab === 'calendar' ? 2.5 : 2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('queue')}
              className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 text-sm transition-colors ${
                activeTab === 'queue'
                  ? 'border-primary text-[#101b0d] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#599a4c] font-medium'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Queue
              {queueCount > 0 && (
                <span className="bg-[#e9f3e7] text-[#599a4c] text-xs px-1.5 py-0.5 rounded-full">
                  {queueCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('published')}
              className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 text-sm transition-colors ${
                activeTab === 'published'
                  ? 'border-primary text-[#101b0d] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#599a4c] font-medium'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Published
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 text-sm transition-colors ${
                activeTab === 'analytics'
                  ? 'border-primary text-[#101b0d] font-bold'
                  : 'border-transparent text-gray-500 hover:text-[#599a4c] font-medium'
              }`}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              Analytics
            </button>
          </div>
        </div>

        {/* Calendar Control & Filters */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#f9fcf8]">
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white rounded-lg border border-[#d3e7cf] p-1 shadow-sm">
              <button
                onClick={handlePrevMonth}
                className="p-1 hover:bg-[#e9f3e7] rounded transition-colors"
              >
                <svg className="w-5 h-5 text-[#101b0d]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              <span className="px-3 text-sm font-bold text-[#101b0d] min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-[#e9f3e7] rounded transition-colors"
              >
                <svg className="w-5 h-5 text-[#101b0d]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
            <div className="flex items-center bg-[#e9f3e7] rounded-lg p-1">
              <button
                onClick={() => setViewMode('month')}
                className={`px-3 py-1 rounded text-xs font-bold transition-colors ${
                  viewMode === 'month'
                    ? 'bg-white shadow-sm text-[#101b0d]'
                    : 'text-[#599a4c] hover:bg-white/50'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setViewMode('week')}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  viewMode === 'week'
                    ? 'bg-white shadow-sm text-[#101b0d] font-bold'
                    : 'text-[#599a4c] hover:bg-white/50'
                }`}
              >
                Week
              </button>
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            <button
              onClick={() => setSelectedPlatform('all')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg border pl-2 pr-2 transition-colors ${
                selectedPlatform === 'all'
                  ? 'bg-white border-[#d3e7cf] hover:bg-[#f0fdf4]'
                  : 'bg-white border-[#d3e7cf] hover:bg-[#f0fdf4]'
              }`}
            >
              <svg className="w-[18px] h-[18px] text-[#101b0d]" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
              </svg>
              <p className="text-[#101b0d] text-xs font-bold">All Platforms</p>
              <svg className="w-[18px] h-[18px] text-[#101b0d]" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
            <button
              onClick={() => setSelectedStatus('draft')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg border pl-2 pr-2 transition-colors ${
                selectedStatus === 'draft'
                  ? 'bg-white border-[#d3e7cf] hover:bg-[#f0fdf4]'
                  : 'bg-white border-[#d3e7cf] hover:bg-[#f0fdf4]'
              }`}
            >
              <div className="size-2 rounded-full bg-yellow-400"></div>
              <p className="text-[#101b0d] text-xs font-medium">Drafts</p>
            </button>
            <button
              onClick={() => setSelectedStatus('scheduled')}
              className={`flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-lg border pl-2 pr-2 transition-colors ${
                selectedStatus === 'scheduled'
                  ? 'bg-white border-[#d3e7cf] hover:bg-[#f0fdf4]'
                  : 'bg-white border-[#d3e7cf] hover:bg-[#f0fdf4]'
              }`}
            >
              <div className="size-2 rounded-full bg-blue-500"></div>
              <p className="text-[#101b0d] text-xs font-medium">Scheduled</p>
            </button>
          </div>
      </div>

        {/* Calendar Grid */}
        {activeTab === 'calendar' && (
          <MarketingCalendar
            posts={filteredPosts}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onPostClick={handlePostClick}
            currentMonth={currentMonth}
            onMonthChange={setCurrentMonth}
          />
        )}

        {/* Queue View */}
        {activeTab === 'queue' && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#e9f3e7] p-6">
              <p className="text-gray-500">Queue view coming soon...</p>
            </div>
          </div>
        )}

        {/* Published View */}
        {activeTab === 'published' && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#e9f3e7] p-6">
              <p className="text-gray-500">Published view coming soon...</p>
            </div>
          </div>
        )}

        {/* Analytics View */}
        {activeTab === 'analytics' && (
          <div className="flex-1 overflow-y-auto px-6 pb-6">
            <div className="bg-white rounded-xl shadow-sm border border-[#e9f3e7] p-6">
              <p className="text-gray-500">Analytics view coming soon...</p>
            </div>
          </div>
        )}
      </main>

      {/* Right Panel: Post Preview */}
      {selectedPost && (
        <PostPreviewPanel
          post={selectedPost}
          onClose={handleClosePanel}
          onApprove={handleApprove}
          onSaveDraft={handleSaveDraft}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
