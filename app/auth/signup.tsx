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
import { Link } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAuth } from '@/contexts/AuthContext'
import { useThemeColor } from '@/hooks/useThemeColor'
import {
  isValidEmail,
  evaluatePasswordStrength,
  PasswordStrength,
  meetsPasswordRequirements,
} from '@/services/validationService'
import { PasswordStrengthIndicator } from '@/components/PasswordStrengthIndicator'

export default function SignupScreen() {
  const { signup, isLoading, error } = useAuth()
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [emailValid, setEmailValid] = useState(true)
  const [passwordStrength, setPasswordStrength] = useState({
    strength: PasswordStrength.WEAK,
    score: 0,
    feedback: ['Enter a password'],
  })
  const [passwordFocused, setPasswordFocused] = useState(false)

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

  // Validate email when it changes
  useEffect(() => {
    if (email) {
      setEmailValid(isValidEmail(email))
    } else {
      setEmailValid(true) // Don't show error when empty
    }
  }, [email])

  // Evaluate password strength when it changes
  useEffect(() => {
    setPasswordStrength(evaluatePasswordStrength(password))
  }, [password])

  const handleSignup = async () => {
    // Validate inputs before submission
    if (!username) {
      Alert.alert('Error', 'Username is required')
      return
    }

    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address')
      return
    }

    if (!meetsPasswordRequirements(password)) {
      Alert.alert(
        'Error',
        'Password must be at least 6 characters and include a number'
      )
      return
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match')
      return
    }

    await signup({ username, email, password, confirmPassword })
  }

  const isFormValid =
    username &&
    email &&
    emailValid &&
    password &&
    confirmPassword &&
    password === confirmPassword &&
    meetsPasswordRequirements(password)

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1529686342540-1b43aec0df75?q=80&w=1000',
          }}
          style={styles.headerImage}
        />

        <ThemedView
          style={[styles.formContainer, { backgroundColor: cardBgColor }]}
        >
          <ThemedText type="title" style={styles.title}>
            Create Account
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
            Join the ComTok community
          </ThemedText>

          {error && (
            <ThemedView
              style={[styles.errorContainer, { backgroundColor: errorBgColor }]}
            >
              <ThemedText style={[styles.errorText, { color: errorColor }]}>
                {error}
              </ThemedText>
            </ThemedView>
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
              name="person-outline"
              size={20}
              color={iconColor}
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Username"
              value={username}
              onChangeText={setUsername}
              placeholderTextColor={secondaryTextColor}
              autoCapitalize="none"
            />
          </ThemedView>

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
              onFocus={() => setPasswordFocused(true)}
              onBlur={() => setPasswordFocused(false)}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                size={20}
                color={iconColor}
              />
            </TouchableOpacity>
          </ThemedView>

          {(passwordFocused || password) && (
            <PasswordStrengthIndicator
              strength={passwordStrength.strength}
              score={passwordStrength.score}
              feedback={passwordStrength.feedback}
              showFeedback={passwordFocused}
            />
          )}

          <ThemedView
            style={[
              styles.inputContainer,
              {
                borderColor:
                  password && confirmPassword && password !== confirmPassword
                    ? errorColor
                    : borderColor,
                backgroundColor: inputBgColor,
              },
            ]}
          >
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color={
                password && confirmPassword && password !== confirmPassword
                  ? errorColor
                  : iconColor
              }
              style={styles.inputIcon}
            />
            <TextInput
              style={[styles.input, { color: textColor }]}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor={secondaryTextColor}
              secureTextEntry={!showPassword}
            />
          </ThemedView>

          {password && confirmPassword && password !== confirmPassword && (
            <ThemedText
              style={[styles.passwordMismatch, { color: errorColor }]}
            >
              Passwords do not match
            </ThemedText>
          )}

          <TouchableOpacity
            style={[
              styles.signupButton,
              { backgroundColor: tintColor },
              (!isFormValid || isLoading) && {
                backgroundColor: buttonDisabledColor,
              },
            ]}
            onPress={handleSignup}
            disabled={!isFormValid || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.signupButtonText}>
                Create Account
              </ThemedText>
            )}
          </TouchableOpacity>

          <ThemedView style={styles.termsContainer}>
            <ThemedText
              style={[styles.termsText, { color: secondaryTextColor }]}
            >
              By signing up, you agree to our Terms of Service and Privacy
              Policy
            </ThemedText>
          </ThemedView>

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

          <ThemedView style={styles.loginContainer}>
            <ThemedText
              style={[styles.hasAccountText, { color: secondaryTextColor }]}
            >
              Already have an account?{' '}
            </ThemedText>
            <Link href="/auth/login" asChild>
              <TouchableOpacity>
                <ThemedText style={[styles.loginText, { color: tintColor }]}>
                  Login
                </ThemedText>
              </TouchableOpacity>
            </Link>
          </ThemedView>
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
  passwordMismatch: {
    fontSize: 14,
    marginBottom: 16,
    marginTop: -8,
  },
  signupButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  termsContainer: {
    marginTop: 16,
    marginBottom: 20,
  },
  termsText: {
    fontSize: 12,
    textAlign: 'center',
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
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  hasAccountText: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
  },
  validationError: {
    fontSize: 12,
    marginBottom: 12,
    marginTop: -8,
    alignSelf: 'flex-start',
  },
})
