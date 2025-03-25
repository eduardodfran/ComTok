import api from './apiService'
import { AuthUser, LoginCredentials, SignupCredentials } from '@/types/auth'
import * as SecureStore from 'expo-secure-store'

// Login function using API
export const login = async (
  credentials: LoginCredentials
): Promise<AuthUser> => {
  try {
    const response = await api.post('/auth/login', credentials)
    const { user, token } = response.data

    // Store the token
    await SecureStore.setItemAsync('authToken', token)

    return user
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed')
  }
}

// Signup function using API
export const signup = async (
  credentials: SignupCredentials
): Promise<AuthUser> => {
  try {
    const response = await api.post('/auth/signup', credentials)
    const { user, token } = response.data

    // Store the token
    await SecureStore.setItemAsync('authToken', token)

    return user
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Signup failed')
  }
}

// Logout function
export const logout = async (): Promise<void> => {
  try {
    // Call logout endpoint if you need to invalidate token on server
    await api.post('/auth/logout')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    // Always remove token from storage
    await SecureStore.deleteItemAsync('authToken')
  }
}

// Get current user from token
export const getCurrentUser = async (): Promise<AuthUser | null> => {
  try {
    const token = await SecureStore.getItemAsync('authToken')

    if (!token) {
      return null
    }

    const response = await api.get('/auth/me')
    return response.data.user
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

// Verify OTP
export const verifyOTP = async (email: string, otp: string): Promise<void> => {
  try {
    await api.post('/auth/verify-otp', { email, otp })
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Invalid verification code'
    )
  }
}

// Request password reset
export const requestPasswordReset = async (email: string): Promise<void> => {
  try {
    await api.post('/auth/forgot-password', { email })
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Password reset request failed'
    )
  }
}
