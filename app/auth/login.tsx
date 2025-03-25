import { useState, useEffect } from 'react'
import {
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  View,
  Alert,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeColor } from '@/hooks/useThemeColor'
import * as BiometricService from '@/services/biometricService'
import * as LockoutService from '@/services/lockoutService'
import { isValidEmail } from '@/services/validationService'

export default function LoginScreen() {
  const { login, isLoading, error } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [biometricAvailable, setBiometricAvailable] = useState(false)
  const [biometricEnabled, setBiometricEnabled] = useState(false)
  const [isLocked, setIsLocked] = useState(false)
  const [lockoutTime, setLockoutTime] = useState(0)
  const [attemptsRemaining, setAttemptsRemaining] = useState(5)
  const [emailValid, setEmailValid] = useState(true)
  const router = useRouter()

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')
  const errorColor = useThemeColor({}, 'error')
  const errorBgColor = useThemeColor({}, 'error') + '20' // 20% opacity
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')
  const dividerColor = useThemeColor({}, 'divider')
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')

  useEffect(() => {
    // Check if biometric authentication is available
    const checkBiometricAvailability = async () => {
      try {
        const available = await BiometricService.isBiometricAvailable()
        setBiometricAvailable(available)

        if (available) {
          const enabled = await BiometricService.isBiometricEnabled()
          setBiometricEnabled(enabled)

          // If biometric is enabled, prompt for authentication
          if (enabled) {
            handleBiometricLogin()
          }
        }
      } catch (error) {
        console.warn('Error checking biometrics:', error)
        setBiometricAvailable(false)
        setBiometricEnabled(false)
      }
    }

    checkBiometricAvailability()
  }, [])

  useEffect(() => {
    // Check account lockout status when email changes
    const checkLockoutStatus = async () => {
      if (email) {
        try {
          const status = await LockoutService.checkAccountLockout(email)
          setIsLocked(status.isLocked)
          setLockoutTime(status.timeRemaining)
          setAttemptsRemaining(status.attemptsRemaining)

          // Set up a timer to update the lockout status if account is locked
          if (status.isLocked && status.timeRemaining > 0) {
            const timer = setTimeout(() => {
              checkLockoutStatus()
            }, 1000) // Update every second

            return () => clearTimeout(timer)
          }
        } catch (error) {
          console.error('Error checking lockout status:', error)
          // Reset lockout state to prevent blocking login in case of errors
          setIsLocked(false)
          setLockoutTime(0)
          setAttemptsRemaining(5)
        }
      }
    }

    checkLockoutStatus()
  }, [email])

  // Validate email when it changes
  useEffect(() => {
    if (email) {
      setEmailValid(isValidEmail(email))
    } else {
      setEmailValid(true) // Don't show error when empty
    }
  }, [email])

  const handleLogin = async () => {
    // Don't allow login attempts if account is locked
    if (isLocked) {
      Alert.alert(
        'Account Locked',
        `Too many failed login attempts. Please try again in ${LockoutService.formatLockoutTime(
          lockoutTime
        )}.`
      )
      return
    }

    // Validate email before submission
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    if (!password) {
      Alert.alert('Error', 'Password is required')
      return
    }

    await login({ email, password })
  }

  const handleBiometricLogin = async () => {
    try {
      const credentials = await BiometricService.authenticateWithBiometric()
      if (credentials) {
        // Credentials retrieved, login with them
        await login(credentials)
      }
    } catch (error) {
      console.error('Biometric authentication error:', error)
    }
  }

  const handleSaveBiometrics = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter your email and password first')
      return
    }

    try {
      const success = await BiometricService.enableBiometric(email, password)
      if (success) {
        setBiometricEnabled(true)
        Alert.alert('Success', 'Biometric authentication enabled')
      } else {
        // Show installation guide if packages aren't available
        Alert.alert(
          'Required Packages Not Installed',
          'To use biometric authentication, you need to install additional packages. See INSTALL_PACKAGES.md for instructions.'
        )
      }
    } catch (error) {
      console.error('Error saving biometrics:', error)
      Alert.alert('Error', 'Something went wrong')
    }
  }

  // Function to handle account recovery
  const handleAccountRecovery = () => {
    // Reset the lockout for demo purposes
    // In a real app, this would trigger an additional verification step
    if (email) {
      LockoutService.resetLockout(email).then(() => {
        setIsLocked(false)
        setLockoutTime(0)
        setAttemptsRemaining(5)
        Alert.alert(
          'Account Unlocked',
          'Your account has been unlocked. Please try logging in again.'
        )
      })
    }
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1573832035811-218f5113ffdc?q=80&w=1000',
          }}
          style={styles.headerImage}
        />

        <ThemedView
          style={[styles.formContainer, { backgroundColor: cardBgColor }]}
        >
          <ThemedText type="title" style={styles.title}>
            Welcome to ComTok
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
            Sign in to continue
          </ThemedText>

          {(error || isLocked) && (
            <ThemedView
              style={[styles.errorContainer, { backgroundColor: errorBgColor }]}
            >
              <ThemedText style={[styles.errorText, { color: errorColor }]}>
                {isLocked
                  ? `Account locked. Try again in ${LockoutService.formatLockoutTime(
                      lockoutTime
                    )}.`
                  : error}
              </ThemedText>
              {isLocked && (
                <TouchableOpacity onPress={handleAccountRecovery}>
                  <ThemedText
                    style={[styles.recoveryLink, { color: tintColor }]}
                  >
                    Unlock my account
                  </ThemedText>
                </TouchableOpacity>
              )}
            </ThemedView>
          )}

          <ThemedView
            style={[
              styles.inputContainer,
              {
                borderColor: emailValid ? borderColor : errorColor,
                backgroundColor: inputBgColor,
              },
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={20}
              color={emailValid ? iconColor : errorColor}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              placeholderTextColor={secondaryTextColor}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            {email && !emailValid && (
              <Ionicons name="alert-circle" size={20} color={errorColor} />
            )}
          </ThemedView>

          {email && !emailValid && (
            <ThemedText style={[styles.validationError, { color: errorColor }]}>
              Please enter a valid email address
            </ThemedText>
          )}

          <ThemedView
            style={[
              styles.inputContainer,
              {
                borderColor: borderColor,
                backgroundColor: inputBgColor,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={iconColor}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              placeholderTextColor={secondaryTextColor}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={iconColor}
              />
            </TouchableOpacity>
          </ThemedView>

          <View style={styles.forgotAndBiometricRow}>
            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={() => router.push('/auth/forgot-password')}
            >
              <ThemedText
                style={[
                  styles.forgotPasswordText,
                  { color: secondaryTextColor },
                ]}
              >
                Forgot password?
              </ThemedText>
            </TouchableOpacity>

            {biometricAvailable && !biometricEnabled && (
              <TouchableOpacity
                style={styles.saveForBiometric}
                onPress={handleSaveBiometrics}
              >
                <Ionicons
                  name="finger-print"
                  size={16}
                  color={tintColor}
                  style={styles.biometricIcon}
                />
                <ThemedText
                  style={[styles.saveForBiometricText, { color: tintColor }]}
                >
                  Enable Face/Touch ID
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={[
              styles.loginButton,
              { backgroundColor: tintColor },
              (!email || !password || isLoading || isLocked) && {
                backgroundColor: buttonDisabledColor,
              },
            ]}
            onPress={handleLogin}
            disabled={!email || !password || isLoading || isLocked}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.loginButtonText}>
                {isLocked ? 'Account Locked' : 'Login'}
              </ThemedText>
            )}
          </TouchableOpacity>

          {biometricAvailable && biometricEnabled && (
            <TouchableOpacity
              style={[styles.biometricButton, { borderColor: tintColor }]}
              onPress={handleBiometricLogin}
            >
              <Ionicons
                name="finger-print"
                size={20}
                color={tintColor}
                style={styles.biometricIcon}
              />
              <ThemedText
                style={[styles.biometricButtonText, { color: tintColor }]}
              >
                Login with Face/Touch ID
              </ThemedText>
            </TouchableOpacity>
          )}

          <ThemedView style={styles.divider}>
            <ThemedView
              style={[styles.dividerLine, { backgroundColor: dividerColor }]}
            />
            <ThemedText
              style={[styles.dividerText, { color: secondaryTextColor }]}
            >
              OR
            </ThemedText>
            <ThemedView
              style={[styles.dividerLine, { backgroundColor: dividerColor }]}
            />
          </ThemedView>

          <ThemedView style={styles.socialContainer}>
            <ThemedText
              style={[styles.noAccountText, { color: secondaryTextColor }]}
            >
              Don't have an account?{' '}
            </ThemedText>
            <Link href="/auth/signup" asChild>
              <TouchableOpacity>
                <ThemedText style={[styles.signupText, { color: tintColor }]}>
                  Sign Up
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>

          <ThemedText style={[styles.demoHint, { color: secondaryTextColor }]}>
            For demo, use email: demo@example.com with any password
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  headerImage: {
    width: '100%',
    height: 220,
  },
  formContainer: {
    paddingHorizontal: 25,
    paddingTop: 30,
    paddingBottom: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
  },
  title: {
    fontSize: 28,
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 30,
  },
  errorContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 50,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  forgotAndBiometricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  forgotPassword: {
    flex: 1,
  },
  forgotPasswordText: {
    fontSize: 14,
  },
  saveForBiometric: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  saveForBiometricText: {
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  biometricButton: {
    flexDirection: 'row',
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  biometricIcon: {
    marginRight: 8,
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 10,
    fontSize: 14,
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  noAccountText: {
    fontSize: 14,
  },
  signupText: {
    fontSize: 14,
    fontWeight: '600',
  },
  demoHint: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 12,
    fontStyle: 'italic',
  },
  recoveryLink: {
    fontSize: 14,
    textDecorationLine: 'underline',
    marginTop: 8,
    alignSelf: 'center',
  },
  validationError: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: -8,
    alignSelf: 'flex-start',
  },
})
