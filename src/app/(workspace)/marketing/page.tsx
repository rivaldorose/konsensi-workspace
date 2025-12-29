'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CalendarTab } from '@/components/marketing/CalendarTab'
import { QueueTab } from '@/components/marketing/QueueTab'
import { PublishedTab } from '@/components/marketing/PublishedTab'
import { AnalyticsTab } from '@/components/marketing/AnalyticsTab'
import { PostDetailsSidebar } from '@/components/marketing/PostDetailsSidebar'
import { useQueuePosts } from '@/hooks/useMarketingPosts'

export default function MarketingHubPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'calendar' | 'queue' | 'published' | 'analytics'>('calendar')
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null)
  const [showSidebar, setShowSidebar] = useState(false)
  
  const { data: queuePosts = [] } = useQueuePosts()
  const queueCount = queuePosts.filter(p => p.status === 'draft' || p.status === 'pending_review').length

  const tabs = [
    { id: 'calendar' as const, label: 'Calendar', icon: 'calendar_month', badge: null },
    { id: 'queue' as const, label: 'Queue', icon: 'list', badge: queueCount > 0 ? queueCount : null },
    { id: 'published' as const, label: 'Published', icon: 'check_circle', badge: null },
    { id: 'analytics' as const, label: 'Analytics', icon: 'bar_chart', badge: null }
  ]

  const handleSelectPost = (postId: string) => {
    setSelectedPostId(postId)
    setShowSidebar(true)
  }

  const handleCloseSidebar = () => {
    setShowSidebar(false)
    setSelectedPostId(null)
  }

  const getIconSVG = (iconName: string, isActive: boolean) => {
    const className = `w-5 h-5 ${isActive ? 'text-[#101b0d]' : 'text-gray-500'}`
    
    switch (iconName) {
      case 'calendar_month':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
          </svg>
        )
      case 'list':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
      case 'check_circle':
        return (
          <svg className={`w-5 h-5 ${isActive ? 'text-[#101b0d]' : 'text-green-500'}`} fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        )
      case 'bar_chart':
        return (
          <svg className={className} fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
          </svg>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex-1 pt-16">
      <main className="flex flex-1 overflow-hidden min-w-0 bg-[#f9fcf8] dark:bg-[#131b0d] relative">
        {/* Header */}
        <div className="px-6 pt-6 pb-0 border-b border-[#e9f3e7] dark:border-[#334025] bg-white dark:bg-[#1f2b15] sticky top-0 z-20">
          <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
            <div className="flex min-w-72 flex-col gap-1">
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-1">
                <span>Workspace</span>
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
                <span>Marketing</span>
              </div>
              <h1 className="text-[#101b0d] dark:text-white text-3xl font-black leading-tight tracking-[-0.033em]">
                Marketing Hub
              </h1>
              <p className="text-[#599a4c] dark:text-[#a3d977] text-sm font-medium">
                Manage content schedule and campaigns
              </p>
            </div>
            
            <div className="flex gap-3">
              <button className="flex items-center justify-center gap-2 h-10 px-4 rounded-lg bg-white dark:bg-[#222e18] border border-[#d3e7cf] dark:border-[#334025] text-[#101b0d] dark:text-white text-sm font-bold hover:bg-[#f6f8f6] dark:hover:bg-[#2a3820] transition-colors">
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
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 border-b-[3px] pb-3 px-1 font-bold text-sm transition-colors ${
                    isActive
                      ? 'border-primary text-[#101b0d] dark:text-white'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-[#599a4c] dark:hover:text-[#a3d977]'
                  }`}
                >
                  {getIconSVG(tab.icon, isActive)}
                  <span>{tab.label}</span>
                  {tab.badge !== null && tab.badge !== undefined && (
                    <span className="bg-[#e9f3e7] dark:bg-[#334025] text-[#599a4c] dark:text-[#a3d977] text-xs px-1.5 py-0.5 rounded-full">
                      {tab.badge}
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-hidden flex">
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'calendar' && <CalendarTab onSelectPost={handleSelectPost} />}
            {activeTab === 'queue' && <QueueTab onSelectPost={handleSelectPost} />}
            {activeTab === 'published' && <PublishedTab onSelectPost={handleSelectPost} />}
            {activeTab === 'analytics' && <AnalyticsTab />}
          </div>

          {/* Sidebar */}
          {showSidebar && selectedPostId && (
            <PostDetailsSidebar
              postId={selectedPostId}
              onClose={handleCloseSidebar}
            />
          )}
        </div>
      </main>
    </div>
  )
}
