import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from 'react'
import { router } from 'expo-router'
import * as authService from '@/services/authService'
import {
  AuthUser,
  LoginCredentials,
  SignupCredentials,
  AuthState,
} from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>
  signup: (credentials: SignupCredentials) => Promise<void>
  logout: () => Promise<void>
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
})

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState)

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser()
        setState({
          user,
          isAuthenticated: !!user,
          isLoading: false,
          error: null,
        })
      } catch (error) {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: 'Failed to restore session',
        })
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials: LoginCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const user = await authService.login(credentials)

      // Check if the user needs to verify OTP
      if (user.requiresOTP) {
        // Navigate to OTP verification screen instead of home
        router.push({
          pathname: '/auth/verify-otp',
          params: { email: credentials.email },
        })

        // Update state but don't set as authenticated yet
        setState({
          user,
          isAuthenticated: false, // Not fully authenticated until OTP verification
          isLoading: false,
          error: null,
        })
      } else {
        // Normal login flow - OTP not required
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        })

        // Navigate to home screen after successful login
        router.replace('/')
      }
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to login',
      }))
    }
  }

  const signup = async (credentials: SignupCredentials) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }))
    try {
      const user = await authService.signup(credentials)
      setState({
        user,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      })
      // Navigate to home screen after successful signup
      router.replace('/')
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to sign up',
      }))
    }
  }

  const logout = async () => {
    setState((prev) => ({ ...prev, isLoading: true }))
    try {
      await authService.logout()
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      })
      // Navigate to login screen after logout
      router.replace('/auth/login')
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.message || 'Failed to logout',
      }))
    }
  }

  return (
    <AuthContext.Provider value={{ ...state, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
