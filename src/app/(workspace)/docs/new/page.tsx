'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateDocument } from '@/hooks/useDocuments'

interface TeamMember {
  id: string
  name: string
  avatar?: string
}

export default function CreateDocumentPage() {
  const router = useRouter()
  const createDocument = useCreateDocument()
  
  const [documentName, setDocumentName] = useState('')
  const [template, setTemplate] = useState('blank')
  const [location, setLocation] = useState('marketing-q3')
  const [sharingOption, setSharingOption] = useState<'whole-team' | 'specific-people' | 'only-me'>('specific-people')
  const [selectedPeople, setSelectedPeople] = useState<TeamMember[]>([
    { id: '1', name: 'Sarah', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB4ic3WUaimV4-VDTZeJFw6q4XhnBy5LJTTcXrajg4qZb-07SBtkzzz9kPYwE6uJvWERGgziDc5V7KuBGAlnH048P81YcgqnTQVDFm9iwQaZR6G4AVn4QMBfib9j_xV14CZb0JhXvfW73q48MM0V7UFS1n8tk8gjUw5dwrWt_gIeYdWs80XuIycBopZD0bfhGdokhbXSXeM5J0aenAMNNoiuz2w_s10Bv22Sx1u2bM2o5Bd4Q0ElrxbScb0TfKTyy7duZSUdx2oz0fg' },
    { id: '2', name: 'Mike', avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAMomJsFaSMxgc5Ja82FOXC3JRkB84xKTckwkFlF4OFsXoue5A5d9yT5DSpa0wTxycIrsXaIEYW-kekIGYC7DK0w59OubAYc7VDP6d6bi6nn02g8HIuam4ND39OP-CaQhbGeiX-bceyWyG_JGoqjs_0wCX6A4sb2lBj62rVjrzRa3Qj_i9mrR_vyQV59VzO_0Sbe_mJHYtLO8CaLYxIdCjeOHd9hML2ZoGssD7tXoydGFWLEtufzRQUn3kh58G1wh4T3E1kb44aUpSL' }
  ])
  const [newPersonInput, setNewPersonInput] = useState('')
  const [tags, setTags] = useState<string[]>(['Q3'])
  const [newTag, setNewTag] = useState('')
  const [relatedTo, setRelatedTo] = useState('')

  const handleClose = () => {
    router.push('/docs')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!documentName.trim()) {
      alert('Please enter a document name')
      return
    }
    
    try {
      const newDocument = await createDocument.mutateAsync({
        title: documentName,
        type: 'doc',
        document_mode: 'text',
        folder: location,
        folder_id: location !== 'general-root' ? location : null,
        status: 'draft',
        is_favorite: false
      })
      
      router.push(`/docs/${newDocument.id}`)
    } catch (error) {
      console.error('Failed to create document:', error)
      alert('Failed to create document. Please try again.')
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()])
      }
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  const handleRemovePerson = (personId: string) => {
    setSelectedPeople(selectedPeople.filter(p => p.id !== personId))
  }

  const handleAddPerson = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPersonInput.trim()) {
      e.preventDefault()
      // Mock: Add person by name
      const newPerson: TeamMember = {
        id: Date.now().toString(),
        name: newPersonInput.trim()
      }
      setSelectedPeople([...selectedPeople, newPerson])
      setNewPersonInput('')
    }
  }

  return (
    <>
      {/* Background Layer */}
      <div aria-hidden="true" className="fixed inset-0 h-screen w-full flex flex-col opacity-40 pointer-events-none blur-[2px] select-none z-30">
        <div className="flex-1 p-10 grid grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 rounded-xl bg-white dark:bg-[#232f1e] border border-[#dae7cf] dark:border-[#3a4d2e] p-6"></div>
          ))}
        </div>
      </div>

      {/* Modal Overlay */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#131b0d]/60 backdrop-blur-sm transition-opacity"
          onClick={handleClose}
          aria-hidden="true"
        />

        {/* Modal Container */}
        <div className="relative w-full max-w-[640px] flex flex-col bg-white dark:bg-[#232f1e] rounded-xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 max-h-[95vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#dae7cf] dark:border-[#3a4d2e] bg-white dark:bg-[#232f1e] z-10">
            <div>
              <h2 className="text-xl font-bold text-[#131b0d] dark:text-white leading-tight">
                Create New Document
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Start a fresh document or use a template.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="group p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              <span className="material-symbols-outlined text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-200">
                close
              </span>
            </button>
          </div>

          {/* Modal Scrollable Content */}
          <div className="flex-1 overflow-y-auto px-6 py-6">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Document Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-[#131b0d] dark:text-white" htmlFor="doc-name">
                  Document Name<span className="text-red-500 ml-0.5">*</span>
                </label>
                <input
                  autoFocus
                  id="doc-name"
                  className="w-full h-12 px-4 rounded-lg border border-[#dae7cf] dark:border-[#3a4d2e] bg-[#f7f8f6] dark:bg-[#182210] text-[#131b0d] dark:text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-base font-medium"
                  placeholder="e.g., Q3 Marketing Strategy"
                  type="text"
                  value={documentName}
                  onChange={(e) => setDocumentName(e.target.value)}
                />
              </div>

              {/* Grid for Template & Location */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Template */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#131b0d] dark:text-white">Template</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-4 pr-10 appearance-none rounded-lg border border-[#dae7cf] dark:border-[#3a4d2e] bg-[#f7f8f6] dark:bg-[#182210] text-[#131b0d] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium cursor-pointer"
                      value={template}
                      onChange={(e) => setTemplate(e.target.value)}
                    >
                      <option value="blank">Blank Document</option>
                      <option value="meeting-notes">Meeting Notes</option>
                      <option value="project-proposal">Project Proposal</option>
                      <option value="technical-spec">Technical Spec</option>
                    </select>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#131b0d] dark:text-white">Location</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-10 pr-10 appearance-none rounded-lg border border-[#dae7cf] dark:border-[#3a4d2e] bg-[#f7f8f6] dark:bg-[#182210] text-[#131b0d] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium cursor-pointer"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    >
                      <option value="marketing-q3">Marketing / Q3</option>
                      <option value="general-root">General / Root</option>
                      <option value="engineering-backend">Engineering / Backend</option>
                      <option value="personal-folder">Personal Folder</option>
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">
                      folder
                    </span>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>

              {/* Sharing & Access */}
              <div className="flex flex-col gap-3">
                <label className="text-sm font-bold text-[#131b0d] dark:text-white">
                  Sharing & Access
                </label>
                <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#dae7cf] dark:border-[#3a4d2e] bg-[#f7f8f6]/50 dark:bg-[#182210]/30">
                  {/* Option 1: Whole Team */}
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        className="peer appearance-none h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-primary checked:bg-primary transition-all focus:ring-0 focus:ring-offset-0"
                        name="sharing"
                        type="radio"
                        checked={sharingOption === 'whole-team'}
                        onChange={() => setSharingOption('whole-team')}
                      />
                      <span className="material-symbols-outlined absolute text-[#131b0d] text-[14px] opacity-0 peer-checked:opacity-100 font-bold scale-50 peer-checked:scale-100 transition-transform">
                        check
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#131b0d] dark:text-gray-200">
                      Whole team <span className="text-gray-400 font-normal ml-1">(4 members)</span>
                    </span>
                  </label>

                  {/* Option 2: Specific People */}
                  <div className="flex flex-col gap-3">
                    <label className="group flex items-center gap-3 cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input
                          className="peer appearance-none h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-primary checked:bg-primary transition-all focus:ring-0 focus:ring-offset-0"
                          name="sharing"
                          type="radio"
                          checked={sharingOption === 'specific-people'}
                          onChange={() => setSharingOption('specific-people')}
                        />
                        <span className="material-symbols-outlined absolute text-[#131b0d] text-[14px] opacity-0 peer-checked:opacity-100 font-bold scale-50 peer-checked:scale-100 transition-transform">
                          check
                        </span>
                      </div>
                      <span className="text-sm font-medium text-[#131b0d] dark:text-gray-200">
                        Specific people
                      </span>
                    </label>

                    {/* Conditional Multi-Select */}
                    {sharingOption === 'specific-people' && (
                      <div className="ml-8 animate-in slide-in-from-top-2 fade-in duration-200">
                        <div className="flex flex-wrap items-center gap-2 p-2 min-h-[48px] rounded-lg border border-primary/50 bg-white dark:bg-black/20 ring-1 ring-primary/20">
                          {/* Person Chips */}
                          {selectedPeople.map((person) => (
                            <div
                              key={person.id}
                              className="flex items-center gap-2 bg-gray-100 dark:bg-white/10 pl-1 pr-2 py-0.5 rounded-full border border-gray-200 dark:border-white/5"
                            >
                              {person.avatar ? (
                                <img
                                  className="size-5 rounded-full object-cover"
                                  src={person.avatar}
                                  alt={`Avatar of ${person.name}`}
                                />
                              ) : (
                                <div className="size-5 rounded-full bg-primary/20 flex items-center justify-center">
                                  <span className="text-xs text-primary font-bold">
                                    {person.name.charAt(0)}
                                  </span>
                                </div>
                              )}
                              <span className="text-xs font-semibold text-[#131b0d] dark:text-gray-200">
                                {person.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemovePerson(person.id)}
                                className="hover:text-red-500 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[14px] leading-none">
                                  close
                                </span>
                              </button>
                            </div>
                          ))}
                          {/* Input Trigger */}
                          <input
                            className="bg-transparent border-none focus:ring-0 text-sm p-0 text-[#131b0d] dark:text-white placeholder:text-gray-400 min-w-[80px]"
                            placeholder="Add more..."
                            type="text"
                            value={newPersonInput}
                            onChange={(e) => setNewPersonInput(e.target.value)}
                            onKeyDown={handleAddPerson}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Option 3: Only Me */}
                  <label className="group flex items-center gap-3 cursor-pointer">
                    <div className="relative flex items-center justify-center">
                      <input
                        className="peer appearance-none h-5 w-5 border-2 border-gray-300 dark:border-gray-600 rounded-full checked:border-primary checked:bg-primary transition-all focus:ring-0 focus:ring-offset-0"
                        name="sharing"
                        type="radio"
                        checked={sharingOption === 'only-me'}
                        onChange={() => setSharingOption('only-me')}
                      />
                      <span className="material-symbols-outlined absolute text-[#131b0d] text-[14px] opacity-0 peer-checked:opacity-100 font-bold scale-50 peer-checked:scale-100 transition-transform">
                        check
                      </span>
                    </div>
                    <span className="text-sm font-medium text-[#131b0d] dark:text-gray-200">
                      Only me
                    </span>
                  </label>
                </div>
              </div>

              {/* Tags & Related To */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tags */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#131b0d] dark:text-white">Tags</label>
                  <div className="flex items-center gap-2 w-full h-12 px-3 rounded-lg border border-[#dae7cf] dark:border-[#3a4d2e] bg-[#f7f8f6] dark:bg-[#182210] overflow-hidden focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary transition-all">
                    <span className="material-symbols-outlined text-gray-400">label</span>
                    <div className="flex gap-1">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="hover:text-green-900 dark:hover:text-green-100 transition-colors"
                          >
                            <span className="material-symbols-outlined text-[12px] leading-none">close</span>
                          </button>
                        </span>
                      ))}
                    </div>
                    <input
                      className="flex-1 bg-transparent border-none focus:ring-0 p-0 text-base text-[#131b0d] dark:text-white placeholder:text-gray-400"
                      placeholder="Add tags..."
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </div>

                {/* Related To */}
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-bold text-[#131b0d] dark:text-white">Related To</label>
                  <div className="relative">
                    <select
                      className="w-full h-12 pl-10 pr-10 appearance-none rounded-lg border border-[#dae7cf] dark:border-[#3a4d2e] bg-[#f7f8f6] dark:bg-[#182210] text-[#131b0d] dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all font-medium cursor-pointer"
                      value={relatedTo}
                      onChange={(e) => setRelatedTo(e.target.value)}
                    >
                      <option disabled value="">
                        Select event or project...
                      </option>
                      <option value="project-website-redesign">Project: Website Redesign</option>
                      <option value="event-weekly-sync">Event: Weekly Sync</option>
                    </select>
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-[20px]">
                      link
                    </span>
                    <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      expand_more
                    </span>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 px-6 py-5 border-t border-[#dae7cf] dark:border-[#3a4d2e] bg-white dark:bg-[#232f1e] z-10">
            <button
              type="button"
              onClick={handleClose}
              className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={createDocument.isPending}
              className="flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold bg-primary text-[#131b0d] hover:bg-[#60d60b] active:scale-95 transition-all shadow-[0_0_15px_-3px_rgba(113,236,19,0.15)]"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">edit_square</span>
              Create & Start Writing
            </button>
          </div>
        </div>
    </div>
    </>
  )
}
