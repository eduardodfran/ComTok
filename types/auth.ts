export interface AuthUser {
  id: number
  username: string
  email: string
  profilePic: string | null
  createdAt: string
  followedProvinces: number[]
  followedCities: number[]
  requiresOTP?: boolean
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignupCredentials {
  username: string
  email: string
  password: string
  confirmPassword: string
}

export interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}
