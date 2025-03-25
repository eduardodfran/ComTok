// Safely import packages that might not be installed yet
let LocalAuthentication: any = null
let AsyncStorage: any = null

try {
  // Try to import LocalAuthentication, but don't crash if it's not available
  LocalAuthentication = require('expo-local-authentication')
} catch (e) {
  console.warn(
    'expo-local-authentication is not installed. Biometric authentication will be disabled.'
  )
}

try {
  // Try to import AsyncStorage, but don't crash if it's not available
  AsyncStorage = require('@react-native-async-storage/async-storage').default
} catch (e) {
  console.warn(
    '@react-native-async-storage/async-storage is not installed. Biometric authentication will be disabled.'
  )
}

// Storage keys
const BIOMETRIC_ENABLED_KEY = 'biometric_enabled'
const BIOMETRIC_CREDENTIALS_KEY = 'biometric_credentials'

// Check if the required packages are available
const arePackagesAvailable = (): boolean => {
  return !!LocalAuthentication && !!AsyncStorage
}

// Check if biometric authentication is available on the device
export const isBiometricAvailable = async (): Promise<boolean> => {
  if (!arePackagesAvailable()) return false

  try {
    const compatible = await LocalAuthentication.hasHardwareAsync()
    const enrolled = await LocalAuthentication.isEnrolledAsync()
    return compatible && enrolled
  } catch (error) {
    console.error('Error checking biometric availability:', error)
    return false
  }
}

// Check if user has enabled biometric authentication
export const isBiometricEnabled = async (): Promise<boolean> => {
  if (!arePackagesAvailable()) return false

  try {
    const value = await AsyncStorage.getItem(BIOMETRIC_ENABLED_KEY)
    return value === 'true'
  } catch (error) {
    console.error('Error checking if biometric is enabled:', error)
    return false
  }
}

// Enable biometric authentication for the user
export const enableBiometric = async (
  email: string,
  password: string
): Promise<boolean> => {
  if (!arePackagesAvailable()) {
    alert(
      'Please install required packages first. See INSTALL_PACKAGES.md for instructions.'
    )
    return false
  }

  try {
    // Store credentials securely
    await AsyncStorage.setItem(
      BIOMETRIC_CREDENTIALS_KEY,
      JSON.stringify({ email, password })
    )
    // Mark biometric as enabled
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'true')
    return true
  } catch (error) {
    console.error('Error enabling biometric:', error)
    return false
  }
}

// Disable biometric authentication for the user
export const disableBiometric = async (): Promise<boolean> => {
  if (!arePackagesAvailable()) return false

  try {
    // Remove stored credentials
    await AsyncStorage.removeItem(BIOMETRIC_CREDENTIALS_KEY)
    // Mark biometric as disabled
    await AsyncStorage.setItem(BIOMETRIC_ENABLED_KEY, 'false')
    return true
  } catch (error) {
    console.error('Error disabling biometric:', error)
    return false
  }
}

// Authenticate user with biometrics
export const authenticateWithBiometric = async (): Promise<{
  email: string
  password: string
} | null> => {
  if (!arePackagesAvailable()) return null

  try {
    // Check if biometric is available and enabled
    const available = await isBiometricAvailable()
    const enabled = await isBiometricEnabled()

    if (!available || !enabled) {
      return null
    }

    // Prompt user for biometric authentication
    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Authenticate to login',
      fallbackLabel: 'Use password',
      disableDeviceFallback: false,
    })

    // If authentication was successful, retrieve stored credentials
    if (result.success) {
      const credentialsString = await AsyncStorage.getItem(
        BIOMETRIC_CREDENTIALS_KEY
      )
      if (credentialsString) {
        return JSON.parse(credentialsString)
      }
    }

    return null
  } catch (error) {
    console.error('Error during biometric authentication:', error)
    return null
  }
}
