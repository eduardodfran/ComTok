import { useState, useEffect } from 'react'
import {
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  View,
  ActivityIndicator,
  FlatList,
} from 'react-native'
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { PostCard } from '@/components/PostCard'
import { mockPosts } from '@/services/mockData'
import { getUserById } from '@/services/userService'
import { ReportModal } from '@/components/ReportModal'
import { useAuth } from '@/contexts/AuthContext'
import { Post } from '@/types/post'
import { AuthUser } from '@/types/auth'

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams()
  const router = useRouter()
  const { user: currentUser } = useAuth()

  const [user, setUser] = useState<AuthUser | null>(null)
  const [userPosts, setUserPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)

  const userId = typeof id === 'string' ? parseInt(id, 10) : 0
  const isCurrentUser = currentUser?.id === userId

  useEffect(() => {
    const fetchUserAndPosts = async () => {
      setIsLoading(true)
      try {
        // Fetch user profile data
        const userData = await getUserById(userId)
        setUser(userData)

        // Fetch posts by this user
        const posts = mockPosts.filter((post) => post.user.id === userId)
        setUserPosts(posts)
      } catch (error) {
        console.error('Error fetching user profile:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserAndPosts()
  }, [userId])

  const handleFollow = () => {
    setIsFollowing(!isFollowing)
    // In a real app, this would call an API to follow/unfollow
  }

  const handleReport = async (reason: string, details: string) => {
    // In a real app, this would send a report to the backend
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setReportModalVisible(false)
    router.push('/notifications')
  }

  const renderHeader = () => {
    if (!user) return null

    return (
      <ThemedView style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {user.profilePic ? (
            <Image
              source={{ uri: user.profilePic }}
              style={styles.profileImage}
            />
          ) : (
            <View style={styles.profilePlaceholder}>
              <ThemedText style={styles.profileInitial}>
                {user.username.charAt(0).toUpperCase()}
              </ThemedText>
            </View>
          )}
        </View>

        <ThemedText type="subtitle" style={styles.username}>
          {user.username}
        </ThemedText>

        <ThemedText style={styles.joinDate}>Joined {user.createdAt}</ThemedText>

        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>{userPosts.length}</ThemedText>
            <ThemedText style={styles.statLabel}>Posts</ThemedText>
          </ThemedView>

          <View style={styles.statDivider} />

          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>
              {user.followedProvinces.length}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </ThemedView>

          <View style={styles.statDivider} />

          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Followers</ThemedText>
          </ThemedView>
        </ThemedView>

        {!isCurrentUser && (
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.followButton,
                isFollowing && styles.followingButton,
              ]}
              onPress={handleFollow}
            >
              <Ionicons
                name={isFollowing ? 'checkmark' : 'person-add-outline'}
                size={20}
                color={isFollowing ? '#0a7ea4' : '#FFFFFF'}
              />
              <ThemedText
                style={[
                  styles.followButtonText,
                  isFollowing && styles.followingButtonText,
                ]}
              >
                {isFollowing ? 'Following' : 'Follow'}
              </ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.messageButton}
              onPress={() => {
                /* Navigate to messages in a real app */
              }}
            >
              <Ionicons name="chatbubble-outline" size={20} color="#0a7ea4" />
              <ThemedText style={styles.messageButtonText}>Message</ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <ThemedText type="subtitle" style={styles.sectionTitle}>
          Recent Posts
        </ThemedText>
      </ThemedView>
    )
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    )
  }

  if (!user) {
    return (
      <ThemedView style={styles.errorContainer}>
        <Ionicons name="person-outline" size={64} color="#687076" />
        <ThemedText type="subtitle" style={styles.errorText}>
          User not found
        </ThemedText>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ThemedText style={styles.backButtonText}>Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: user?.username || 'User Profile',
          headerRight: () =>
            !isCurrentUser && (
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => setReportModalVisible(true)}
              >
                <Ionicons name="flag-outline" size={24} color="#687076" />
              </TouchableOpacity>
            ),
        }}
      />

      {userPosts.length > 0 ? (
        <FlatList
          data={userPosts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <PostCard post={item} />}
          ListHeaderComponent={renderHeader}
          contentContainerStyle={styles.postsList}
        />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {renderHeader()}
          <ThemedView style={styles.emptyState}>
            <Ionicons name="document-text-outline" size={64} color="#687076" />
            <ThemedText style={styles.emptyStateText}>No posts yet</ThemedText>
          </ThemedView>
        </ScrollView>
      )}

      <ReportModal
        visible={reportModalVisible}
        onClose={() => setReportModalVisible(false)}
        onSubmit={handleReport}
        contentType="user"
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 16,
    marginBottom: 20,
  },
  backButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollContainer: {
    flexGrow: 1,
  },
  profileHeader: {
    padding: 20,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  profilePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileInitial: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  username: {
    textAlign: 'center',
    marginBottom: 4,
  },
  joinDate: {
    textAlign: 'center',
    color: '#687076',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E1E1E1',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#687076',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    marginRight: 8,
  },
  followingButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  followButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  followingButtonText: {
    color: '#0a7ea4',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0a7ea4',
    borderRadius: 8,
    paddingVertical: 10,
    flex: 1,
    marginLeft: 8,
  },
  messageButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  postsList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#687076',
    marginTop: 16,
    fontSize: 16,
  },
  reportButton: {
    padding: 8,
  },
})
