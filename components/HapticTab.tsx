import { TouchableOpacity } from 'react-native'
import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { mediumHaptic } from '@/utils/haptics'

export function HapticTab({
  accessibilityState,
  onPress,
  ...props
}: BottomTabBarButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={(e) => {
        mediumHaptic()
        onPress?.(e)
      }}
      {...props}
    />
  )
}
