import { Tabs } from 'expo-router'
import React from 'react'
import { Platform, TouchableOpacity, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { HapticTab } from '@/components/HapticTab'
import TabBarBackground from '@/components/ui/TabBarBackground'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useThemeColor } from '@/hooks/useThemeColor'
import { ThemedText } from '@/components/ThemedText'

function TabsHeader() {
  const router = useRouter()
  const iconColor = useThemeColor({}, 'icon')

  return (
    <TouchableOpacity
      style={{ marginRight: 16 }}
      onPress={() => router.push('/search')}
    >
      <Ionicons name="search" size={24} color={iconColor} />
    </TouchableOpacity>
  )
}

function HomeHeader() {
  const tintColor = useThemeColor({}, 'tint')
  return (
    <ThemedText style={[styles.logoText, { color: tintColor }]}>
      ComTok
    </ThemedText>
  )
}

export default function TabLayout() {
  const colorScheme = useColorScheme()
  const tintColor = useThemeColor({}, 'tint')
  const tabIconDefaultColor = useThemeColor({}, 'tabIconDefault')
  const borderColor = useThemeColor({}, 'border')

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: tintColor,
        tabBarInactiveTintColor: tabIconDefaultColor,
        headerShown: true, // Re-enable headers for all tabs
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
            borderTopColor: borderColor,
            borderTopWidth: 0.5,
          },
          default: {
            borderTopColor: borderColor,
            borderTopWidth: 0.5,
          },
        }),
        headerRight: () => <TabsHeader />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
          headerTitle: () => <HomeHeader />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="compass" size={size} color={color} />
          ),
          headerTitle: 'Explore Communities',
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Post',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
          headerTitle: 'Create Post',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
          headerTitle: 'Profile',
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
})
