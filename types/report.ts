export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'inappropriate'
  | 'violence'
  | 'other'
export type ReportStatus = 'pending' | 'resolved' | 'rejected'
export type ReportContentType = 'post' | 'comment' | 'user'

export interface ReportContent {
  reason: ReportReason
  details?: string
}

export interface Report {
  id: number
  reporter_id: number
  reported_user_id?: number
  post_id?: number
  comment_id?: number
  reason: ReportReason
  details?: string
  status: ReportStatus
  created_at: string
  updated_at: string
  resolved_by?: number
}
