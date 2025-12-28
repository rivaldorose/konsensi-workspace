'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMarketingPost, useUpdateMarketingPost, useDeleteMarketingPost } from '@/hooks/useMarketing'
import { useUsers } from '@/hooks/useUsers'

export default function EditMarketingPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string

  const { data: post, isLoading } = useMarketingPost(postId)
  const { data: users = [] } = useUsers()
  const updatePost = useUpdateMarketingPost()
  const deletePost = useDeleteMarketingPost()

  const [platforms, setPlatforms] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [scheduledTime, setScheduledTime] = useState('')
  const [reviewerId, setReviewerId] = useState<string>('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mediaFile, setMediaFile] = useState<File | null>(null)
  const [mediaPreview, setMediaPreview] = useState<string>('')

  useEffect(() => {
    if (post) {
      setPlatforms(post.platforms || [])
      setCaption(post.caption || '')
      if (post.scheduled_date) {
        setScheduledDate(post.scheduled_date)
      }
      if (post.scheduled_time) {
        setScheduledTime(post.scheduled_time)
      }
      setReviewerId(post.approved_by || '')
      if (post.media_url) {
        setMediaPreview(post.media_url)
      }
    }
  }, [post])

  const handleClose = () => {
    router.back()
  }

  const handlePlatformToggle = (platform: string) => {
    setPlatforms((prev) => (prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]))
  }

  const handleMediaReplace = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'image/*'
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (file) {
        setMediaFile(file)
        const reader = new FileReader()
        reader.onloadend = () => {
          setMediaPreview(reader.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
    input.click()
  }

  const handleMediaDelete = () => {
    setMediaFile(null)
    setMediaPreview('')
  }

  const handleSave = async () => {
    if (!post) return

    setIsSubmitting(true)

    try {
      await updatePost.mutateAsync({
        id: post.id,
        platforms,
        caption,
        scheduled_date: scheduledDate || undefined,
        scheduled_time: scheduledTime || undefined,
        approved_by: reviewerId || undefined,
        // media_url would be handled via file upload in production
      })

      router.back()
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Failed to update post. Please try again.')
      setIsSubmitting(false)
    }
  }

  const handleDelete = async () => {
    if (!post) return

    if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return
    }

    try {
      await deletePost.mutateAsync(post.id)
      router.push('/marketing')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
    }
  }

  const captionLength = caption.length
  const maxLength = 2200

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-[800px] bg-white dark:bg-[#222f1a] rounded-2xl p-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-[800px] bg-white dark:bg-[#222f1a] rounded-2xl p-8">
          <p className="text-center text-gray-500">Post not found</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  const reviewer = users.find((u) => u.id === reviewerId)

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity z-40 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-[800px] flex flex-col bg-white dark:bg-[#222f1a] rounded-2xl shadow-2xl max-h-[90vh] overflow-hidden border border-gray-200 dark:border-[#2f3e23]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-[#2f3e23] bg-white dark:bg-[#222f1a] z-10">
          <h2 className="text-[#131b0d] dark:text-white text-xl font-bold leading-tight">Edit Post</h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-white dark:bg-[#222f1a]">
          {/* Section: Platforms */}
          <div className="space-y-3">
            <p className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold leading-normal uppercase tracking-wider opacity-80">
              Target Platforms
            </p>
            <div className="flex gap-3 flex-wrap">
              {['LinkedIn', 'Twitter', 'Instagram'].map((platform) => {
                const isSelected = platforms.includes(platform.toLowerCase())
                return (
                  <button
                    key={platform}
                    onClick={() => handlePlatformToggle(platform.toLowerCase())}
                    className={`flex h-10 shrink-0 items-center justify-center gap-x-2 rounded-lg border-2 pl-3 pr-4 transition-all ${
                      isSelected
                        ? 'bg-[#ecf3e7] dark:bg-primary/20 border-primary'
                        : 'bg-gray-100 dark:bg-white/5 border-transparent hover:bg-gray-200 dark:hover:bg-white/10'
                    }`}
                  >
                    {isSelected ? (
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                        />
                      </svg>
                    )}
                    <p
                      className={`text-sm font-bold ${
                        isSelected
                          ? 'text-[#131b0d] dark:text-white'
                          : 'text-gray-600 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-gray-200'
                      }`}
                    >
                      {platform}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Section: Media */}
          {mediaPreview && (
            <div className="space-y-3">
              <p className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold leading-normal uppercase tracking-wider opacity-80">
                Media
              </p>
              <div className="border border-gray-200 dark:border-[#2f3e23] rounded-xl p-4 bg-gray-50 dark:bg-[#2a3820]/30">
                <div className="flex items-stretch justify-between gap-6 flex-col sm:flex-row">
                  <div
                    className="w-full sm:w-1/3 bg-center bg-no-repeat aspect-video bg-cover rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm relative group overflow-hidden"
                    style={{ backgroundImage: `url(${mediaPreview})` }}
                  >
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                  </div>
                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <p className="text-[#131b0d] dark:text-white text-base font-bold leading-tight">
                          {mediaFile?.name || 'media.png'}
                        </p>
                        <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs px-2 py-1 rounded font-medium">
                          Ready
                        </span>
                      </div>
                      <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                        {mediaFile ? `${(mediaFile.size / 1024 / 1024).toFixed(1)} MB` : 'Media file'}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">Uploaded</p>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleMediaReplace}
                        className="flex items-center justify-center gap-2 rounded-lg h-9 px-4 bg-white dark:bg-white/10 border border-gray-200 dark:border-gray-600 text-[#131b0d] dark:text-white text-sm font-medium hover:bg-gray-50 dark:hover:bg-white/20 transition-colors w-fit shadow-sm"
                      >
                        <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" />
                        </svg>
                        <span>Replace</span>
                      </button>
                      <button
                        onClick={handleMediaDelete}
                        className="flex items-center justify-center gap-2 rounded-lg h-9 px-3 text-red-600 dark:text-red-400 text-sm font-medium hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors w-fit"
                      >
                        <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Section: Caption */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <p className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold leading-normal uppercase tracking-wider opacity-80">
                Caption
              </p>
              <span className="text-xs text-gray-400 dark:text-gray-500">
                {captionLength} / {maxLength} characters
              </span>
            </div>
            <div className="relative">
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                maxLength={maxLength}
                className="w-full min-h-[140px] rounded-xl border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-[#131b0d] dark:text-white text-base p-4 focus:ring-2 focus:ring-primary focus:border-transparent resize-y placeholder-gray-400"
                placeholder="Write your caption here..."
              />
              <div className="absolute bottom-3 right-3 flex gap-2">
                <button
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                  title="Add Emoji"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z"
                    />
                  </svg>
                </button>
                <button
                  className="p-1.5 rounded hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors"
                  title="Add Hashtags"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Section: Schedule & Settings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date Picker */}
            <div className="space-y-3">
              <p className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold leading-normal uppercase tracking-wider opacity-80">
                Schedule
              </p>
              <div className="relative">
                <input
                  type="date"
                  value={scheduledDate || ''}
                  onChange={(e) => setScheduledDate(e.target.value)}
                  className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-[#131b0d] dark:text-white px-4 focus:ring-2 focus:ring-primary focus:border-transparent dark:[color-scheme:dark]"
                />
                <input
                  type="time"
                  value={scheduledTime || ''}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  className="w-full h-11 rounded-lg border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-[#131b0d] dark:text-white px-4 focus:ring-2 focus:ring-primary focus:border-transparent dark:[color-scheme:dark] mt-2"
                />
              </div>
              {scheduledDate && (
                <p className="text-xs text-orange-600 dark:text-orange-400 flex items-center gap-1 mt-1">
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    />
                  </svg>
                  Scheduled for {new Date(scheduledDate).toLocaleDateString()}
                </p>
              )}
            </div>

            {/* Approver */}
            <div className="space-y-3">
              <p className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold leading-normal uppercase tracking-wider opacity-80">
                Reviewer
              </p>
              <div className="relative">
                <select
                  value={reviewerId}
                  onChange={(e) => setReviewerId(e.target.value)}
                  className="w-full h-11 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-black/20 text-[#131b0d] dark:text-white px-3 focus:ring-2 focus:ring-primary focus:border-transparent cursor-pointer appearance-none"
                >
                  <option value="">Select reviewer</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-400">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </div>
              {reviewer && (
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Currently assigned</p>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-5 bg-gray-50 dark:bg-[#1c2912] border-t border-gray-200 dark:border-[#2f3e23] flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Left: Destructive Action */}
          <button
            onClick={handleDelete}
            className="flex items-center justify-center gap-2 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 text-sm font-bold px-2 py-2 rounded transition-colors group"
          >
            <svg className="w-5 h-5 group-hover:animate-pulse" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              />
            </svg>
            Delete Post
          </button>

          {/* Right: Primary Actions */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none h-10 px-6 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={isSubmitting || updatePost.isPending}
              className="flex-1 sm:flex-none h-10 px-6 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
              </svg>
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

