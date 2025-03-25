import React, { useState } from 'react'
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
  TextInputProps,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useThemeColor } from '@/hooks/useThemeColor'

interface SearchBarProps extends TextInputProps {
  onClear?: () => void
}

export function SearchBar({
  value,
  onChangeText,
  placeholder = 'Search...',
  onClear,
  ...rest
}: SearchBarProps) {
  const [isFocused, setIsFocused] = useState(false)

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const textColor = useThemeColor({}, 'text')
  const borderColor = useThemeColor({}, 'border')
  const tintColor = useThemeColor({}, 'tint')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')

  const handleClear = () => {
    if (onChangeText) {
      onChangeText('')
    }
    if (onClear) {
      onClear()
    }
  }

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: inputBgColor,
          borderColor: isFocused ? tintColor : 'transparent',
          borderWidth: 1,
        },
      ]}
    >
      <Ionicons
        name="search"
        size={20}
        color={iconColor}
        style={styles.searchIcon}
      />

      <TextInput
        style={[styles.input, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={secondaryTextColor}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        returnKeyType="search"
        clearButtonMode="never" // We'll handle this ourselves for cross-platform
        {...rest}
      />

      {value && value.length > 0 && (
        <TouchableOpacity onPress={handleClear} style={styles.clearButton}>
          <Ionicons name="close-circle" size={20} color={iconColor} />
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    height: 48,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0, // Remove default padding
  },
  clearButton: {
    padding: 4,
  },
})
