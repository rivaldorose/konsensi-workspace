'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useNewsArticle, useNewsArticleComments, useNewsArticleNote, useUpdateNewsArticle, useUpsertNewsArticleNote, useCreateNewsArticleComment } from '@/hooks/useNews'
import { useCurrentUser } from '@/hooks/useUsers'
import { formatDistanceToNow } from 'date-fns'

export default function NewsDetailPage() {
  const params = useParams()
  const router = useRouter()
  const articleId = params.id as string
  
  const { data: article, isLoading } = useNewsArticle(articleId)
  const { data: comments = [] } = useNewsArticleComments(articleId)
  const { data: note } = useNewsArticleNote(articleId)
  const updateArticle = useUpdateNewsArticle()
  const upsertNote = useUpsertNewsArticleNote()
  const createComment = useCreateNewsArticleComment()
  const { data: currentUser } = useCurrentUser()
  
  const [noteContent, setNoteContent] = useState(note?.content || '')
  const [commentText, setCommentText] = useState('')

  const handleSaveNote = async () => {
    if (!articleId || !noteContent.trim()) return
    
    try {
      await upsertNote.mutateAsync({
        articleId,
        content: noteContent.trim(),
      })
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Failed to save note. Please try again.')
    }
  }

  const handleAddComment = async () => {
    if (!commentText.trim() || !articleId) return
    
    try {
      await createComment.mutateAsync({
        articleId,
        content: commentText.trim(),
      })
      setCommentText('')
    } catch (error) {
      console.error('Error adding comment:', error)
      alert('Failed to add comment. Please try again.')
    }
  }

  const handleToggleSave = async () => {
    if (!article) return
    
    try {
      await updateArticle.mutateAsync({
        id: article.id,
        is_saved: !article.is_saved,
      } as any)
    } catch (error) {
      console.error('Error toggling save:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-400">Loading article...</div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-2">Article not found</p>
          <Link href="/news" className="text-primary hover:underline">
            Back to News Feed
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1024px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      <div>
        <Link
          href="/news"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#4b5945] hover:text-primary transition-colors dark:text-gray-400 dark:hover:text-primary"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Back to News Feed
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <article className="bg-white dark:bg-[#2a3620] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
            {article.image_url && (
              <div className="w-full h-64 sm:h-80 bg-cover bg-center" style={{ backgroundImage: `url("${article.image_url}")` }} />
            )}
            <div className="p-6 sm:p-8">
              <div className="flex flex-col gap-4 mb-8">
                <div className="flex flex-col gap-2">
                  <h1 className="text-2xl sm:text-3xl font-black text-[#131c0d] dark:text-white leading-tight">
                    {article.title}
                  </h1>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#4b5945] dark:text-gray-400">
                    {article.category && (
                      <>
                        <span className="flex items-center gap-1.5 font-semibold text-primary">
                          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                          {article.category.charAt(0).toUpperCase() + article.category.slice(1).replace('_', ' ')}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      </>
                    )}
                    {article.source && (
                      <>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2 5a2 2 0 012-2h8a2 2 0 012 2v10a2 2 0 002 2H4a2 2 0 01-2-2V5zm3 1h6v4H5V6zm6 6H5v2h6v-2z" clipRule="evenodd" />
                            <path d="M15 7h1a2 2 0 012 2v5.5a1.5 1.5 0 01-3 0V7z" />
                          </svg>
                          {article.source.name}
                        </span>
                        <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                      </>
                    )}
                    {article.published_at && (
                      <>
                        <span className="flex items-center gap-1.5">
                          <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          {new Date(article.published_at).toLocaleDateString()}
                        </span>
                        {article.author && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600"></span>
                            <span className="flex items-center gap-1.5">
                              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                              </svg>
                              {article.author}
                            </span>
                          </>
                        )}
                      </>
                    )}
                  </div>
                </div>
                {article.url && (
                  <div className="flex items-center">
                    <a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-bold"
                    >
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                      Read Original Source
                    </a>
                  </div>
                )}
              </div>
              <hr className="border-gray-100 dark:border-gray-700 mb-8" />
              {article.content && (
                <div className="prose prose-sm max-w-none text-[#131c0d] dark:text-gray-200">
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                </div>
              )}
              {article.summary && !article.content && (
                <p className="text-[#131c0d] dark:text-gray-200 leading-relaxed">{article.summary}</p>
              )}
              <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3">
                <button
                  onClick={handleToggleSave}
                  className={`flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#131c0d] dark:text-white rounded-lg font-bold text-sm transition-colors ${
                    article.is_saved ? 'bg-primary/20 text-primary' : ''
                  }`}
                >
                  <svg className="w-5 h-5" fill={article.is_saved ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h6a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  {article.is_saved ? 'Saved' : 'Save for Later'}
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-[#131c0d] dark:text-white rounded-lg font-bold text-sm transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                  </svg>
                  Share Article
                </button>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-[#131c0d] hover:bg-primary/90 rounded-lg font-bold text-sm transition-colors">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                  Add to Documents
                </button>
              </div>
            </div>
          </article>

          {/* Team Comments */}
          <section className="bg-white dark:bg-[#2a3620] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <svg className="w-5 h-5 text-[#4b5945] dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
              </svg>
              <h3 className="text-lg font-bold text-[#131c0d] dark:text-white">Team Comments</h3>
            </div>
            <div className="flex flex-col gap-6">
              {comments.map((comment) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center">
                    {comment.user?.avatar_url ? (
                      <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url("${comment.user.avatar_url}")` }} />
                    ) : (
                      <span className="text-gray-500 font-bold text-xs">
                        {(comment.user?.full_name || comment.user?.email || 'U').charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-[#131c0d] dark:text-white text-sm">
                        {comment.user?.full_name || comment.user?.email || 'Unknown'}
                      </span>
                      <span className="text-xs text-[#4b5945] dark:text-gray-500">
                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                      </span>
                    </div>
                    <p className="text-sm text-[#4b5945] dark:text-gray-300">{comment.content}</p>
                  </div>
                </div>
              ))}
              <div className="flex gap-4 items-start">
                <div className="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-gray-500 font-bold text-xs border border-gray-300 dark:border-gray-600">
                  {currentUser ? (currentUser.full_name || currentUser.email || 'ME').charAt(0).toUpperCase() : 'ME'}
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey) && commentText.trim()) {
                        handleAddComment()
                      }
                    }}
                    className="w-full bg-[#f7f8f5] dark:bg-[#182210]/50 border-none rounded-lg p-3 text-sm text-[#131c0d] dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 resize-none"
                    placeholder="Write a comment to the team... (Cmd/Ctrl + Enter to post)"
                    rows={2}
                  />
                  <button
                    onClick={handleAddComment}
                    disabled={!commentText.trim() || createComment.isPending}
                    className="absolute bottom-2 right-2 text-xs font-bold text-primary hover:text-primary/80 disabled:opacity-50"
                  >
                    POST
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* My Notes */}
          <div className="bg-white dark:bg-[#2a3620] rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col h-fit sticky top-24">
            <div className="p-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#131c0d] dark:text-white flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm9.586 4L10 4.586 6 8.586V16h8V8h-.414z" clipRule="evenodd" />
                </svg>
                My Notes
              </h3>
              <span className="text-xs text-[#4b5945] dark:text-gray-500 font-medium">Auto-saved</span>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                onBlur={handleSaveNote}
                className="w-full bg-[#f7f8f5] dark:bg-[#182210]/50 border border-transparent focus:border-primary/30 rounded-lg p-4 text-sm text-[#131c0d] dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary/50 resize-y transition-all"
                placeholder="Jot down key takeaways or action items..."
                rows={6}
              />
              <button
                onClick={handleSaveNote}
                className="w-full py-2.5 rounded-lg bg-[#131c0d] dark:bg-white text-white dark:text-[#131c0d] font-bold text-sm hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
              >
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h5a2 2 0 012 2v7a2 2 0 01-2 2H4a2 2 0 01-2-2V8a2 2 0 012-2h5v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                </svg>
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

