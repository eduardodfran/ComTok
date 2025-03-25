/**
 * Mock Service
 *
 * This service provides mock data for development and testing.
 * It intercepts API calls and returns mock data instead of making actual network requests.
 */

import {
  mockPosts,
  mockComments,
  mockUsers,
  provinces,
  cities,
  mockNotifications,
} from '@/utils/mockData'
import { Province, City } from '@/types/location'
import { Post, NewPost } from '@/types/post'
import { Comment } from '@/types/comment'
import { AuthUser } from '@/types/auth'
import { formatRelativeTime } from '@/utils/timeUtils'
import { Notification } from '@/types/notification'

// Flag to determine whether to use mock data or real API
// Set this to false when using real API calls
export const useMockData = true

/**
 * PROVINCE RELATED MOCK SERVICES
 */

// Get all provinces
export const getAllProvinces = async (): Promise<Province[]> => {
  return provinces
}

// Get province by ID
export const getProvinceById = async (id: number): Promise<Province | null> => {
  return provinces.find((province) => province.id === id) || null
}

// Get cities by province ID
export const getCitiesByProvinceId = async (
  provinceId: number
): Promise<City[]> => {
  const province = provinces.find((p) => p.id === provinceId)

  if (!province) return []

  return cities[province.name] || []
}

/**
 * POST RELATED MOCK SERVICES
 */

// Get all posts
export const getPosts = async (
  page = 1,
  limit = 10,
  filters = {}
): Promise<{ posts: Post[]; total: number }> => {
  // Apply mock filters here if needed
  const filteredPosts = [...mockPosts]

  // Calculate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  const paginatedPosts = filteredPosts.slice(startIndex, endIndex)

  return {
    posts: paginatedPosts,
    total: filteredPosts.length,
  }
}

// Get post by ID
export const getPostById = async (id: number): Promise<Post | null> => {
  return mockPosts.find((post) => post.id === id) || null
}

// Get posts by province
export const getPostsByProvince = async (
  provinceId: number,
  page = 1,
  limit = 10
): Promise<Post[]> => {
  const filteredPosts = mockPosts.filter(
    (post) => post.province_id === provinceId
  )

  // Calculate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return filteredPosts.slice(startIndex, endIndex)
}

// Get posts by city
export const getPostsByCity = async (
  cityId: number,
  page = 1,
  limit = 10
): Promise<Post[]> => {
  const filteredPosts = mockPosts.filter((post) => post.city_id === cityId)

  // Calculate pagination
  const startIndex = (page - 1) * limit
  const endIndex = startIndex + limit
  return filteredPosts.slice(startIndex, endIndex)
}

// Create a new post
export const createPost = async (post: NewPost): Promise<Post | null> => {
  const newPost: Post = {
    id: mockPosts.length + 1,
    title: post.title,
    content: post.content,
    image_url: post.image_url,
    user: mockUsers[0], // Assuming the current user is the first mock user
    province:
      provinces.find((p) => p.id === post.province_id)?.name || 'Unknown',
    province_id: post.province_id,
    city: post.city_id
      ? cities[
          provinces.find((p) => p.id === post.province_id)?.name || ''
        ]?.find((c) => c.id === post.city_id)?.name
      : undefined,
    city_id: post.city_id,
    votes: 0,
    comment_count: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    timeAgo: 'just now',
  }

  // Add to mock posts (in a real app, this would be saved to the database)
  mockPosts.unshift(newPost)

  return newPost
}

/**
 * COMMENT RELATED MOCK SERVICES
 */

// Get comments for a post
export const getCommentsByPostId = async (
  postId: number
): Promise<Comment[]> => {
  // Get top-level comments
  const topLevelComments = mockComments.filter(
    (comment) => comment.post_id === postId && !comment.parent_id
  )

  // Process each comment to add replies
  return topLevelComments.map((comment) => {
    // Find replies to this comment
    const replies = mockComments.filter(
      (reply) => reply.parent_id === comment.id
    )

    // Add timeAgo to each reply
    const repliesWithTimeAgo = replies.map((reply) => ({
      ...reply,
      timeAgo: formatRelativeTime(reply.created_at),
    }))

    // Return the comment with its replies
    return {
      ...comment,
      timeAgo: formatRelativeTime(comment.created_at),
      replies: repliesWithTimeAgo,
    }
  })
}

// Add a comment
export const addComment = async (
  postId: number,
  userId: number,
  content: string,
  parentId?: number
): Promise<Comment> => {
  const newComment: Comment = {
    id: mockComments.length + 1,
    post_id: postId,
    user_id: userId,
    parent_id: parentId,
    content,
    votes: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    is_deleted: false,
    user: mockUsers.find((user) => user.id === userId) || mockUsers[0],
    timeAgo: 'just now',
  }

  // Add to mock comments
  mockComments.push(newComment)

  // Update comment count on the post
  const post = mockPosts.find((post) => post.id === postId)
  if (post) {
    post.comment_count += 1
  }

  return newComment
}

/**
 * USER RELATED MOCK SERVICES
 */

// Get user by ID
export const getUserById = async (userId: number): Promise<AuthUser | null> => {
  return mockUsers.find((user) => user.id === userId) || null
}

// Get user's posts
export const getUserPosts = async (userId: number): Promise<Post[]> => {
  return mockPosts.filter((post) => post.user.id === userId)
}

/**
 * NOTIFICATION RELATED MOCK SERVICES
 */

// Get all notifications for the current user
export const getNotifications = async (): Promise<Notification[]> => {
  return mockNotifications.map((notification) => ({
    ...notification,
    timeAgo: formatRelativeTime(notification.created_at),
  }))
}

// Get unread notification count
export const getUnreadCount = async (): Promise<number> => {
  return mockNotifications.filter((notification) => !notification.is_read)
    .length
}

// Mark a notification as read
export const markAsRead = async (notificationId: number): Promise<boolean> => {
  const notification = mockNotifications.find((n) => n.id === notificationId)
  if (notification) {
    notification.is_read = true
    return true
  }
  return false
}

// Mark all notifications as read
export const markAllAsRead = async (): Promise<boolean> => {
  mockNotifications.forEach((notification) => {
    notification.is_read = true
  })
  return true
}
