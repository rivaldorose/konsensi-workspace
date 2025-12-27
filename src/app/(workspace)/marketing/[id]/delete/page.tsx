'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useMarketingPost, useDeleteMarketingPost } from '@/hooks/useMarketing'
import { format } from 'date-fns'

export default function DeletePostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = params.id as string
  
  const { data: post, isLoading } = useMarketingPost(postId)
  const deletePost = useDeleteMarketingPost()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleClose = () => {
    router.back()
  }

  const handleDelete = async () => {
    if (!post) return
    
    setIsDeleting(true)
    try {
      await deletePost.mutateAsync(post.id)
      router.push('/marketing')
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post. Please try again.')
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-[#202b18] rounded-xl p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm flex items-center justify-center">
        <div className="bg-white dark:bg-[#202b18] rounded-xl p-8">
          <p className="text-[#131b0d] dark:text-white">Post not found</p>
          <button
            onClick={() => router.push('/marketing')}
            className="mt-4 text-primary"
          >
            Go back
          </button>
        </div>
      </div>
    )
  }

  const scheduledDate = post.scheduled_date ? new Date(post.scheduled_date) : null

  return (
    <>
      {/* Background Simulation */}
      <div aria-hidden="true" className="fixed inset-0 z-0 flex flex-col opacity-30 pointer-events-none">
        <div className="h-16 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#182210] w-full"></div>
        <div className="flex flex-1">
          <div className="w-64 border-r border-neutral-200 dark:border-neutral-800 h-full hidden md:block"></div>
          <div className="flex-1 bg-[#f7f8f6] dark:bg-[#182210] p-8">
            <div className="h-32 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg mb-4"></div>
            <div className="h-64 w-full bg-neutral-200 dark:bg-neutral-800 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Overlay Backdrop */}
      <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity"></div>

      {/* Modal Dialog */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Modal Container */}
        <div className="relative w-full max-w-[480px] flex flex-col bg-white dark:bg-[#202b18] rounded-xl shadow-2xl ring-1 ring-black/5 transform transition-all">
          
          {/* Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <h3 className="text-[#131b0d] dark:text-white text-xl font-bold leading-tight tracking-[-0.015em]">
              🗑️ Delete Post
            </h3>
            <button
              onClick={handleClose}
              aria-label="Close modal"
              className="group p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors cursor-pointer text-neutral-500 dark:text-neutral-400"
            >
              <span className="material-symbols-outlined text-2xl group-hover:text-neutral-800 dark:group-hover:text-white">close</span>
            </button>
          </div>

          {/* Body Content */}
          <div className="px-6 py-2 flex flex-col gap-4">
            {/* Question Text */}
            <p className="text-[#131b0d] dark:text-neutral-200 text-base font-medium leading-normal">
              Are you sure you want to delete this {post.platforms.join('/')} post?
            </p>

            {/* Post Preview Card */}
            <div className="flex gap-4 p-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-neutral-50 dark:bg-[#182210]/50 items-start">
              {/* Thumbnail Image */}
              <div
                className="h-16 w-16 shrink-0 bg-cover bg-center rounded-md border border-neutral-200 dark:border-neutral-700 shadow-sm"
                style={{
                  backgroundImage: post.media_url 
                    ? `url(${post.media_url})` 
                    : 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuCKEGBA2wRy40aUyD5k04eSoQBNoqa4Bg1uGIUMaZwzzbLL9Xz3K1vRtKoFMYGYs93kdVPJJ8pSGT1DblgLwoRY3CrJqYz8VCHH1TaQYnXXZjU1R4W0LTzd4At0OvVyKcM4PEJQw0Nrp9o6kTWBEPEdfiyN1TTh2PbRu5zr015yEjCK1FjuBLP9L7-qlgY7_5lxI1b9WGN19fsMmRxAKr0S-ghi1J3_UJh_b_GYBybWOw8MY6X0U12NbVBL-qkFoo4pinEYhK5_uEbJ)'
                }}
              />

              {/* Post Details */}
              <div className="flex flex-col gap-1 overflow-hidden flex-1">
                <p className="text-sm font-bold text-[#131b0d] dark:text-white truncate leading-tight">
                  {post.title || post.caption?.substring(0, 50) + '...' || 'Untitled Post'}
                </p>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-neutral-400 dark:text-neutral-500">schedule</span>
                  <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-bold ring-1 ring-inset ${
                    post.status === 'scheduled'
                      ? 'bg-primary/10 dark:bg-primary/20 text-primary dark:text-[#8af53b] ring-primary/20'
                      : post.status === 'published'
                      ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-300 ring-green-600/20'
                      : post.status === 'draft'
                      ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 ring-gray-600/20'
                      : 'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 ring-yellow-600/20'
                  }`}>
                    {post.status === 'scheduled' ? 'Scheduled' :
                     post.status === 'published' ? 'Published' :
                     post.status === 'draft' ? 'Draft' :
                     'Pending Review'}
                  </span>
                </div>
              </div>
            </div>

            {/* Warning Message */}
            <div className="flex items-start gap-2 pt-1">
              <span className="material-symbols-outlined text-amber-500 text-lg mt-0.5">warning</span>
              <p className="text-[#6e9a4c] dark:text-[#8bb868] text-sm font-medium leading-normal">
                This action cannot be undone. The post will be permanently removed from your content calendar.
              </p>
            </div>
          </div>

          {/* Footer / Action Buttons */}
          <div className="px-6 py-6 mt-2 flex justify-end gap-3 border-t border-neutral-100 dark:border-neutral-700/50">
            <button
              onClick={handleClose}
              disabled={isDeleting}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-700/50 text-[#131b0d] dark:text-white text-sm font-bold leading-normal tracking-[0.015em] transition-colors border border-neutral-200 dark:border-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">Cancel</span>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold leading-normal tracking-[0.015em] shadow-sm transition-colors ring-1 ring-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-[#202b18] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="truncate">{isDeleting ? 'Deleting...' : 'Delete Post'}</span>
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

