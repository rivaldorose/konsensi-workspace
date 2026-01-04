'use client'

import { useEffect, useRef, useState } from 'react'
import * as pdfjsLib from 'pdfjs-dist'

// Set worker - use local worker file from public folder
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'
}

interface PDFViewerProps {
  url: string
  scale?: number
  pageNum?: number
  onPageCountChange?: (count: number) => void
}

export function PDFViewer({ url, scale = 1.0, pageNum: controlledPageNum, onPageCountChange }: PDFViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [pdfDoc, setPdfDoc] = useState<any>(null)
  const [internalPageNum, setInternalPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const pageNum = controlledPageNum ?? internalPageNum

  // Load PDF document
  useEffect(() => {
    if (!url) return
    
    setLoading(true)
    setError(null)

    pdfjsLib
      .getDocument(url)
      .promise.then((pdf) => {
        setPdfDoc(pdf)
        setNumPages(pdf.numPages)
        setInternalPageNum(1)
        setLoading(false)
        if (onPageCountChange) {
          onPageCountChange(pdf.numPages)
        }
      })
      .catch((err) => {
        console.error('Error loading PDF:', err)
        setError('Failed to load PDF')
        setLoading(false)
      })
  }, [url, onPageCountChange])

  // Render page
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current || !url) return

    setLoading(true)
    pdfDoc
      .getPage(pageNum)
      .then((page: any) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const viewport = page.getViewport({ scale })
        canvas.height = viewport.height
        canvas.width = viewport.width

        const renderContext = {
          canvasContext: canvas.getContext('2d'),
          viewport: viewport,
        }

        const renderTask = page.render(renderContext)
        renderTask.promise.then(() => {
          setLoading(false)
        })
        
        return renderTask
      })
      .catch((err: any) => {
        console.error('Error rendering page:', err)
        setError('Failed to render page')
        setLoading(false)
      })
  }, [pdfDoc, pageNum, scale, url])

  if (error) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="text-center">
          <p className="text-red-600 mb-2">{error}</p>
          <p className="text-sm text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    )
  }

  return (
    <div ref={containerRef} className="flex flex-col items-center w-full">
      {loading && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-pulse mb-2">Loading PDF...</div>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="max-w-full h-auto shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06),0_0_0_1px_rgba(0,0,0,0.05)] bg-white"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  )
}

export function usePDFViewer(url: string) {
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.0)

  const goToPage = (page: number) => {
    if (page >= 1 && page <= numPages) {
      setPageNum(page)
    }
  }

  const nextPage = () => {
    if (pageNum < numPages) {
      setPageNum((prev) => prev + 1)
    }
  }

  const prevPage = () => {
    if (pageNum > 1) {
      setPageNum((prev) => prev - 1)
    }
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.25, 3.0))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.25, 0.5))
  }

  const setZoom = (newScale: number) => {
    setScale(Math.max(0.5, Math.min(3.0, newScale)))
  }

  return {
    pageNum,
    numPages,
    setNumPages,
    scale,
    goToPage,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    setZoom,
  }
}
