'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCreateContract } from '@/hooks/useContracts'
import { usePartners } from '@/hooks/usePartners'
import type { ContractParty, Contract } from '@/types'

export default function NewContractPage() {
  const router = useRouter()
  const createContract = useCreateContract()
  const { data: partners } = usePartners()

  const [formData, setFormData] = useState({
    name: '',
    type: '' as 'partnership' | 'service' | 'employment' | 'nda' | 'other' | '',
    status: 'draft' as 'draft' | 'active',
    start_date: '',
    end_date: '',
    value: '',
    currency: 'usd' as 'usd' | 'eur' | 'gbp' | 'idr',
    auto_renewal: true,
    renewal_notice_days: '30',
    related_partner_id: '',
    notes: '',
  })

  const [parties, setParties] = useState<ContractParty[]>([
    { name: 'Konsensi Internal', role: 'employee', email: 'admin@konsensi.com' },
    { name: '', role: 'client', email: '' },
  ])

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePartyChange = (index: number, field: keyof ContractParty, value: string) => {
    setParties((prev) => {
      const updated = [...prev]
      updated[index] = { ...updated[index], [field]: value }
      return updated
    })
  }

  const handleAddParty = () => {
    setParties((prev) => [...prev, { name: '', role: 'client', email: '' }])
  }

  const handleRemoveParty = (index: number) => {
    setParties((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.type || !formData.start_date) {
      alert('Please fill in all required fields')
      return
    }

    try {
      await createContract.mutateAsync({
        name: formData.name,
        type: formData.type as Contract['type'],
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date || undefined,
        value: formData.value ? parseFloat(formData.value) : undefined,
        currency: formData.currency,
        parties: parties.filter((p) => p.name && p.email),
        auto_renewal: formData.auto_renewal,
        renewal_notice_days: formData.renewal_notice_days ? parseInt(formData.renewal_notice_days) : undefined,
        related_partner_id: formData.related_partner_id || undefined,
        notes: formData.notes || undefined,
        owner_id: '', // Will be set by the hook
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
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Modal Container */}
      <div className="relative w-full max-w-[960px] h-[90vh] bg-card-light dark:bg-card-dark rounded-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark shrink-0 z-20">
          <h2 className="text-xl font-bold text-[#131b0d] dark:text-[#f0f2ef] tracking-tight">Add New Contract</h2>
          <button
            onClick={handleCancel}
            className="text-[#6e9a4c] hover:text-[#131b0d] dark:hover:text-white transition-colors p-2 rounded-full hover:bg-background-light dark:hover:bg-background-dark"
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
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 bg-[#fafcf8] dark:bg-[#1e2a15] custom-scrollbar">
          {/* Primary Details Form (2 Columns) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-5">
              {/* Contract Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Contract Name</label>
                <input
                  className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark px-4 text-[#131b0d] dark:text-[#f0f2ef] placeholder:text-[#6e9a4c] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                  placeholder="Enter contract name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  required
                />
              </div>

              {/* Type */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Type</label>
                <div className="relative">
                  <select
                    className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark px-4 text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all cursor-pointer"
                    value={formData.type}
                    onChange={(e) => handleChange('type', e.target.value)}
                    required
                  >
                    <option disabled value="">
                      Select type
                    </option>
                    <option value="partnership">Partnership</option>
                    <option value="service">Service</option>
                    <option value="employment">Employment</option>
                    <option value="nda">NDA</option>
                    <option value="other">Other</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e9a4c] pointer-events-none"
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

              {/* Status */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Status</label>
                <div className="relative">
                  <select
                    className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark px-4 text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none transition-all cursor-pointer"
                    value={formData.status}
                    onChange={(e) => handleChange('status', e.target.value)}
                  >
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e9a4c] pointer-events-none"
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

            {/* Right Column */}
            <div className="space-y-5">
              {/* Start Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Start Date</label>
                <div className="relative">
                  <input
                    className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark pl-4 pr-10 text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                    style={{ colorScheme: 'light dark' }}
                    type="date"
                    value={formData.start_date}
                    onChange={(e) => handleChange('start_date', e.target.value)}
                    required
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e9a4c] pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    />
                  </svg>
                </div>
              </div>

              {/* End Date */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">End Date</label>
                <div className="relative">
                  <input
                    className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark pl-4 pr-10 text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all cursor-pointer"
                    style={{ colorScheme: 'light dark' }}
                    type="date"
                    value={formData.end_date}
                    onChange={(e) => handleChange('end_date', e.target.value)}
                  />
                  <svg
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e9a4c] pointer-events-none"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    />
                  </svg>
                </div>
              </div>

              {/* Contract Value */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Contract Value</label>
                <div className="flex rounded-lg overflow-hidden border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all">
                  <div className="relative w-24 border-r border-[#dae7cf] dark:border-[#36452a] bg-background-light dark:bg-background-dark">
                    <select
                      className="w-full h-12 bg-transparent text-[#131b0d] dark:text-[#f0f2ef] pl-3 pr-6 text-sm outline-none appearance-none cursor-pointer font-medium"
                      value={formData.currency}
                      onChange={(e) => handleChange('currency', e.target.value)}
                    >
                      <option value="usd">USD</option>
                      <option value="eur">EUR</option>
                      <option value="gbp">GBP</option>
                      <option value="idr">IDR</option>
                    </select>
                    <svg
                      className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6e9a4c] pointer-events-none"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      />
                    </svg>
                  </div>
                  <input
                    className="flex-1 h-12 bg-transparent px-4 text-[#131b0d] dark:text-[#f0f2ef] placeholder:text-[#6e9a4c] outline-none"
                    placeholder="0.00"
                    type="number"
                    step="0.01"
                    value={formData.value}
                    onChange={(e) => handleChange('value', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#dae7cf] dark:bg-[#36452a]"></div>

          {/* Parties Involved Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-[#131b0d] dark:text-[#f0f2ef] text-lg font-bold">Parties Involved</h3>
              <button
                type="button"
                onClick={handleAddParty}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-primary hover:text-white border border-primary hover:bg-primary rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                </svg>
                Add Party
              </button>
            </div>

            {/* Party Cards Container */}
            <div className="space-y-4">
              {parties.map((party, index) => (
                <div
                  key={index}
                  className="bg-card-light dark:bg-card-dark border border-[#dae7cf] dark:border-[#36452a] rounded-xl p-5 shadow-sm relative group"
                >
                  {/* Remove Button */}
                  <button
                    type="button"
                    onClick={() => handleRemoveParty(index)}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition-colors p-1"
                    title="Remove Party"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      />
                    </svg>
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pr-8">
                    {/* Party Name */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#131b0d] dark:text-[#f0f2ef] text-xs font-semibold uppercase tracking-wider">
                        Party Name
                      </label>
                      <input
                        className="w-full h-10 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-[#fafcf8] dark:bg-[#1e2a15] px-3 text-sm text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        type="text"
                        value={party.name}
                        onChange={(e) => handlePartyChange(index, 'name', e.target.value)}
                        placeholder="e.g. Acme Corp"
                      />
                    </div>

                    {/* Role */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#131b0d] dark:text-[#f0f2ef] text-xs font-semibold uppercase tracking-wider">Role</label>
                      <div className="relative">
                        <select
                          className="w-full h-10 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-[#fafcf8] dark:bg-[#1e2a15] px-3 text-sm text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none"
                          value={party.role}
                          onChange={(e) => handlePartyChange(index, 'role', e.target.value)}
                        >
                          <option value="client">Client</option>
                          <option value="vendor">Vendor</option>
                          <option value="partner">Partner</option>
                          <option value="employee">Employee</option>
                        </select>
                        <svg
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e9a4c] pointer-events-none"
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

                    {/* Contact Email */}
                    <div className="flex flex-col gap-1.5">
                      <label className="text-[#131b0d] dark:text-[#f0f2ef] text-xs font-semibold uppercase tracking-wider">
                        Contact Email
                      </label>
                      <input
                        className="w-full h-10 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-[#fafcf8] dark:bg-[#1e2a15] px-3 text-sm text-[#131b0d] dark:text-[#f0f2ef] placeholder:text-[#6e9a4c] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                        placeholder="contact@email.com"
                        type="email"
                        value={party.email}
                        onChange={(e) => handlePartyChange(index, 'email', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-[#dae7cf] dark:bg-[#36452a]"></div>

          {/* Renewal & Related Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Renewal Section */}
            <div className="space-y-5">
              <h3 className="text-[#131b0d] dark:text-[#f0f2ef] text-lg font-bold">Renewal Details</h3>

              {/* Toggle Switch */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-card-light dark:bg-card-dark border border-[#dae7cf] dark:border-[#36452a]">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-[#131b0d] dark:text-[#f0f2ef]">Auto Renewal</span>
                  <span className="text-xs text-[#6e9a4c]">Automatically renew when expired</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.auto_renewal}
                    onChange={(e) => handleChange('auto_renewal', e.target.checked)}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/20 dark:peer-focus:ring-primary/30 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              {/* Notice Days */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Renewal Notice Days</label>
                <input
                  className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark px-4 text-[#131b0d] dark:text-[#f0f2ef] placeholder:text-[#6e9a4c] focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  type="number"
                  value={formData.renewal_notice_days}
                  onChange={(e) => handleChange('renewal_notice_days', e.target.value)}
                />
              </div>
            </div>

            {/* Related Section */}
            <div className="space-y-5">
              <h3 className="text-[#131b0d] dark:text-[#f0f2ef] text-lg font-bold">Related Info</h3>

              {/* Related Partner */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">
                  Related Partner <span className="text-[#6e9a4c] font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <select
                    className="w-full h-12 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark px-4 text-[#131b0d] dark:text-[#f0f2ef] focus:border-primary focus:ring-1 focus:ring-primary outline-none appearance-none cursor-pointer"
                    value={formData.related_partner_id}
                    onChange={(e) => handleChange('related_partner_id', e.target.value)}
                  >
                    <option value="">None</option>
                    {partners?.map((partner) => (
                      <option key={partner.id} value={partner.id}>
                        {partner.name}
                      </option>
                    ))}
                  </select>
                  <svg
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6e9a4c] pointer-events-none"
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

              {/* File Upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Upload Document</label>
                <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-[#dae7cf] dark:border-[#36452a] rounded-lg cursor-pointer bg-card-light hover:bg-background-light dark:bg-card-dark dark:hover:bg-[#2a3820] transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-8 h-8 text-primary mb-2" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M5.5 13a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 13H11V9.413l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13H5.5z" />
                      <path d="M9 13h2v5a1 1 0 11-2 0v-5z" />
                    </svg>
                    <p className="mb-1 text-sm text-[#131b0d] dark:text-[#f0f2ef] font-medium">Click to upload</p>
                    <p className="text-xs text-[#6e9a4c]">PDF, DOCX (MAX. 10MB)</p>
                  </div>
                  <input className="hidden" type="file" accept=".pdf,.doc,.docx" />
                </label>
              </div>
            </div>
          </div>

          {/* Notes (Full Width) */}
          <div className="flex flex-col gap-1.5 pb-2">
            <label className="text-[#131b0d] dark:text-[#f0f2ef] text-sm font-medium">Notes</label>
            <textarea
              className="w-full p-4 rounded-lg border border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark text-[#131b0d] dark:text-[#f0f2ef] placeholder:text-[#6e9a4c] focus:border-primary focus:ring-1 focus:ring-primary outline-none min-h-[100px] resize-y"
              placeholder="Add any additional context or notes regarding this contract..."
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
            ></textarea>
          </div>
        </form>

        {/* Modal Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-[#dae7cf] dark:border-[#36452a] bg-card-light dark:bg-card-dark shrink-0 z-20">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 h-12 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-[#131b0d] dark:text-[#f0f2ef] font-semibold text-sm transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={createContract.isPending}
            className="px-6 h-12 rounded-lg bg-primary hover:bg-primary-hover text-white font-semibold text-sm shadow-md shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
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

