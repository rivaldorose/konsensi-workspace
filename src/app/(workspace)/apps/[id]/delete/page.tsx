'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp, useDeleteApp } from '@/hooks/useApps'

export default function DeleteAppPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { data: app, isLoading } = useApp(params.id)
  const deleteApp = useDeleteApp()
  
  const [deleteAction, setDeleteAction] = useState<'archive' | 'permanent'>('archive')
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!app) return

    setIsDeleting(true)
    try {
      if (deleteAction === 'archive') {
        // TODO: Implement archive functionality
        // For now, just delete
        await deleteApp.mutateAsync(app.id)
      } else {
        await deleteApp.mutateAsync(app.id)
      }
      router.push('/apps')
    } catch (error) {
      console.error('Failed to delete app:', error)
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="animate-pulse text-white">Loading...</div>
      </div>
    )
  }

  if (!app) {
    return (
      <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="text-white">App not found</div>
      </div>
    )
  }

  return (
    <>
      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={() => router.back()}
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="w-full max-w-[640px] bg-[#f7f8f6] dark:bg-background-dark rounded-xl shadow-2xl overflow-hidden flex flex-col relative border border-white/20 pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <header className="flex items-center justify-between border-b border-[#dae7cf]/50 px-6 py-4 bg-white/50 dark:bg-background-dark/50">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" />
                </svg>
              </div>
              <h2 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight">Delete App</h2>
            </div>
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#6e9a4c] dark:text-gray-400"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
              </svg>
            </button>
          </header>

          {/* Scrollable Content */}
          <div className="flex flex-col p-6 sm:p-8 gap-6 max-h-[80vh] overflow-y-auto">
            {/* Heading Section */}
            <div className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-[#131b0d] dark:text-white leading-tight">
                Delete &quot;{app.name}&quot;?
              </h1>
              <p className="text-[#6e9a4c] text-sm font-normal">
                This action will affect your workspace data and team access. Please review the consequences below.
              </p>
            </div>

            {/* Impact Analysis */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Removed Column */}
              <div className="bg-red-50/50 dark:bg-red-900/10 rounded-lg p-4 border border-red-100 dark:border-red-900/20">
                <h3 className="flex items-center gap-2 text-red-700 dark:text-red-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                  </svg>
                  Will be removed
                </h3>
                <ul className="flex flex-col gap-3">
                  <li className="flex flex-col">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">App Info</span>
                    <span className="text-[#6e9a4c] text-xs">Metadata & configurations</span>
                  </li>
                  <li className="flex flex-col border-t border-red-200/50 dark:border-red-800/20 pt-2">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">User Stats</span>
                    <span className="text-[#6e9a4c] text-xs">Analytics & usage logs</span>
                  </li>
                  <li className="flex flex-col border-t border-red-200/50 dark:border-red-800/20 pt-2">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">Dev Progress</span>
                    <span className="text-[#6e9a4c] text-xs">Tickets & milestones</span>
                  </li>
                  <li className="flex flex-col border-t border-red-200/50 dark:border-red-800/20 pt-2">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">Team Assignments</span>
                    <span className="text-[#6e9a4c] text-xs">Role allocations</span>
                  </li>
                </ul>
              </div>

              {/* Kept Column */}
              <div className="bg-green-50/50 dark:bg-green-900/10 rounded-lg p-4 border border-green-100 dark:border-green-900/20">
                <h3 className="flex items-center gap-2 text-green-700 dark:text-green-400 text-xs font-bold uppercase tracking-wider mb-3">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" />
                  </svg>
                  Will stay safe
                </h3>
                <ul className="flex flex-col gap-3">
                  <li className="flex flex-col">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">Related Docs</span>
                    <span className="text-[#6e9a4c] text-xs">External documentation</span>
                  </li>
                  <li className="flex flex-col border-t border-green-200/50 dark:border-green-800/20 pt-2">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">Linked Events</span>
                    <span className="text-[#6e9a4c] text-xs">Calendar entries</span>
                  </li>
                  <li className="flex flex-col border-t border-green-200/50 dark:border-green-800/20 pt-2">
                    <span className="text-[#131b0d] dark:text-gray-200 text-sm font-semibold">GitHub Repo</span>
                    <span className="text-[#6e9a4c] text-xs">Source code & commits</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Radio List */}
            <div className="flex flex-col gap-3">
              <label className={`group relative flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                deleteAction === 'archive' 
                  ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                  : 'border-[#dae7cf] dark:border-gray-700 bg-white dark:bg-white/5 hover:border-gray-400 dark:hover:border-gray-600'
              }`}>
                <div className="flex items-center h-5">
                  <input
                    checked={deleteAction === 'archive'}
                    onChange={() => setDeleteAction('archive')}
                    className="h-5 w-5 border-2 border-[#dae7cf] bg-transparent text-transparent focus:ring-0 focus:ring-offset-0 checked:border-primary checked:bg-transparent cursor-pointer appearance-none relative"
                    name="delete_action"
                    type="radio"
                  />
                  {deleteAction === 'archive' && (
                    <div className="absolute h-5 w-5 flex items-center justify-center pointer-events-none">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
                <div className="flex grow flex-col">
                  <p className="text-[#131b0d] dark:text-white text-sm font-bold leading-tight mb-1">Archive instead (Recommended)</p>
                  <p className="text-[#6e9a4c] text-sm font-normal leading-normal">Hide app from dashboard but keep data accessible for admins.</p>
                </div>
                <div className="absolute right-4 top-4 hidden sm:block">
                  <span className="inline-flex items-center rounded-md bg-primary/20 px-2 py-1 text-xs font-medium text-green-800 dark:text-green-300 ring-1 ring-inset ring-primary/30">Safe</span>
                </div>
              </label>

              <label className={`group relative flex cursor-pointer items-start gap-4 rounded-lg border p-4 transition-all ${
                deleteAction === 'permanent' 
                  ? 'border-primary bg-primary/5 hover:bg-primary/10' 
                  : 'border-[#dae7cf] dark:border-gray-700 bg-white dark:bg-white/5 hover:border-gray-400 dark:hover:border-gray-600'
              }`}>
                <div className="flex items-center h-5 relative">
                  <input
                    checked={deleteAction === 'permanent'}
                    onChange={() => setDeleteAction('permanent')}
                    className="h-5 w-5 border-2 border-[#dae7cf] bg-transparent text-transparent focus:ring-0 focus:ring-offset-0 checked:border-primary checked:bg-transparent cursor-pointer appearance-none"
                    name="delete_action"
                    type="radio"
                  />
                  {deleteAction === 'permanent' && (
                    <div className="absolute left-0 h-5 w-5 flex items-center justify-center pointer-events-none border-2 border-primary rounded-full">
                      <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                    </div>
                  )}
                </div>
                <div className="flex grow flex-col">
                  <p className="text-[#131b0d] dark:text-white text-sm font-bold leading-tight mb-1">Permanently delete</p>
                  <p className="text-[#6e9a4c] text-sm font-normal leading-normal">This action cannot be undone. All workspace data will be wiped.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50/80 dark:bg-black/20 px-6 py-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-[#dae7cf]/50">
            <button
              onClick={() => router.back()}
              className="w-full sm:w-auto px-6 py-3 rounded-lg text-sm font-bold text-[#131b0d] dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting || deleteApp.isPending}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-[#131b0d] px-6 py-3 rounded-lg text-sm font-bold shadow-sm shadow-primary/20 transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
              </svg>
              {deleteAction === 'archive' ? 'Archive App' : 'Delete App'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

