import { StyleSheet, View, Platform } from 'react-native'
import { BlurView } from 'expo-blur'

import { useColorScheme } from '@/hooks/useColorScheme'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function TabBarBackground() {
  const colorScheme = useColorScheme()
  const backgroundColor = useThemeColor({}, 'cardBackground')
  const isDark = colorScheme === 'dark'

  // On iOS, use a blur effect for a more native feel
  if (Platform.OS === 'ios') {
    return (
      <BlurView
        intensity={70}
        tint={isDark ? 'dark' : 'light'}
        style={StyleSheet.absoluteFill}
      />
    )
  }

  // On Android and other platforms, use solid background color
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        { backgroundColor },
        styles.androidTabBar,
      ]}
    />
  )
}

const styles = StyleSheet.create({
  androidTabBar: {
    elevation: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(0, 0, 0, 0.1)',
  },
})

export function useBottomTabOverflow() {
  return 0
}
