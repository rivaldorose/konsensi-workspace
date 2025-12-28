'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useContract, useDeleteContract, useArchiveContract } from '@/hooks/useContracts'

export default function DeleteContractPage() {
  const router = useRouter()
  const params = useParams()
  const contractId = params.id as string
  const { data: contract, isLoading } = useContract(contractId)
  const deleteContract = useDeleteContract()
  const archiveContract = useArchiveContract()

  const [deleteOption, setDeleteOption] = useState<'archive' | 'delete'>('archive')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#fafcf8] dark:bg-[#232a20] rounded-xl p-8">
          <div className="animate-pulse">Loading contract...</div>
        </div>
      </div>
    )
  }

  if (!contract) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#fafcf8] dark:bg-[#232a20] rounded-xl p-8">
          <p className="text-red-500">Contract not found</p>
          <button onClick={() => router.push('/contracts')} className="mt-4 px-4 py-2 bg-primary text-white rounded">
            Back to Contracts
          </button>
        </div>
      </div>
    )
  }

  const handleCancel = () => {
    router.push(`/contracts/${contract.id}`)
  }

  const handleConfirm = async () => {
    setIsSubmitting(true)
    try {
      if (deleteOption === 'archive') {
        await archiveContract.mutateAsync(contract.id)
      } else {
        await deleteContract.mutateAsync(contract.id)
      }
      router.push('/contracts')
    } catch (error) {
      console.error('Error deleting/archiving contract:', error)
      alert(`Failed to ${deleteOption === 'archive' ? 'archive' : 'delete'} contract`)
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (value?: number, currency?: string) => {
    if (!value) return '$0.00'
    const currencySymbol = currency === 'usd' ? '$' : currency === 'eur' ? '€' : currency === 'gbp' ? '£' : 'Rp'
    return `${currencySymbol}${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-[600px] bg-[#fafcf8] dark:bg-[#232a20] rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#ecf3e7] dark:border-[#343a30] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <svg className="w-6 h-6 text-danger" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold leading-tight tracking-[-0.015em] text-[#131b0d] dark:text-[#f7f8f6]">
              Delete Contract?
            </h2>
          </div>
          <button
            onClick={handleCancel}
            className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-[#343a30] text-[#131b0d] dark:text-[#f7f8f6]"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex flex-col gap-6 p-6">
          {/* Contract Summary Card */}
          <div className="rounded-lg border border-[#dae7cf] dark:border-[#4a5545] bg-white dark:bg-[#1f261b] p-4 shadow-sm">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Contract Image/Thumbnail */}
              <div className="h-20 w-20 shrink-0 rounded-lg bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 sm:h-24 sm:w-24 border border-gray-100 dark:border-gray-700 flex items-center justify-center">
                <svg className="w-10 h-10 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                  />
                </svg>
              </div>

              {/* Details */}
              <div className="flex flex-1 flex-col justify-between gap-2">
                <div>
                  <h3 className="text-base font-bold text-[#131b0d] dark:text-[#f7f8f6] line-clamp-1">{contract.name}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center rounded-full bg-blue-100 dark:bg-blue-900/30 px-2.5 py-0.5 text-xs font-medium text-blue-800 dark:text-blue-300">
                      {contract.type}
                    </span>
                    <span className="inline-flex items-center rounded-full bg-primary/20 dark:bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:text-primary">
                      {contract.status}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-dashed border-[#ecf3e7] dark:border-[#343a30] pt-2 mt-1">
                  <div className="flex items-center -space-x-2 overflow-hidden">
                    {contract.parties?.slice(0, 2).map((party, index) => (
                      <div
                        key={index}
                        className="inline-block h-6 w-6 rounded-full ring-2 ring-white dark:ring-[#1f261b] bg-primary/20 flex items-center justify-center text-primary text-xs font-bold"
                      >
                        {party.name.charAt(0).toUpperCase()}
                      </div>
                    ))}
                    <span className="ml-2 text-xs text-gray-500 dark:text-gray-400">
                      {contract.parties?.map((p) => p.name).join(' + ') || 'No parties'}
                    </span>
                  </div>
                  <span className="font-bold text-[#131b0d] dark:text-[#f7f8f6] text-sm">
                    {formatCurrency(contract.value, contract.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Warning Text */}
          <div className="flex gap-3 rounded-lg bg-red-50 dark:bg-red-900/10 p-4 border border-red-100 dark:border-red-900/20">
            <svg className="w-5 h-5 text-danger shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              />
            </svg>
            <p className="text-sm font-normal leading-relaxed text-[#131b0d] dark:text-[#f7f8f6]">
              <span className="font-bold text-danger">WARNING:</span> Deleting this contract will permanently remove
              all associated data including documents and history. This action cannot be undone.
            </p>
          </div>

          {/* Action Options */}
          <div className="flex flex-col gap-3">
            <label
              className={`group relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all hover:bg-[#f2f8f0] dark:hover:bg-[#2a3225] ${
                deleteOption === 'archive'
                  ? 'border-primary bg-[#f0f9eb] dark:bg-[#1e2815] dark:border-primary/60'
                  : 'border-[#dae7cf] dark:border-[#4a5545]'
              }`}
            >
              <input
                className="peer h-5 w-5 border-2 border-gray-300 dark:border-gray-500 bg-transparent text-primary checked:border-primary focus:ring-primary focus:ring-offset-0 dark:focus:ring-offset-gray-900"
                name="delete-option"
                type="radio"
                value="archive"
                checked={deleteOption === 'archive'}
                onChange={() => setDeleteOption('archive')}
              />
              <div className="flex grow flex-col">
                <p className="text-sm font-bold text-[#131b0d] dark:text-[#f7f8f6]">Archive Contract</p>
                <p className="text-xs text-[#6e9a4c] dark:text-[#8ab866]">Keep data but hide from view</p>
              </div>
              <svg
                className={`w-5 h-5 text-primary absolute right-4 ${deleteOption === 'archive' ? 'opacity-100' : 'opacity-0'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                />
              </svg>
            </label>

            <label
              className={`group relative flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition-all ${
                deleteOption === 'delete'
                  ? 'border-danger bg-red-50 dark:bg-[#2f1b1b] dark:border-danger/60 hover:bg-red-50 dark:hover:bg-[#2f1b1b]'
                  : 'border-[#dae7cf] dark:border-[#4a5545] hover:bg-red-50 dark:hover:bg-[#2f1b1b]'
              }`}
            >
              <input
                className="peer h-5 w-5 border-2 border-gray-300 dark:border-gray-500 bg-transparent text-danger checked:border-danger focus:ring-danger focus:ring-offset-0 dark:focus:ring-offset-gray-900"
                name="delete-option"
                type="radio"
                value="delete"
                checked={deleteOption === 'delete'}
                onChange={() => setDeleteOption('delete')}
              />
              <div className="flex grow flex-col">
                <p className="text-sm font-bold text-[#131b0d] dark:text-[#f7f8f6]">Delete Permanently</p>
                <p className="text-xs text-danger/80 dark:text-danger/80">Remove all data (cannot recover)</p>
              </div>
              <svg
                className={`w-5 h-5 text-danger absolute right-4 ${deleteOption === 'delete' ? 'opacity-100' : 'opacity-0'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                />
              </svg>
            </label>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-[#ecf3e7] dark:border-[#343a30] bg-[#fafcf8] dark:bg-[#232a20] px-6 py-4">
          <button
            onClick={handleCancel}
            className="flex h-10 min-w-[84px] items-center justify-center rounded-lg border border-transparent px-4 text-sm font-bold text-[#637588] dark:text-[#9ca3af] transition-colors hover:bg-gray-100 dark:hover:bg-[#343a30] focus:outline-none focus:ring-2 focus:ring-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={isSubmitting || deleteContract.isPending || archiveContract.isPending}
            className="flex h-10 min-w-[84px] items-center justify-center rounded-lg bg-danger px-4 text-sm font-bold text-white shadow-sm transition-all hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-danger focus:ring-offset-2 dark:focus:ring-offset-[#232a20] disabled:opacity-50"
          >
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  )
}

