'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDocument, useDeleteDocument } from '@/hooks/useDocuments'
import { formatDistanceToNow } from 'date-fns'

export default function DeleteDocumentPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string
  
  const { data: document, isLoading } = useDocument(documentId)
  const deleteDocument = useDeleteDocument()

  const handleClose = () => {
    router.push('/docs')
  }

  const handleDelete = async () => {
    if (!documentId) return
    
    try {
      await deleteDocument.mutateAsync(documentId)
      router.push('/docs')
    } catch (error) {
      console.error('Failed to delete document:', error)
      alert('Failed to delete document. Please try again.')
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#131b0d]/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8">
          <div className="animate-pulse text-gray-400">Loading...</div>
        </div>
      </div>
    )
  }

  if (!document) {
    return (
      <div className="fixed inset-0 bg-[#131b0d]/60 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1e1e1e] rounded-xl p-8">
          <p className="text-gray-700 dark:text-gray-300">Document not found</p>
          <button
            onClick={handleClose}
            className="mt-4 px-4 py-2 bg-primary text-[#131b0d] rounded-lg font-bold"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  const lastEditedAgo = document.last_edited
    ? formatDistanceToNow(new Date(document.last_edited), { addSuffix: true })
    : 'Unknown'

  const sharedWith = document.collaborators && document.collaborators.length > 0
    ? `${document.collaborators.length} ${document.collaborators.length === 1 ? 'person' : 'people'}`
    : 'Whole Team'

  return (
    <>
      {/* Page Background Simulation */}
      <div className="relative flex h-screen w-full flex-col overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full z-0 opacity-40 pointer-events-none">
          <div className="w-64 h-64 bg-primary/20 rounded-full blur-3xl absolute top-10 left-20"></div>
          <div className="w-96 h-96 bg-blue-500/10 rounded-full blur-3xl absolute bottom-10 right-20"></div>
        </div>

        {/* Main Workspace Header (Mock) */}
        <div className="w-full h-16 border-b border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-black/20 flex items-center px-6 justify-between z-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded bg-primary"></div>
            <span className="font-bold text-lg">Konsensi Workspace</span>
          </div>
          <div className="flex gap-4">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
        </div>

        {/* Main Content Area (Mock) */}
        <div className="flex-1 p-8 opacity-50 z-0">
          <h1 className="text-3xl font-bold mb-6">{document.title}</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-40 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700"></div>
            ))}
          </div>
        </div>
      </div>

      {/* MODAL OVERLAY */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#131b0d]/60 backdrop-blur-sm p-4">
        {/* Modal Container */}
        <div className="w-full max-w-[520px] bg-white dark:bg-[#1e1e1e] rounded-xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-300">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 pt-6 pb-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-500">
                <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>warning</span>
              </div>
              <h2 className="text-xl font-bold leading-tight tracking-tight text-gray-900 dark:text-white">
                Move to Trash
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="group p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer text-gray-500 dark:text-gray-400"
            >
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>close</span>
            </button>
          </div>

          {/* Modal Body */}
          <div className="px-6 py-2 flex flex-col gap-4">
            {/* Title & Warning */}
            <div className="flex flex-col gap-2 mt-2">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-snug">
                Move "{document.title}" to trash?
              </h3>
              <p className="text-base text-gray-600 dark:text-gray-400 font-normal leading-relaxed">
                Items in the trash can be restored within <span className="font-semibold text-gray-800 dark:text-gray-200">30 days</span> before being permanently deleted.
              </p>
            </div>

            {/* Details Card */}
            <div className="mt-2 bg-[#f7f8f6] dark:bg-[#2a2a2a] rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="grid grid-cols-[120px_1fr] gap-y-3 gap-x-4">
                {/* Row 1: Shared with */}
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">group</span>
                  Shared with
                </div>
                <div className="text-gray-900 dark:text-gray-200 text-sm font-semibold">
                  {sharedWith}
                </div>

                {/* Divider */}
                <div className="col-span-2 h-px bg-gray-200 dark:bg-gray-700 w-full"></div>

                {/* Row 2: Last edited */}
                <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 text-sm font-medium">
                  <span className="material-symbols-outlined text-[18px]">schedule</span>
                  Last edited
                </div>
                <div className="text-gray-900 dark:text-gray-200 text-sm font-semibold">
                  {lastEditedAgo}
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer / Actions */}
          <div className="px-6 py-6 mt-2 flex justify-end gap-3 bg-gray-50 dark:bg-[#252525] border-t border-gray-100 dark:border-gray-800">
            {/* Cancel Button */}
            <button
              onClick={handleClose}
              className="px-5 h-11 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-transparent text-gray-700 dark:text-gray-200 font-bold text-sm hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 transition-all focus:ring-2 focus:ring-gray-200 outline-none"
            >
              Cancel
            </button>

            {/* Destructive Action */}
            <button
              onClick={handleDelete}
              disabled={deleteDocument.isPending}
              className="px-5 h-11 rounded-lg bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-sm transition-all flex items-center gap-2 focus:ring-2 focus:ring-red-200 focus:ring-offset-1 outline-none"
            >
              <span className="material-symbols-outlined text-[20px]">delete</span>
              Move to Trash
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

