import { useState, useEffect, useRef } from 'react'
import {
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  TextInput,
  View,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import { verifyOTP } from '@/services/authService'

export default function VerifyOTPScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const email = typeof params.email === 'string' ? params.email : ''

  const [otpCode, setOtpCode] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [countdown, setCountdown] = useState(30)
  const [canResend, setCanResend] = useState(false)

  const inputRefs = useRef<Array<TextInput | null>>([])

  // Get theme colors
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const tintColor = useThemeColor({}, 'tint')
  const borderColor = useThemeColor({}, 'border')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')
  const errorColor = useThemeColor({}, 'error')
  const errorBgColor = useThemeColor({}, 'errorBackground')

  useEffect(() => {
    // Countdown timer for OTP resend
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else {
      setCanResend(true)
    }
  }, [countdown])

  const handleOtpChange = (text: string, index: number) => {
    if (text.length > 1) {
      text = text.charAt(text.length - 1)
    }

    const newOTP = [...otpCode]
    newOTP[index] = text
    setOtpCode(newOTP)

    // Auto focus to next input if value is entered
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace for empty inputs - move to previous field
    if (e.nativeEvent.key === 'Backspace' && !otpCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otpCode.join('')
    if (code.length !== 6) return

    setIsLoading(true)
    setError(null)

    try {
      await verifyOTP(email, code)
      router.replace('/')
    } catch (error: any) {
      setError(error.message || 'Failed to verify code')
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendCode = async () => {
    if (!canResend) return

    // Reset the countdown
    setCountdown(30)
    setCanResend(false)

    // For demo purposes, we'll just show a success message
    // In a real app, this would call an API to resend the code
    setError(null)
  }

  const isFormComplete = otpCode.every((digit) => digit !== '')

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
      >
        <Image
          source={{
            uri: 'https://images.unsplash.com/photo-1586769852044-692d6e3703f2?q=80&w=1000',
          }}
          style={styles.headerImage}
        />

        <ThemedView
          style={[styles.formContainer, { backgroundColor: cardBgColor }]}
        >
          <Ionicons
            name="shield-checkmark"
            size={64}
            color={tintColor}
            style={styles.icon}
          />

          <ThemedText type="title" style={styles.title}>
            Verification
          </ThemedText>

          <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
            We've sent a 6-digit code to {email || 'your email'}
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

          <View style={styles.otpContainer}>
            {otpCode.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpInput,
                  {
                    borderColor: digit ? tintColor : borderColor,
                    backgroundColor: inputBgColor,
                    color: textColor,
                  },
                ]}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                maxLength={1}
                keyboardType="number-pad"
                textContentType="oneTimeCode"
                autoComplete="sms-otp"
                selectionColor={tintColor}
              />
            ))}
          </View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              { backgroundColor: tintColor },
              (!isFormComplete || isLoading) && {
                backgroundColor: buttonDisabledColor,
              },
            ]}
            onPress={handleVerify}
            disabled={!isFormComplete || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <ThemedText style={styles.verifyButtonText}>Verify</ThemedText>
            )}
          </TouchableOpacity>

          <View style={styles.resendContainer}>
            <ThemedText
              style={[styles.resendText, { color: secondaryTextColor }]}
            >
              Didn't receive the code?
            </ThemedText>

            <TouchableOpacity onPress={handleResendCode} disabled={!canResend}>
              <ThemedText
                style={[
                  styles.resendButtonText,
                  { color: canResend ? tintColor : secondaryTextColor },
                ]}
              >
                {canResend ? 'Resend Code' : `Resend code in ${countdown}s`}
              </ThemedText>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={20} color={secondaryTextColor} />
            <ThemedText
              style={[styles.backButtonText, { color: secondaryTextColor }]}
            >
              Back to login
            </ThemedText>
          </TouchableOpacity>
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
    alignItems: 'center',
  },
  icon: {
    marginVertical: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    marginBottom: 30,
    textAlign: 'center',
  },
  messageContainer: {
    padding: 10,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  messageText: {
    fontSize: 14,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 30,
  },
  otpInput: {
    width: 46,
    height: 56,
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  verifyButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  verifyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    alignItems: 'center',
    marginTop: 10,
  },
  resendText: {
    fontSize: 14,
    marginBottom: 8,
  },
  resendButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    alignSelf: 'center',
  },
  backButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
})
