import { User } from './post'

export type NotificationType =
  | 'post_like'
  | 'comment'
  | 'follow'
  | 'mention'
  | 'reply'
  | 'system'

export interface Notification {
  id: number
  user_id: number
  type: NotificationType
  sender_id?: number
  sender_username?: string
  sender_profile_pic?: string
  post_id?: number
  post_title?: string
  comment_id?: number
  province_id?: number
  province_name?: string
  city_id?: number
  city_name?: string
  content?: string
  is_read: boolean
  created_at: string
  timeAgo?: string
}
