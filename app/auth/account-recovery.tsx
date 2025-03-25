import { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter, useLocalSearchParams } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useThemeColor } from '@/hooks/useThemeColor'
import * as LockoutService from '@/services/lockoutService'

export default function AccountRecoveryScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const email = typeof params.email === 'string' ? params.email : ''

  const [submittedEmail, setSubmittedEmail] = useState(email)
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  // Get theme colors
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const iconColor = useThemeColor({}, 'icon')
  const tintColor = useThemeColor({}, 'tint')
  const borderColor = useThemeColor({}, 'border')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')
  const successColor = useThemeColor({}, 'success')
  const successBgColor = useThemeColor({}, 'cardBackground')

  const handleResetLockout = async () => {
    if (!submittedEmail) return

    setIsLoading(true)

    try {
      // In a real app, this would send a recovery email or SMS
      // For demo purposes, we'll just reset the lockout
      await LockoutService.resetLockout(submittedEmail)
      await new Promise((resolve) => setTimeout(resolve, 1500)) // Simulate API delay

      setSuccess(true)
    } catch (error) {
      Alert.alert('Error', 'Failed to process account recovery request')
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
            uri: 'https://images.unsplash.com/photo-1574337960472-869a5c5fbd74?q=80&w=1000',
          }}
          style={styles.headerImage}
        />

        <ThemedView
          style={[styles.formContainer, { backgroundColor: cardBgColor }]}
        >
          <Ionicons
            name="shield"
            size={64}
            color={tintColor}
            style={styles.icon}
          />

          <ThemedText type="title" style={styles.title}>
            Account Recovery
          </ThemedText>

          <ThemedText style={[styles.subtitle, { color: secondaryTextColor }]}>
            {success
              ? 'Your account has been unlocked successfully.'
              : 'Enter your email to unlock your account after too many failed login attempts.'}
          </ThemedText>

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
                Account successfully unlocked. You can now return to the login
                screen.
              </ThemedText>
            </ThemedView>
          )}

          {!success && (
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
                value={submittedEmail}
                onChangeText={setSubmittedEmail}
                placeholderTextColor={secondaryTextColor}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </ThemedView>
          )}

          {!success ? (
            <TouchableOpacity
              style={[
                styles.unlockButton,
                { backgroundColor: tintColor },
                (!submittedEmail || isLoading) && {
                  backgroundColor: buttonDisabledColor,
                },
              ]}
              onPress={handleResetLockout}
              disabled={!submittedEmail || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <ThemedText style={styles.unlockButtonText}>
                  Unlock Account
                </ThemedText>
              )}
            </TouchableOpacity>
          ) : (
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
          )}

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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 24,
    height: 50,
    width: '100%',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
  },
  unlockButton: {
    borderRadius: 8,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },
  unlockButtonText: {
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
    width: '100%',
  },
  returnButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 14,
    marginLeft: 5,
  },
})
