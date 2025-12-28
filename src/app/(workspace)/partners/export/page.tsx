'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { usePartners } from '@/hooks/usePartners'

type ExportFormat = 'excel' | 'csv' | 'pdf'
type ExportScope = 'all' | 'active' | 'in_gesprek' | 'custom'
type SortOption = 'name_asc' | 'name_desc' | 'date_newest' | 'status'

const EXPORT_FIELDS = [
  { id: 'name', label: 'Partner name', defaultChecked: true },
  { id: 'contact', label: 'Contact information', defaultChecked: true },
  { id: 'status_dates', label: 'Status & dates', defaultChecked: true },
  { id: 'contract', label: 'Contract details', defaultChecked: false },
  { id: 'value', label: 'Value & metrics', defaultChecked: false },
  { id: 'tags', label: 'Tags', defaultChecked: false },
  { id: 'notes', label: 'Notes', defaultChecked: false },
  { id: 'activity', label: 'Full activity history', defaultChecked: false },
] as const

export default function ExportPartnersPage() {
  const router = useRouter()
  const { data: partners = [], isLoading } = usePartners()

  const [format, setFormat] = useState<ExportFormat>('excel')
  const [scope, setScope] = useState<ExportScope>('all')
  const [selectedFields, setSelectedFields] = useState<Set<string>>(
    new Set(EXPORT_FIELDS.filter((f) => f.defaultChecked).map((f) => f.id))
  )
  const [sortBy, setSortBy] = useState<SortOption>('name_asc')
  const [isExporting, setIsExporting] = useState(false)

  const handleClose = () => {
    router.back()
  }

  const handleSelectAll = () => {
    if (selectedFields.size === EXPORT_FIELDS.length) {
      setSelectedFields(new Set())
    } else {
      setSelectedFields(new Set(EXPORT_FIELDS.map((f) => f.id)))
    }
  }

  const handleFieldToggle = (fieldId: string) => {
    const newFields = new Set(selectedFields)
    if (newFields.has(fieldId)) {
      newFields.delete(fieldId)
    } else {
      newFields.add(fieldId)
    }
    setSelectedFields(newFields)
  }

  const handleExport = async () => {
    if (selectedFields.size === 0) {
      alert('Please select at least one field to export')
      return
    }

    setIsExporting(true)

    // Filter partners based on scope
    let filteredPartners = partners
    if (scope === 'active') {
      filteredPartners = partners.filter((p) => p.status === 'active')
    } else if (scope === 'in_gesprek') {
      filteredPartners = partners.filter((p) => p.status === 'in_gesprek')
    }
    // 'all' and 'custom' use all partners for now

    // Sort partners
    const sortedPartners = [...filteredPartners].sort((a, b) => {
      switch (sortBy) {
        case 'name_asc':
          return a.name.localeCompare(b.name)
        case 'name_desc':
          return b.name.localeCompare(a.name)
        case 'date_newest':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        case 'status':
          return a.status.localeCompare(b.status)
        default:
          return 0
      }
    })

    // Generate export data based on selected fields
    const exportData = sortedPartners.map((partner) => {
      const row: Record<string, any> = {}
      if (selectedFields.has('name')) row['Partner Name'] = partner.name
      if (selectedFields.has('contact')) {
        row['Contact Name'] = partner.contact_name
        row['Contact Email'] = partner.contact_email
        row['Contact Phone'] = partner.contact_phone || ''
      }
      if (selectedFields.has('status_dates')) {
        row['Status'] = partner.status
        row['Partnership Start'] = partner.partnership_start || ''
        row['Contract End'] = partner.contract_end || ''
      }
      if (selectedFields.has('contract')) {
        row['Contract Type'] = partner.type || ''
      }
      if (selectedFields.has('value')) {
        row['Annual Value'] = partner.annual_value || 0
      }
      if (selectedFields.has('tags')) {
        row['Tags'] = partner.tags?.join(', ') || ''
      }
      if (selectedFields.has('notes')) {
        row['Notes'] = partner.notes || ''
      }
      // Activity history would require additional queries, skipping for now
      return row
    })

    try {
      if (format === 'csv') {
        // Generate CSV
        const headers = Object.keys(exportData[0] || {})
        const csvRows = [
          headers.join(','),
          ...exportData.map((row) => headers.map((header) => JSON.stringify(row[header] || '')).join(',')),
        ]
        const csvContent = csvRows.join('\n')
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `partners_export_${new Date().toISOString().split('T')[0]}.csv`
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === 'excel') {
        // For Excel, we'll generate a CSV with .xlsx extension
        // In production, you'd use a library like xlsx or exceljs
        const headers = Object.keys(exportData[0] || {})
        const csvRows = [
          headers.join(','),
          ...exportData.map((row) => headers.map((header) => JSON.stringify(row[header] || '')).join(',')),
        ]
        const csvContent = csvRows.join('\n')
        const blob = new Blob([csvContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `partners_export_${new Date().toISOString().split('T')[0]}.xlsx`
        link.click()
        URL.revokeObjectURL(url)
      } else if (format === 'pdf') {
        // PDF export would require a library like jsPDF or pdfkit
        // For now, we'll alert the user
        alert('PDF export is not yet implemented. Please use CSV or Excel format.')
        setIsExporting(false)
        return
      }

      // Success - close modal after a brief delay
      setTimeout(() => {
        router.back()
      }, 500)
    } catch (error) {
      console.error('Export error:', error)
      alert('Failed to export partners. Please try again.')
      setIsExporting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-[#131b0d]/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
        <div className="relative z-50 w-full max-w-2xl bg-white dark:bg-[#182210] rounded-xl shadow-2xl p-8">
          <p className="text-center text-gray-500">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#131b0d]/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative z-50 w-full max-w-2xl bg-white dark:bg-[#182210] rounded-xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] flex flex-col max-h-[90vh] overflow-hidden border border-border-light dark:border-border-dark">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border-light dark:border-border-dark bg-white dark:bg-[#182210] shrink-0 z-10">
          <div>
            <h2 className="text-[#131b0d] dark:text-white text-[24px] font-bold leading-tight tracking-tight">
              Export Partners
            </h2>
            <p className="text-[#131b0d]/60 dark:text-white/60 text-sm font-medium mt-1">
              Export partner database to file
            </p>
          </div>
          <button
            onClick={handleClose}
            aria-label="Close modal"
            className="group flex items-center justify-center w-8 h-8 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <svg
              className="w-5 h-5 text-[#131b0d] dark:text-white group-hover:scale-110 transition-transform"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar bg-white dark:bg-[#182210] flex-1">
          {/* Section: Format */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[#131b0d] dark:text-white text-base font-bold leading-tight">Format</h3>
            <div className="grid grid-cols-3 gap-3">
              <label className="group relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="format"
                  type="radio"
                  value="excel"
                  checked={format === 'excel'}
                  onChange={() => setFormat('excel')}
                />
                <div className="flex items-center justify-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-3 h-12 text-text-main dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <svg className="w-5 h-5 text-[#1D6F42]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 4a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V4zm2 0v12h12V4H4z" />
                    <path d="M6 6h2v8H6V6zm4 0h2v8h-2V6z" />
                  </svg>
                  Excel (.xlsx)
                </div>
                <div className="absolute top-0 right-0 -mt-1 -mr-1 w-4 h-4 bg-primary rounded-full hidden peer-checked:block border-2 border-white dark:border-[#182210]"></div>
              </label>

              <label className="group relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="format"
                  type="radio"
                  value="csv"
                  checked={format === 'csv'}
                  onChange={() => setFormat('csv')}
                />
                <div className="flex items-center justify-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-3 h-12 text-text-main dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <svg className="w-5 h-5 text-[#2ba849]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                    />
                  </svg>
                  CSV
                </div>
              </label>

              <label className="group relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="format"
                  type="radio"
                  value="pdf"
                  checked={format === 'pdf'}
                  onChange={() => setFormat('pdf')}
                />
                <div className="flex items-center justify-center gap-2 rounded-lg border border-border-light dark:border-border-dark px-4 py-3 h-12 text-text-main dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <svg className="w-5 h-5 text-[#F40F02]" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                    />
                  </svg>
                  PDF
                </div>
              </label>
            </div>
          </div>

          {/* Section: Include Partners */}
          <div className="flex flex-col gap-3">
            <h3 className="text-[#131b0d] dark:text-white text-base font-bold leading-tight">Include Partners</h3>
            <div className="grid grid-cols-2 gap-3">
              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="scope"
                  type="radio"
                  value="all"
                  checked={scope === 'all'}
                  onChange={() => setScope('all')}
                />
                <div className="flex items-center rounded-lg border border-[#dae7cf] dark:border-[#2a3820] px-4 py-3 text-[#131b0d] dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <span className="w-4 h-4 rounded-full border border-gray-400 mr-3 peer-checked:border-primary peer-checked:border-4 peer-checked:bg-white dark:peer-checked:bg-white"></span>
                  All partners
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="scope"
                  type="radio"
                  value="active"
                  checked={scope === 'active'}
                  onChange={() => setScope('active')}
                />
                <div className="flex items-center rounded-lg border border-[#dae7cf] dark:border-[#2a3820] px-4 py-3 text-[#131b0d] dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <span className="w-4 h-4 rounded-full border border-gray-400 mr-3 peer-checked:border-primary peer-checked:border-4 peer-checked:bg-white dark:peer-checked:bg-white"></span>
                  Active only
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="scope"
                  type="radio"
                  value="in_gesprek"
                  checked={scope === 'in_gesprek'}
                  onChange={() => setScope('in_gesprek')}
                />
                <div className="flex items-center rounded-lg border border-[#dae7cf] dark:border-[#2a3820] px-4 py-3 text-[#131b0d] dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <span className="w-4 h-4 rounded-full border border-gray-400 mr-3 peer-checked:border-primary peer-checked:border-4 peer-checked:bg-white dark:peer-checked:bg-white"></span>
                  In Gesprek only
                </div>
              </label>

              <label className="relative cursor-pointer">
                <input
                  className="peer sr-only"
                  name="scope"
                  type="radio"
                  value="custom"
                  checked={scope === 'custom'}
                  onChange={() => setScope('custom')}
                />
                <div className="flex items-center rounded-lg border border-[#dae7cf] dark:border-[#2a3820] px-4 py-3 text-[#131b0d] dark:text-white font-medium text-sm transition-all peer-checked:border-[2px] peer-checked:border-primary peer-checked:bg-primary/5 hover:bg-background-light dark:hover:bg-white/5">
                  <span className="w-4 h-4 rounded-full border border-gray-400 mr-3 peer-checked:border-primary peer-checked:border-4 peer-checked:bg-white dark:peer-checked:bg-white"></span>
                  Custom selection
                </div>
              </label>
            </div>
          </div>

          {/* Section: Include Fields */}
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-end">
              <h3 className="text-[#131b0d] dark:text-white text-base font-bold leading-tight">Include Fields</h3>
              <button
                onClick={handleSelectAll}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Select All
              </button>
            </div>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {EXPORT_FIELDS.map((field) => (
                <label key={field.id} className="inline-flex items-center cursor-pointer group">
                  <div className="relative flex items-center">
                    <input
                      className="peer sr-only"
                      type="checkbox"
                      checked={selectedFields.has(field.id)}
                      onChange={() => handleFieldToggle(field.id)}
                    />
                    <div className="w-5 h-5 border-2 border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-white/5 peer-checked:bg-primary peer-checked:border-primary transition-all flex items-center justify-center">
                      <svg
                        className="w-3.5 h-3.5 text-black opacity-0 peer-checked:opacity-100 font-bold"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        />
                      </svg>
                    </div>
                    <span className="ml-3 text-sm text-[#131b0d] dark:text-white font-medium group-hover:text-primary transition-colors">
                      {field.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Section: Sort By */}
          <div className="flex flex-col gap-3 pb-2">
            <h3 className="text-[#131b0d] dark:text-white text-base font-bold leading-tight">Sort by</h3>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="appearance-none w-full bg-white dark:bg-[#182210] border border-[#dae7cf] dark:border-[#2a3820] text-[#131b0d] dark:text-white text-sm rounded-lg focus:ring-primary focus:border-primary block p-3 pr-10 font-medium cursor-pointer"
              >
                <option value="name_asc">Partner Name (A-Z)</option>
                <option value="name_desc">Partner Name (Z-A)</option>
                <option value="date_newest">Date Added (Newest First)</option>
                <option value="status">Status</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#131b0d] dark:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-[#dae7cf] dark:border-[#2a3820] flex justify-end gap-3 bg-white dark:bg-[#182210] shrink-0">
          <button
            onClick={handleClose}
            className="px-6 py-2.5 rounded-lg border border-transparent hover:bg-gray-100 dark:hover:bg-white/5 text-[#131b0d] dark:text-white font-bold text-sm transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={handleExport}
            disabled={isExporting || selectedFields.size === 0}
            className="px-6 py-2.5 rounded-lg bg-primary text-[#131b0d] font-bold text-sm hover:brightness-95 transition-all duration-200 shadow-sm flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
              />
            </svg>
            Export
          </button>
        </div>
      </div>
    </div>
  )
}

