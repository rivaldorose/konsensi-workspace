'use client'

import { useState } from 'react'
import { useMarketingPosts } from '@/hooks/useMarketing'
import type { MarketingPost } from '@/types/marketing'
import MarketingCalendar from '@/components/marketing/MarketingCalendar'
import PostPreviewPanel from '@/components/marketing/PostPreviewPanel'
import { format, startOfMonth } from 'date-fns'

export default function MarketingPage() {
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

  const handleCreatePost = () => {
    // TODO: Navigate to create post page
    console.log('Create post')
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
                <span className="material-symbols-outlined text-[14px]">chevron_right</span>
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
                <span className="material-symbols-outlined text-[20px]">tune</span>
                <span>Filter</span>
              </button>
              <button
                onClick={handleCreatePost}
                className="flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-primary text-[#101b0d] text-sm font-bold shadow-sm shadow-primary/30 hover:bg-[#2bc40e] transition-colors"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
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
              <span className={`material-symbols-outlined text-[20px] ${activeTab === 'calendar' ? 'filled' : ''}`}>
                calendar_month
              </span>
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
              <span className="material-symbols-outlined text-[20px]">list</span>
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
              <span className="material-symbols-outlined text-[20px]">check_circle</span>
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
              <span className="material-symbols-outlined text-[20px]">bar_chart</span>
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
                <span className="material-symbols-outlined text-[#101b0d]">chevron_left</span>
              </button>
              <span className="px-3 text-sm font-bold text-[#101b0d] min-w-[120px] text-center">
                {format(currentMonth, 'MMMM yyyy')}
              </span>
              <button
                onClick={handleNextMonth}
                className="p-1 hover:bg-[#e9f3e7] rounded transition-colors"
              >
                <span className="material-symbols-outlined text-[#101b0d]">chevron_right</span>
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
              <span className="material-symbols-outlined text-[#101b0d] text-[18px]">filter_list</span>
              <p className="text-[#101b0d] text-xs font-bold">All Platforms</p>
              <span className="material-symbols-outlined text-[#101b0d] text-[18px]">arrow_drop_down</span>
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
