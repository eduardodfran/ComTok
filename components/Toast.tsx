import React, { useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { ThemedText } from './ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface ToastProps {
  visible: boolean
  message: string
  type?: ToastType
  duration?: number
  onClose?: () => void
}

export function Toast({
  visible,
  message,
  type = 'info',
  duration = 3000,
  onClose,
}: ToastProps) {
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(-20)).current

  // Get theme colors
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const textColor = useThemeColor({}, 'text')
  const successColor = useThemeColor({}, 'success')
  const errorColor = useThemeColor({}, 'error')
  const warningColor = useThemeColor({}, 'warning')
  const tintColor = useThemeColor({}, 'tint')
  const shadowColor = useThemeColor({}, 'shadow')

  useEffect(() => {
    let hideTimeout: NodeJS.Timeout

    if (visible) {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()

      hideTimeout = setTimeout(() => {
        onClose && onClose()
      }, duration)
    } else {
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start()
    }

    return () => {
      clearTimeout(hideTimeout)
    }
  }, [visible, opacity, translateY, duration, onClose])

  if (!visible && opacity._value === 0) return null

  // Get icon and color based on type
  let iconName: keyof typeof Ionicons.glyphMap
  let iconColor: string

  switch (type) {
    case 'success':
      iconName = 'checkmark-circle'
      iconColor = successColor
      break
    case 'error':
      iconName = 'alert-circle'
      iconColor = errorColor
      break
    case 'warning':
      iconName = 'warning'
      iconColor = warningColor
      break
    case 'info':
    default:
      iconName = 'information-circle'
      iconColor = tintColor
      break
  }

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity,
          transform: [{ translateY }],
          backgroundColor: cardBgColor,
          shadowColor,
        },
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={iconName}
          size={24}
          color={iconColor}
          style={styles.icon}
        />
        <ThemedText
          style={[styles.message, { color: textColor }]}
          numberOfLines={2}
        >
          {message}
        </ThemedText>
      </View>

      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Ionicons name="close" size={20} color={textColor} />
      </TouchableOpacity>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60, // Below status bar and header
    left: 20,
    right: 20,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 1000,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  closeButton: {
    marginLeft: 8,
    padding: 4,
  },
})
