'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreatePartner } from '@/hooks/usePartners'
import type { Partner } from '@/types'

export default function AddPartnerPage() {
  const router = useRouter()
  const createPartner = useCreatePartner()
  
  const [formData, setFormData] = useState<Partial<Partner>>({
    status: 'in_gesprek',
    tags: [],
    type: 'client'
  })
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')
  const [opportunity, setOpportunity] = useState('')

  const handleClose = () => {
    router.push('/partners')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await createPartner.mutateAsync({
        ...formData,
        tags,
        notes: opportunity || formData.notes
      })
      router.push('/partners')
    } catch (error) {
      console.error('Failed to create partner:', error)
      alert('Failed to create partner. Please try again.')
    }
  }

  const handleSaveDraft = async () => {
    try {
      await createPartner.mutateAsync({
        ...formData,
        tags,
        status: 'to_contact',
        notes: opportunity || formData.notes
      })
      router.push('/partners')
    } catch (error) {
      console.error('Failed to save draft:', error)
      alert('Failed to save draft. Please try again.')
    }
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      setTags([...tags, newTag.trim()])
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  return (
    <>
      {/* Background Pattern */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#dae7cf 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

      {/* Modal Overlay */}
      <div 
        className="fixed inset-0 bg-[#131b0d]/60 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-white dark:bg-[#1e2a16] rounded-xl shadow-2xl flex flex-col max-h-[90vh] border border-[#dae7cf] dark:border-[#3a4b30]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#dae7cf] dark:border-[#2d3b24] shrink-0">
            <div>
              <h2 className="text-[#131b0d] dark:text-white tracking-tight text-[24px] font-bold leading-tight">
                Add New Partner
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Enter the details for the new business partner.
              </p>
            </div>
            <button
              onClick={handleClose}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-[#2d3b24] text-[#131b0d] dark:text-white transition-colors"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Scrollable Form Body */}
          <div className="overflow-y-auto flex-1 px-8 py-6">
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
              
              {/* Section: Partner Information */}
              <section>
                <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">domain</span>
                  Partner Information
                </h3>
                <div className="grid grid-cols-1 gap-5">
                  {/* Partner Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Partner Name*</label>
                    <input
                      className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 px-4 text-base font-normal transition-all"
                      placeholder="e.g. Acme Corporation"
                      required
                      type="text"
                      value={formData.name || ''}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Type*</label>
                      <div className="relative">
                        <select
                          className="form-select flex w-full appearance-none rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 px-4 text-base font-normal transition-all cursor-pointer"
                          required
                          value={formData.type || 'client'}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                          <option value="vendor">Vendor</option>
                          <option value="reseller">Reseller</option>
                          <option value="strategic">Strategic Partner</option>
                          <option value="client">Client</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e9a4c]">expand_more</span>
                      </div>
                    </div>
                    {/* Sector/Industry */}
                    <div className="flex flex-col gap-2">
                      <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Sector/Industry</label>
                      <input
                        className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 px-4 text-base font-normal transition-all"
                        placeholder="e.g. Fintech"
                        type="text"
                        value={formData.sector || ''}
                        onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Contact Information */}
              <section>
                <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-t border-[#dae7cf] dark:border-[#2d3b24] pt-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">person</span>
                  Contact Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Primary Contact Name */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Primary Contact Name*</label>
                    <input
                      className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 px-4 text-base font-normal transition-all"
                      placeholder="First Last"
                      required
                      type="text"
                      value={formData.contact_name || ''}
                      onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    />
                  </div>
                  {/* Job Title */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Job Title</label>
                    <input
                      className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 px-4 text-base font-normal transition-all"
                      placeholder="e.g. Head of Operations"
                      type="text"
                      value={formData.contact_email || ''}
                      onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Email*</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6e9a4c] text-[20px]">mail</span>
                      <input
                        className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 pl-11 pr-4 text-base font-normal transition-all"
                        placeholder="email@company.com"
                        required
                        type="email"
                        value={formData.contact_email || ''}
                        onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                      />
                    </div>
                  </div>
                  {/* Phone */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Phone</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#6e9a4c] text-[20px]">call</span>
                      <input
                        className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 pl-11 pr-4 text-base font-normal transition-all"
                        placeholder="+31 6 12345678"
                        type="tel"
                        value={formData.contact_phone || ''}
                        onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Partnership Details */}
              <section>
                <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-t border-[#dae7cf] dark:border-[#2d3b24] pt-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">handshake</span>
                  Partnership Details
                </h3>
                {/* Current Status */}
                <div className="flex flex-col gap-3 mb-5">
                  <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Current Status</label>
                  <div className="flex flex-wrap gap-3">
                    {(['to_contact', 'in_gesprek', 'active'] as const).map((status) => {
                      const isSelected = formData.status === status
                      const labels = {
                        to_contact: 'To Contact',
                        in_gesprek: 'In Gesprek',
                        active: 'Active'
                      }
                      return (
                        <label key={status} className="cursor-pointer group relative">
                          <input
                            className="peer sr-only"
                            name="status"
                            type="radio"
                            checked={isSelected}
                            onChange={() => setFormData({ ...formData, status })}
                          />
                          <div className={`h-10 px-5 rounded-full border transition-all flex items-center gap-2 ${
                            isSelected
                              ? 'bg-[#131b0d] border-[#131b0d] text-primary dark:bg-primary dark:border-primary dark:text-[#131b0d]'
                              : 'border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-[#23311b]'
                          }`}>
                            <span className={`w-2 h-2 rounded-full ${
                              isSelected ? 'bg-primary dark:bg-[#131b0d]' : 'bg-gray-400'
                            }`}></span>
                            <span className="text-sm font-bold">{labels[status]}</span>
                          </div>
                        </label>
                      )
                    })}
                  </div>
                </div>
                {/* Opportunity/Focus */}
                <div className="flex flex-col gap-2 mb-5">
                  <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Opportunity / Focus</label>
                  <textarea
                    className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] min-h-[100px] placeholder:text-[#6e9a4c]/70 p-4 text-base font-normal transition-all resize-y"
                    placeholder="Describe the focus of this partnership opportunity..."
                    value={opportunity}
                    onChange={(e) => setOpportunity(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
                  {/* Potential Value */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Potential Value</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e9a4c] font-bold">€</span>
                      <input
                        className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 pl-10 pr-4 text-base font-normal transition-all"
                        placeholder="0.00"
                        type="number"
                        value={formData.annual_value || ''}
                        onChange={(e) => setFormData({ ...formData, annual_value: parseFloat(e.target.value) || 0 })}
                      />
                    </div>
                  </div>
                  {/* Owner */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Owner</label>
                    <div className="relative">
                      <select
                        className="form-select flex w-full appearance-none rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 px-4 text-base font-normal transition-all cursor-pointer"
                        value={formData.owner_id || 'me'}
                        onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                      >
                        <option value="me">Me</option>
                        <option value="sarah">Sarah Jansen</option>
                        <option value="mark">Mark de Vries</option>
                      </select>
                      <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#6e9a4c]">expand_more</span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* Next Action */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Next Action</label>
                    <input
                      className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 placeholder:text-[#6e9a4c]/70 px-4 text-base font-normal transition-all"
                      placeholder="e.g. Schedule introduction call"
                      type="text"
                      value={formData.next_action || ''}
                      onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                    />
                  </div>
                  {/* Next Action Date */}
                  <div className="flex flex-col gap-2">
                    <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Next Action Date</label>
                    <div className="relative">
                      <input
                        className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] h-12 px-4 text-base font-normal transition-all"
                        type="date"
                        value={formData.next_action_date ? formData.next_action_date.split('T')[0] : ''}
                        onChange={(e) => setFormData({ ...formData, next_action_date: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Section: Additional Details */}
              <section>
                <h3 className="text-[#131b0d] dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-4 border-t border-[#dae7cf] dark:border-[#2d3b24] pt-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">feed</span>
                  Additional Details
                </h3>
                {/* Tags */}
                <div className="flex flex-col gap-2 mb-5">
                  <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Tags</label>
                  <div className="flex w-full min-h-[52px] rounded-lg border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] p-2 flex-wrap gap-2 items-center focus-within:ring-2 focus-within:ring-primary/50 focus-within:border-primary">
                    {tags.map((tag, index) => (
                      <div
                        key={index}
                        className="bg-[#131b0d] text-primary dark:bg-primary dark:text-[#131b0d] h-8 px-3 rounded flex items-center gap-1 text-sm font-medium"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => handleRemoveTag(tag)}
                          className="hover:text-white dark:hover:text-white transition-colors"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    ))}
                    <input
                      className="flex-1 min-w-[120px] bg-transparent outline-none text-[#131b0d] dark:text-white placeholder:text-[#6e9a4c]/70 text-base h-8 px-1"
                      placeholder="Add a tag..."
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                  </div>
                </div>
                {/* Notes */}
                <div className="flex flex-col gap-2 mb-5">
                  <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Notes</label>
                  <textarea
                    className="form-input flex w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] min-h-[100px] placeholder:text-[#6e9a4c]/70 p-4 text-base font-normal transition-all resize-y"
                    placeholder="Any additional internal notes..."
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  />
                </div>
                {/* Upload Documents */}
                <div className="flex flex-col gap-2">
                  <label className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-medium leading-normal">Upload Documents</label>
                  <div className="group border-2 border-dashed border-[#dae7cf] dark:border-[#3a4b30] bg-[#fafcf8] dark:bg-[#151c10] rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 dark:hover:bg-[#1e2a16] transition-all">
                    <div className="w-12 h-12 rounded-full bg-[#dae7cf]/30 dark:bg-[#2d3b24] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                      <span className="material-symbols-outlined text-[#6e9a4c] dark:text-primary text-[24px]">cloud_upload</span>
                    </div>
                    <p className="text-[#131b0d] dark:text-white font-medium text-sm">Click to upload or drag and drop</p>
                    <p className="text-gray-500 text-xs mt-1">PDF, Word, or Excel (max 10MB)</p>
                  </div>
                </div>
              </section>

            </form>
          </div>

          {/* Footer Actions */}
          <div className="shrink-0 px-8 py-5 border-t border-[#dae7cf] dark:border-[#2d3b24] bg-white dark:bg-[#1e2a16] rounded-b-xl flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
            <button
              onClick={handleClose}
              className="text-[#131b0d] dark:text-[#e0e0e0] text-sm font-bold hover:text-red-500 dark:hover:text-red-400 transition-colors px-2"
            >
              Cancel
            </button>
            <div className="flex gap-3 w-full sm:w-auto">
              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={createPartner.isPending}
                className="flex-1 sm:flex-none px-6 py-3 rounded-lg border border-[#dae7cf] dark:border-[#3a4b30] text-[#131b0d] dark:text-white font-bold text-sm hover:bg-gray-50 dark:hover:bg-[#2d3b24] transition-colors focus:ring-2 focus:ring-gray-200 disabled:opacity-50"
              >
                Save as Draft
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={createPartner.isPending}
                className="flex-1 sm:flex-none px-6 py-3 rounded-lg bg-primary hover:bg-[#65d312] text-[#131b0d] font-bold text-sm shadow-sm transition-colors flex items-center justify-center gap-2 focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px] font-bold">check</span>
                Add Partner
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}
