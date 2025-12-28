import type { User } from './user'

export interface ContractParty {
  name: string
  role: 'client' | 'vendor' | 'partner' | 'employee'
  email: string
}

export interface Contract {
  id: string
  name: string
  type: 'partnership' | 'service' | 'employment' | 'nda' | 'other'
  status: 'draft' | 'active' | 'expired' | 'terminated' | 'archived'
  start_date: string
  end_date?: string
  value?: number
  currency?: 'usd' | 'eur' | 'gbp' | 'idr'
  parties: ContractParty[]
  auto_renewal: boolean
  renewal_notice_days?: number
  related_partner_id?: string
  document_url?: string
  notes?: string
  owner_id: string
  owner?: User
  created_at: string
  updated_at: string
}

