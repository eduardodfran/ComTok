import * as Haptics from 'expo-haptics'

// Check if Haptics is available
const isHapticsAvailable = () => {
  return (
    typeof Haptics !== 'undefined' &&
    Haptics !== null &&
    typeof Haptics.impactAsync === 'function' &&
    typeof Haptics.notificationAsync === 'function'
  )
}

/**
 * Triggers a light haptic feedback (for button presses, etc)
 */
export function lightHaptic() {
  if (isHapticsAvailable()) {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)
    } catch (error) {
      console.warn('Haptic feedback error:', error)
    }
  }
}

/**
 * Triggers a medium haptic feedback (for tab selections, etc)
 */
export function mediumHaptic() {
  if (isHapticsAvailable()) {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
    } catch (error) {
      console.warn('Haptic feedback error:', error)
    }
  }
}

/**
 * Triggers a heavy haptic feedback (for significant UI events)
 */
export function heavyHaptic() {
  if (isHapticsAvailable()) {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy)
    } catch (error) {
      console.warn('Haptic feedback error:', error)
    }
  }
}

/**
 * Triggers a success notification haptic feedback
 */
export function successHaptic() {
  if (isHapticsAvailable()) {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)
    } catch (error) {
      console.warn('Haptic feedback error:', error)
    }
  }
}

/**
 * Triggers an error notification haptic feedback
 */
export function errorHaptic() {
  if (isHapticsAvailable()) {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error)
    } catch (error) {
      console.warn('Haptic feedback error:', error)
    }
  }
}

/**
 * Triggers a warning notification haptic feedback
 */
export function warningHaptic() {
  if (isHapticsAvailable()) {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning)
    } catch (error) {
      console.warn('Haptic feedback error:', error)
    }
  }
}
