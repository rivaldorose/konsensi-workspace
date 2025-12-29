'use client'

import { useQueuePosts } from '@/hooks/useMarketingPosts'
import { format } from 'date-fns'
import type { MarketingPost, PostPlatform } from '@/types/marketing'

interface QueueTabProps {
  onSelectPost: (postId: string) => void
}

const getPostStatusConfig = (status: MarketingPost['status']) => {
  switch (status) {
    case 'draft':
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-800',
        label: 'Draft',
      }
    case 'scheduled':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        border: 'border-blue-200 dark:border-blue-800',
        label: 'Scheduled',
      }
    case 'pending_review':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        border: 'border-yellow-200 dark:border-yellow-800',
        label: 'Pending Review',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-600 dark:text-gray-400',
        border: 'border-gray-200 dark:border-gray-800',
        label: status,
      }
  }
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

export function QueueTab({ onSelectPost }: QueueTabProps) {
  const { data: posts = [], isLoading } = useQueuePosts()

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="animate-pulse text-gray-400">Loading queue...</div>
      </div>
    )
  }

  // Group posts by status
  const drafts = posts.filter(p => p.status === 'draft')
  const scheduled = posts.filter(p => p.status === 'scheduled')
  const pending = posts.filter(p => p.status === 'pending_review')

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6 bg-[#f9fcf8] dark:bg-[#131b0d]">
      <div className="space-y-6">
        {/* Pending Review */}
        {pending.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#101b0d] dark:text-white mb-3">Pending Review</h3>
            <div className="space-y-3">
              {pending.map((post) => {
                const statusConfig = getPostStatusConfig(post.status)
                return (
                  <PostCard key={post.id} post={post} statusConfig={statusConfig} onSelectPost={onSelectPost} getPlatformIcon={getPlatformIcon} getPlatformBg={getPlatformBg} />
                )
              })}
            </div>
          </div>
        )}

        {/* Scheduled */}
        {scheduled.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#101b0d] dark:text-white mb-3">Scheduled</h3>
            <div className="space-y-3">
              {scheduled.map((post) => {
                const statusConfig = getPostStatusConfig(post.status)
                return (
                  <PostCard key={post.id} post={post} statusConfig={statusConfig} onSelectPost={onSelectPost} getPlatformIcon={getPlatformIcon} getPlatformBg={getPlatformBg} />
                )
              })}
            </div>
          </div>
        )}

        {/* Drafts */}
        {drafts.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-[#101b0d] dark:text-white mb-3">Drafts</h3>
            <div className="space-y-3">
              {drafts.map((post) => {
                const statusConfig = getPostStatusConfig(post.status)
                return (
                  <PostCard key={post.id} post={post} statusConfig={statusConfig} onSelectPost={onSelectPost} getPlatformIcon={getPlatformIcon} getPlatformBg={getPlatformBg} />
                )
              })}
            </div>
          </div>
        )}

        {posts.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>No posts in queue. Create your first post to get started.</p>
          </div>
        )}
      </div>
    </div>
  )
}

function PostCard({
  post,
  statusConfig,
  onSelectPost,
  getPlatformIcon,
  getPlatformBg,
}: {
  post: MarketingPost
  statusConfig: { bg: string; text: string; border: string; label: string }
  onSelectPost: (id: string) => void
  getPlatformIcon: (platform: PostPlatform) => React.ReactElement
  getPlatformBg: (platform: PostPlatform) => string
}) {
  return (
    <button
      onClick={() => onSelectPost(post.id)}
      className="w-full text-left bg-white dark:bg-[#1f2b15] rounded-xl border border-[#e9f3e7] dark:border-[#334025] p-4 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-bold text-[#101b0d] dark:text-white text-base mb-1 truncate">
            {post.title || 'Untitled Post'}
          </h4>
          {post.caption && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {post.caption}
            </p>
          )}
        </div>
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} flex-shrink-0`}>
          {statusConfig.label}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {post.platforms.map((platform) => (
            <div
              key={platform}
              className={`w-6 h-6 rounded flex items-center justify-center ${getPlatformBg(platform)}`}
            >
              {getPlatformIcon(platform)}
            </div>
          ))}
        </div>
        {post.scheduled_date && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(post.scheduled_date), 'MMM d, yyyy')}
            {post.scheduled_time && ` at ${post.scheduled_time}`}
          </span>
        )}
      </div>
    </button>
  )
}

