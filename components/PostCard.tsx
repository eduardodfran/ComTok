import { StyleSheet, TouchableOpacity, Image, View } from 'react-native'
import { useRouter } from 'expo-router'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Post } from '@/types/post'
import { useColorScheme } from '@/hooks/useColorScheme'
import { useThemeColor } from '@/hooks/useThemeColor'

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: PostCardProps) {
  const router = useRouter()
  const colorScheme = useColorScheme()
  const [votes, setVotes] = useState(post.votes)
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null)
  const [showOptions, setShowOptions] = useState(false)

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const borderColor = useThemeColor({}, 'border')
  const upvoteColor = useThemeColor({}, 'upvote')
  const downvoteColor = useThemeColor({}, 'downvote')
  const shadowColor = useThemeColor({}, 'shadow')

  const handleUpvote = () => {
    if (userVote === 'up') {
      setVotes(votes - 1)
      setUserVote(null)
    } else {
      setVotes(userVote === 'down' ? votes + 2 : votes + 1)
      setUserVote('up')
    }
  }

  const handleDownvote = () => {
    if (userVote === 'down') {
      setVotes(votes + 1)
      setUserVote(null)
    } else {
      setVotes(userVote === 'up' ? votes - 2 : votes - 1)
      setUserVote('down')
    }
  }

  const navigateToPostDetail = () => {
    router.push({
      pathname: '/post/[id]',
      params: { id: post.id },
    })
  }

  const navigateToComments = () => {
    router.push({
      pathname: '/post/[id]',
      params: { id: post.id },
    })
  }

  const navigateToUserProfile = () => {
    router.push({
      pathname: '/user/[id]',
      params: { id: post.user.id },
    })
  }

  const handleShare = () => {
    // Here we would implement the share functionality
    // This will be similar to the implementation in post/[id].tsx
  }

  const handleReport = () => {
    router.push({
      pathname: '/post/[id]',
      params: { id: post.id, report: 'true' },
    })
  }

  return (
    <ThemedView
      style={[
        styles.container,
        { shadowColor, backgroundColor: cardBgColor, borderColor },
      ]}
      colorName="cardBackground"
    >
      <ThemedView style={styles.header} colorName="cardBackground">
        <TouchableOpacity
          style={styles.profilePicContainer}
          onPress={navigateToUserProfile}
        >
          {post.user.profilePic ? (
            <Image
              source={{ uri: post.user.profilePic }}
              style={styles.profilePic}
            />
          ) : (
            <View style={[styles.profilePic, styles.defaultProfilePic]} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.userInfoContainer}
          onPress={navigateToUserProfile}
        >
          <ThemedText type="defaultSemiBold">{post.user.username}</ThemedText>
          <ThemedText style={styles.communityText}>
            {post.province}/{post.city} • {post.timeAgo}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Ionicons name="ellipsis-horizontal" size={20} color={iconColor} />
        </TouchableOpacity>
      </ThemedView>

      {showOptions && (
        <View
          style={[
            styles.optionsMenu,
            { backgroundColor: cardBgColor, borderColor },
          ]}
        >
          <TouchableOpacity style={styles.optionItem} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color={iconColor} />
            <ThemedText style={styles.optionText}>Share</ThemedText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.optionItem} onPress={handleReport}>
            <Ionicons name="flag-outline" size={18} color="#E53935" />
            <ThemedText style={[styles.optionText, { color: '#E53935' }]}>
              Report
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <TouchableOpacity onPress={navigateToPostDetail} activeOpacity={0.7}>
        <ThemedText type="defaultSemiBold" style={styles.title}>
          {post.title}
        </ThemedText>
        <ThemedText style={styles.content} numberOfLines={3}>
          {post.content}
        </ThemedText>

        {post.imageUrl && (
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
        )}
      </TouchableOpacity>

      <ThemedView style={styles.footer} colorName="cardBackground">
        <ThemedView style={styles.voteContainer} colorName="cardBackground">
          <TouchableOpacity onPress={handleUpvote} style={styles.voteButton}>
            <Ionicons
              name={userVote === 'up' ? 'arrow-up' : 'arrow-up-outline'}
              size={20}
              color={userVote === 'up' ? upvoteColor : iconColor}
            />
          </TouchableOpacity>

          <ThemedText style={styles.voteCount}>{votes}</ThemedText>

          <TouchableOpacity onPress={handleDownvote} style={styles.voteButton}>
            <Ionicons
              name={userVote === 'down' ? 'arrow-down' : 'arrow-down-outline'}
              size={20}
              color={userVote === 'down' ? downvoteColor : iconColor}
            />
          </TouchableOpacity>
        </ThemedView>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={navigateToComments}
        >
          <Ionicons name="chatbubble-outline" size={20} color={iconColor} />
          <ThemedText style={styles.actionText} colorName="secondaryText">
            {post.commentCount}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={20} color={iconColor} />
          <ThemedText style={styles.actionText} colorName="secondaryText">
            Share
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    marginBottom: 16,
    padding: 16,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  profilePicContainer: {
    marginRight: 10,
  },
  profilePic: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  defaultProfilePic: {
    backgroundColor: '#DDD',
  },
  communityText: {
    fontSize: 12,
    opacity: 0.7,
  },
  title: {
    fontSize: 18,
    marginBottom: 8,
  },
  content: {
    marginBottom: 12,
  },
  postImage: {
    height: 200,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: '#f0f0f0',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  voteButton: {
    padding: 4,
  },
  voteCount: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 4,
    minWidth: 24,
    textAlign: 'center',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  actionText: {
    marginLeft: 4,
    fontSize: 14,
  },
  userInfoContainer: {
    flex: 1,
  },
  optionsButton: {
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 40,
    right: 10,
    borderRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    padding: 5,
    minWidth: 120,
    borderWidth: 1,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  optionText: {
    marginLeft: 8,
    fontSize: 14,
  },
})
