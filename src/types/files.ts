export interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  mime_type?: string
  size?: number
  parent_id?: string | null
  file_url?: string
  storage_path?: string
  is_favorite: boolean
  created_by: string
  created_by_user?: {
    id: string
    email: string
    full_name?: string
    avatar_url?: string
  }
  created_at: string
  updated_at: string
}

export interface Folder {
  id: string
  name: string
  type: 'folder'
  parent_id?: string | null
  is_favorite: boolean
  created_by: string
  created_at: string
  updated_at: string
}

