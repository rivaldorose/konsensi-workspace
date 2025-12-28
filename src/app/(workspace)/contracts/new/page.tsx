'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateContract } from '@/hooks/useContracts'
import { usePartners } from '@/hooks/usePartners'
import { useUsers } from '@/hooks/useUsers'
import type { ContractParty, Contract } from '@/types'

interface Milestone {
  date: string
  description: string
}

export default function NewContractPage() {
  const router = useRouter()
  const createContract = useCreateContract()
  const { data: partners } = usePartners()
  const { data: users } = useUsers()

  const [formData, setFormData] = useState({
    name: '',
    type: '' as Contract['type'] | '',
    status: 'active' as 'active' | 'pending' | 'expired' | 'review',
    annual_value: '',
    start_date: '',
    end_date: '',
    auto_renewal: false,
    related_partner_id: '',
    owner_id: '',
    key_terms: '',
    notes: '',
    tags: ['Urgent', 'Legal-Review'],
  })

  const [externalParties, setExternalParties] = useState<Array<{ name: string; email: string; role: string }>>([
    { name: '', email: '', role: '' },
  ])

  const [milestones, setMilestones] = useState<Milestone[]>([{ date: '', description: '' }])
  const [newTag, setNewTag] = useState('')

  const handleChange = (field: string, value: string | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleExternalPartyChange = (index: number, field: string, value: string) => {
    setExternalParties((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddParty = () => {
    setExternalParties((prev) => [...prev, { name: '', email: '', role: '' }])
  }

  const handleMilestoneChange = (index: number, field: keyof Milestone, value: string) => {
    setMilestones((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddMilestone = () => {
    setMilestones((prev) => [...prev, { date: '', description: '' }])
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newTag.trim()) {
      e.preventDefault()
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag('')
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type || !formData.start_date || !formData.end_date) {
      alert('Please fill in all required fields')
      return
    }

    try {
      const parties: ContractParty[] = [
        { name: 'Konsensi', role: 'employee', email: 'legal@konsensi.com' },
        ...externalParties
          .filter((p) => p.name && p.email)
          .map((p) => ({
            name: p.name,
            email: p.email,
            role: (p.role || 'client') as ContractParty['role'],
          })),
      ]

      await createContract.mutateAsync({
        name: formData.name,
        type: formData.type as Contract['type'],
        status: formData.status === 'pending' ? 'draft' : (formData.status as Contract['status']),
        start_date: formData.start_date,
        end_date: formData.end_date,
        value: formData.annual_value ? parseFloat(formData.annual_value) : undefined,
        currency: 'usd',
        parties,
        auto_renewal: formData.auto_renewal,
        related_partner_id: formData.related_partner_id || undefined,
        notes: formData.notes || formData.key_terms || undefined,
        owner_id: formData.owner_id || '',
      })

      router.push('/contracts')
    } catch (error) {
      console.error('Error creating contract:', error)
      alert('Failed to create contract')
    }
  }

  const handleCancel = () => {
    router.push('/contracts')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Modal Overlay Backdrop */}
      <div
        aria-hidden="true"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleCancel}
      ></div>

      {/* Modal Container */}
      <div className="relative z-50 flex flex-col w-full max-w-4xl max-h-[90vh] bg-[#fafcf8] dark:bg-[#182210] rounded-2xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-[#dae7cf] dark:border-[#2a3620] bg-[#fafcf8] dark:bg-[#182210] shrink-0 z-10">
          <h2 className="text-[#131b0d] dark:text-[#e0e6dd] text-2xl font-bold leading-tight tracking-tight">
            Add New Contract
          </h2>
          <button
            onClick={handleCancel}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-[#131b0d] dark:text-[#e0e6dd]"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar p-8 space-y-10">
          {/* Section 1: Contract Information */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                />
              </svg>
              <h3 className="text-lg font-bold text-[#131b0d] dark:text-[#e0e6dd]">Contract Information</h3>
            </div>

            {/* Row 1: Name */}
            <div className="flex flex-col">
              <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">
                Contract Name*
              </label>
              <input
                className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
                placeholder="e.g. Q3 Partnership Agreement - Acme Corp"
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Row 2: Type & Annual Value */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">Type*</label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd]"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  >
                    <option disabled value="">
                      Select contract type
                    </option>
                    <option value="partnership">Partnership Agreement</option>
                    <option value="service">Service Level Agreement (SLA)</option>
                    <option value="employment">Employment Contract</option>
                    <option value="other">Funding Grant</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">
                  Annual Value
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6e9a4c] font-medium">$</span>
                  <input
                    className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-8 pr-4 text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={formData.annual_value}
                    onChange={(e) => handleChange('annual_value', e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Status (Radio Group) */}
            <div className="flex flex-col">
              <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-3">Status*</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {(['active', 'pending', 'expired', 'review'] as const).map((status) => (
                  <label key={status} className="group cursor-pointer">
                    <input
                      className="peer sr-only"
                      name="status"
                      type="radio"
                      checked={formData.status === status}
                      onChange={() => handleChange('status', status)}
                    />
                    <div className="flex items-center justify-center gap-2 rounded-lg border border-[#dae7cf] dark:border-[#2a3620] p-3 transition-all peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:bg-gray-50 dark:hover:bg-white/5">
                      <div className={`w-2.5 h-2.5 rounded-full ${formData.status === status ? 'bg-primary' : 'bg-gray-300'}`}></div>
                      <span className="text-sm font-medium text-[#131b0d] dark:text-[#e0e6dd] capitalize">{status}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Row 4: Dates & Auto-renewal */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
              <div className="md:col-span-5 flex flex-col">
                <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">
                  Start Date*
                </label>
                <input
                  className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => handleChange('start_date', e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-5 flex flex-col">
                <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">End Date*</label>
                <input
                  className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => handleChange('end_date', e.target.value)}
                  required
                />
              </div>
              <div className="md:col-span-2 flex items-center h-12 pb-2">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    className="rounded border-[#dae7cf] text-primary focus:ring-primary h-5 w-5 bg-white dark:bg-[#1f2b16]"
                    type="checkbox"
                    checked={formData.auto_renewal}
                    onChange={(e) => handleChange('auto_renewal', e.target.checked)}
                  />
                  <span className="ml-2 text-sm text-[#131b0d] dark:text-[#e0e6dd]">Auto-renew</span>
                </label>
              </div>
            </div>

            {/* Row 5: Associations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">
                  Associated Partner/Client
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd]"
                    value={formData.related_partner_id}
                    onChange={(e) => handleChange('related_partner_id', e.target.value)}
                  >
                    <option disabled value="">
                      Select partner
                    </option>
                    {partners?.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col">
                <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">
                  Internal Owner
                </label>
                <div className="relative">
                  <select
                    className="w-full appearance-none rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd]"
                    value={formData.owner_id}
                    onChange={(e) => handleChange('owner_id', e.target.value)}
                  >
                    <option disabled value="">
                      Select owner
                    </option>
                    {users?.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </section>

          <hr className="border-[#dae7cf] dark:border-[#2a3620]" />

          {/* Section 2: Parties Involved */}
          <section className="space-y-6">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <h3 className="text-lg font-bold text-[#131b0d] dark:text-[#e0e6dd]">Parties Involved</h3>
            </div>

            {/* Konsensi Contact */}
            <div className="flex flex-col">
              <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal pb-2">
                Konsensi Contact
              </label>
              <input
                className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-gray-50 dark:bg-white/5 focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
                type="text"
                value="Legal Team (legal@konsensi.com)"
                readOnly
              />
            </div>

            {/* External Parties */}
            {externalParties.map((party, index) => (
              <div key={index} className="p-4 rounded-xl border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] space-y-4">
                <h4 className="text-sm font-semibold text-[#131b0d] dark:text-[#e0e6dd]">External Party {index + 1}</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex flex-col">
                    <input
                      className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-transparent focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3 text-sm text-[#131b0d] dark:text-[#e0e6dd]"
                      placeholder="Full Name"
                      type="text"
                      value={party.name}
                      onChange={(e) => handleExternalPartyChange(index, 'name', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-transparent focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3 text-sm text-[#131b0d] dark:text-[#e0e6dd]"
                      placeholder="Email Address"
                      type="email"
                      value={party.email}
                      onChange={(e) => handleExternalPartyChange(index, 'email', e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col">
                    <input
                      className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-transparent focus:border-primary focus:ring-1 focus:ring-primary h-11 px-3 text-sm text-[#131b0d] dark:text-[#e0e6dd]"
                      placeholder="Role (e.g. Signatory)"
                      type="text"
                      value={party.role}
                      onChange={(e) => handleExternalPartyChange(index, 'role', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddParty}
              className="flex items-center gap-2 text-primary hover:text-green-700 font-medium text-sm transition-colors w-fit"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
              </svg>
              Add Party
            </button>
          </section>

          <hr className="border-[#dae7cf] dark:border-[#2a3620]" />

          {/* Section 3: Key Terms */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                />
              </svg>
              <h3 className="text-lg font-bold text-[#131b0d] dark:text-[#e0e6dd]">Key Terms</h3>
            </div>
            <p className="text-sm text-[#6e9a4c]">Summarize the critical clauses, deliverables, or obligations.</p>
            <textarea
              className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary p-4 text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
              placeholder="• Term 1: ...&#10;• Term 2: ..."
              rows={5}
              value={formData.key_terms}
              onChange={(e) => handleChange('key_terms', e.target.value)}
            ></textarea>
          </section>

          <hr className="border-[#dae7cf] dark:border-[#2a3620]" />

          {/* Section 4: Documents */}
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              </svg>
              <h3 className="text-lg font-bold text-[#131b0d] dark:text-[#e0e6dd]">Documents</h3>
            </div>
            <label className="border-2 border-dashed border-[#dae7cf] dark:border-[#2a3620] rounded-xl bg-gray-50 dark:bg-white/5 p-8 flex flex-col items-center justify-center text-center hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer block">
              <svg className="w-10 h-10 text-[#6e9a4c] mb-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
              </svg>
              <p className="text-[#131b0d] dark:text-[#e0e6dd] font-medium">Click to upload or drag and drop</p>
              <p className="text-sm text-[#6e9a4c] mt-1">PDF, DOCX up to 10MB</p>
              <input className="hidden" type="file" accept=".pdf,.doc,.docx" />
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                className="flex items-center gap-2 text-primary hover:text-green-700 font-medium text-sm transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                  />
                </svg>
                Link Existing Document
              </button>
            </div>
          </section>

          <hr className="border-[#dae7cf] dark:border-[#2a3620]" />

          {/* Section 5: Milestones & Reminders */}
          <section className="space-y-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z"
                />
              </svg>
              <h3 className="text-lg font-bold text-[#131b0d] dark:text-[#e0e6dd]">Milestones &amp; Reminders</h3>
            </div>
            {milestones.map((milestone, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
                <div className="md:col-span-4">
                  <label className="text-xs font-semibold text-[#6e9a4c] uppercase tracking-wider">Date</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 text-sm text-[#131b0d] dark:text-[#e0e6dd]"
                    type="date"
                    value={milestone.date}
                    onChange={(e) => handleMilestoneChange(index, 'date', e.target.value)}
                  />
                </div>
                <div className="md:col-span-7">
                  <label className="text-xs font-semibold text-[#6e9a4c] uppercase tracking-wider">Description</label>
                  <input
                    className="mt-1 w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary h-10 px-3 text-sm text-[#131b0d] dark:text-[#e0e6dd]"
                    placeholder="e.g. First Draft Review"
                    type="text"
                    value={milestone.description}
                    onChange={(e) => handleMilestoneChange(index, 'description', e.target.value)}
                  />
                </div>
                <div className="md:col-span-1 flex justify-center pb-2">
                  <button
                    type="button"
                    onClick={() => handleRemoveMilestone(index)}
                    className="text-red-400 hover:text-red-600"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddMilestone}
              className="flex items-center gap-2 text-primary hover:text-green-700 font-medium text-sm transition-colors w-fit"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
              </svg>
              Add Milestone
            </button>
          </section>

          <hr className="border-[#dae7cf] dark:border-[#2a3620]" />

          {/* Section 6: Meta (Notes & Tags) */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-4">
            <div className="flex flex-col gap-2">
              <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal">
                Internal Notes
              </label>
              <textarea
                className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus:border-primary focus:ring-1 focus:ring-primary p-3 text-sm text-[#131b0d] dark:text-[#e0e6dd]"
                placeholder="Any private notes for the team..."
                rows={3}
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
              ></textarea>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[#131b0d] dark:text-[#e0e6dd] text-sm font-medium leading-normal">Tags</label>
              <div className="w-full rounded-lg border border-[#dae7cf] dark:border-[#2a3620] bg-white dark:bg-[#1f2b16] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary p-2 min-h-[5rem] flex flex-wrap gap-2 items-start content-start">
                {formData.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 rounded bg-primary/20 text-[#131b0d] dark:text-white text-xs font-medium"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 hover:text-primary"
                    >
                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
                <input
                  className="flex-1 min-w-[100px] bg-transparent border-none focus:ring-0 p-0 px-1 text-sm text-[#131b0d] dark:text-[#e0e6dd] placeholder:text-[#6e9a4c]"
                  placeholder="Type and hit enter..."
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                />
              </div>
            </div>
          </section>
        </form>

        {/* Modal Footer (Sticky) */}
        <div className="flex items-center justify-end gap-4 px-8 py-5 border-t border-[#dae7cf] dark:border-[#2a3620] bg-[#fafcf8] dark:bg-[#182210] shrink-0 z-10">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-3 rounded-lg border border-[#dae7cf] dark:border-[#2a3620] text-[#131b0d] dark:text-[#e0e6dd] font-bold text-sm hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createContract.isPending}
            className="px-6 py-3 rounded-lg bg-primary text-white font-bold text-sm shadow-md hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-4.5 h-4.5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
              />
            </svg>
            Create Contract
          </button>
        </div>
      </div>
    </div>
  )
}
