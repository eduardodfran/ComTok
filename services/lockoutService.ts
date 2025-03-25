// Safely import packages that might not be installed yet
let AsyncStorage: any = null

try {
  // Try to import AsyncStorage, but don't crash if it's not available
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (e) {
  console.warn(
    '@react-native-async-storage/async-storage is not installed. Account lockout will use fallback storage.'
  )

  // Create a simple in-memory fallback storage
  const memoryStorage: Record<string, string> = {}
  AsyncStorage = {
    getItem: async (key: string) => memoryStorage[key] || null,
    setItem: async (key: string, value: string) => {
      memoryStorage[key] = value
    },
    removeItem: async (key: string) => {
      delete memoryStorage[key]
    },
  }
}

// Constants
const MAX_FAILED_ATTEMPTS = 5
const LOCKOUT_DURATION_MS = 5 * 60 * 1000 // 5 minutes in milliseconds

// Storage keys
const getFailedAttemptsKey = (email: string) => `failed_attempts_${email}`
const getLockoutTimeKey = (email: string) => `lockout_time_${email}`

/**
 * Records a failed login attempt for a specific email
 */
export const recordFailedAttempt = async (
  email: string
): Promise<{
  attemptsRemaining: number
  isLocked: boolean
  lockoutEndTime: number | null
}> => {
  try {
    // Get current failed attempts
    const key = getFailedAttemptsKey(email)
    const currentAttempts = await AsyncStorage.getItem(key)
    const failedAttempts = currentAttempts
      ? parseInt(currentAttempts, 10) + 1
      : 1

    // Save updated attempts
    await AsyncStorage.setItem(key, failedAttempts.toString())

    // Check if account should be locked
    if (failedAttempts >= MAX_FAILED_ATTEMPTS) {
      const lockoutEndTime = Date.now() + LOCKOUT_DURATION_MS
      await AsyncStorage.setItem(
        getLockoutTimeKey(email),
        lockoutEndTime.toString()
      )

      return {
        attemptsRemaining: 0,
        isLocked: true,
        lockoutEndTime,
      }
    }

    return {
      attemptsRemaining: MAX_FAILED_ATTEMPTS - failedAttempts,
      isLocked: false,
      lockoutEndTime: null,
    }
  } catch (error) {
    console.error('Error recording failed attempt:', error)
    // Return default values in case of error
    return {
      attemptsRemaining: MAX_FAILED_ATTEMPTS - 1,
      isLocked: false,
      lockoutEndTime: null,
    }
  }
}

/**
 * Checks if an account is currently locked out
 */
export const checkAccountLockout = async (
  email: string
): Promise<{
  isLocked: boolean
  timeRemaining: number
  attemptsRemaining: number
}> => {
  try {
    // Check if account is locked
    const lockoutKey = getLockoutTimeKey(email)
    const lockoutTimeStr = await AsyncStorage.getItem(lockoutKey)

    if (lockoutTimeStr) {
      const lockoutTime = parseInt(lockoutTimeStr, 10)
      const now = Date.now()

      // If lockout period has passed, reset the lockout
      if (now >= lockoutTime) {
        await resetLockout(email)
        return {
          isLocked: false,
          timeRemaining: 0,
          attemptsRemaining: MAX_FAILED_ATTEMPTS,
        }
      }

      // Account is still locked
      return {
        isLocked: true,
        timeRemaining: lockoutTime - now,
        attemptsRemaining: 0,
      }
    }

    // Check remaining attempts
    const attemptsKey = getFailedAttemptsKey(email)
    const attemptsStr = await AsyncStorage.getItem(attemptsKey)
    const attempts = attemptsStr ? parseInt(attemptsStr, 10) : 0

    return {
      isLocked: false,
      timeRemaining: 0,
      attemptsRemaining: MAX_FAILED_ATTEMPTS - attempts,
    }
  } catch (error) {
    console.error('Error checking account lockout:', error)
    // Return default values in case of error
    return {
      isLocked: false,
      timeRemaining: 0,
      attemptsRemaining: MAX_FAILED_ATTEMPTS,
    }
  }
}

/**
 * Resets the failed attempts counter after successful login
 */
export const resetFailedAttempts = async (email: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(getFailedAttemptsKey(email))
    await AsyncStorage.removeItem(getLockoutTimeKey(email))
  } catch (error) {
    console.error('Error resetting failed attempts:', error)
  }
}

/**
 * Resets account lockout status
 */
export const resetLockout = async (email: string): Promise<void> => {
  try {
    await AsyncStorage.removeItem(getFailedAttemptsKey(email))
    await AsyncStorage.removeItem(getLockoutTimeKey(email))
  } catch (error) {
    console.error('Error resetting lockout:', error)
  }
}

/**
 * Formats the remaining lockout time into a user-friendly string
 */
export const formatLockoutTime = (milliseconds: number): string => {
  const minutes = Math.floor(milliseconds / 60000)
  const seconds = Math.floor((milliseconds % 60000) / 1000)

  if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} and ${seconds} second${
      seconds !== 1 ? 's' : ''
    }`
  }

  return `${seconds} second${seconds !== 1 ? 's' : ''}`
}
