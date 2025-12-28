'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useDocuments } from '@/hooks/useDocuments'
import type { Document } from '@/types/document'
import DocumentCard from '@/components/documents/DocumentCard'
import { DocsSidebar } from '@/components/documents/DocsSidebar'
import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal'
import { format } from 'date-fns'

export default function DocumentsPage() {
  const router = useRouter()
  const { data: documents = [], isLoading } = useDocuments()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'shared' | 'favorites'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Filter documents
  const filteredDocuments = useMemo(() => {
    if (!documents || documents.length === 0) return []
    
    let filtered = documents

    // Filter by search query
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase()
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(queryLower)
      )
    }

    // Filter by tab
    if (activeFilter === 'favorites') {
      filtered = filtered.filter(doc => doc.is_favorite || doc.status === 'favorite')
    } else if (activeFilter === 'recent') {
      // Show recent documents (last 7 days)
      const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(doc => {
        const docDate = new Date(doc.updated_at || doc.created_at).getTime()
        return docDate >= sevenDaysAgo
      })
    } else if (activeFilter === 'shared') {
      filtered = filtered.filter(doc => doc.status === 'shared' || (doc.collaborators && doc.collaborators.length > 0))
    }

    return filtered
  }, [documents, searchQuery, activeFilter])

  // Group documents by date (optimized)
  const groupedDocuments = useMemo(() => {
    const today: Document[] = []
    const yesterday: Document[] = []
    const thisWeek: Document[] = []
    const older: Document[] = []

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    filteredDocuments.forEach(doc => {
      const docDate = new Date(doc.updated_at || doc.created_at)
      if (docDate >= todayStart) {
        today.push(doc)
      } else if (docDate >= yesterdayStart) {
        yesterday.push(doc)
      } else if (docDate >= weekStart) {
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
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading documents...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <DocsSidebar
        recentDocs={documents.slice(0, 5)}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#f7f8f6] relative h-full w-full min-w-0 overflow-hidden">
        <div className="flex flex-col gap-6 px-8 py-6 bg-[#f7f8f6] z-10 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#131b0d] tracking-tight">Documents</h1>
            <div className="flex items-center gap-4">
              <div className="relative group w-64 md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
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
                onClick={() => setUploadModalOpen(true)}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-blue-600 text-white hover:bg-blue-700 transition-colors text-sm font-bold shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <span>Upload Files</span>
              </button>
              <button
                onClick={handleNewDoc}
                className="flex items-center justify-center gap-2 rounded-lg h-10 px-5 bg-primary text-[#131b0d] hover:bg-[#63d80e] transition-colors text-sm font-bold shadow-sm shadow-primary/20"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
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
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
              <div className="h-4 w-px bg-gray-300"></div>
              <div className="flex bg-white rounded-lg border border-gray-200 p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'text-[#131b0d] bg-gray-100' 
                      : 'text-gray-400 hover:text-[#131b0d] hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-1 rounded transition-colors ${
                    viewMode === 'list' 
                      ? 'text-[#131b0d] bg-gray-100' 
                      : 'text-gray-400 hover:text-[#131b0d] hover:bg-gray-50'
                  }`}
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                  </svg>
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
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                No documents found
              </h3>
              <p className="text-gray-400 text-sm mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Create your first document to get started'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleNewDoc}
                  className="flex items-center gap-2 rounded-lg h-10 px-5 bg-primary text-[#131b0d] hover:bg-[#63d80e] transition-colors text-sm font-bold shadow-sm"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  <span>New Doc</span>
                </button>
              )}
            </div>
          )}
        </div>
      </main>

      {/* Upload Modal */}
      {uploadModalOpen && (
        <UploadDocumentModal
          folders={[]}
          onClose={() => setUploadModalOpen(false)}
        />
      )}
    </div>
  )
}
