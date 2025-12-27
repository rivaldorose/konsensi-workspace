'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDocuments } from '@/hooks/useDocuments'
import type { Document } from '@/types/document'
import DocumentCard from '@/components/documents/DocumentCard'
import { format, isToday, isYesterday, isThisWeek, parseISO } from 'date-fns'

export default function DocumentsPage() {
  const router = useRouter()
  const { data: documents = [], isLoading } = useDocuments()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'shared' | 'favorites'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')

  // Filter documents
  const filteredDocuments = useMemo(() => {
    let filtered = documents

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Filter by tab
    if (activeFilter === 'favorites') {
      filtered = filtered.filter(doc => doc.status === 'favorite')
    } else if (activeFilter === 'recent') {
      // Show recent documents (last 7 days)
      filtered = filtered.filter(doc => {
        const docDate = parseISO(doc.last_edited)
        const now = new Date()
        const diffDays = Math.floor((now.getTime() - docDate.getTime()) / (1000 * 60 * 60 * 24))
        return diffDays <= 7
      })
    } else if (activeFilter === 'shared') {
      filtered = filtered.filter(doc => doc.status === 'shared' || (doc.collaborators && doc.collaborators.length > 0))
    }

    return filtered
  }, [documents, searchQuery, activeFilter])

  // Group documents by date
  const groupedDocuments = useMemo(() => {
    const today: Document[] = []
    const yesterday: Document[] = []
    const thisWeek: Document[] = []
    const older: Document[] = []

    filteredDocuments.forEach(doc => {
      const docDate = parseISO(doc.last_edited)
      if (isToday(docDate)) {
        today.push(doc)
      } else if (isYesterday(docDate)) {
        yesterday.push(doc)
      } else if (isThisWeek(docDate)) {
        thisWeek.push(doc)
      } else {
        older.push(doc)
      }
    })

    return { today, yesterday, thisWeek, older }
  }, [filteredDocuments])

  const handleOpen = (id: string) => {
    router.push(`/docs/${id}`)
  }

  const handleShare = (id: string) => {
    router.push(`/docs/${id}/share`)
  }

  const handleFavorite = (id: string) => {
    // TODO: Implement favorite toggle
    console.log('Toggle favorite:', id)
  }

  const handleNewDoc = () => {
    router.push('/docs/new')
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden" style={{ marginTop: '-4rem' }}>
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading documents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden" style={{ marginTop: '-4rem' }}>
      {/* Sidebar */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#ecf3e7] flex flex-col h-full hidden md:flex overflow-y-auto">
        <div className="flex-1 px-3 py-6 space-y-8">
          {/* Favorites */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between group cursor-pointer">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Favorites</span>
            </div>
            <div className="space-y-1">
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                onClick={() => router.push('/roadmap')}
              >
                <span className="material-symbols-outlined text-[20px] text-yellow-400 fill-1">star</span>
                <span className="text-sm font-medium">Roadmap</span>
              </a>
              <a
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                onClick={() => router.push('/roadmap')}
              >
                <span className="material-symbols-outlined text-[20px] text-yellow-400 fill-1">star</span>
                <span className="text-sm font-medium">Goals</span>
              </a>
            </div>
          </div>

          {/* Recent */}
          <div>
            <div className="px-3 mb-2 flex items-center justify-between">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Recent</span>
            </div>
            <div className="space-y-1">
              {documents.slice(0, 3).map((doc) => (
                <a
                  key={doc.id}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                  onClick={() => handleOpen(doc.id)}
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-primary">description</span>
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
                onClick={() => setSelectedFolder('all')}
              >
                <span className={`material-symbols-outlined text-[20px] ${
                  selectedFolder === 'all' ? 'text-green-700' : 'text-gray-400'
                }`}>
                  {selectedFolder === 'all' ? 'folder_open' : 'folder'}
                </span>
                <span className="text-sm">All Docs</span>
              </a>
              {['Business Plans', 'Marketing Briefs', 'Projects', 'Research', 'Contracts'].map((folder) => (
                <a
                  key={folder}
                  className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-primary">folder</span>
                  <span className="text-sm font-medium">{folder}</span>
                </a>
              ))}
              <button className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 hover:text-primary hover:bg-[#f7f8f6] w-full text-left mt-2 group transition-colors">
                <div className="size-5 rounded border border-dashed border-gray-400 group-hover:border-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[16px]">add</span>
                </div>
                <span className="text-sm font-medium">New Folder</span>
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-[#ecf3e7] mt-auto">
          <button className="flex items-center gap-3 w-full text-left hover:bg-[#f7f8f6] p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-gray-500">settings</span>
            <span className="text-sm font-medium text-gray-600">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#f7f8f6] relative h-full w-full min-w-0 overflow-hidden">
        <div className="flex flex-col gap-6 px-8 py-6 bg-[#f7f8f6] z-10 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#131b0d] tracking-tight">Documents</h1>
            <div className="flex items-center gap-4">
              <div className="relative group w-64 md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-gray-400">search</span>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-sm"
                  placeholder="Search documents..."
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button
                onClick={handleNewDoc}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-[#131b0d] hover:bg-[#63d80e] transition-colors text-sm font-bold shadow-sm shadow-primary/20"
              >
                <span className="material-symbols-outlined text-[20px]">add</span>
                <span>New Doc</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveFilter('all')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all shadow-sm ${
                  activeFilter === 'all'
                    ? 'bg-[#131b0d] text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#131b0d] hover:border-gray-300'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'recent'
                    ? 'bg-[#131b0d] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#131b0d] hover:border-gray-300'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveFilter('shared')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'shared'
                    ? 'bg-[#131b0d] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#131b0d] hover:border-gray-300'
                }`}
              >
                Shared
              </button>
              <button
                onClick={() => setActiveFilter('favorites')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'favorites'
                    ? 'bg-[#131b0d] text-white shadow-sm'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-[#131b0d] hover:border-gray-300'
                }`}
              >
                Favorites
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Sort by:</span>
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#131b0d] hover:bg-gray-200/50 px-2 py-1 rounded transition-colors">
                  Modified
                  <span className="material-symbols-outlined text-[18px]">expand_more</span>
                </button>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex bg-white rounded-lg border border-gray-200 p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded ${viewMode === 'grid' ? 'text-[#131b0d] bg-gray-100' : 'text-gray-400 hover:text-[#131b0d] hover:bg-gray-50'}`}
                >
                  <span className="material-symbols-outlined text-[20px] block">grid_view</span>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded ${viewMode === 'list' ? 'text-[#131b0d] bg-gray-100' : 'text-gray-400 hover:text-[#131b0d] hover:bg-gray-50'}`}
                >
                  <span className="material-symbols-outlined text-[20px] block">view_list</span>
                </button>
              </div>
            </div>
          </div>
      </div>

        <div className="flex-1 overflow-y-auto px-8 pb-10">
          {/* Today */}
          {groupedDocuments.today.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                Today
                <span className="h-px bg-gray-200 flex-1"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groupedDocuments.today.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onOpen={handleOpen}
                    onShare={handleShare}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday */}
          {groupedDocuments.yesterday.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                Yesterday
                <span className="h-px bg-gray-200 flex-1"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groupedDocuments.yesterday.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onOpen={handleOpen}
                    onShare={handleShare}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* This Week */}
          {groupedDocuments.thisWeek.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center gap-2">
                This Week
                <span className="h-px bg-gray-200 flex-1"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groupedDocuments.thisWeek.map((doc) => (
                  <DocumentCard
                    key={doc.id}
                    document={doc}
                    onOpen={handleOpen}
                    onShare={handleShare}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredDocuments.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">description</span>
              <p className="text-gray-500 text-lg font-medium mb-2">No documents found</p>
              <p className="text-gray-400 text-sm mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Create your first document to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleNewDoc}
                  className="flex items-center gap-2 rounded-lg h-10 px-5 bg-primary text-[#131b0d] hover:bg-[#63d80e] transition-colors text-sm font-bold shadow-sm"
                >
                  <span className="material-symbols-outlined text-[20px]">add</span>
                  <span>New Doc</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
