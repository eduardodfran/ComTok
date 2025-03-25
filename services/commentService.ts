import api from './apiService'
import { Comment, NewComment } from '@/types/comment'
import * as mockService from './mockService'

// Get comments for a post
export const getCommentsByPostId = async (
  postId: number
): Promise<Comment[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getCommentsByPostId(postId)
  }

  try {
    const response = await api.get(`/comments/post/${postId}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching comments for post ${postId}:`, error)
    return []
  }
}

// Add a comment
export const addComment = async (
  postId: number,
  userId: number,
  content: string,
  parentId?: number
): Promise<Comment> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.addComment(postId, userId, content, parentId)
  }

  try {
    const response = await api.post('/comments', {
      post_id: postId,
      content,
      parent_id: parentId,
    })
    return response.data.data
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
}

// Update a comment
export const updateComment = async (
  commentId: number,
  content: string
): Promise<Comment> => {
  try {
    const response = await api.put(`/comments/${commentId}`, { content })
    return response.data.data
  } catch (error) {
    console.error(`Error updating comment ${commentId}:`, error)
    throw error
  }
}

// Delete a comment
export const deleteComment = async (commentId: number): Promise<boolean> => {
  try {
    await api.delete(`/comments/${commentId}`)
    return true
  } catch (error) {
    console.error(`Error deleting comment ${commentId}:`, error)
    return false
  }
}

// Upvote a comment
export const upvoteComment = async (commentId: number): Promise<boolean> => {
  try {
    await api.post(`/comments/${commentId}/upvote`)
    return true
  } catch (error) {
    console.error(`Error upvoting comment ${commentId}:`, error)
    return false
  }
}

// Downvote a comment
export const downvoteComment = async (commentId: number): Promise<boolean> => {
  try {
    await api.post(`/comments/${commentId}/downvote`)
    return true
  } catch (error) {
    console.error(`Error downvoting comment ${commentId}:`, error)
    return false
  }
}
