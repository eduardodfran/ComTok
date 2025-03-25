import { useState } from 'react'
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  View,
  Alert,
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAuth } from '@/contexts/AuthContext'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useThemeColor } from '@/hooks/useThemeColor'
import { Colors } from '@/constants/Colors'

export default function SettingsScreen() {
  const { isAuthenticated, logout } = useAuth()
  const router = useRouter()
  const colorScheme = useColorScheme()
  const isDark = colorScheme === 'dark'

  // Get theme colors
  const errorColor = useThemeColor({}, 'error')
  const iconColor = useThemeColor({}, 'icon')
  const dividerColor = useThemeColor({}, 'divider')
  const sectionHeaderBg = useThemeColor({}, 'inputBackground')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const tintColor = useThemeColor({}, 'tint')

  const [darkModeEnabled, setDarkModeEnabled] = useState(isDark)
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = useState(true)
  const [emailNotificationsEnabled, setEmailNotificationsEnabled] =
    useState(true)

  const handleLogout = async () => {
    Alert.alert('Log Out', 'Are you sure you want to log out?', [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Log Out',
        style: 'destructive',
        onPress: () => logout(),
      },
    ])
  }

  const handleDarkModeToggle = (value: boolean) => {
    setDarkModeEnabled(value)
    Alert.alert(
      'Theme Change',
      'This feature will be available in a future update.',
      [{ text: 'OK' }]
    )
  }

  const renderSectionHeader = (title: string) => (
    <ThemedView
      style={[styles.sectionHeader, { backgroundColor: sectionHeaderBg }]}
    >
      <ThemedText
        style={[styles.sectionHeaderText, { color: secondaryTextColor }]}
      >
        {title}
      </ThemedText>
    </ThemedView>
  )

  const renderSettingItem = (
    icon: string,
    title: string,
    rightElement?: React.ReactNode,
    onPress?: () => void,
    destructive: boolean = false
  ) => (
    <TouchableOpacity
      style={[styles.settingItem, { borderBottomColor: dividerColor }]}
      onPress={onPress}
      disabled={!onPress}
    >
      <View style={styles.settingIconContainer}>
        <Ionicons
          name={icon as any}
          size={20}
          color={destructive ? errorColor : iconColor}
        />
      </View>
      <ThemedText
        style={[styles.settingText, destructive && { color: errorColor }]}
      >
        {title}
      </ThemedText>
      {rightElement ||
        (onPress && (
          <Ionicons name="chevron-forward" size={18} color={iconColor} />
        ))}
    </TouchableOpacity>
  )

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Settings' }} />

      <ScrollView style={styles.scrollContainer}>
        {renderSectionHeader('Appearance')}

        {renderSettingItem(
          'moon-outline',
          'Dark Mode',
          <Switch
            value={darkModeEnabled}
            onValueChange={handleDarkModeToggle}
            trackColor={{ false: '#D1D1D6', true: tintColor }}
            thumbColor={'#FFFFFF'}
          />
        )}

        {renderSettingItem('text-outline', 'Text Size', undefined, () =>
          Alert.alert(
            'Text Size',
            'This feature will be available in a future update.'
          )
        )}

        {renderSectionHeader('Notifications')}

        {renderSettingItem(
          'notifications-outline',
          'Push Notifications',
          <Switch
            value={pushNotificationsEnabled}
            onValueChange={setPushNotificationsEnabled}
            trackColor={{ false: '#D1D1D6', true: '#0a7ea4' }}
            thumbColor={'#FFFFFF'}
          />
        )}

        {renderSettingItem(
          'mail-outline',
          'Email Notifications',
          <Switch
            value={emailNotificationsEnabled}
            onValueChange={setEmailNotificationsEnabled}
            trackColor={{ false: '#D1D1D6', true: '#0a7ea4' }}
            thumbColor={'#FFFFFF'}
          />
        )}

        {renderSettingItem(
          'notifications-circle-outline',
          'Notification Preferences',
          undefined,
          () => router.push('/settings/notifications')
        )}

        {renderSectionHeader('Account')}

        {renderSettingItem(
          'person-outline',
          'Account Information',
          undefined,
          () => router.push('/settings/account')
        )}

        {renderSettingItem('lock-closed-outline', 'Privacy', undefined, () =>
          router.push('/settings/privacy')
        )}

        {renderSettingItem('shield-outline', 'Security', undefined, () =>
          router.push('/settings/security')
        )}

        {isAuthenticated &&
          renderSettingItem(
            'log-out-outline',
            'Log Out',
            undefined,
            handleLogout,
            true
          )}

        {renderSectionHeader('Support')}

        {renderSettingItem(
          'help-circle-outline',
          'Help Center',
          undefined,
          () => router.push('/settings/help')
        )}

        {renderSettingItem('chatbubble-outline', 'Contact Us', undefined, () =>
          router.push('/settings/contact')
        )}

        {renderSettingItem(
          'information-circle-outline',
          'About ComTok',
          undefined,
          () => router.push('/settings/about')
        )}

        <ThemedView style={styles.versionContainer}>
          <ThemedText
            style={[styles.versionText, { color: secondaryTextColor }]}
          >
            ComTok v1.0.0
          </ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sectionHeaderText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  settingIconContainer: {
    width: 36,
    alignItems: 'center',
    marginRight: 16,
  },
  settingText: {
    flex: 1,
    fontSize: 16,
  },
  destructiveText: {
    color: '#E53935',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  versionText: {
    fontSize: 14,
  },
})
