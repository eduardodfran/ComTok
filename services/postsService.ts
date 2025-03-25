import api from './apiService'
import { Post, NewPost, PostVote } from '@/types/post'
import * as mockService from './mockService'

// Get all posts with pagination and filters
export const getPosts = async (
  page = 1,
  limit = 10,
  filters = {}
): Promise<{ posts: Post[]; total: number }> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getPosts(page, limit, filters)
  }

  try {
    const response = await api.get('/posts', {
      params: {
        page,
        limit,
        ...filters,
      },
    })
    return {
      posts: response.data.data,
      total: response.data.total || response.data.data.length,
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], total: 0 }
  }
}

// Get a post by ID
export const getPostById = async (id: number): Promise<Post | null> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getPostById(id)
  }

  try {
    const response = await api.get(`/posts/${id}`)
    return response.data.data
  } catch (error) {
    console.error(`Error fetching post ${id}:`, error)
    return null
  }
}

// Get posts by province
export const getPostsByProvince = async (
  provinceId: number,
  page = 1,
  limit = 10
): Promise<Post[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getPostsByProvince(provinceId, page, limit)
  }

  try {
    const response = await api.get(`/provinces/${provinceId}/posts`, {
      params: { page, limit },
    })
    return response.data.data
  } catch (error) {
    console.error(`Error fetching posts for province ${provinceId}:`, error)
    return []
  }
}

// Get posts by city
export const getPostsByCity = async (
  cityId: number,
  page = 1,
  limit = 10
): Promise<Post[]> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.getPostsByCity(cityId, page, limit)
  }

  try {
    const response = await api.get(`/cities/${cityId}/posts`, {
      params: { page, limit },
    })
    return response.data.data
  } catch (error) {
    console.error(`Error fetching posts for city ${cityId}:`, error)
    return []
  }
}

// Create a new post
export const createPost = async (post: NewPost): Promise<Post | null> => {
  // Use mock data if enabled
  if (mockService.useMockData) {
    return mockService.createPost(post)
  }

  try {
    const response = await api.post('/posts', post)
    return response.data.data
  } catch (error) {
    console.error('Error creating post:', error)
    return null
  }
}

// Update a post
export const updatePost = async (
  id: number,
  updates: Partial<NewPost>
): Promise<Post | null> => {
  try {
    const response = await api.put(`/posts/${id}`, updates)
    return response.data.data
  } catch (error) {
    console.error(`Error updating post ${id}:`, error)
    return null
  }
}

// Delete a post
export const deletePost = async (id: number): Promise<boolean> => {
  try {
    await api.delete(`/posts/${id}`)
    return true
  } catch (error) {
    console.error(`Error deleting post ${id}:`, error)
    return false
  }
}

// Vote on a post
export const votePost = async (
  postId: number,
  voteType: 'upvote' | 'downvote'
): Promise<boolean> => {
  try {
    await api.post(`/posts/${postId}/${voteType}`)
    return true
  } catch (error) {
    console.error(`Error ${voteType}ing post ${postId}:`, error)
    return false
  }
}
