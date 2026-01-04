'use client'

import { useMarketingPost } from '@/hooks/useMarketingPosts'
import { format } from 'date-fns'
import type { PostPlatform } from '@/types/marketing'

interface PostDetailsSidebarProps {
  postId: string
  onClose: () => void
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

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'published':
      return {
        bg: 'bg-primary',
        text: 'text-[#101b0d]',
        label: 'Published',
      }
    case 'scheduled':
      return {
        bg: 'bg-blue-100 dark:bg-blue-900/30',
        text: 'text-blue-700 dark:text-blue-300',
        label: 'Scheduled',
      }
    case 'pending_review':
      return {
        bg: 'bg-yellow-100 dark:bg-yellow-900/30',
        text: 'text-yellow-700 dark:text-yellow-300',
        label: 'Pending Review',
      }
    default:
      return {
        bg: 'bg-gray-100 dark:bg-gray-900/30',
        text: 'text-gray-600 dark:text-gray-400',
        label: 'Draft',
      }
  }
}

export function PostDetailsSidebar({ postId, onClose }: PostDetailsSidebarProps) {
  const { data: post, isLoading } = useMarketingPost(postId)

  if (isLoading) {
    return (
      <div className="w-[400px] bg-white dark:bg-[#1f2b15] border-l border-[#e9f3e7] dark:border-[#334025] flex items-center justify-center">
        <div className="animate-pulse text-gray-400">Loading...</div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="w-[400px] bg-white dark:bg-[#1f2b15] border-l border-[#e9f3e7] dark:border-[#334025] flex items-center justify-center">
        <div className="text-gray-400">Post not found</div>
      </div>
    )
  }

  const statusConfig = getStatusConfig(post.status)

  return (
    <aside className="w-[400px] bg-white dark:bg-[#1f2b15] border-l border-[#e9f3e7] dark:border-[#334025] flex flex-col shadow-xl z-20 shrink-0 h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#e9f3e7] dark:border-[#334025]">
        <div>
          <h3 className="text-lg font-bold text-[#101b0d] dark:text-white">Post Details</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">ID: #{post.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <button
          onClick={onClose}
          className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3820] text-gray-500 dark:text-gray-400 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${statusConfig.bg} ${statusConfig.text}`}>
            {statusConfig.label}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {format(new Date(post.updated_at), 'h:mm a')} by {post.author?.full_name || 'Unknown'}
          </span>
        </div>

        {/* Preview Card */}
        <div className="border border-[#e9f3e7] dark:border-[#334025] rounded-xl overflow-hidden bg-[#f9fcf8] dark:bg-[#182210]">
          {post.media_url && (
            <div className="bg-gray-100 dark:bg-gray-900 aspect-video relative">
              <img
                src={post.media_url}
                alt={post.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              {post.platforms.map((platform) => (
                <div
                  key={platform}
                  className={`w-6 h-6 rounded flex items-center justify-center ${getPlatformBg(platform)}`}
                >
                  {getPlatformIcon(platform)}
                </div>
              ))}
            </div>
            <h4 className="font-bold text-[#101b0d] dark:text-white text-base mb-2">
              {post.title || 'Untitled Post'}
            </h4>
            {post.caption && (
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {post.caption}
              </p>
            )}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1 block">Scheduled</label>
            <p className="text-sm text-[#101b0d] dark:text-white">
              {post.scheduled_date
                ? `${format(new Date(post.scheduled_date), 'MMM d, yyyy')}${post.scheduled_time ? ` at ${post.scheduled_time}` : ''}`
                : 'Not scheduled'}
            </p>
          </div>

          {post.published_at && (
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1 block">Published</label>
              <p className="text-sm text-[#101b0d] dark:text-white">
                {format(new Date(post.published_at), 'MMM d, yyyy h:mm a')}
              </p>
            </div>
          )}

          {post.author && (
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-1 block">Author</label>
              <div className="flex items-center gap-2">
                {post.author.avatar_url ? (
                  <img
                    src={post.author.avatar_url}
                    alt={post.author.full_name}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                    {post.author.full_name?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="text-sm text-[#101b0d] dark:text-white">{post.author.full_name || post.author.email}</span>
              </div>
            </div>
          )}

          {/* Analytics (for published posts) */}
          {post.status === 'published' && (post.likes || post.comments || post.shares || post.views) && (
            <div>
              <label className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase mb-2 block">Performance</label>
              <div className="grid grid-cols-2 gap-3">
                {post.views && (
                  <div className="bg-[#f9fcf8] dark:bg-[#182210] rounded-lg p-3 border border-[#e9f3e7] dark:border-[#334025]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Views</div>
                    <div className="text-lg font-bold text-[#101b0d] dark:text-white">{post.views.toLocaleString()}</div>
                  </div>
                )}
                {post.likes && (
                  <div className="bg-[#f9fcf8] dark:bg-[#182210] rounded-lg p-3 border border-[#e9f3e7] dark:border-[#334025]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Likes</div>
                    <div className="text-lg font-bold text-[#101b0d] dark:text-white">{post.likes.toLocaleString()}</div>
                  </div>
                )}
                {post.comments && (
                  <div className="bg-[#f9fcf8] dark:bg-[#182210] rounded-lg p-3 border border-[#e9f3e7] dark:border-[#334025]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Comments</div>
                    <div className="text-lg font-bold text-[#101b0d] dark:text-white">{post.comments.toLocaleString()}</div>
                  </div>
                )}
                {post.shares && (
                  <div className="bg-[#f9fcf8] dark:bg-[#182210] rounded-lg p-3 border border-[#e9f3e7] dark:border-[#334025]">
                    <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Shares</div>
                    <div className="text-lg font-bold text-[#101b0d] dark:text-white">{post.shares.toLocaleString()}</div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="border-t border-[#e9f3e7] dark:border-[#334025] p-5 space-y-2">
        <button className="w-full px-4 py-2 bg-primary hover:bg-[#60d60b] text-[#101b0d] text-sm font-bold rounded-lg transition-colors">
          Edit Post
        </button>
        {post.status !== 'published' && (
          <button className="w-full px-4 py-2 bg-white dark:bg-[#222e18] border border-[#e9f3e7] dark:border-[#334025] hover:bg-gray-50 dark:hover:bg-[#2a3820] text-[#101b0d] dark:text-white text-sm font-medium rounded-lg transition-colors">
            Schedule
          </button>
        )}
      </div>
    </aside>
  )
}


