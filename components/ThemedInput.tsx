import React, { useState } from 'react'
import {
  TextInput,
  StyleSheet,
  View,
  TextInputProps,
  TouchableOpacity,
  ViewStyle,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ThemedText } from './ThemedText'

interface ThemedInputProps extends TextInputProps {
  label?: string
  error?: string
  leftIcon?: string
  rightIcon?: string
  onRightIconPress?: () => void
  containerStyle?: ViewStyle
}

export function ThemedInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  containerStyle,
  style,
  ...restProps
}: ThemedInputProps) {
  const [isFocused, setIsFocused] = useState(false)

  // Get theme colors
  const textColor = useThemeColor({}, 'text')
  const placeholderColor = useThemeColor({}, 'secondaryText')
  const backgroundColor = useThemeColor({}, 'inputBackground')
  const borderColor = isFocused
    ? useThemeColor({}, 'tint')
    : useThemeColor({}, 'border')
  const errorColor = useThemeColor({}, 'error')
  const iconColor = useThemeColor({}, 'icon')

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <ThemedText style={styles.label}>{label}</ThemedText>}

      <View
        style={[
          styles.inputContainer,
          { backgroundColor, borderColor: error ? errorColor : borderColor },
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
          style={[styles.input, { color: textColor }, style]}
          placeholderTextColor={placeholderColor}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...restProps}
        />

        {rightIcon && (
          <TouchableOpacity
            onPress={onRightIconPress}
            disabled={!onRightIconPress}
          >
            <Ionicons
              name={rightIcon as any}
              size={20}
              color={iconColor}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <ThemedText style={[styles.errorText, { color: errorColor }]}>
          {error}
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
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  leftIcon: {
    marginLeft: 12,
  },
  rightIcon: {
    marginRight: 12,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
  },
})
