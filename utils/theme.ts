import { useThemeColor } from '@/hooks/useThemeColor'
import { useColorScheme } from '@/hooks/useColorScheme'

/**
 * A utility function to get a theme object with all colors
 * This is useful for components that need multiple theme colors
 */
export function useTheme() {
  const colorScheme = useColorScheme() || 'light'

  return {
    text: useThemeColor({}, 'text'),
    background: useThemeColor({}, 'background'),
    tint: useThemeColor({}, 'tint'),
    icon: useThemeColor({}, 'icon'),
    tabIconDefault: useThemeColor({}, 'tabIconDefault'),
    tabIconSelected: useThemeColor({}, 'tabIconSelected'),
    cardBackground: useThemeColor({}, 'cardBackground'),
    border: useThemeColor({}, 'border'),
    placeholder: useThemeColor({}, 'placeholder'),
    error: useThemeColor({}, 'error'),
    success: useThemeColor({}, 'success'),
    warning: useThemeColor({}, 'warning'),
    inputBackground: useThemeColor({}, 'inputBackground'),
    secondaryText: useThemeColor({}, 'secondaryText'),
    divider: useThemeColor({}, 'divider'),
    shadow: useThemeColor({}, 'shadow'),
    unread: useThemeColor({}, 'unread'),
    upvote: useThemeColor({}, 'upvote'),
    downvote: useThemeColor({}, 'downvote'),
    like: useThemeColor({}, 'like'),
    buttonDisabled: useThemeColor({}, 'buttonDisabled'),
    isDark: colorScheme === 'dark',
  }
}

/**
 * Shadow styles that adapt to the current theme
 */
export function getThemedShadow(elevation = 2) {
  const shadowColor = useThemeColor({}, 'shadow')
  const isDark = useColorScheme() === 'dark'

  if (isDark) {
    return {
      shadowColor,
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.3,
      shadowRadius: elevation * 1.5,
      elevation: elevation * 2,
    }
  }

  return {
    shadowColor,
    shadowOffset: { width: 0, height: elevation },
    shadowOpacity: 0.1,
    shadowRadius: elevation,
    elevation,
  }
}
