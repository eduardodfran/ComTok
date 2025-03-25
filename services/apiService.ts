import axios from 'axios'
import * as SecureStore from 'expo-secure-store'
import Constants from 'expo-constants'

// Get the device's IP address for local development
const localhost = Constants.expoConfig?.hostUri?.split(':')[0] || 'localhost'

// Define the base URL for API calls
// Use the device IP with port 3000 for development so mobile devices can access the server
const API_BASE_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.API_BASE_URL || 'https://api.comtok.com/api'
    : `http://${localhost}:3000/api`

console.log('API Base URL:', API_BASE_URL)

// Create an axios instance with default configs
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor to include auth token in requests
api.interceptors.request.use(
  async (config) => {
    try {
      // Get the token from SecureStore
      const token = await SecureStore.getItemAsync('authToken')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('Error retrieving auth token:', error)
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Check if error has response
    if (error.response) {
      const { status, data } = error.response

      // Handle common errors
      if (status === 401) {
        // Unauthorized - clear token
        try {
          await SecureStore.deleteItemAsync('authToken')
        } catch (storageError) {
          console.error('Error clearing auth token:', storageError)
        }

        // App should handle redirection based on this error
        console.error('Authentication error: User not authorized')
      } else if (status === 404) {
        console.error('Resource not found:', error.config.url)
      } else if (status === 500) {
        console.error('Server error:', data?.message || 'Unknown server error')
      }
    } else if (error.request) {
      // Request made but no response received
      console.error('Network error: No response received from server')
    } else {
      // Something else happened while setting up the request
      console.error('Error setting up request:', error.message)
    }

    return Promise.reject(error)
  }
)

export default api
