import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { useState, useEffect } from 'react'
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { PostCard } from '@/components/PostCard'
import { cities, mockPosts, provinces } from '@/services/mockData'
import { Post } from '@/types/post'
import { formatNumber } from '@/utils/formatters'
import { useThemeColor } from '@/hooks/useThemeColor'
import { getThemedShadow } from '@/utils/theme'

export default function ProvinceScreen() {
  const { id, name } = useLocalSearchParams()
  const router = useRouter()
  const provinceId = typeof id === 'string' ? parseInt(id, 10) : 0
  const provinceName = typeof name === 'string' ? name : ''

  const [provincePosts, setProvincePosts] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState(false)
  const provinceCities = cities[provinceName] || []
  const province = provinces.find((p) => p.id === provinceId)

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const tintColor = useThemeColor({}, 'tint')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const dividerColor = useThemeColor({}, 'divider')
  const shadow = getThemedShadow(1)

  useEffect(() => {
    // Filter posts for this province
    const filteredPosts = mockPosts.filter(
      (post) => post.province === provinceName
    )
    setProvincePosts(filteredPosts)
  }, [provinceName])

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen
        options={{
          title: provinceName,
          headerShown: true,
        }}
      />

      {/* Province stats */}
      <ThemedView
        style={[styles.statsCard, { backgroundColor: cardBgColor, ...shadow }]}
      >
        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>
              {formatNumber(province?.memberCount || 0)}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: secondaryTextColor }]}
            >
              Members
            </ThemedText>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: dividerColor }]}
          />
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>
              {formatNumber(province?.postCount || 0)}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: secondaryTextColor }]}
            >
              Posts
            </ThemedText>
          </View>
          <View
            style={[styles.statDivider, { backgroundColor: dividerColor }]}
          />
          <View style={styles.stat}>
            <ThemedText style={styles.statValue}>
              {provinceCities.length}
            </ThemedText>
            <ThemedText
              style={[styles.statLabel, { color: secondaryTextColor }]}
            >
              Cities
            </ThemedText>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.followButton,
            { backgroundColor: isFollowing ? 'transparent' : tintColor },
            isFollowing && { borderColor: tintColor, borderWidth: 1 },
          ]}
          onPress={() => setIsFollowing(!isFollowing)}
        >
          <Ionicons
            name={isFollowing ? 'checkmark' : 'add'}
            size={18}
            color={isFollowing ? tintColor : '#fff'}
          />
          <ThemedText
            style={[
              styles.followButtonText,
              { color: isFollowing ? tintColor : '#fff' },
            ]}
          >
            {isFollowing ? 'Following' : 'Follow'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      {/* Cities list */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Cities
      </ThemedText>
      <FlatList
        horizontal
        data={provinceCities}
        keyExtractor={(item) => item.id.toString()}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.citiesList}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.cityCard,
              { backgroundColor: cardBgColor, ...shadow },
            ]}
          >
            <ThemedText style={styles.cityName}>{item.name}</ThemedText>
            <ThemedText
              style={[styles.cityStats, { color: secondaryTextColor }]}
            >
              {formatNumber(item.memberCount)} members
            </ThemedText>
          </TouchableOpacity>
        )}
      />

      {/* Posts section */}
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Recent Posts
      </ThemedText>

      <FlatList
        data={provincePosts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <PostCard post={item} />}
        contentContainerStyle={styles.postsList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <ThemedView style={styles.emptyState}>
            <ThemedText colorName="secondaryText">
              No posts yet in this province.
            </ThemedText>
            <TouchableOpacity
              style={[styles.createPostButton, { backgroundColor: tintColor }]}
            >
              <ThemedText style={styles.createPostButtonText}>
                Create the first post
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>
        }
      />
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  statsCard: {
    marginHorizontal: 20,
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
  },
  followButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 8,
  },
  followButtonText: {
    fontWeight: '600',
    marginLeft: 8,
  },
  sectionTitle: {
    marginHorizontal: 20,
    marginBottom: 12,
  },
  citiesList: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  cityCard: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 120,
  },
  cityName: {
    fontWeight: '600',
    marginBottom: 4,
  },
  cityStats: {
    fontSize: 12,
  },
  postsList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createPostButton: {
    marginTop: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  createPostButtonText: {
    color: '#FFF',
    fontWeight: '600',
  },
})
