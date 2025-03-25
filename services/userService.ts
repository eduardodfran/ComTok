import api from './apiService'
import { AuthUser } from '@/types/auth'
import { Post } from '@/types/post'
import * as mockService from './mockService'

// Get user by ID
export const getUserById = async (userId: number): Promise<AuthUser | null> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getUserById(userId)
  }

  try {
    const response = await api.get(`/users/${userId}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching user ${userId}:`, error)
    return null
  }
}

// Get user's posts
export const getUserPosts = async (userId: number): Promise<Post[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getUserPosts(userId)
  }

  try {
    const response = await api.get(`/users/${userId}/posts`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error)
    return []
  }
}

// Update user profile
export const updateUserProfile = async (
  bio?: string,
  username?: string
): Promise<AuthUser | null> => {
  try {
    const response = await api.put('/users/profile', { bio, username })
    return response.data.data
  } catch (error) {
    console.error('Error updating user profile:', error)
    return null
  }
}

// Follow a user
export const followUser = async (userId: number): Promise<boolean> => {
  try {
    await api.post(`/users/${userId}/follow`)
    return true
  } catch (error) {
    console.error(`Error following user ${userId}:`, error)
    return false
  }
}

// Unfollow a user
export const unfollowUser = async (userId: number): Promise<boolean> => {
  try {
    await api.delete(`/users/${userId}/follow`)
    return true
  } catch (error) {
    console.error(`Error unfollowing user ${userId}:`, error)
    return false
  }
}

// Upload profile picture
export const uploadProfilePicture = async (
  imageFile: FormData
): Promise<string | null> => {
  try {
    const response = await api.post('/users/profile-picture', imageFile, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data.data.profilePic
  } catch (error) {
    console.error('Error uploading profile picture:', error)
    return null
  }
}
