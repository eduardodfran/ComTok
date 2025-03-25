import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native'
import { useThemeColor } from '@/hooks/useThemeColor'

interface ThemedButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'destructive'
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

export function ThemedButton({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  iconPosition = 'left',
}: ThemedButtonProps) {
  // Get theme colors
  const tintColor = useThemeColor({}, 'tint')
  const textColor = useThemeColor({}, 'text')
  const backgroundColor = useThemeColor({}, 'background')
  const errorColor = useThemeColor({}, 'error')
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')

  // Determine button styles based on variant
  let buttonStyle: ViewStyle = {}
  let labelStyle: TextStyle = {}

  switch (variant) {
    case 'primary':
      buttonStyle = {
        backgroundColor: tintColor,
      }
      labelStyle = {
        color: '#FFFFFF',
      }
      break
    case 'secondary':
      buttonStyle = {
        backgroundColor: useThemeColor({}, 'inputBackground'),
      }
      labelStyle = {
        color: tintColor,
      }
      break
    case 'outline':
      buttonStyle = {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: tintColor,
      }
      labelStyle = {
        color: tintColor,
      }
      break
    case 'destructive':
      buttonStyle = {
        backgroundColor: errorColor,
      }
      labelStyle = {
        color: '#FFFFFF',
      }
      break
  }

  // Apply size styles
  let sizeStyle: ViewStyle = {}
  let textSizeStyle: TextStyle = {}

  switch (size) {
    case 'small':
      sizeStyle = styles.smallButton
      textSizeStyle = styles.smallText
      break
    case 'medium':
      sizeStyle = styles.mediumButton
      textSizeStyle = styles.mediumText
      break
    case 'large':
      sizeStyle = styles.largeButton
      textSizeStyle = styles.largeText
      break
  }

  // Apply disabled styles
  if (disabled || loading) {
    buttonStyle = {
      ...buttonStyle,
      backgroundColor: buttonDisabledColor,
      borderColor: buttonDisabledColor,
    }
    labelStyle = {
      ...labelStyle,
      opacity: 0.7,
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, sizeStyle, buttonStyle, style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'outline' ? tintColor : '#FFFFFF'}
        />
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          <Text style={[styles.text, textSizeStyle, labelStyle, textStyle]}>
            {title}
          </Text>
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },
  text: {
    fontWeight: '600',
  },
  smallButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  mediumButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
  },
  largeButton: {
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
})
