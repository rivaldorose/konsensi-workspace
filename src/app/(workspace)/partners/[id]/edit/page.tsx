'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { usePartner, useUpdatePartner, useDeletePartner } from '@/hooks/usePartners'
import { useUsers } from '@/hooks/useUsers'
import type { Partner } from '@/types'

export default function EditPartnerPage() {
  const router = useRouter()
  const params = useParams()
  const partnerId = params.id as string
  
  const { data: partner, isLoading } = usePartner(partnerId)
  const updatePartner = useUpdatePartner()
  const deletePartner = useDeletePartner()
  const { data: users = [] } = useUsers()
  
  const [activeTab, setActiveTab] = useState('basic')
  const [formData, setFormData] = useState<Partial<Partner>>({})
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (partner) {
      setFormData(partner)
      setTags(partner.tags || [])
    }
  }, [partner])

  const handleClose = () => {
    router.push('/partners')
  }

  const handleSave = async () => {
    if (!partnerId) return
    
    // Ensure required fields are present
    if (!formData.name?.trim()) {
      alert('Partner Name is required')
      return
    }
    
    // Build updates object - only include fields that are actually being updated
    const cleanedUpdates: any = {}
    
    // Required fields
    if (formData.name !== undefined) cleanedUpdates.name = formData.name.trim()
    if (formData.type !== undefined) cleanedUpdates.type = formData.type || 'client'
    if (formData.sector !== undefined) cleanedUpdates.sector = formData.sector?.trim() || 'General'
    if (formData.status !== undefined) cleanedUpdates.status = formData.status || 'active'
    if (formData.contact_name !== undefined) cleanedUpdates.contact_name = formData.contact_name?.trim() || ''
    
    // Owner ID
    if (formData.owner_id !== undefined) cleanedUpdates.owner_id = formData.owner_id
    
    // Date fields - convert YYYY-MM-DD to ISO strings
    if (formData.partnership_start !== undefined && formData.partnership_start !== '') {
      const dateStr = formData.partnership_start
      if (!dateStr.includes('T')) {
        // Convert YYYY-MM-DD to ISO string
        cleanedUpdates.partnership_start = new Date(dateStr + 'T00:00:00').toISOString()
      } else {
        cleanedUpdates.partnership_start = dateStr
      }
    } else if (formData.partnership_start === '') {
      // Empty string means clear the field - set to null
      cleanedUpdates.partnership_start = null
    }
    
    if (formData.contract_end !== undefined && formData.contract_end !== '') {
      const dateStr = formData.contract_end
      if (!dateStr.includes('T')) {
        cleanedUpdates.contract_end = new Date(dateStr + 'T00:00:00').toISOString()
      } else {
        cleanedUpdates.contract_end = dateStr
      }
    } else if (formData.contract_end === '') {
      cleanedUpdates.contract_end = null
    }
    
    if (formData.next_action_date !== undefined && formData.next_action_date !== '') {
      const dateStr = formData.next_action_date
      if (!dateStr.includes('T')) {
        cleanedUpdates.next_action_date = new Date(dateStr + 'T00:00:00').toISOString()
      } else {
        cleanedUpdates.next_action_date = dateStr
      }
    } else if (formData.next_action_date === '') {
      cleanedUpdates.next_action_date = null
    }
    
    // Contact fields - convert empty strings to null
    if (formData.contact_email !== undefined) {
      cleanedUpdates.contact_email = formData.contact_email?.trim() || null
    }
    if (formData.contact_phone !== undefined) {
      cleanedUpdates.contact_phone = formData.contact_phone?.trim() || null
    }
    
    // Other fields
    if (formData.annual_value !== undefined) cleanedUpdates.annual_value = formData.annual_value || 0
    if (formData.next_action !== undefined) cleanedUpdates.next_action = formData.next_action?.trim() || ''
    if (formData.notes !== undefined) cleanedUpdates.notes = formData.notes?.trim() || ''
    if (tags !== undefined) cleanedUpdates.tags = tags
    
    try {
      await updatePartner.mutateAsync({
        id: partnerId,
        updates: cleanedUpdates
      })
      router.push('/partners')
    } catch (error: any) {
      console.error('Failed to save partner:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      console.error('Updates being sent:', JSON.stringify(cleanedUpdates, null, 2))
      
      let errorMessage = 'Unknown error'
      if (error?.message) {
        errorMessage = error.message
      } else if (error?.details) {
        errorMessage = typeof error.details === 'string' 
          ? error.details 
          : error.details[0]?.message || JSON.stringify(error.details)
      } else if (error?.hint) {
        errorMessage = error.hint
      }
      
      alert(`Failed to save partner:\n\n${errorMessage}\n\nCheck console for more details (F12)`)
    }
  }

  const handleSaveAndClose = async () => {
    await handleSave()
  }

  const handleDelete = () => {
    router.push(`/partners/${partnerId}/delete`)
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

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1a2016] rounded-xl p-8">
          <div className="animate-pulse">Loading...</div>
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 flex items-center justify-center">
        <div className="bg-white dark:bg-[#1a2016] rounded-xl p-8">
          <p>Partner not found</p>
          <button onClick={handleClose} className="mt-4 text-primary">Go back</button>
        </div>
      </div>
    )
  }

  const tabs = [
    { id: 'basic', label: 'Basic Info' },
    { id: 'contact', label: 'Contact' },
    { id: 'status', label: 'Status' },
    { id: 'documents', label: 'Documents' },
    { id: 'activity', label: 'Activity' },
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="relative w-full max-w-5xl h-[90vh] bg-[#fafcf8] dark:bg-[#1a2016] rounded-xl shadow-2xl flex flex-col overflow-hidden border border-[#dae7cf] dark:border-[#2a3820]">
          
          {/* Header */}
          <div className="flex items-center justify-between px-8 py-5 border-b border-[#dae7cf] dark:border-[#2a3820] bg-white dark:bg-[#1a2016]">
            <h2 className="text-[#131b0d] dark:text-white text-[24px] font-bold leading-tight">
              Edit Partner - {formData.name || partner.name}
            </h2>
            <button 
              onClick={handleClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-[#2a3820] transition-colors text-gray-500 hover:text-red-500"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="px-8 bg-white dark:bg-[#1a2016] border-b border-[#dae7cf] dark:border-[#2a3820]">
            <div className="flex gap-8 overflow-x-auto no-scrollbar">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-center border-b-[3px] pb-[13px] pt-4 px-2 cursor-pointer transition-colors ${
                      isActive
                        ? 'border-b-primary text-text-dark dark:text-white'
                        : 'border-b-transparent hover:border-b-primary/30 text-[#6e9a4c] dark:text-[#8ba675] hover:text-text-dark dark:hover:text-white'
                    }`}
                  >
                    <p className="text-sm font-bold leading-normal tracking-[0.015em]">{tab.label}</p>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Main Content Area (Scrollable) */}
          <div className="flex-1 overflow-y-auto bg-[#fafcf8] dark:bg-[#131810]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
              
              {/* Left Column: Forms */}
              <div className="lg:col-span-2 space-y-8">
                
                {/* Basic Info Tab */}
                {activeTab === 'basic' && (
                  <>
                    {/* General Information */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-text-dark dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                        General Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Partner Name*</p>
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            value={formData.name || ''}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          />
                        </label>
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Type*</p>
                          <div className="relative">
                            <select
                              className="form-select w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal appearance-none"
                              value={formData.type || 'client'}
                              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                            >
                              <option value="vendor">Vendor</option>
                              <option value="client">Client</option>
                              <option value="partner">Strategic Partner</option>
                            </select>
                            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </label>
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Sector/Industry</p>
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            value={formData.sector || ''}
                            onChange={(e) => setFormData({ ...formData, sector: e.target.value })}
                          />
                        </label>
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Owner</p>
                          <div className="relative">
                            <select
                              className="form-select w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal appearance-none"
                              value={formData.owner_id || ''}
                              onChange={(e) => setFormData({ ...formData, owner_id: e.target.value })}
                            >
                              {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.full_name || user.email}
                                </option>
                              ))}
                            </select>
                            <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                        </label>
                      </div>
                    </div>

                    <hr className="border-[#dae7cf] dark:border-[#2a3820]" />

                    {/* Agreement Details */}
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold text-text-dark dark:text-white flex items-center gap-2">
                        <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Agreement Details
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Partnership Start</p>
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            type="date"
                            value={formData.partnership_start ? formData.partnership_start.split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, partnership_start: e.target.value })}
                          />
                        </label>
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Contract End</p>
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            type="date"
                            value={formData.contract_end ? formData.contract_end.split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, contract_end: e.target.value })}
                          />
                        </label>
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Annual Value (€)</p>
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            type="number"
                            value={formData.annual_value || ''}
                            onChange={(e) => setFormData({ ...formData, annual_value: parseFloat(e.target.value) || 0 })}
                          />
                        </label>
                        <label className="flex flex-col flex-1">
                          <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Tags</p>
                          <div className="w-full rounded-lg border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] min-h-12 px-2 py-2 flex items-center gap-2 flex-wrap">
                            {tags.map((tag, index) => (
                              <span
                                key={index}
                                className="bg-primary/20 text-text-dark dark:text-white text-xs px-2 py-1 rounded-full whitespace-nowrap flex items-center gap-1"
                              >
                                #{tag}
                                <button
                                  onClick={() => handleRemoveTag(tag)}
                                  className="hover:text-red-500"
                                >
                                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </span>
                            ))}
                            <input
                              className="flex-1 min-w-[50px] bg-transparent focus:outline-none text-base text-[#131b0d] dark:text-white placeholder:text-[#6e9a4c]/60"
                              placeholder="Add tag..."
                              value={newTag}
                              onChange={(e) => setNewTag(e.target.value)}
                              onKeyDown={handleAddTag}
                            />
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-4">
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Notes</p>
                        <textarea
                          className="form-textarea w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] min-h-[120px] p-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60 resize-none"
                          value={formData.notes || ''}
                          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                      </label>
                    </div>
                  </>
                )}

                {/* Contact Tab */}
                {activeTab === 'contact' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text-dark dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      Primary Contact
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Contact Name*</p>
                        <input
                          className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                          value={formData.contact_name || ''}
                          onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                        />
                      </label>
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Email*</p>
                        <div className="relative">
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 pl-10 pr-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            type="email"
                            value={formData.contact_email || ''}
                            onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                          />
                          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                      </label>
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Phone</p>
                        <div className="relative">
                          <input
                            className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 pl-10 pr-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                            type="tel"
                            value={formData.contact_phone || ''}
                            onChange={(e) => setFormData({ ...formData, contact_phone: e.target.value })}
                          />
                          <svg className="absolute left-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                        </div>
                      </label>
                    </div>
                  </div>
                )}

                {/* Status Tab */}
                {activeTab === 'status' && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-text-dark dark:text-white flex items-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      Status & Tracking
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Status*</p>
                        <div className="relative">
                          <select
                            className="form-select w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal appearance-none"
                            value={formData.status || 'active'}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value as Partner['status'] })}
                          >
                            <option value="to_contact">To Contact</option>
                            <option value="in_gesprek">In Gesprek</option>
                            <option value="active">Active</option>
                            <option value="paused">Paused</option>
                          </select>
                          <svg className="absolute right-4 top-3.5 w-5 h-5 text-gray-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </label>
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Next Action</p>
                        <input
                          className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                          value={formData.next_action || ''}
                          onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                        />
                      </label>
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Due Date</p>
                        <input
                          className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-12 px-4 text-base font-normal leading-normal placeholder:text-[#6e9a4c]/60"
                          type="date"
                          value={formData.next_action_date ? formData.next_action_date.split('T')[0] : ''}
                          onChange={(e) => setFormData({ ...formData, next_action_date: e.target.value })}
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Documents & Activity tabs - placeholder */}
                {(activeTab === 'documents' || activeTab === 'activity') && (
                  <div className="text-center py-12 text-gray-500">
                    <p>{activeTab === 'documents' ? 'Documents' : 'Activity'} section coming soon</p>
                  </div>
                )}

              </div>

              {/* Right Column: Status & Activity */}
              <div className="space-y-8">
                
                {/* Status Management Card */}
                <div className="bg-white dark:bg-[#1a2016] rounded-xl border border-[#dae7cf] dark:border-[#2a3820] p-5 shadow-sm">
                  <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">Status & Tracking</h4>
                  <div className="space-y-5">
                    <div>
                      <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-3">Current Status</p>
                      <div className="flex gap-3 flex-wrap">
                        {['to_contact', 'in_gesprek', 'active', 'paused'].map((status) => {
                          const isSelected = formData.status === status
                          return (
                            <label key={status} className="cursor-pointer">
                              <input
                                className="peer sr-only"
                                name="status"
                                type="radio"
                                checked={isSelected}
                                onChange={() => setFormData({ ...formData, status: status as Partner['status'] })}
                              />
                              <div className={`px-4 py-2 rounded-lg border transition-all text-sm font-medium ${
                                isSelected
                                  ? status === 'active'
                                    ? 'bg-primary/20 border-primary text-text-dark dark:text-white'
                                    : status === 'in_gesprek'
                                    ? 'bg-yellow-100 border-yellow-400 text-yellow-900 dark:bg-yellow-900/20 dark:border-yellow-400 dark:text-yellow-300'
                                    : status === 'to_contact'
                                    ? 'bg-blue-100 border-blue-400 text-blue-900 dark:bg-blue-900/20 dark:border-blue-400 dark:text-blue-300'
                                    : 'bg-gray-200 border-gray-400 text-gray-900 dark:bg-gray-700 dark:border-gray-500 dark:text-gray-300'
                                  : 'border-[#dae7cf] dark:border-[#2a3820] bg-gray-50 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10'
                              }`}>
                                {status === 'active' ? 'Active' : status === 'in_gesprek' ? 'In Gesprek' : status === 'to_contact' ? 'To Contact' : 'Paused'}
                              </div>
                            </label>
                          )
                        })}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 gap-4">
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Next Action</p>
                        <input
                          className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-10 px-3 text-sm font-normal leading-normal"
                          value={formData.next_action || ''}
                          onChange={(e) => setFormData({ ...formData, next_action: e.target.value })}
                        />
                      </label>
                      <label className="flex flex-col flex-1">
                        <p className="text-[#131b0d] dark:text-[#e4e8e1] text-sm font-medium leading-normal pb-2">Due Date</p>
                        <input
                          className="form-input w-full rounded-lg text-[#131b0d] dark:text-white focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-[#dae7cf] dark:border-[#3a4d2c] bg-white dark:bg-[#1a2016] h-10 px-3 text-sm font-normal leading-normal"
                          type="date"
                          value={formData.next_action_date ? formData.next_action_date.split('T')[0] : ''}
                          onChange={(e) => setFormData({ ...formData, next_action_date: e.target.value })}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Activity History Card */}
                <div className="bg-white dark:bg-[#1a2016] rounded-xl border border-[#dae7cf] dark:border-[#2a3820] p-5 shadow-sm flex flex-col h-fit">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Activity History</h4>
                    <button className="text-xs font-bold text-primary hover:text-green-600 dark:hover:text-green-400">View Full</button>
                  </div>
                  <div className="relative pl-2 border-l border-gray-200 dark:border-gray-700 space-y-6">
                    <div className="relative pl-4">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white dark:border-[#1a2016]"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-0.5">Today, 10:23 AM</span>
                        <p className="text-sm text-text-dark dark:text-white font-medium">Updated Contract Value</p>
                        <span className="text-xs text-gray-500">Changed from €42k to €45k</span>
                      </div>
                    </div>
                    <div className="relative pl-4">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#1a2016]"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-0.5">Oct 24, 2023</span>
                        <p className="text-sm text-text-dark dark:text-white font-medium">Email Sent: Q4 Strategy</p>
                        <span className="text-xs text-gray-500">Sent by Julia S.</span>
                      </div>
                    </div>
                    <div className="relative pl-4">
                      <div className="absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full bg-gray-300 dark:bg-gray-600 border-2 border-white dark:border-[#1a2016]"></div>
                      <div className="flex flex-col">
                        <span className="text-xs text-gray-400 mb-0.5">Oct 15, 2023</span>
                        <p className="text-sm text-text-dark dark:text-white font-medium">Meeting: Renewal Discussion</p>
                        <span className="text-xs text-gray-500">Logged via Calendar</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* Footer / Action Bar */}
          <div className="flex items-center justify-between px-8 py-5 border-t border-[#dae7cf] dark:border-[#2a3820] bg-white dark:bg-[#1a2016]">
            <button
              onClick={handleDelete}
              className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-bold flex items-center gap-1"
            >
              <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Delete Partner
            </button>
            <div className="flex gap-4">
              <button
                onClick={handleClose}
                className="h-10 px-6 rounded-lg border border-transparent hover:bg-gray-100 dark:hover:bg-white/10 text-gray-600 dark:text-gray-300 text-sm font-bold transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="h-10 px-6 rounded-lg border border-[#dae7cf] dark:border-[#3a4d2c] hover:border-primary text-text-dark dark:text-white text-sm font-bold transition-colors"
              >
                Save Changes
              </button>
              <button
                onClick={handleSaveAndClose}
                className="h-10 px-6 rounded-lg bg-primary hover:bg-[#64d60f] text-[#131b0d] text-sm font-bold shadow-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Save & Close
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

