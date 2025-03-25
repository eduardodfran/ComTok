import React, { useState } from 'react'
import {
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  TextInputProps,
  ViewStyle,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ThemedText } from './ThemedText'

interface FormInputProps extends TextInputProps {
  label?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  error?: string
  hint?: string
  containerStyle?: ViewStyle
  secureTextEntry?: boolean
  showTogglePasswordButton?: boolean
}

export function FormInput({
  label,
  leftIcon,
  rightIcon,
  onRightIconPress,
  error,
  hint,
  containerStyle,
  secureTextEntry,
  showTogglePasswordButton,
  ...restProps
}: FormInputProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')
  const errorColor = useThemeColor({}, 'error')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')

  // Determine border color based on state
  const inputBorderColor = error
    ? errorColor
    : isFocused
    ? tintColor
    : borderColor

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const actualSecureTextEntry = secureTextEntry && !showPassword

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <View
        style={[
          styles.inputContainer,
          {
            borderColor: inputBorderColor,
            backgroundColor: inputBgColor,
          },
        ]}
      >
        {leftIcon && (
          <Ionicons
            name={leftIcon as any}
            size={20}
            color={iconColor}
            style={styles.leftIcon}
          />
        )}

        <TextInput
          style={[styles.input, { color: textColor }]}
          placeholderTextColor={secondaryTextColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={actualSecureTextEntry}
          {...restProps}
        />

        {showTogglePasswordButton && secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIconButton}
          >
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={iconColor}
            />
          </TouchableOpacity>
        )}

        {rightIcon && !showTogglePasswordButton && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
            style={styles.rightIconButton}
          >
            <Ionicons name={rightIcon as any} size={20} color={iconColor} />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <ThemedText style={[styles.errorText, { color: errorColor }]}>
          {error}
        </ThemedText>
      )}

      {hint && !error && (
        <ThemedText style={[styles.hintText, { color: secondaryTextColor }]}>
          {hint}
        </ThemedText>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    height: 50,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: 16,
    paddingVertical: 8,
  },
  leftIcon: {
    marginRight: 10,
  },
  rightIconButton: {
    padding: 4,
    marginLeft: 4,
  },
  errorText: {
    marginTop: 4,
    fontSize: 12,
  },
  hintText: {
    marginTop: 4,
    fontSize: 12,
  },
})
