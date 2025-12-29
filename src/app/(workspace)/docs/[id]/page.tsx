'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useDocument, useUpdateDocument } from '@/hooks/useDocuments'
import { useFile, useRenameFile } from '@/hooks/useFiles'

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
  
  const [activeTab, setActiveTab] = useState<'activity' | 'history'>('activity')
  const [documentTitle, setDocumentTitle] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  // Update title when document/file loads
  useEffect(() => {
    if (isFile && file?.name) {
      setDocumentTitle(file.name)
      // If it's a file (uploaded file), redirect to file URL immediately
      if (file.type === 'file' && file.file_url) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:DocumentEditorPage',message:'Redirecting to file URL',data:{fileUrl:file.file_url},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        window.open(file.file_url, '_blank')
        router.replace('/docs')
        return
      }
    } else if (isDocument && document?.title) {
      setDocumentTitle(document.title)
    }
  }, [file, document, isFile, isDocument, router])

  const handleTitleChange = async (newTitle: string) => {
    setDocumentTitle(newTitle)
    setIsSaving(true)
    
    try {
      if (isFile) {
        // #region agent log
        fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:handleTitleChange',message:'Renaming file',data:{fileId:documentId,newName:newTitle},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        await renameFile.mutateAsync({
          id: documentId,
          name: newTitle
        })
      } else if (isDocument) {
        await updateDocument.mutateAsync({
          id: documentId,
          title: newTitle
        })
      }
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7244/ingest/0a454eb1-d3d1-4c43-8c8e-e087d82e49ee',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'docs/[id]/page.tsx:handleTitleChange',message:'Update failed',data:{error:error instanceof Error ? error.message : String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.error('Failed to update document/file:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleShare = () => {
    router.push(`/docs/${documentId}/share`)
  }

  const handleNewDoc = () => {
    router.push('/docs/new')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-pulse">Loading document...</div>
      </div>
    )
  }

  // If it's a file, we redirect, so show loading/redirect message
  if (isFile && file?.type === 'file' && file.file_url) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-lg mb-4">Opening file...</p>
          <p className="text-sm text-gray-500">If the file doesn't open, <button onClick={() => window.open(file.file_url, '_blank')} className="text-primary underline">click here</button></p>
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

  return (
    <div className="flex flex-1 overflow-hidden h-[calc(100vh-4rem)]" style={{ marginTop: '-4rem' }}>
      {/* Left Sidebar: Navigation */}
      <aside className="w-[240px] flex-shrink-0 bg-white border-r border-[#ecf3e7] flex flex-col h-full hidden md:flex">
        {/* New Doc Button */}
        <div className="p-4 pb-2">
          <button
            onClick={handleNewDoc}
            className="flex w-full cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-[#131b0d] hover:bg-[#63d80e] transition-colors text-sm font-bold leading-normal tracking-[0.015em] shadow-sm"
          >
            <span className="material-symbols-outlined text-[20px]">add</span>
            <span className="truncate">New Doc</span>
          </button>
        </div>

        {/* Search */}
        <div className="px-4 py-2">
          <label className="flex flex-col w-full h-10">
            <div className="flex w-full flex-1 items-stretch rounded-lg h-full bg-[#f7f8f6] border border-transparent focus-within:border-primary/50 transition-colors">
              <div className="text-[#6e9a4c] flex items-center justify-center pl-3">
                <span className="material-symbols-outlined text-[20px]">search</span>
              </div>
              <input
                className="flex w-full min-w-0 flex-1 bg-transparent border-none focus:outline-none focus:ring-0 h-full placeholder:text-[#6e9a4c] px-2 text-sm text-[#131b0d]"
                placeholder="Search docs..."
                type="text"
              />
            </div>
          </label>
        </div>

        {/* Scrollable Nav Links */}
        <div className="flex-1 overflow-y-auto px-2 py-2 space-y-6">
          {/* Quick Access */}
          <div className="flex flex-col gap-1">
            <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Shortcuts</div>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
              onClick={() => router.push('/docs')}
            >
              <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-primary">schedule</span>
              <span className="text-sm font-medium">Recent</span>
            </a>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-[#131b0d] hover:bg-[#f7f8f6] group transition-colors cursor-pointer"
              onClick={() => router.push('/docs')}
            >
              <span className="material-symbols-outlined text-[20px] text-gray-400 group-hover:text-primary">star</span>
              <span className="text-sm font-medium">Favorites</span>
            </a>
          </div>

          {/* Folders Tree */}
          <div className="flex flex-col gap-1">
            <div className="px-3 py-1 text-xs font-bold text-gray-400 uppercase tracking-wider">Folders</div>
            <a
              className="flex items-center gap-3 rounded-lg px-3 py-2 bg-primary/10 text-[#131b0d] border border-primary/20"
              onClick={() => router.push('/docs')}
            >
              <span className="material-symbols-outlined text-[20px] text-green-700">folder_open</span>
              <span className="text-sm font-medium">All Docs</span>
            </a>

            {/* Accordion Item 1 */}
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-[#f7f8f6] text-[#131b0d] list-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-gray-400">folder</span>
                  <span className="text-sm font-medium">Business Plans</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-gray-400 transform group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="pl-9 pr-2 py-1 flex flex-col gap-1">
                <a className="block px-2 py-1.5 rounded text-sm text-gray-600 hover:text-[#131b0d] hover:bg-gray-100 cursor-pointer">Q3 Strategy</a>
                <a className="block px-2 py-1.5 rounded text-sm text-gray-600 hover:text-[#131b0d] hover:bg-gray-100 cursor-pointer">Annual Budget</a>
              </div>
            </details>

            {/* Accordion Item 2 */}
            <details className="group" open>
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-[#f7f8f6] text-[#131b0d] list-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-gray-400">folder</span>
                  <span className="text-sm font-medium">Marketing</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-gray-400 transform group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
              <div className="pl-9 pr-2 py-1 flex flex-col gap-1 border-l ml-[21px] border-[#ecf3e7]">
                <a className="flex items-center justify-between px-2 py-1.5 rounded text-sm text-[#131b0d] bg-primary/10 font-medium cursor-pointer">
                  <span>Q4 Strategy</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
                </a>
                <a className="block px-2 py-1.5 rounded text-sm text-gray-600 hover:text-[#131b0d] hover:bg-gray-100 cursor-pointer">Social Media Calendar</a>
                <a className="block px-2 py-1.5 rounded text-sm text-gray-600 hover:text-[#131b0d] hover:bg-gray-100 cursor-pointer">Influencer Briefs</a>
              </div>
            </details>

            {/* Accordion Item 3 */}
            <details className="group">
              <summary className="flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 hover:bg-[#f7f8f6] text-[#131b0d] list-none">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-[20px] text-gray-400">folder</span>
                  <span className="text-sm font-medium">Research</span>
                </div>
                <span className="material-symbols-outlined text-[16px] text-gray-400 transform group-open:rotate-180 transition-transform">expand_more</span>
              </summary>
            </details>
          </div>
        </div>

        {/* Bottom User Settings */}
        <div className="p-4 border-t border-[#ecf3e7]">
          <button className="flex items-center gap-3 w-full text-left hover:bg-[#f7f8f6] p-2 rounded-lg transition-colors">
            <span className="material-symbols-outlined text-gray-500">settings</span>
            <span className="text-sm font-medium text-gray-600">Settings</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area: Editor */}
      <main className="flex-1 flex flex-col bg-[#f7f8f6] relative h-full w-full min-w-0">
        {/* Sticky Formatting Toolbar */}
        <div className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white border-b border-[#ecf3e7] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-1">
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
              <span className="material-symbols-outlined text-[20px]">undo</span>
            </button>
            <button className="p-1.5 rounded hover:bg-gray-100 text-gray-600">
              <span className="material-symbols-outlined text-[20px]">redo</span>
            </button>
            <div className="w-px h-5 bg-gray-200 mx-2"></div>
            <div className="relative group">
              <button className="flex items-center gap-1 px-2 py-1.5 rounded hover:bg-gray-100 text-sm font-medium text-gray-700">
                Normal Text
                <span className="material-symbols-outlined text-[16px]">arrow_drop_down</span>
              </button>
            </div>
            <div className="w-px h-5 bg-gray-200 mx-2"></div>
            <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 font-bold">B</button>
            <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 italic font-serif">I</button>
            <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600 underline">U</button>
            <div className="w-px h-5 bg-gray-200 mx-2"></div>
            <button className="size-8 flex items-center justify-center rounded bg-primary/20 text-green-900">
              <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
            </button>
            <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">
              <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
            </button>
            <button className="size-8 flex items-center justify-center rounded hover:bg-gray-100 text-gray-600">
              <span className="material-symbols-outlined text-[18px]">link</span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">{isSaving ? 'Saving...' : 'Saved'}</span>
            <button
              onClick={handleShare}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white border border-[#ecf3e7] text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="material-symbols-outlined text-[18px]">share</span>
              Share
            </button>
          </div>
        </div>

        {/* Scrollable Document Canvas */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-8 md:pb-20 scroll-smooth">
          {/* A4-ish Paper */}
          <div className="bg-white max-w-[720px] mx-auto min-h-[1000px] shadow-sm rounded-xl p-8 md:p-16 border border-[#ecf3e7]">
            {/* Doc Header */}
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-6">
                <span className="text-2xl material-symbols-outlined text-gray-300">description</span>
                <nav className="flex text-sm text-gray-500">
                  <span>Marketing</span>
                  <span className="mx-2">/</span>
                  <span>Q4 Strategy</span>
                </nav>
              </div>
              <h1
                className="text-4xl md:text-5xl font-extrabold text-[#131b0d] leading-[1.2] outline-none placeholder:text-gray-300"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleTitleChange(e.currentTarget.textContent || '')}
              >
                {documentTitle || (isFile ? file?.name : document?.title) || 'Untitled'}
              </h1>
            </div>

            {/* Doc Body */}
            <div className="space-y-6 text-[#374151] text-lg leading-[1.7]">
              <p>
                This document outlines the core strategic initiatives for the upcoming quarter. Our primary focus is to amplify brand presence across emerging channels while solidifying our retention metrics.
              </p>

              <div className="p-4 bg-[#fcfdfa] border-l-4 border-primary rounded-r-lg">
                <p className="text-base font-medium text-gray-800 italic">
                  "Growth is never by mere chance; it is the result of forces working together."
                </p>
              </div>

              <h2 className="text-2xl font-bold text-[#131b0d] mt-8 mb-4">1. Key Objectives</h2>
              <ul className="list-disc pl-5 space-y-2">
                <li>Increase organic traffic by <span className="bg-yellow-100 px-1 rounded text-yellow-800 font-medium">25%</span> via content clusters.</li>
                <li>Launch the new referral program by mid-October.</li>
                <li>Improve customer onboarding completion rate to 85%.</li>
              </ul>

              <h2 className="text-2xl font-bold text-[#131b0d] mt-8 mb-4">2. Action Plan</h2>
              <p>
                We will begin by auditing our current content library. <span className="bg-primary/20 text-green-900 px-1.5 py-0.5 rounded-md font-medium cursor-pointer hover:bg-primary/30 transition-colors">@Sarah Jenkins</span> please review the audit parameters by Friday.
              </p>

              <div className="my-6">
                <div className="aspect-video w-full rounded-xl bg-gray-100 overflow-hidden relative group">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div
                    className="w-full h-full bg-cover bg-center"
                    style={{
                      backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDWjLbqDu0GBBCWruQ0lv5VOjaWR7EknzTfsUK6sXUjhoaXk-C7DN4YiBkSjFTzCPdM2JnKVtIJuOJg_jsSiKWXVTq6dEezTRd8S0nD6fMrLzg5PmYW_mI48xArTfKbEAz9CARBuezAZGPDduSIlWck9IikKiFYnI4nLYdCEZ-HAI0B-6mqElbyGkBu3h_EqGB4TpCns6-NgGbRWlXGwjPhyuz_u1OKdVgPvJLWw26PbvwZFBxmg_pilnCXktxDYC4BDGomU7Ycxz9W")'
                    }}
                  ></div>
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-medium text-gray-700 shadow-sm">
                    Projected Growth Q4
                  </div>
                </div>
              </div>

              <p>
                The chart above illustrates our projected growth trajectory assuming all initiatives are deployed on schedule. Note the spike in November corresponding with the holiday campaign launch.
              </p>
            </div>
          </div>

          {/* Spacer for scroll */}
          <div className="h-20"></div>
        </div>
      </main>

      {/* Right Sidebar: Context & Collaboration */}
      <aside className="w-[300px] bg-white border-l border-[#ecf3e7] flex-col hidden lg:flex flex-shrink-0 z-20">
        {/* Tabs */}
        <div className="flex border-b border-[#ecf3e7]">
          <button
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 text-sm font-bold ${
              activeTab === 'activity' ? 'text-[#131b0d] border-b-2 border-primary' : 'text-gray-500 hover:text-[#131b0d] hover:bg-gray-50'
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-3 text-sm font-medium ${
              activeTab === 'history' ? 'text-[#131b0d] border-b-2 border-primary' : 'text-gray-500 hover:text-[#131b0d] hover:bg-gray-50'
            }`}
          >
            History
          </button>
        </div>

        {/* Viewers Area */}
        <div className="p-4 border-b border-[#ecf3e7] bg-[#fafcf8]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Online Now</span>
            <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse"></span>
          </div>
          <div className="flex -space-x-2 overflow-hidden py-1">
            <div
              className="inline-block size-8 rounded-full ring-2 ring-white bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuA7WDsHVo1ThCyuo_Ph49y507ZnxIUoTzwm8Ab1j9dGRopLkukrwPBhsipWo3_dGQRpf4P-fBYyv_qkqYeB1L-_eol241vxPwn7pE1z2iCpSvr35tUq4XYOwV4kuQyN0h_Grx5DuHQ5RX-IHK5SYTx8X6kRcqdTZN9ykFL_j8Y44k_fqBgxvYkt46d2abyP2VM18nrlOHqjkJsRmgvUdjqFOAtK-O5yW6D2ZAT3nZql1xH2_QeeDWtQFFLPpdZQaJo93syTMgLP01Jx")'
              }}
              title="Sarah Jenkins"
            ></div>
            <div
              className="inline-block size-8 rounded-full ring-2 ring-white bg-cover bg-center"
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDvIrKeG0bwN-SE--Uc_eSqy9RAZwFoHUAQ_BKQauRKuWddND__pVtnRb-GKKHRVkCNJBVB16EO_QqYUoSOvAY2BScpnoAnCIKo3Z1ZUJOL0HkWJjozYlh_dryVv67fgehPXy09dYL6gV2FqCt-1OFgbC44d96swNkAAtH3W-rpoUs-8uKY5qvkpUkBZXpQTT1eqQt6hFhIfGclvsXn72WYVJJNcuIlRVpDBfNqjO3d__hNQ0zL8vSU4hOdujvrCUM5Bo9aG8eCtTyC")'
              }}
              title="Michael Chen"
            ></div>
            <div className="inline-block size-8 rounded-full ring-2 ring-white bg-gray-100 flex items-center justify-center text-xs font-medium text-gray-600">+1</div>
          </div>
        </div>

        {/* Comment Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Comment Thread 1 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div
                className="size-8 rounded-full bg-cover bg-center shrink-0"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuD1bAAN-2ICAcaiTenZ8-k-t9pGN3UZirJrx_r5NvE4DaUbZfkeBVirCkGp3UBtjlHMHzUdDfvxusZ3TxSBXyMg_JRwSsu3bHu6X2ba9DbS1vCmj6MAGxRWKeKWUDihmrm_b1LKKJ5dt7FlIa6ofJf8d_qmpltDwWi5JOxQ3Zzu8iHz_nMCwcpt0lxc8AjtG2zkqs561PKOttsW5FcY6nD37QkEoEC5hkYYATU84_DiRZ29Tk_aaQmeEWSS5xmI2FJZFBY0c0O5bQi3")'
                }}
              ></div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#131b0d]">Sarah Jenkins</span>
                  <span className="text-xs text-gray-400">10:42 AM</span>
                </div>
                <div className="bg-[#f7f8f6] p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ecf3e7]">
                  <p className="text-sm text-gray-700">Great start! I think we should emphasize the mobile retention strategy a bit more in section 2.</p>
                </div>
                <div className="flex gap-3 text-xs font-medium text-gray-500 mt-0.5">
                  <button className="hover:text-primary">Reply</button>
                  <button className="hover:text-primary">Resolve</button>
                </div>
              </div>
            </div>
          </div>

          {/* Comment Thread 2 */}
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <div
                className="size-8 rounded-full bg-cover bg-center shrink-0"
                style={{
                  backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuBLAMJXy58xg2WKxSDAz4G6Y0dFnVBY7qp-nDq71wpRFNfEZPWTjIETH7K29bVOsAsU2PGmHY-H8eIQXo-SwJBCr3T9pK-HDXCu1OeDRZdULlpk0-qtGk0pum83ldK7UmHETR75rqTk08kzoqeN8dM2EGmxU5jy6rieH4T3pLEh-Zmg_rbhFRb4yxzXYBksooXWvOjNG4bobw5DTxP2uPYoa6TUmwOBoFhnIND55jdPae97fiWYWn-0SPV7fNhs7GUYkWoaH0pN-Ces")'
                }}
              ></div>
              <div className="flex flex-col gap-1 w-full">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold text-[#131b0d]">Michael Chen</span>
                  <span className="text-xs text-gray-400">11:15 AM</span>
                </div>
                {/* Quoted Text Context */}
                <div className="pl-2 border-l-2 border-primary/50 mb-1">
                  <p className="text-xs text-gray-400 truncate italic">...referral program by mid-October.</p>
                </div>
                <div className="bg-[#f7f8f6] p-3 rounded-tr-lg rounded-br-lg rounded-bl-lg border border-[#ecf3e7]">
                  <p className="text-sm text-gray-700">Agreed. I'll ping the dev team to check if the timeline is feasible.</p>
                </div>
              </div>
            </div>
          </div>

          {/* System Notification */}
          <div className="flex items-center gap-3 py-2">
            <div className="h-px bg-gray-100 flex-1"></div>
            <span className="text-xs text-gray-400 font-medium">Today</span>
            <div className="h-px bg-gray-100 flex-1"></div>
          </div>
          <div className="flex gap-3 items-center opacity-70">
            <div className="size-6 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[14px] text-gray-500">edit</span>
            </div>
            <p className="text-xs text-gray-500">
              <span className="font-bold text-gray-700">You</span> updated the title
            </p>
            <span className="text-[10px] text-gray-400 ml-auto">12:03 PM</span>
          </div>
      </div>

        {/* Comment Input */}
        <div className="p-4 border-t border-[#ecf3e7] bg-white">
          <div className="relative">
            <textarea
              className="w-full resize-none rounded-lg border border-gray-200 bg-[#f7f8f6] p-3 pr-10 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary h-20 placeholder:text-gray-400"
              placeholder="Add a comment or @mention..."
            ></textarea>
            <button className="absolute bottom-2 right-2 p-1.5 bg-primary rounded-md text-[#131b0d] hover:bg-[#63d60e] transition-colors shadow-sm">
              <span className="material-symbols-outlined text-[18px] block">send</span>
            </button>
          </div>
        </div>
      </aside>
    </div>
  )
}
