import { FlatList, StyleSheet, TouchableOpacity } from 'react-native'
import { useEffect, useState } from 'react'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { PostCard } from '@/components/PostCard'
import { mockPosts } from '@/services/mockData'
import { Post } from '@/types/post'

export default function HomeScreen() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'trending' | 'following'>(
    'trending'
  )

  useEffect(() => {
    // Simulate fetching data
    const fetchPosts = async () => {
      try {
        // In a real app, this would be an API call
        setPosts(mockPosts)
      } catch (error) {
        console.error('Failed to fetch posts', error)
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('trending')}
          style={[styles.tab, activeTab === 'trending' && styles.activeTab]}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'trending' && styles.activeTabText,
            ]}
          >
            Trending
          </ThemedText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setActiveTab('following')}
          style={[styles.tab, activeTab === 'following' && styles.activeTab]}
        >
          <ThemedText
            style={[
              styles.tabText,
              activeTab === 'following' && styles.activeTabText,
            ]}
          >
            Following
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ThemedText>Loading posts...</ThemedText>
        </ThemedView>
      ) : (
        <FlatList
          data={posts}
          renderItem={({ item }) => <PostCard post={item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.postList}
          showsVerticalScrollIndicator={false}
        />
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  tab: {
    marginRight: 24,
    paddingBottom: 8,
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#0a7ea4',
  },
  tabText: {
    fontSize: 16,
  },
  activeTabText: {
    fontWeight: '600',
    color: '#0a7ea4',
  },
  postList: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
})
