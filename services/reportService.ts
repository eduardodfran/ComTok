import api from './apiService'
import { ReportContent, ReportReason } from '@/types/report'

// Report a post
export const reportPost = async (
  postId: number,
  reason: ReportReason,
  details?: string
): Promise<boolean> => {
  try {
    await api.post('/reports', {
      post_id: postId,
      reason,
      details,
    })
    return true
  } catch (error) {
    console.error(`Error reporting post ${postId}:`, error)
    return false
  }
}

// Report a comment
export const reportComment = async (
  commentId: number,
  reason: ReportReason,
  details?: string
): Promise<boolean> => {
  try {
    await api.post('/reports', {
      comment_id: commentId,
      reason,
      details,
    })
    return true
  } catch (error) {
    console.error(`Error reporting comment ${commentId}:`, error)
    return false
  }
}

// Report a user
export const reportUser = async (
  userId: number,
  reason: ReportReason,
  details?: string
): Promise<boolean> => {
  try {
    await api.post('/reports', {
      reported_user_id: userId,
      reason,
      details,
    })
    return true
  } catch (error) {
    console.error(`Error reporting user ${userId}:`, error)
    return false
  }
}
