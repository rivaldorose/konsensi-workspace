'use client'

import { useState, useEffect, useRef } from 'react'
import type { Document } from '@/types/document'

interface DocumentCardProps {
  document: Document
  onOpen?: (id: string) => void
  onShare?: (id: string) => void
  onFavorite?: (id: string) => void
}

const getDocumentIcon = (type: Document['type']) => {
  switch (type) {
    case 'article':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      )
    case 'description':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      )
    case 'slideshow':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM9 10l2 2 4-4" />
        </svg>
      )
    case 'text_snippet':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      )
    case 'gavel':
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      )
    default:
      return (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
        </svg>
      )
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

export default function DocumentCard({ document: doc, onOpen, onShare, onFavorite }: DocumentCardProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [isFavorite, setIsFavorite] = useState(doc.status === 'favorite')
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false)
      }
    }

    if (showMenu) {
      window.document.addEventListener('mousedown', handleClickOutside)
      return () => window.document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showMenu])

  const handleFavorite = () => {
    setIsFavorite(!isFavorite)
    if (onFavorite) onFavorite(doc.id)
  }

  return (
    <div className="group bg-white rounded-xl border border-[#ecf3e7] p-4 shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 relative flex flex-col h-[200px]">
      <div className="flex justify-between items-start mb-3">
        <div className={`size-10 rounded-lg ${getIconColor(doc.type)} flex items-center justify-center`}>
          {getDocumentIcon(doc.type)}
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
            <svg className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} fill={isFavorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          </button>
        </div>
      </div>

      <h4 className="font-bold text-[#131b0d] text-lg leading-tight mb-1 truncate">
        {doc.title}
      </h4>

      <div className="flex items-center gap-2 mb-3">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wide ${getFolderColor(doc.folder)}`}>
          {doc.folder}
        </span>
        <span className="text-xs text-gray-400 truncate">
          Edited {formatTimeAgo(doc.last_edited)}
        </span>
      </div>

      <div className="mt-auto flex items-center justify-between pt-3 border-t border-gray-50">
        <div className="flex items-center gap-2">
          {doc.collaborators && doc.collaborators.length > 0 && (
            <div className="flex -space-x-2">
              {doc.collaborators.slice(0, 2).map((collab, idx) => (
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
          {doc.comment_count !== undefined && doc.comment_count > 0 && (
            <div className="flex items-center text-gray-400 text-xs gap-0.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" />
              </svg>
              <span>{doc.comment_count}</span>
            </div>
          )}
          {doc.view_count !== undefined && (
            <div className="flex items-center text-gray-400 text-xs gap-0.5">
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onOpen?.(doc.id)}
            className="text-xs font-bold bg-primary/10 text-green-800 px-3 py-1.5 rounded-md hover:bg-primary/20 transition-colors"
          >
            Open
          </button>
          <button
            onClick={() => onShare?.(doc.id)}
            className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
            </svg>
          </button>
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 text-gray-400 hover:text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
            >
              <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {showMenu && (
              <div className="absolute top-10 right-2 w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1.5 z-50">
                <div className="px-1 space-y-0.5">
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Open
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                    </svg>
                    Open in New Tab
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                    </svg>
                    Share
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                      <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                    </svg>
                    Copy Link
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                    </svg>
                    Move to Folder
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 20 20">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    Remove from Favorites
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    Rename
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
                      <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
                    </svg>
                    Duplicate
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                    </svg>
                    Download as PDF
                  </button>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                    </svg>
                    Version History
                  </button>
                  <div className="h-px bg-gray-100 my-1 mx-2"></div>
                  <button className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 rounded flex items-center gap-2">
                    <svg className="w-4.5 h-4.5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" />
                    </svg>
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
