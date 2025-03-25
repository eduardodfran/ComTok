import { useState, useEffect } from 'react'
import {
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Image,
} from 'react-native'
import { Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { PostCard } from '@/components/PostCard'
import { mockPosts } from '@/services/mockData'
import { Post } from '@/types/post'
import { AuthUser } from '@/types/auth'
import { searchUsers } from '@/services/userService'

type SearchTab = 'posts' | 'users' | 'communities'

export default function SearchScreen() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<SearchTab>('posts')
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<{
    posts: Post[]
    users: AuthUser[]
    communities: any[]
  }>({
    posts: [],
    users: [],
    communities: [],
  })

  useEffect(() => {
    const performSearch = async () => {
      if (!searchQuery.trim()) {
        setResults({ posts: [], users: [], communities: [] })
        return
      }

      setIsLoading(true)

      try {
        // Search posts
        const lowercaseQuery = searchQuery.toLowerCase()
        const filteredPosts = mockPosts.filter(
          (post) =>
            post.title.toLowerCase().includes(lowercaseQuery) ||
            post.content.toLowerCase().includes(lowercaseQuery)
        )

        // Search users
        const userResults = await searchUsers(searchQuery)

        // Search communities would use a similar approach
        // For demo, we'll just use empty array

        setResults({
          posts: filteredPosts,
          users: userResults,
          communities: [],
        })
      } catch (error) {
        console.error('Error performing search:', error)
      } finally {
        setIsLoading(false)
      }
    }

    const delaySearch = setTimeout(() => {
      performSearch()
    }, 500)

    return () => clearTimeout(delaySearch)
  }, [searchQuery])

  const handleClearSearch = () => {
    setSearchQuery('')
  }

  const renderUserItem = ({ item }: { item: AuthUser }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() =>
        router.push({
          pathname: '/user/[id]',
          params: { id: item.id },
        })
      }
    >
      {item.profilePic ? (
        <Image source={{ uri: item.profilePic }} style={styles.userAvatar} />
      ) : (
        <View style={styles.userAvatarPlaceholder}>
          <ThemedText style={styles.userAvatarInitial}>
            {item.username.charAt(0).toUpperCase()}
          </ThemedText>
        </View>
      )}

      <View style={styles.userInfo}>
        <ThemedText style={styles.username}>{item.username}</ThemedText>
        <ThemedText style={styles.userBio}>
          Following {item.followedProvinces.length} provinces
        </ThemedText>
      </View>
    </TouchableOpacity>
  )

  const renderEmptyState = () => (
    <ThemedView style={styles.emptyContainer}>
      {searchQuery ? (
        <>
          <Ionicons name="search-outline" size={64} color="#687076" />
          <ThemedText style={styles.emptyTitle}>No results found</ThemedText>
          <ThemedText style={styles.emptyDescription}>
            We couldn't find anything matching "{searchQuery}"
          </ThemedText>
        </>
      ) : (
        <>
          <Ionicons name="search" size={64} color="#687076" />
          <ThemedText style={styles.emptyTitle}>Search ComTok</ThemedText>
          <ThemedText style={styles.emptyDescription}>
            Search for posts, users, or communities
          </ThemedText>
        </>
      )}
    </ThemedView>
  )

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen options={{ title: 'Search' }} />

      <ThemedView style={styles.searchContainer}>
        <Ionicons
          name="search"
          size={20}
          color="#687076"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search ComTok"
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#687076"
          autoFocus
          returnKeyType="search"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={handleClearSearch}>
            <Ionicons name="close-circle" size={20} color="#687076" />
          </TouchableOpacity>
        ) : null}
      </ThemedView>

      <ThemedView style={styles.tabsContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'posts' && styles.activeTab]}
          onPress={() => setActiveTab('posts')}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'posts' && styles.activeTabText,
            ]}
          >
            Posts
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'users' && styles.activeTab]}
          onPress={() => setActiveTab('users')}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'users' && styles.activeTabText,
            ]}
          >
            Users
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'communities' && styles.activeTab]}
          onPress={() => setActiveTab('communities')}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'communities' && styles.activeTabText,
            ]}
          >
            Communities
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {isLoading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0a7ea4" />
        </ThemedView>
      ) : (
        <>
          {activeTab === 'posts' && (
            <FlatList
              data={results.posts}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => <PostCard post={item} />}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={renderEmptyState}
            />
          )}

          {activeTab === 'users' && (
            <FlatList
              data={results.users}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderUserItem}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={renderEmptyState}
            />
          )}

          {activeTab === 'communities' && (
            <FlatList
              data={results.communities}
              keyExtractor={(item, index) => index.toString()}
              renderItem={() => null}
              contentContainerStyle={styles.listContent}
              ListEmptyComponent={renderEmptyState}
            />
          )}
        </>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#11181C',
    paddingVertical: 8,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E1E1E1',
    marginBottom: 8,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    fontSize: 16,
    color: '#687076',
  },
  activeTabText: {
    fontWeight: '600',
    color: '#0a7ea4',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyDescription: {
    fontSize: 14,
    color: '#687076',
    textAlign: 'center',
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 16,
  },
  userAvatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#0a7ea4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  userAvatarInitial: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  userBio: {
    fontSize: 14,
    color: '#687076',
  },
})
