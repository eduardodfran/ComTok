import { useEffect } from 'react'
import {
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  View,
  ActivityIndicator,
  RefreshControl,
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useNotifications } from '@/contexts/NotificationContext'
import { useAuth } from '@/contexts/AuthContext'
import { Notification } from '@/types/notification'

export default function NotificationsScreen() {
  const {
    notifications,
    isLoading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
  } = useNotifications()
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAllAsRead = async () => {
    await markAllAsRead()
  }

  const handleNotificationPress = async (notification: Notification) => {
    // Mark as read when tapped
    if (!notification.read) {
      await markAsRead(notification.id)
    }

    // Navigate based on notification type
    if (
      notification.type === 'like' ||
      notification.type === 'comment' ||
      notification.type === 'reply'
    ) {
      if (notification.postId) {
        router.push({
          pathname: '/post/[id]',
          params: { id: notification.postId },
        })
      }
    } else if (notification.type === 'follow' && notification.provinceId) {
      router.push({
        pathname: '/province/[id]',
        params: {
          id: notification.provinceId,
          name: notification.provinceName,
        },
      })
    }
  }

  if (!isAuthenticated) {
    return (
      <ThemedView style={styles.container}>
        <Stack.Screen options={{ title: 'Notifications' }} />
        <ThemedView style={styles.centerContainer}>
          <Ionicons
            name="notifications-off-outline"
            size={64}
            color="#687076"
          />
          <ThemedText style={styles.infoText}>
            Please login to see your notifications
          </ThemedText>
          <TouchableOpacity
            style={styles.loginButton}
            onPress={() => router.push('/auth/login')}
          >
            <ThemedText style={styles.loginButtonText}>Login</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: 'Notifications',
          headerRight: () =>
            unreadCount > 0 ? (
              <TouchableOpacity
                style={styles.markAllButton}
                onPress={handleMarkAllAsRead}
              >
                <ThemedText style={styles.markAllText}>
                  Mark all as read
                </ThemedText>
              </TouchableOpacity>
            ) : null,
        }}
      />

      {isLoading && notifications.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <ActivityIndicator color="#0a7ea4" size="large" />
        </ThemedView>
      ) : notifications.length === 0 ? (
        <ThemedView style={styles.centerContainer}>
          <Ionicons name="notifications-outline" size={64} color="#687076" />
          <ThemedText style={styles.infoText}>
            You don't have any notifications yet
          </ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id.toString()}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={fetchNotifications}
              colors={['#0a7ea4']}
              tintColor="#0a7ea4"
            />
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.notificationItem, !item.read && styles.unreadItem]}
              onPress={() => handleNotificationPress(item)}
            >
              {!item.read && <View style={styles.unreadDot} />}

              {item.type === 'system' ? (
                <View style={styles.systemNotification}>
                  <Ionicons
                    name="information-circle"
                    size={40}
                    color="#0a7ea4"
                  />
                  <View style={styles.notificationContent}>
                    <ThemedText style={styles.systemText}>
                      {item.text}
                    </ThemedText>
                    <ThemedText style={styles.timeText}>
                      {item.createdAt}
                    </ThemedText>
                  </View>
                </View>
              ) : (
                <View style={styles.userNotification}>
                  {item.user?.profilePic ? (
                    <Image
                      source={{ uri: item.user.profilePic }}
                      style={styles.userImage}
                    />
                  ) : (
                    <View style={styles.userPlaceholder}>
                      <ThemedText style={styles.userPlaceholderText}>
                        {item.user?.username.charAt(0).toUpperCase() || '?'}
                      </ThemedText>
                    </View>
                  )}

                  <View style={styles.notificationContent}>
                    <ThemedText>
                      <ThemedText type="defaultSemiBold">
                        {item.user?.username}{' '}
                      </ThemedText>
                      <ThemedText>{item.text} </ThemedText>
                      {item.postTitle && (
                        <ThemedText type="defaultSemiBold">
                          "{item.postTitle}"
                        </ThemedText>
                      )}
                      {item.provinceName && (
                        <ThemedText type="defaultSemiBold">
                          {item.provinceName}
                        </ThemedText>
                      )}
                    </ThemedText>
                    <ThemedText style={styles.timeText}>
                      {item.createdAt}
                    </ThemedText>
                  </View>

                  {item.type === 'like' && (
                    <Ionicons
                      name="heart"
                      size={20}
                      color="#E91E63"
                      style={styles.typeIcon}
                    />
                  )}
                  {item.type === 'comment' && (
                    <Ionicons
                      name="chatbubble"
                      size={20}
                      color="#2196F3"
                      style={styles.typeIcon}
                    />
                  )}
                  {item.type === 'reply' && (
                    <Ionicons
                      name="return-down-back"
                      size={20}
                      color="#4CAF50"
                      style={styles.typeIcon}
                    />
                  )}
                  {item.type === 'follow' && (
                    <Ionicons
                      name="person-add"
                      size={20}
                      color="#0a7ea4"
                      style={styles.typeIcon}
                    />
                  )}
                </View>
              )}
            </TouchableOpacity>
          )}
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  infoText: {
    marginTop: 16,
    fontSize: 16,
    textAlign: 'center',
    color: '#687076',
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  markAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  markAllText: {
    color: '#0a7ea4',
    fontSize: 14,
  },
  notificationItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    position: 'relative',
  },
  unreadItem: {
    backgroundColor: 'rgba(10, 126, 164, 0.05)',
  },
  unreadDot: {
    position: 'absolute',
    top: 16,
    left: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0a7ea4',
  },
  systemNotification: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 10,
  },
  userNotification: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E1E1E1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  userPlaceholderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  notificationContent: {
    flex: 1,
    marginRight: 10,
  },
  systemText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#11181C',
  },
  timeText: {
    color: '#687076',
    fontSize: 12,
    marginTop: 4,
  },
  typeIcon: {
    alignSelf: 'center',
  },
})
