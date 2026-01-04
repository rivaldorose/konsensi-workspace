'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDocument, useUpdateDocument } from '@/hooks/useDocuments'
import { useFile, useRenameFile } from '@/hooks/useFiles'
import { createClient } from '@/lib/supabase/client'
import { formatDistanceToNow } from 'date-fns'

export default function DocumentEditorPage() {
  const router = useRouter()
  const params = useParams()
  const documentId = params.id as string
  
  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'Page loaded',data:{documentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
  }, [documentId]);
  // #endregion
  
  // Try to fetch as file first (new system)
  const { data: file, isLoading: isLoadingFile, error: fileError } = useFile(documentId)
  const renameFile = useRenameFile()
  
  // Also try as document (old system) for backward compatibility
  const { data: document, isLoading: isLoadingDocument, error: documentError } = useDocument(documentId)
  const updateDocument = useUpdateDocument()
  
  const isLoading = isLoadingFile || isLoadingDocument
  const isFile = !!file
  const isDocument = !!document
  
  // #region agent log
  useEffect(() => {
    if (fileError) {
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'File query error',data:{error:fileError instanceof Error ? fileError.message : String(fileError),documentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
    }
    if (documentError) {
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'Document query error',data:{error:documentError instanceof Error ? documentError.message : String(documentError),documentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'E'})}).catch(()=>{});
    }
  }, [fileError, documentError, documentId]);
  // #endregion
  
  // #region agent log
  useEffect(() => {
    if (file) {
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'File found',data:{fileId:file.id,fileName:file.name,fileType:file.type,mimeType:file.mime_type,fileUrl:file.file_url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
    }
    if (document) {
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'Document found',data:{documentId:document.id,documentTitle:document.title},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'B'})}).catch(()=>{});
    }
    if (!isLoading && !file && !document) {
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'Neither file nor document found',data:{documentId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
    }
  }, [file, document, isLoading, documentId]);
  // #endregion
  
  const [sidebarTab, setSidebarTab] = useState<'details' | 'comments'>('details')
  const [showOutline, setShowOutline] = useState(false)
  const [zoom, setZoom] = useState(100)
  const [fileViewUrl, setFileViewUrl] = useState<string | null>(null)
  const [isGeneratingUrl, setIsGeneratingUrl] = useState(false)
  const [parentFolder, setParentFolder] = useState<{ id: string; name: string } | null>(null)

  // Update title when document/file loads and generate view URL for files
  useEffect(() => {
    if (isFile && file?.name) {
      // If it's a file (uploaded file), generate signed URL for viewing
      if (file.type === 'file' && file.storage_path && !fileViewUrl) {
        // Store in const with explicit type to satisfy TypeScript narrowing
        const storagePath: string = file.storage_path
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'Generating signed URL for file',data:{storagePath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Generate signed URL (works for both public and private buckets)
        const generateViewUrl = async () => {
          setIsGeneratingUrl(true)
          try {
            const { createClient } = await import('@/lib/supabase/client')
            const supabase = createClient()
            
            const { data: signedUrlData, error: signedUrlError } = await supabase.storage
              .from('files')
              .createSignedUrl(storagePath, 3600) // 1 hour expiry
            
            if (signedUrlError) {
              // #region agent log
              fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:generateViewUrl',message:'Signed URL error, trying public URL',data:{error:signedUrlError.message,storagePath},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'C'})}).catch(()=>{});
              // #endregion
              // Fallback to stored file_url if signed URL fails
              if (file.file_url) {
                setFileViewUrl(file.file_url)
              }
            } else {
              // #region agent log
              fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:generateViewUrl',message:'Signed URL created',data:{signedUrl:signedUrlData.signedUrl},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
              // #endregion
              setFileViewUrl(signedUrlData.signedUrl)
            }
          } catch (error) {
            // #region agent log
            fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:generateViewUrl',message:'Error generating view URL',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'D'})}).catch(()=>{});
            // #endregion
            console.error('Error generating view URL:', error)
          } finally {
            setIsGeneratingUrl(false)
          }
        }
        
        generateViewUrl()
      }

      // Fetch parent folder if file has parent_id
      if (file.parent_id) {
        const fetchParentFolder = async () => {
          try {
            const supabase = createClient()
            const { data: folder, error } = await supabase
              .from('files')
              .select('id, name')
              .eq('id', file.parent_id)
              .eq('type', 'folder')
              .single()
            
            if (!error && folder) {
              setParentFolder({ id: folder.id, name: folder.name })
            }
          } catch (error) {
            console.error('Error fetching parent folder:', error)
          }
        }
        fetchParentFolder()
      }
    }
  }, [file, isFile, fileViewUrl])

  const handleShare = () => {
    router.push(`/docs/${documentId}/share`)
  }

  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return bytes + ' B'
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'Unknown'
    try {
      return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    } catch {
      return 'Unknown'
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Loading document...</div>
      </div>
    )
  }

  // If it's a file, show file viewer
  if (isFile && file?.type === 'file') {
    const isPDF = file.mime_type?.includes('pdf') || file.name?.endsWith('.pdf')
    const isImage = file.mime_type?.includes('image') || /\.(jpg|jpeg|png|gif|webp)$/i.test(file.name || '')
    
    if (isGeneratingUrl) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-pulse mb-4">Loading file...</div>
          </div>
        </div>
      )
    }
    
    if (!fileViewUrl) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <p className="text-lg mb-2">Unable to load file</p>
            <p className="text-sm text-gray-500 mb-4">The file could not be loaded.</p>
            <button onClick={() => router.push('/docs')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#63d80e] transition-colors">
              Back to Documents
            </button>
          </div>
        </div>
      )
    }
    
    // Render PDF viewer with details sidebar
    return (
      <div className="fixed inset-0 z-[100] flex flex-col justify-center items-center bg-black/60 backdrop-blur-sm">
        <div className="absolute inset-2 md:inset-6 lg:inset-x-12 lg:inset-y-8 bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden">
          {/* Header */}
          <header className="h-16 border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 shrink-0 bg-white relative z-20">
            <div className="flex items-center gap-4 flex-1 min-w-0">
              <button
                onClick={() => router.push('/docs')}
                className="flex items-center gap-1 text-gray-500 hover:text-text-main hover:bg-gray-100 px-2 py-1.5 rounded-lg transition-colors group"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" />
                </svg>
                <span className="text-sm font-semibold hidden md:inline">Documents</span>
              </button>
              <div className="h-6 w-px bg-gray-200"></div>
              <div className="flex items-center gap-3 min-w-0">
                <div className="size-8 rounded bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h2 className="text-[#131b0d] font-bold text-base leading-none truncate">{file.name}</h2>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {file.updated_at && `Edited ${formatDistanceToNow(new Date(file.updated_at), { addSuffix: true })}`}
                    {file.created_by_user && ` by ${file.created_by_user.full_name || file.created_by_user.email}`}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0 ml-4">
              <div className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => window.print()}
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-text-main hover:bg-gray-100 rounded-lg transition-colors"
                  title="Print"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" />
                  </svg>
                </button>
                <button
                  onClick={() => {
                    const link = window.document.createElement('a')
                    link.href = fileViewUrl
                    link.download = file.name || 'download'
                    link.click()
                  }}
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-text-main hover:bg-gray-100 rounded-lg transition-colors"
                  title="Download"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" />
                  </svg>
                </button>
                <button
                  className="flex items-center justify-center p-2 text-gray-500 hover:text-text-main hover:bg-gray-100 rounded-lg transition-colors"
                  title="Version History"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" />
                  </svg>
                </button>
              </div>
              <div className="h-6 w-px bg-gray-200 hidden lg:block"></div>
              <button
                onClick={handleShare}
                className="flex items-center gap-2 px-3 py-1.5 text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg font-medium text-sm transition-colors shadow-sm"
              >
                <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
                <span>Share</span>
              </button>
              <button className="lg:hidden p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                </svg>
              </button>
            </div>
          </header>

          <div className="flex-1 flex overflow-hidden">
            {/* PDF Viewer */}
            <div className="flex-1 bg-gray-50/80 relative flex flex-col min-w-0">
              {/* Toolbar */}
              <div className="h-10 border-b border-gray-200/60 bg-white/50 backdrop-blur flex items-center justify-between px-4 shrink-0">
                <div className="flex items-center gap-2 text-gray-500">
                  <button
                    onClick={() => setShowOutline(!showOutline)}
                    className="hover:text-gray-800"
                  >
                    <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                  <span className="text-xs font-medium">Outline</span>
                </div>
                <div className="flex items-center bg-gray-100 rounded-lg p-0.5 gap-1">
                  <button
                    onClick={() => setZoom(Math.max(25, zoom - 10))}
                    className="size-6 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                    </svg>
                  </button>
                  <span className="text-xs font-mono w-10 text-center">{zoom}%</span>
                  <button
                    onClick={() => setZoom(Math.min(200, zoom + 10))}
                    className="size-6 flex items-center justify-center rounded hover:bg-white hover:shadow-sm text-gray-500 transition-all"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                    </svg>
                  </button>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <span className="text-xs font-medium">Page 1 of 1</span>
                </div>
              </div>

              {/* Outline Sidebar */}
              {showOutline && (
                <div className="absolute top-[40px] left-0 bottom-0 w-64 bg-white border-r border-gray-200 shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-30 flex flex-col animate-in slide-in-from-left duration-200">
                  <div className="p-3 flex items-center justify-between border-b border-gray-100 bg-gray-50/50">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-2">Document Outline</span>
                    <button
                      onClick={() => setShowOutline(false)}
                      className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded transition-colors"
                    >
                      <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto py-2">
                    <div className="px-2 space-y-0.5">
                      <a className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors group" href="#">
                        <span className="text-gray-400 group-hover:text-gray-600 text-xs">1.</span>
                        <span>Introduction</span>
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* PDF Content */}
              <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-[#f0f2f5]">
                {isPDF ? (
                  <div className="w-full max-w-3xl">
                    <iframe
                      src={fileViewUrl}
                      className="w-full min-h-[800px] border border-gray-300 rounded-sm bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.05)]"
                      title={file.name}
                      style={{ height: `${800 * (zoom / 100)}px` }}
                    />
                  </div>
                ) : isImage ? (
                  <div className="w-full max-w-3xl">
                    <img
                      src={fileViewUrl}
                      alt={file.name}
                      className="w-full h-auto rounded-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.05)]"
                      style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top center' }}
                    />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center w-full max-w-3xl min-h-[800px] bg-white rounded-sm shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.05)] p-12 md:p-16">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" />
                    </svg>
                    <p className="text-lg font-medium text-gray-700 mb-2">{file.name}</p>
                    <p className="text-sm text-gray-500 mb-4">Preview not available for this file type</p>
                    <button
                      onClick={() => window.open(fileViewUrl, '_blank')}
                      className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#63d80e] transition-colors"
                    >
                      Open in New Tab
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Right Sidebar: Details/Comments */}
            <aside className="w-[320px] bg-white border-l border-gray-200 hidden xl:flex flex-col shrink-0 h-full">
              {/* Tabs */}
              <div className="flex items-center border-b border-gray-100 px-2 shrink-0 bg-white">
                <button
                  onClick={() => setSidebarTab('details')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 ${
                    sidebarTab === 'details'
                      ? 'text-[#131b0d] border-primary'
                      : 'text-gray-500 border-transparent hover:text-text-main hover:border-gray-200'
                  }`}
                >
                  Details
                </button>
                <button
                  onClick={() => setSidebarTab('comments')}
                  className={`flex-1 py-3 text-sm font-medium transition-colors border-b-2 relative ${
                    sidebarTab === 'comments'
                      ? 'text-[#131b0d] border-primary'
                      : 'text-gray-500 border-transparent hover:text-text-main hover:border-gray-200'
                  }`}
                >
                  Comments
                  <span className="ml-1.5 bg-primary/20 text-green-800 px-1.5 py-0.5 rounded text-[10px] font-bold align-middle">0</span>
                </button>
              </div>

              {/* Details Tab */}
              {sidebarTab === 'details' && (
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  {/* Info Section */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Info</h4>
                    <div className="space-y-4">
                      {/* Owner */}
                      {file.created_by_user && (
                        <div className="flex items-center justify-between group">
                          <span className="text-sm text-gray-500">Owner</span>
                          <div className="flex items-center gap-2">
                            {file.created_by_user.avatar_url ? (
                              <div
                                className="size-5 rounded-full bg-cover bg-center"
                                style={{ backgroundImage: `url("${file.created_by_user.avatar_url}")` }}
                              />
                            ) : (
                              <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                  {(file.created_by_user.full_name || file.created_by_user.email || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                            <span className="text-sm font-medium text-gray-700">
                              {file.created_by_user.full_name || file.created_by_user.email || 'Unknown'}
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Modified */}
                      {file.updated_at && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Modified</span>
                          <span className="text-sm font-medium text-gray-700">{formatDate(file.updated_at)}</span>
                        </div>
                      )}

                      {/* Size */}
                      {file.size && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">Size</span>
                          <span className="text-sm font-medium text-gray-700">{formatFileSize(file.size)}</span>
                        </div>
                      )}

                      {/* Location */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">Location</span>
                        {parentFolder ? (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-600">{parentFolder.name}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            <svg className="w-3.5 h-3.5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                            <span className="text-xs font-medium text-gray-600">All Docs</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-gray-100"></div>

                  {/* Shared with Section */}
                  <div>
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Shared with</h4>
                    <div className="flex items-center gap-2 mb-3">
                      {file.created_by_user && (
                        <>
                          <div className="flex -space-x-2">
                            {file.created_by_user.avatar_url ? (
                              <div
                                className="size-8 rounded-full ring-2 ring-white bg-cover bg-center"
                                style={{ backgroundImage: `url("${file.created_by_user.avatar_url}")` }}
                              />
                            ) : (
                              <div className="size-8 rounded-full ring-2 ring-white bg-primary/20 flex items-center justify-center">
                                <span className="text-xs font-bold text-primary">
                                  {(file.created_by_user.full_name || file.created_by_user.email || 'U').charAt(0).toUpperCase()}
                                </span>
                              </div>
                            )}
                          </div>
                          <button className="size-8 rounded-full border border-dashed border-gray-300 flex items-center justify-center hover:border-primary hover:text-primary transition-colors text-gray-400">
                            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                            </svg>
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Comments Tab */}
              {sidebarTab === 'comments' && (
                <div className="flex-1 overflow-y-auto flex flex-col">
                  <div className="py-4">
                    <div className="px-5 pb-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">No comments yet</span>
                    </div>
                  </div>
                  <div className="p-4 bg-white border-t border-gray-200 mt-auto z-10">
                    <div className="relative bg-gray-50 border border-gray-200 rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
                      <textarea
                        className="block w-full border-0 bg-transparent p-3 text-sm text-gray-900 placeholder:text-gray-400 focus:ring-0 resize-none min-h-[80px]"
                        placeholder="Add a new comment..."
                      ></textarea>
                      <div className="flex items-center justify-between px-2 pb-2 mt-1">
                        <div className="flex items-center gap-1">
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded transition-colors"
                            title="Mention someone"
                          >
                            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded transition-colors"
                            title="Add emoji"
                          >
                            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" />
                            </svg>
                          </button>
                          <button
                            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-200/50 rounded transition-colors"
                            title="Attach file"
                          >
                            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" />
                            </svg>
                          </button>
                        </div>
                        <button className="bg-primary hover:bg-[#63d80e] text-[#131b0d] text-xs font-bold px-4 py-1.5 rounded-lg shadow-sm shadow-primary/20 transition-all">
                          Post
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </div>
      </div>
    )
  }

  // Show not found only after loading is complete
  if (!isLoading && !document && !file) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-2">Document/File not found</p>
          <p className="text-sm text-gray-500 mb-4">The file you're looking for doesn't exist or you don't have permission to view it.</p>
          <button onClick={() => router.push('/docs')} className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-[#63d80e] transition-colors">
            Back to Documents
          </button>
        </div>
      </div>
    )
  }

  // For non-file documents, show the old editor view (keep existing code)
  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]" style={{ marginTop: '-4rem' }}>
      {/* This section will be kept for text documents - keeping it minimal for now */}
      <main className="flex-1 flex flex-col bg-[#f7f8f6] relative h-full w-full min-w-0">
        <div className="p-8">
          <p>Document editor for text documents (not implemented in this update)</p>
        </div>
      </main>
    </div>
  )
}
