'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useDeleteApp } from '@/hooks/useApps'

interface AppHeaderProps {
  appId: string
}

export function AppHeader({ appId }: AppHeaderProps) {
  const router = useRouter()
  const deleteMutation = useDeleteApp()

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this app? This action cannot be undone.')) {
      try {
        await deleteMutation.mutateAsync(appId)
        router.push('/apps')
      } catch (error) {
        console.error('Failed to delete app:', error)
        alert('Failed to delete app')
      }
    }
  }

  return (
    <div className="flex items-center justify-between gap-4">
      <Link
        href="/apps"
        className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-[#131b0d] dark:hover:text-white transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        <span className="font-medium">Back to Apps</span>
      </Link>

      <div className="flex items-center gap-3">
        <Link
          href={`/apps/${appId}/edit`}
          className="flex items-center gap-2 px-4 py-2 border-2 border-primary text-primary hover:bg-primary/5 rounded-lg font-bold text-sm transition-colors"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
          </svg>
          Edit App
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleteMutation.isPending}
          className="flex items-center gap-2 px-4 py-2 border-2 border-red-500 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg font-bold text-sm transition-colors disabled:opacity-50"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
          </svg>
          Delete App
        </button>
      </div>
    </div>
  )
}

