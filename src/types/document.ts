export interface Document {
  id: string
  title: string
  type: 'doc' | 'sheet' | 'slide' | 'pdf'
  document_mode?: 'text' | 'file' // 'text' for Tip-Tap documents, 'file' for uploaded files
  folder?: string | null
  folder_id?: string | null
  status?: 'draft' | 'published' | 'archived' | 'all'
  last_edited?: string
  owner_id: string
  owner?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  last_edited_by?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  last_edited_by_id?: string
  collaborators?: {
    id: string
    full_name: string
    avatar_url?: string
  }[]
  comment_count?: number
  view_count?: number
  
  // Text document fields
  content?: any // Tip-Tap JSON content
  
  // File document fields (NEW)
  file_name?: string
  file_size?: number
  file_type?: string
  file_url?: string
  file_path?: string
  
  is_favorite?: boolean
  created_at: string
  updated_at: string
}

