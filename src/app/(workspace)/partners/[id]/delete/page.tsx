'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePartner, useDeletePartner } from '@/hooks/usePartners'

export default function DeletePartnerPage() {
  const router = useRouter()
  const params = useParams()
  const partnerId = params.id as string
  
  const { data: partner, isLoading } = usePartner(partnerId)
  const deletePartner = useDeletePartner()
  
  const [confirmText, setConfirmText] = useState('')
  const canDelete = confirmText === 'DELETE'

  const handleClose = () => {
    router.push(`/partners/${partnerId}/edit`)
  }

  const handleDelete = async () => {
    if (!canDelete || !partnerId) return
    
    try {
      await deletePartner.mutateAsync(partnerId)
      router.push('/partners')
    } catch (error) {
      console.error('Failed to delete partner:', error)
      alert('Failed to delete partner. Please try again.')
    }
  }

  const handleArchive = () => {
    // TODO: Implement archive functionality
    router.push(`/partners/${partnerId}/edit`)
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1a0b0b] rounded-xl p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1a0b0b] rounded-xl p-8">
          <p>Partner not found</p>
          <button onClick={() => router.push('/partners')} className="mt-4 text-primary">Go back</button>
        </div>
      </div>
    )
  }

  return (
    <>
      {/* Modal Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-lg transform overflow-hidden rounded-xl bg-white dark:bg-[#1a0b0b] shadow-2xl transition-all border border-neutral-200 dark:border-neutral-800">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 px-6 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ec1313]/10">
                <svg className="w-5 h-5 text-[#ec1313]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
                </svg>
              </div>
              <h3 className="text-xl font-bold leading-tight text-neutral-900 dark:text-neutral-50">
                Delete Partner
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-500 dark:hover:bg-neutral-800 dark:hover:text-neutral-300 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Body Content */}
          <div className="px-6 py-6">
            {/* Confirmation Question */}
            <p className="mb-5 text-base font-normal leading-relaxed text-neutral-600 dark:text-neutral-300">
              Are you sure you want to delete <span className="font-bold text-neutral-900 dark:text-white">"{partner.name}"</span>?
            </p>

            {/* Consequences List */}
            <div className="mb-6 rounded-lg bg-neutral-50 dark:bg-[#2a1515] p-4 border border-neutral-100 dark:border-neutral-800">
              <p className="mb-3 text-sm font-semibold text-neutral-900 dark:text-neutral-200">
                This will permanently remove:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <svg className="w-[18px] h-[18px] text-[#ec1313]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Partner information
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <svg className="w-[18px] h-[18px] text-[#ec1313]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  All contact details
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <svg className="w-[18px] h-[18px] text-[#ec1313]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Internal notes
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <svg className="w-[18px] h-[18px] text-[#ec1313]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Linked documents
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                  <svg className="w-[18px] h-[18px] text-[#ec1313]" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  Related contracts
                </li>
              </ul>
            </div>

            {/* Critical Warning */}
            <div className="mb-6 flex items-start gap-3 rounded-lg bg-red-50 dark:bg-red-900/10 p-3 text-[#ec1313]">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
              </svg>
              <p className="text-sm font-medium">This action cannot be undone.</p>
            </div>

            {/* Confirmation Input */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300" htmlFor="confirm-delete">
                Type <span className="font-bold text-neutral-900 dark:text-white">DELETE</span> to confirm
              </label>
              <input
                className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-3 text-base text-neutral-900 placeholder-neutral-400 focus:border-[#ec1313] focus:ring-[#ec1313] dark:border-neutral-700 dark:bg-[#1a0b0b] dark:text-white dark:placeholder-neutral-600"
                id="confirm-delete"
                placeholder="DELETE"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
              />
            </div>

            {/* Archive Alternative */}
            <div className="mt-4 flex items-center justify-start gap-1 text-sm">
              <span className="text-neutral-500 dark:text-neutral-400">Want to keep the data?</span>
              <button
                onClick={handleArchive}
                className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-[#ec1313] hover:decoration-[#ec1313] dark:text-neutral-300 dark:decoration-neutral-600 dark:hover:text-[#ec1313] transition-colors"
              >
                Archive partner instead
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50 dark:bg-[#221010] px-6 py-4">
            <button
              onClick={handleClose}
              className="rounded-lg border border-neutral-300 bg-white px-4 py-2.5 text-sm font-semibold text-neutral-700 shadow-sm hover:bg-neutral-50 hover:text-neutral-900 dark:border-neutral-700 dark:bg-transparent dark:text-neutral-300 dark:hover:bg-neutral-800 dark:hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={!canDelete || deletePartner.isPending}
              className="inline-flex items-center justify-center rounded-lg bg-[#ec1313] px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ec1313] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete Partner
            </button>
          </div>

        </div>
      </div>
    </>
  )
}

