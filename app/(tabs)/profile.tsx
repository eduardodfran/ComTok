import {
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  View,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { useAuth } from '@/contexts/AuthContext'
import { useNotifications } from '@/contexts/NotificationContext'

export default function ProfileScreen() {
  const { user, isAuthenticated, logout, isLoading } = useAuth()
  const { unreadCount } = useNotifications()
  const router = useRouter()

  const handleLogin = () => {
    router.push('/auth/login')
  }

  const handleSignup = () => {
    router.push('/auth/signup')
  }

  const handleLogout = async () => {
    await logout()
  }

  if (!isAuthenticated && !isLoading) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.notLoggedInContainer}>
          <Ionicons name="person-circle-outline" size={80} color="#687076" />
          <ThemedText style={styles.notLoggedInText}>
            Login or create an account to view your profile
          </ThemedText>

          <View style={styles.authButtonsContainer}>
            <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
              <ThemedText style={styles.loginButtonText}>Login</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={handleSignup}
            >
              <ThemedText style={styles.signupButtonText}>Sign Up</ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <ThemedView style={styles.headerRightContainer}>
          <TouchableOpacity
            style={styles.settingsButton}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={24} color="#687076" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.profileHeader}>
          <View style={styles.profileImageContainer}>
            {user?.profilePic ? (
              <Image
                source={{ uri: user.profilePic }}
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profilePlaceholder}>
                <ThemedText style={styles.profileInitial}>
                  {user?.username?.charAt(0).toUpperCase() || 'U'}
                </ThemedText>
              </View>
            )}
          </View>

          <ThemedText type="subtitle" style={styles.username}>
            {user?.username || 'User'}
          </ThemedText>
          <ThemedText style={styles.joinDate}>
            Joined {user?.createdAt || 'recently'}
          </ThemedText>

          <TouchableOpacity style={styles.editProfileButton}>
            <ThemedText style={styles.editProfileText}>Edit Profile</ThemedText>
          </TouchableOpacity>
        </ThemedView>

        {/* Stats Section */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Posts</ThemedText>
          </ThemedView>
          <View style={styles.statDivider} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>
              {user?.followedProvinces?.length || 0}
            </ThemedText>
            <ThemedText style={styles.statLabel}>Following</ThemedText>
          </ThemedView>
          <View style={styles.statDivider} />
          <ThemedView style={styles.statItem}>
            <ThemedText style={styles.statValue}>0</ThemedText>
            <ThemedText style={styles.statLabel}>Karma</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Menu Options */}
        <ThemedView style={styles.menuContainer}>
          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="document-text-outline" size={22} color="#687076" />
            <ThemedText style={styles.menuText}>My Posts</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#687076" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/notifications')}
          >
            <Ionicons name="notifications-outline" size={22} color="#687076" />
            <ThemedText style={styles.menuText}>Notifications</ThemedText>
            {unreadCount > 0 && (
              <View style={styles.badgeContainer}>
                <ThemedText style={styles.badgeText}>{unreadCount}</ThemedText>
              </View>
            )}
            <Ionicons name="chevron-forward" size={20} color="#687076" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="bookmark-outline" size={22} color="#687076" />
            <ThemedText style={styles.menuText}>Saved</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#687076" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem}>
            <Ionicons name="help-circle-outline" size={22} color="#687076" />
            <ThemedText style={styles.menuText}>Help & Support</ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#687076" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={22} color="#E53935" />
            <ThemedText style={[styles.menuText, { color: '#E53935' }]}>
              Log Out
            </ThemedText>
            <Ionicons name="chevron-forward" size={20} color="#E53935" />
          </TouchableOpacity>
        </ThemedView>

        <ThemedView style={styles.footer}>
          <ThemedText style={styles.footerText}>ComTok v1.0.0</ThemedText>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16, // Reduced top padding
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  settingsButton: {
    padding: 8,
  },
  notLoggedInContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  notLoggedInText: {
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 32,
    color: '#687076',
  },
  authButtonsContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loginButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  signupButtonText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  scrollContainer: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  profileImageContainer: {
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
    marginBottom: 4,
  },
  joinDate: {
    color: '#687076',
    marginBottom: 16,
  },
  editProfileButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  editProfileText: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginHorizontal: 20,
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
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
  menuContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  menuText: {
    flex: 1,
    marginLeft: 16,
    fontSize: 16,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 10,
  },
  footerText: {
    color: '#687076',
    fontSize: 12,
  },
  badgeContainer: {
    backgroundColor: '#E53935',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
    paddingHorizontal: 5,
  },
  headerRightContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    marginBottom: 8,
  },
})
