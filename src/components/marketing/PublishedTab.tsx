'use client'

import { useState } from 'react'
import { usePublishedPosts } from '@/hooks/useMarketingPosts'
import { format } from 'date-fns'
import type { MarketingPost, PostPlatform } from '@/types/marketing'

interface PublishedTabProps {
  onSelectPost: (postId: string) => void
}

const getPlatformIcon = (platform: PostPlatform) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return <span className="text-xs font-bold">in</span>
    case 'instagram':
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    case 'twitter':
      return <span className="text-xs font-bold">tw</span>
    case 'facebook':
      return <span className="text-xs font-bold">fb</span>
    default:
      return <span className="text-xs font-bold">{platform.charAt(0).toUpperCase()}</span>
  }
}

const getPlatformBg = (platform: PostPlatform) => {
  switch (platform.toLowerCase()) {
    case 'linkedin':
      return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
    case 'instagram':
      return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
    case 'twitter':
      return 'bg-sky-100 dark:bg-sky-900/30 text-sky-600 dark:text-sky-400'
    case 'facebook':
      return 'bg-blue-200 dark:bg-blue-800/30 text-blue-800 dark:text-blue-300'
    default:
      return 'bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400'
  }
}

export function PublishedTab({ onSelectPost }: PublishedTabProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all')
  const [timeframe, setTimeframe] = useState<string>('last_30_days')
  const [searchQuery, setSearchQuery] = useState('')
  
  const { data: posts = [], isLoading } = usePublishedPosts({
    platform: selectedPlatform,
    timeframe,
    search: searchQuery || undefined,
  })

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading published posts...</div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#f9fcf8] dark:bg-[#131b0d]">
      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2 bg-white dark:bg-[#1f2b15] rounded-lg border border-[#e9f3e7] dark:border-[#334025] px-3 py-2 flex-1 min-w-[200px]">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-sm text-[#101b0d] dark:text-white placeholder:text-gray-400"
          />
        </div>
        
        <select
          value={selectedPlatform}
          onChange={(e) => setSelectedPlatform(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-[#e9f3e7] dark:border-[#334025] rounded-lg text-sm text-[#101b0d] dark:text-white"
        >
          <option value="all">All Platforms</option>
          <option value="linkedin">LinkedIn</option>
          <option value="twitter">Twitter</option>
          <option value="instagram">Instagram</option>
          <option value="facebook">Facebook</option>
        </select>

        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value)}
          className="px-4 py-2 bg-white dark:bg-[#1f2b15] border border-[#e9f3e7] dark:border-[#334025] rounded-lg text-sm text-[#101b0d] dark:text-white"
        >
          <option value="last_7_days">Last 7 days</option>
          <option value="last_30_days">Last 30 days</option>
          <option value="all">All time</option>
        </select>
      </div>

      {/* Posts Grid */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No published posts found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onSelectPost(post.id)}
              className="text-left bg-white dark:bg-[#1f2b15] rounded-xl border border-[#e9f3e7] dark:border-[#334025] overflow-hidden hover:shadow-md transition-all"
            >
              {post.media_url && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-900 relative">
                  <img
                    src={post.media_url}
                    alt={post.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {post.platforms.map((platform) => (
                    <div
                      key={platform}
                      className={`w-6 h-6 rounded flex items-center justify-center ${getPlatformBg(platform)}`}
                    >
                      {getPlatformIcon(platform)}
                    </div>
                  ))}
                </div>
                <h4 className="font-bold text-[#101b0d] dark:text-white text-base mb-2 line-clamp-2">
                  {post.title || 'Untitled Post'}
                </h4>
                {post.caption && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                    {post.caption}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                  <span>{post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : ''}</span>
                  {(post.likes || post.comments || post.shares) && (
                    <div className="flex items-center gap-3">
                      {post.likes && <span>❤️ {post.likes}</span>}
                      {post.comments && <span>💬 {post.comments}</span>}
                      {post.shares && <span>🔁 {post.shares}</span>}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

