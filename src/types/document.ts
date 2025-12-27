export interface Document {
  id: string
  title: string
  type: 'article' | 'description' | 'slideshow' | 'text_snippet' | 'gavel' | 'other'
  folder: string
  folder_id?: string
  status: 'favorite' | 'recent' | 'shared' | 'all'
  last_edited: string
  last_edited_by?: {
    id: string
    full_name: string
    avatar_url?: string
  }
  collaborators?: {
    id: string
    full_name: string
    avatar_url?: string
  }[]
  comment_count?: number
  view_count?: number
  created_at: string
  updated_at: string
  owner_id: string
}

