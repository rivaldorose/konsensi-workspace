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
      return <i className="not-italic font-bold text-xs">in</i>
    case 'instagram':
      return <span className="material-symbols-outlined text-[16px]">photo_camera</span>
    case 'twitter':
    case 'x':
      return <i className="not-italic font-bold text-xs">X</i>
    default:
      return <span className="material-symbols-outlined text-[16px]">public</span>
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
            <span className="material-symbols-outlined text-[20px]">more_horiz</span>
          </button>
          <button
            onClick={onClose}
            className="size-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
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
                <span className="material-symbols-outlined text-4xl">image</span>
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
                  <span className="material-symbols-outlined text-[14px]">smart_toy</span>
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
                <span className="material-symbols-outlined text-gray-400 text-[18px]">calendar_today</span>
                <span className="text-sm font-medium text-[#101b0d]">
                  {scheduledDate ? format(scheduledDate, 'MMM d, yyyy') : 'Not scheduled'}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500 font-medium">Time</label>
              <div className="flex items-center gap-2 bg-[#f9fcf8] border border-[#d3e7cf] rounded-lg px-3 py-2">
                <span className="material-symbols-outlined text-gray-400 text-[18px]">schedule</span>
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
            <span className="material-symbols-outlined text-yellow-600 mt-0.5">info</span>
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
            <span className="material-symbols-outlined">check</span>
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

