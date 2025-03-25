import { AuthUser } from './auth'

export interface Comment {
  id: number
  post_id: number
  user_id: number
  parent_id?: number
  content: string
  votes: number
  created_at: string
  updated_at: string
  is_deleted: boolean
  user: AuthUser
  replies?: Comment[]
  timeAgo?: string
}

export interface NewComment {
  post_id: number
  content: string
  parent_id?: number
}
