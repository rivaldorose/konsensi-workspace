'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useFiles, useFolders, useRecentFiles, useFavoriteFiles, useToggleFavorite } from '@/hooks/useFiles'
import type { FileItem } from '@/types/files'
import DocumentCard from '@/components/documents/DocumentCard'
import { DocsSidebar } from '@/components/documents/DocsSidebar'
import { UploadDocumentModal } from '@/components/documents/UploadDocumentModal'
import { format } from 'date-fns'

export default function DocumentsPage() {
  const router = useRouter()
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null)
  const { data: files = [], isLoading } = useFiles(currentFolderId)
  const { data: folders = [] } = useFolders()
  const { data: recentFiles = [] } = useRecentFiles()
  const { data: favoriteFiles = [] } = useFavoriteFiles()
  const toggleFavorite = useToggleFavorite()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [activeFilter, setActiveFilter] = useState<'all' | 'recent' | 'shared' | 'favorites'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedFolder, setSelectedFolder] = useState('all')
  const [uploadModalOpen, setUploadModalOpen] = useState(false)

  // Filter files based on active filter
  const filteredFiles = useMemo(() => {
    let sourceFiles: FileItem[] = files
    
    // Apply filter
    if (activeFilter === 'favorites') {
      sourceFiles = favoriteFiles
    } else if (activeFilter === 'recent') {
      sourceFiles = recentFiles
    } else if (activeFilter === 'shared') {
      // For shared, show all files for now (would need separate query)
      sourceFiles = files
    }
    
    // Filter by search query
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase()
      sourceFiles = sourceFiles.filter(file =>
        file.name.toLowerCase().includes(queryLower)
      )
    }

    // Filter by folder
    if (selectedFolder !== 'all') {
      sourceFiles = sourceFiles.filter(file => file.parent_id === selectedFolder)
    } else if (currentFolderId === null) {
      // Only show root files
      sourceFiles = sourceFiles.filter(file => !file.parent_id)
    }

    // Only show files (not folders) in the main view
    sourceFiles = sourceFiles.filter(file => file.type === 'file')

    return sourceFiles
  }, [files, favoriteFiles, recentFiles, searchQuery, activeFilter, selectedFolder, currentFolderId])

  // Group files by date
  const groupedFiles = useMemo(() => {
    const today: FileItem[] = []
    const yesterday: FileItem[] = []
    const thisWeek: FileItem[] = []
    const older: FileItem[] = []

    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const yesterdayStart = new Date(todayStart)
    yesterdayStart.setDate(yesterdayStart.getDate() - 1)
    const weekStart = new Date(todayStart)
    weekStart.setDate(weekStart.getDate() - 7)

    filteredFiles.forEach(file => {
      const fileDate = new Date(file.updated_at || file.created_at)
      if (fileDate >= todayStart) {
        today.push(file)
      } else if (fileDate >= yesterdayStart) {
        yesterday.push(file)
      } else if (fileDate >= weekStart) {
        thisWeek.push(file)
      } else {
        older.push(file)
      }
    })

    return { today, yesterday, thisWeek, older }
  }, [filteredFiles])

  const handleOpen = (id: string) => {
    router.push(`/docs/${id}`)
  }

  const handleShare = (id: string) => {
    router.push(`/docs/${id}/share`)
  }

  const handleFavorite = async (id: string) => {
    const file = files.find(f => f.id === id)
    if (file) {
      try {
        await toggleFavorite.mutateAsync({
          id,
          isFavorite: !file.is_favorite
        })
      } catch (error) {
        console.error('Failed to toggle favorite:', error)
      }
    }
  }

  const handleNewDoc = () => {
    router.push('/docs/new')
  }

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading files...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <DocsSidebar
        recentDocs={recentFiles.slice(0, 5)}
        selectedFolder={selectedFolder}
        onSelectFolder={setSelectedFolder}
        folders={folders}
      />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-[#f7f8f6] dark:bg-[#131b0d] relative h-full w-full min-w-0 overflow-hidden">
        <div className="flex flex-col gap-6 px-8 py-6 bg-[#f7f8f6] dark:bg-[#182210] z-10 shrink-0">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold text-[#131b0d] dark:text-white tracking-tight">Documents</h1>
            <div className="flex items-center gap-4">
              <div className="relative group w-64 md:w-80">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" />
                  </svg>
                </div>
                <input
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 dark:border-[#334025] rounded-lg leading-5 bg-white dark:bg-[#1f2b15] placeholder-gray-400 dark:placeholder-gray-500 text-[#131b0d] dark:text-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary sm:text-sm transition-all shadow-sm"
                  placeholder="Search files..."
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
                    ? 'bg-[#131b0d] dark:bg-white text-white dark:text-[#131b0d]'
                    : 'bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-[#334025] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a3820] hover:text-[#131b0d] dark:hover:text-white hover:border-gray-300 dark:hover:border-[#3a4d2e]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setActiveFilter('recent')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'recent'
                    ? 'bg-[#131b0d] dark:bg-white text-white dark:text-[#131b0d] shadow-sm'
                    : 'bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-[#334025] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a3820] hover:text-[#131b0d] dark:hover:text-white hover:border-gray-300 dark:hover:border-[#3a4d2e]'
                }`}
              >
                Recent
              </button>
              <button
                onClick={() => setActiveFilter('shared')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'shared'
                    ? 'bg-[#131b0d] dark:bg-white text-white dark:text-[#131b0d] shadow-sm'
                    : 'bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-[#334025] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a3820] hover:text-[#131b0d] dark:hover:text-white hover:border-gray-300 dark:hover:border-[#3a4d2e]'
                }`}
              >
                Shared
              </button>
              <button
                onClick={() => setActiveFilter('favorites')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
                  activeFilter === 'favorites'
                    ? 'bg-[#131b0d] dark:bg-white text-white dark:text-[#131b0d] shadow-sm'
                    : 'bg-white dark:bg-[#1f2b15] border border-gray-200 dark:border-[#334025] text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-[#2a3820] hover:text-[#131b0d] dark:hover:text-white hover:border-gray-300 dark:hover:border-[#3a4d2e]'
                }`}
              >
                Favorites
              </button>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">Sort by:</span>
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#131b0d] dark:text-white hover:bg-gray-200/50 dark:hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  Modified
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </button>
              </div>
              <div className="h-4 w-px bg-gray-300 dark:bg-[#334025]"></div>
              <div className="flex bg-white dark:bg-[#1f2b15] rounded-lg border border-gray-200 dark:border-[#334025] p-0.5 shadow-sm">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-1 rounded transition-colors ${
                    viewMode === 'grid' 
                      ? 'text-[#131b0d] dark:text-white bg-gray-100 dark:bg-[#2a3820]' 
                      : 'text-gray-400 dark:text-gray-500 hover:text-[#131b0d] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2a3820]'
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
                      ? 'text-[#131b0d] dark:text-white bg-gray-100 dark:bg-[#2a3820]' 
                      : 'text-gray-400 dark:text-gray-500 hover:text-[#131b0d] dark:hover:text-white hover:bg-gray-50 dark:hover:bg-[#2a3820]'
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
          {groupedFiles.today.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                Today
                <span className="h-px bg-gray-200 dark:bg-[#334025] flex-1"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groupedFiles.today.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onOpen={handleOpen}
                    onShare={handleShare}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Yesterday */}
          {groupedFiles.yesterday.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                Yesterday
                <span className="h-px bg-gray-200 dark:bg-[#334025] flex-1"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groupedFiles.yesterday.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onOpen={handleOpen}
                    onShare={handleShare}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* This Week */}
          {groupedFiles.thisWeek.length > 0 && (
            <div className="mb-10">
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 flex items-center gap-2">
                This Week
                <span className="h-px bg-gray-200 dark:bg-[#334025] flex-1"></span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {groupedFiles.thisWeek.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    onOpen={handleOpen}
                    onShare={handleShare}
                    onFavorite={handleFavorite}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {filteredFiles.length === 0 && (
            <div className="flex flex-col items-center justify-center py-20">
              <h3 className="text-2xl font-bold text-gray-300 dark:text-gray-600 mb-2">
                No files found
              </h3>
              <p className="text-gray-400 dark:text-gray-500 text-sm mb-6">
                {searchQuery ? 'Try adjusting your search' : 'Create your first file to get started'}
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
          folders={folders}
          onClose={() => setUploadModalOpen(false)}
        />
      )}
    </div>
  )
}

// FileCard component - wrapper to convert FileItem to Document-like format for DocumentCard
function FileCard({
  file,
  onOpen,
  onShare,
  onFavorite,
}: {
  file: FileItem
  onOpen?: (id: string) => void
  onShare?: (id: string) => void
  onFavorite?: (id: string) => void
}) {
  // Convert FileItem to Document-like format for compatibility with DocumentCard
  const documentLike = {
    id: file.id,
    title: file.name,
    type: file.mime_type?.includes('pdf') ? 'pdf' : file.mime_type?.includes('sheet') ? 'sheet' : file.mime_type?.includes('presentation') ? 'slide' : 'doc',
    document_mode: 'file' as const,
    file_name: file.name,
    file_size: file.size,
    file_type: file.mime_type,
    file_url: file.file_url,
    file_path: file.storage_path,
    folder_id: file.parent_id,
    owner_id: file.created_by,
    owner: file.created_by_user ? {
      id: file.created_by_user.id,
      full_name: file.created_by_user.full_name || file.created_by_user.email,
      avatar_url: file.created_by_user.avatar_url
    } : undefined,
    is_favorite: file.is_favorite,
    created_at: file.created_at,
    updated_at: file.updated_at,
  }

  return (
    <DocumentCard
      document={documentLike as any}
      onOpen={onOpen}
      onShare={onShare}
      onFavorite={onFavorite}
    />
  )
}
