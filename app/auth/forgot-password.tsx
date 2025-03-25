import { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native'
import { Link, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  // Get theme colors
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const iconColor = useThemeColor({}, 'icon')
  const tintColor = useThemeColor({}, 'tint')
  const dividerColor = useThemeColor({}, 'divider')
  const borderColor = useThemeColor({}, 'border')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')
  const errorColor = useThemeColor({}, 'error')
  const errorBgColor = useThemeColor({}, 'errorBackground')
  const successColor = useThemeColor({}, 'success')
  const successBgColor = useThemeColor({}, 'cardBackground')

  const handleResetPassword = async () => {
    if (!email) return

    setIsLoading(true)
    setError(null)

    try {
      // In a real app, this would call your auth service
      // await authService.requestPasswordReset(email)

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSuccess(true)
    } catch (error: any) {
      setError(error.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
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
            uri: 'https://images.unsplash.com/photo-1572144953601-9bce7a6d5b04?q=80&w=1000',
          }}
          style={styles.headerImage}
        />

        <ThemedView
          style={[styles.formContainer, { backgroundColor: cardBgColor }]}
        >
          <ThemedText type="title" style={styles.title}>
            Reset Password
          </ThemedText>
          <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
            Enter your email to receive a password reset link
          </ThemedText>

          {error && (
            <ThemedView
              style={[
                styles.messageContainer,
                { backgroundColor: errorBgColor },
              ]}
            >
              <ThemedText style={[styles.messageText, { color: errorColor }]}>
                {error}
              </ThemedText>
            </ThemedView>
          )}

          {success && (
            <ThemedView
              style={[
                styles.messageContainer,
                {
                  backgroundColor: successBgColor,
                  borderColor: successColor,
                  borderWidth: 1,
                },
              ]}
            >
              <ThemedText style={[styles.messageText, { color: successColor }]}>
                Password reset link sent to your email. Please check your inbox.
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
              name="mail-outline"
              size={20}
              color={iconColor}
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
              editable={!success}
            />
          </ThemedView>

          <TouchableOpacity
            style={[
              styles.resetButton,
              { backgroundColor: tintColor },
              (!email || isLoading || success) && {
                backgroundColor: buttonDisabledColor,
              },
            ]}
            onPress={handleResetPassword}
            disabled={!email || isLoading || success}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.resetButtonText}>
                Send Reset Link
              </ThemedText>
            )}
          </TouchableOpacity>

          {success ? (
            <TouchableOpacity
              style={[styles.returnButton, { borderColor: tintColor }]}
              onPress={() => router.push('/auth/login')}
            >
              <ThemedText
                style={[styles.returnButtonText, { color: tintColor }]}
              >
                Return to Login
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedView style={styles.loginContainer}>
              <ThemedText
                style={[styles.rememberText, { color: secondaryTextColor }]}
              >
                Remember your password?{' '}
              </ThemedText>
              <Link href="/auth/login" asChild>
                <TouchableOpacity>
                  <ThemedText style={[styles.loginText, { color: tintColor }]}>
                    Login
                  </ThemedText>
                </TouchableOpacity>
              </Link>
            </ThemedView>
          )}
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
    height: 200,
    resizeMode: 'cover',
  },
  formContainer: {
    flex: 1,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -24,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    marginBottom: 30,
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
  },
  messageText: {
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
  resetButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  returnButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  rememberText: {
    fontSize: 14,
  },
  loginText: {
    fontSize: 14,
    fontWeight: '600',
  },
})
