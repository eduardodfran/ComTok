import { AuthUser } from './auth'

export interface User {
  id: number
  username: string
  profilePic: string | null
}

export interface Post {
  id: number
  title: string
  content: string
  image_url?: string
  user: AuthUser
  province: string
  province_id: number
  city?: string
  city_id?: number
  votes: number
  comment_count: number
  created_at: string
  updated_at: string
  timeAgo?: string
}

export interface NewPost {
  title: string
  content: string
  province_id: number
  city_id?: number
  image_url?: string
}

export interface PostVote {
  id: number
  post_id: number
  user_id: number
  vote_type: 'upvote' | 'downvote'
  created_at: string
}
