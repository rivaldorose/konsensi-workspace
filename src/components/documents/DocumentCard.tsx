'use client'

import { useState, useEffect, useRef } from 'react'
import type { Document } from '@/types/document'

interface DocumentCardProps {
  document: Document
  onOpen?: (id: string) => void
  onShare?: (id: string) => void
  onFavorite?: (id: string) => void
}

const getIconType = (type: Document['type']) => {
  switch (type) {
    case 'article':
      return 'article'
    case 'description':
      return 'description'
    case 'slideshow':
      return 'slideshow'
    case 'text_snippet':
      return 'text_snippet'
    case 'gavel':
      return 'gavel'
    default:
      return 'article'
  }
}

const getIconColor = (type: Document['type']) => {
  switch (type) {
    case 'article':
      return 'bg-blue-50 text-blue-600'
    case 'description':
      return 'bg-purple-50 text-purple-600'
    case 'slideshow':
      return 'bg-orange-50 text-orange-600'
    case 'text_snippet':
      return 'bg-pink-50 text-pink-600'
    case 'gavel':
      return 'bg-indigo-50 text-indigo-600'
    default:
      return 'bg-gray-50 text-gray-600'
  }
}

const getFolderColor = (folder: string) => {
  switch (folder.toLowerCase()) {
    case 'marketing briefs':
      return 'bg-green-50 text-green-700 border-green-100'
    case 'favorites':
      return 'bg-purple-50 text-purple-700 border-purple-100'
    case 'recent':
      return 'bg-gray-100 text-gray-600 border-gray-200'
    case 'projects':
      return 'bg-pink-50 text-pink-700 border-pink-100'
    case 'contracts':
      return 'bg-indigo-50 text-indigo-700 border-indigo-100'
    default:
      return 'bg-gray-100 text-gray-600 border-gray-200'
  }
}

const formatTimeAgo = (dateString: string) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 7) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    return days[date.getDay()]
  }
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function DocumentCard({ document, onOpen, onShare, onFavorite }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isFavorite, setIsFavorite] = useState(document.status === 'favorite')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite(document.id)
  }

  return (
    <div className="group bg-white rounded-xl border border-[#ecf3e7] p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col h-[200px]">
      <div className="flex justify-between items-start mb-3">
        <div className={`size-10 rounded-lg ${getIconColor(document.type)} flex items-center justify-center`}>
          <span className="material-symbols-outlined">{getIconType(document.type)}</span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={handleFavorite}
            className={`size-8 flex items-center justify-center rounded-full transition-colors ${
              isFavorite
                ? 'text-yellow-400 bg-yellow-50'
                : 'text-gray-400 hover:text-yellow-400 hover:bg-yellow-50'
            }`}
          >
            <span className={`material-symbols-outlined text-[20px] ${isFavorite ? 'fill-1' : ''}`}>
              star
            </span>
          </button>
        </div>
      </div>

      <h4 className="font-bold text-[#131b0d] text-lg leading-tight mb-1 truncate">
        {document.title}
      </h4>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${getFolderColor(document.folder)}`}>
          {document.folder}
        </span>
        <span className="text-xs text-gray-400 truncate">
          Edited {formatTimeAgo(document.last_edited)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {document.collaborators && document.collaborators.length > 0 && (
            <div className="flex -space-x-2">
              {document.collaborators.slice(0, 2).map((collab, idx) => (
                <div
                  key={collab.id || idx}
                  className="size-6 rounded-full ring-2 ring-white bg-cover bg-center bg-gray-200"
                  style={{
                    backgroundImage: collab.avatar_url ? `url(${collab.avatar_url})` : undefined
                  }}
                >
                  {!collab.avatar_url && (
                    <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-500">
                      {collab.full_name?.charAt(0) || '?'}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {document.comment_count !== undefined && document.comment_count > 0 && (
            <div className="flex items-center text-gray-400 text-xs gap-0.5">
              <span className="material-symbols-outlined text-[14px]">chat_bubble</span>
              <span>{document.comment_count}</span>
            </div>
          )}
          {document.view_count !== undefined && (
            <div className="flex items-center text-gray-400 text-xs gap-0.5">
              <span className="material-symbols-outlined text-[14px]">visibility</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onOpen?.(document.id)}
            className="text-xs font-bold bg-primary/10 text-green-800 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
          >
            Open
          </button>
          <button
            onClick={() => onShare?.(document.id)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">share</span>
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">more_horiz</span>
            </button>
            {showMenu && (
              <div className="absolute top-10 right-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50">
                <div className="px-1 space-y-0.5">
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">open_in_new</span>
                    Open
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">tab</span>
                    Open in New Tab
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">share</span>
                    Share
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">link</span>
                    Copy Link
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">drive_file_move</span>
                    Move to Folder
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">star_border</span>
                    Remove from Favorites
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">edit</span>
                    Rename
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">content_copy</span>
                    Duplicate
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">picture_as_pdf</span>
                    Download as PDF
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-gray-400">history</span>
                    Version History
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px] text-red-400">delete</span>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

