'use client'

import { useRouter } from 'next/navigation'
import type { MarketingPost } from '@/types/marketing'
import { format } from 'date-fns'

interface PostPreviewPanelProps {
  post: MarketingPost | null
  onClose: () => void
  onApprove: (id: string) => void
  onSaveDraft: (id: string) => void
  onDelete: (id: string) => void
}

const getPlatformIcon = (platform: string) => {
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
    case 'x':
      return <span className="text-xs font-bold">X</span>
    default:
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
  }
}

export default function PostPreviewPanel({
  post,
  onClose,
  onApprove,
  onSaveDraft,
  onDelete
}: PostPreviewPanelProps) {
  const router = useRouter()
  
  if (!post) return null

  const scheduledDate = post.scheduled_date ? new Date(post.scheduled_date) : null

  return (
    <aside className="w-[400px] bg-white border-l border-[#e9f3e7] flex flex-col shadow-xl z-20 shrink-0 h-full overflow-hidden">
      {/* Panel Header */}
      <div className="flex items-center justify-between p-5 border-b border-[#e9f3e7]">
        <div>
          <h3 className="text-lg font-bold text-[#101b0d]">Post Details</h3>
          <p className="text-xs text-gray-500">ID: #{post.id.slice(0, 8).toUpperCase()}</p>
        </div>
        <div className="flex gap-2">
          <button className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* Status Stepper */}
        <div className="flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${
            post.status === 'pending_review' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
            post.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' :
            post.status === 'scheduled' ? 'bg-blue-100 text-blue-700 border-blue-200' :
            'bg-gray-100 text-gray-700 border-gray-200'
          }`}>
            {post.status === 'pending_review' ? 'Pending Review' :
             post.status === 'published' ? 'Published' :
             post.status === 'scheduled' ? 'Scheduled' :
             'Draft'}
          </span>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs text-gray-500">
            Last edited {format(new Date(post.updated_at), 'h:mm a')} by {post.author?.full_name || 'Unknown'}
          </span>
        </div>

        {/* Preview Card */}
        <div className="border border-[#e9f3e7] rounded-xl overflow-hidden bg-[#f9fcf8]">
          <div className="bg-gray-100 aspect-video relative group">
            {post.media_url ? (
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${post.media_url})` }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
            )}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button className="bg-white/90 text-[#101b0d] px-3 py-1.5 rounded-lg text-xs font-bold shadow-lg">
                Change Media
              </button>
            </div>
          </div>
          <div className="p-4">
            <div className="flex gap-3 mb-3">
              {post.platforms.map((platform) => (
                <button
                  key={platform}
                  className="size-8 rounded-full bg-primary text-[#101b0d] flex items-center justify-center shadow-sm"
                >
                  {getPlatformIcon(platform)}
                </button>
              ))}
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-bold text-gray-500 uppercase">Caption</label>
              <textarea
                className="w-full text-sm text-[#101b0d] bg-transparent border-0 p-0 focus:ring-0 resize-none min-h-[80px]"
                value={post.caption || ''}
                readOnly
              />
              <div className="flex justify-between items-center pt-2 border-t border-[#e9f3e7]">
                <span className="text-xs text-gray-400">
                  {post.caption?.length || 0} / 3000 chars
                </span>
                <button className="text-primary hover:underline text-xs font-bold flex items-center gap-1">
                  <svg className="w-[14px] h-[14px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Generate AI Caption
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Scheduling Details */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-[#101b0d]">Scheduling</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">Date</label>
              <div className="flex items-center gap-2 bg-[#f9fcf8] border border-[#d3e7cf] rounded-lg px-3 py-2">
                <svg className="w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm font-medium text-[#101b0d]">
                  {scheduledDate ? format(scheduledDate, 'MMM d, yyyy') : 'Not scheduled'}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">Time</label>
              <div className="flex items-center gap-2 bg-[#f9fcf8] border border-[#d3e7cf] rounded-lg px-3 py-2">
                <svg className="w-[18px] h-[18px] text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-[#101b0d]">
                  {post.scheduled_time || 'Not set'}
                </span>
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs text-gray-500 font-medium">Author</label>
            <div className="flex items-center gap-2">
              <div className="size-6 rounded-full bg-gray-200 bg-cover" style={{
                backgroundImage: post.author?.avatar_url ? `url(${post.author.avatar_url})` : undefined
              }}>
                {!post.author?.avatar_url && (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-600">
                    {post.author?.full_name?.charAt(0) || '?'}
                  </div>
                )}
              </div>
              <span className="text-sm font-medium text-[#101b0d]">
                {post.author?.full_name || 'Unknown'}
              </span>
            </div>
          </div>
        </div>

        {/* Approval Workflow */}
        {post.approval_required && post.status === 'pending_review' && (
          <div className="bg-yellow-50 rounded-lg p-3 border border-yellow-100 flex gap-3 items-start">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-xs font-bold text-yellow-800 mb-1">Approval Required</p>
              <p className="text-xs text-yellow-700 leading-relaxed">
                This post contains product announcements and requires approval from the Marketing Lead before scheduling.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Panel Footer Actions */}
      <div className="p-5 border-t border-[#e9f3e7] bg-[#fcfdfc] space-y-3">
        {post.status === 'pending_review' && (
          <button
            onClick={() => onApprove(post.id)}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-lg bg-primary text-[#101b0d] text-sm font-bold shadow-md shadow-primary/20 hover:bg-[#2bc40e] transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Approve & Schedule
          </button>
        )}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onSaveDraft(post.id)}
            className="w-full h-10 rounded-lg border border-[#d3e7cf] bg-white text-[#101b0d] text-sm font-bold hover:bg-gray-50 transition-colors"
          >
            Save as Draft
          </button>
          <button
            onClick={() => router.push(`/marketing/${post.id}/delete`)}
            className="w-full h-10 rounded-lg border border-transparent text-red-600 text-sm font-bold hover:bg-red-50 transition-colors"
          >
            Delete Post
          </button>
        </div>
      </div>
    </aside>
  )
}

