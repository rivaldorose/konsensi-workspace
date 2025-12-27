'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Document } from '@/types/document'

interface DocsSidebarProps {
  recentDocs: Document[]
  selectedFolder: string
  onSelectFolder: (folderId: string) => void
}

export function DocsSidebar({
  recentDocs,
  selectedFolder,
  onSelectFolder
}: DocsSidebarProps) {
  const router = useRouter()
  const [showNewFolderInput, setShowNewFolderInput] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  const folders = [
    { id: 'business-plans', name: 'Business Plans' },
    { id: 'marketing-briefs', name: 'Marketing Briefs' },
    { id: 'projects', name: 'Projects' },
    { id: 'research', name: 'Research' },
    { id: 'contracts', name: 'Contracts' }
  ]

  const favorites = [
    { id: 'roadmap', title: 'Roadmap', href: '/roadmap' },
    { id: 'goals', title: 'Goals', href: '/roadmap' }
  ]

  return (
    <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#ecf3e7] flex flex-col h-full hidden md:flex overflow-y-auto">
      <div className="flex-1 px-3 py-6 space-y-8">
        {/* Favorites */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between group cursor-pointer">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Favorites</span>
          </div>
          <div className="space-y-1">
            {favorites.map((fav) => (
              <a
                key={fav.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                onClick={() => router.push(fav.href)}
              >
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-medium">{fav.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent</span>
          </div>
          <div className="space-y-1">
            {recentDocs.slice(0, 3).map((doc) => (
              <a
                key={doc.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                onClick={() => router.push(`/docs/${doc.id}`)}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                </svg>
                <span className="text-sm font-medium truncate">{doc.title}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Folders */}
        <div>
          <div className="px-3 mb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Folders</span>
          </div>
          <div className="space-y-1">
            <a
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                selectedFolder === 'all' 
                  ? 'bg-primary/10 text-[#131b0d] border border-primary/20 font-medium' 
                  : 'text-[#131b0d] hover:bg-[#f7f8f6]'
              } transition-colors cursor-pointer`}
              onClick={() => onSelectFolder('all')}
            >
              {selectedFolder === 'all' ? (
                <svg className="w-5 h-5 text-green-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
              )}
              <span className="text-sm">All Docs</span>
            </a>
            {folders.map((folder) => (
              <a
                key={folder.id}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                onClick={() => onSelectFolder(folder.id)}
              >
                <svg className="w-5 h-5 text-gray-400 group-hover:text-primary" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                </svg>
                <span className="text-sm font-medium">{folder.name}</span>
              </a>
            ))}
            <button 
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-primary hover:bg-[#f7f8f6] w-full text-left mt-2 group transition-colors"
              onClick={() => setShowNewFolderInput(true)}
            >
              <div className="size-5 rounded border border-dashed border-gray-400 group-hover:border-primary flex items-center justify-center">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
              </div>
              <span className="text-sm font-medium">New Folder</span>
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 border-t border-[#ecf3e7] mt-auto">
        <button className="flex items-center gap-3 w-full text-left hover:bg-[#f7f8f6] p-2 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" />
          </svg>
          <span className="text-sm font-medium text-gray-600">Settings</span>
        </button>
      </div>
    </aside>
  )
}

