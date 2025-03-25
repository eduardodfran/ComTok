import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Switch, Appearance } from 'react-native'
import { useColorScheme } from '@/hooks/useColorScheme'
import { ThemedText } from './ThemedText'
import { useThemeColor } from '@/hooks/useThemeColor'

interface ThemeSwitchProps {
  onChange?: (isDarkMode: boolean) => void
}

export function ThemeSwitch({ onChange }: ThemeSwitchProps) {
  const colorScheme = useColorScheme()
  const [isDarkMode, setIsDarkMode] = useState(colorScheme === 'dark')

  // Get theme colors
  const tintColor = useThemeColor({}, 'tint')

  useEffect(() => {
    setIsDarkMode(colorScheme === 'dark')
  }, [colorScheme])

  const toggleTheme = (value: boolean) => {
    setIsDarkMode(value)
    if (onChange) {
      onChange(value)
    }

    // In a real app, you would set the theme here
    // For example, using AsyncStorage or another state management solution
  }

  return (
    <View style={styles.container}>
      <ThemedText style={styles.label}>
        {isDarkMode ? 'Dark Mode' : 'Light Mode'}
      </ThemedText>
      <Switch
        value={isDarkMode}
        onValueChange={toggleTheme}
        trackColor={{ false: '#D1D1D6', true: tintColor }}
        thumbColor={'#FFFFFF'}
        ios_backgroundColor="#D1D1D6"
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  label: {
    fontSize: 16,
  },
})
