import { useState, useEffect } from 'react'
import {
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  View,
  KeyboardAvoidingView,
  Platform,
  Share,
  Alert,
} from 'react-native'
import { useLocalSearchParams, Stack, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { mockPosts } from '@/services/mockData'
import { Post } from '@/types/post'
import { Comment } from '@/types/comment'
import * as commentService from '@/services/commentService'
import { useAuth } from '@/contexts/AuthContext'
import { CommentItem } from '@/components/CommentItem'
import { ReportModal } from '@/components/ReportModal'
import { useThemeColor } from '@/hooks/useThemeColor'

export default function PostDetailScreen() {
  const { id, report } = useLocalSearchParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showOptions, setShowOptions] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(
    report === 'true'
  )
  const [reportingComment, setReportingComment] = useState<Comment | null>(null)
  const [reportModalType, setReportModalType] = useState<'post' | 'comment'>(
    'post'
  )

  // Get theme colors
  const iconColor = useThemeColor({}, 'icon')
  const dividerColor = useThemeColor({}, 'divider')
  const cardBgColor = useThemeColor({}, 'cardBackground')
  const inputBgColor = useThemeColor({}, 'inputBackground')
  const secondaryTextColor = useThemeColor({}, 'secondaryText')
  const tintColor = useThemeColor({}, 'tint')
  const buttonDisabledColor = useThemeColor({}, 'buttonDisabled')
  const shadowColor = useThemeColor({}, 'shadow')

  // Fetch post and comments
  useEffect(() => {
    const fetchPostAndComments = async () => {
      setIsLoading(true)
      try {
        // In a real app, this would be an API call
        const postId = typeof id === 'string' ? parseInt(id, 10) : 0
        const foundPost = mockPosts.find((p) => p.id === postId)

        if (foundPost) {
          setPost(foundPost)
          const postComments = await commentService.getCommentsByPostId(postId)
          setComments(postComments)
        }
      } catch (error) {
        console.error('Error fetching post details:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPostAndComments()
  }, [id])

  const handlePostComment = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (!newComment.trim() || !post) return

    setIsSubmitting(true)
    try {
      const postId = post.id
      const userId = user?.id || 0
      const addedComment = await commentService.addComment(
        postId,
        userId,
        newComment
      )
      setComments((prev) => [addedComment, ...prev])
      setNewComment('')
    } catch (error) {
      console.error('Error posting comment:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleLikeComment = async (comment: Comment) => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    try {
      let updatedComment
      if (comment.isLiked) {
        updatedComment = await commentService.unlikeComment(comment.id)
      } else {
        updatedComment = await commentService.likeComment(comment.id)
      }

      setComments((prevComments) =>
        prevComments.map((c) =>
          c.id === updatedComment.id ? updatedComment : c
        )
      )
    } catch (error) {
      console.error('Error liking comment:', error)
    }
  }

  const handleSharePost = async () => {
    if (!post) return

    try {
      const result = await Share.share({
        message: `Check out this post on ComTok: ${post.title}\n\n${post.content}`,
        // In a real app, you would include a deep link URL here
        url: `https://comtok.example.com/post/${post.id}`,
      })
    } catch (error) {
      console.error('Error sharing post:', error)
    }
  }

  const handleReportComment = (comment: Comment) => {
    setReportingComment(comment)
    setReportModalType('comment')
    setReportModalVisible(true)
  }

  const handleReport = async (reason: string, details: string) => {
    // In a real app, this would send the report to your backend
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setReportModalVisible(false)
    setShowOptions(false)

    let message = ''
    if (reportModalType === 'post') {
      message =
        'Thank you for reporting this post. Our team will review it shortly.'
    } else {
      message =
        'Thank you for reporting this comment. Our team will review it shortly.'
      setReportingComment(null)
    }

    Alert.alert('Report Submitted', message, [{ text: 'OK' }])
  }

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
      </ThemedView>
    )
  }

  if (!post) {
    return (
      <ThemedView style={styles.errorContainer}>
        <ThemedText type="subtitle">Post not found</ThemedText>
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
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={100}
    >
      <ThemedView style={styles.container}>
        <Stack.Screen
          options={{
            title: 'Post',
            headerRight: () => (
              <TouchableOpacity
                style={styles.optionsButton}
                onPress={() => setShowOptions(!showOptions)}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={24}
                  color={iconColor}
                />
              </TouchableOpacity>
            ),
          }}
        />

        {/* Options menu with theme colors */}
        {showOptions && (
          <View
            style={[
              styles.optionsMenu,
              {
                backgroundColor: cardBgColor,
                borderColor: dividerColor,
                shadowColor,
              },
            ]}
          >
            <TouchableOpacity
              style={styles.optionItem}
              onPress={handleSharePost}
            >
              <Ionicons name="share-outline" size={20} color={iconColor} />
              <ThemedText style={styles.optionText}>Share</ThemedText>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionItem}
              onPress={() => {
                setReportModalVisible(true)
                setShowOptions(false)
              }}
            >
              <Ionicons name="flag-outline" size={20} color="#E53935" />
              <ThemedText style={[styles.optionText, { color: '#E53935' }]}>
                Report
              </ThemedText>
            </TouchableOpacity>
          </View>
        )}

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          {/* Post Header with theme colors */}
          <ThemedView
            style={[styles.postHeader, { borderBottomColor: dividerColor }]}
          >
            <TouchableOpacity
              style={styles.profilePicContainer}
              onPress={() =>
                router.push({
                  pathname: '/user/[id]',
                  params: { id: post?.user.id },
                })
              }
            >
              {post?.user.profilePic ? (
                <Image
                  source={{ uri: post.user.profilePic }}
                  style={styles.profilePic}
                />
              ) : (
                <View style={[styles.profilePic, styles.defaultProfilePic]} />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.userInfo}
              onPress={() =>
                router.push({
                  pathname: '/user/[id]',
                  params: { id: post?.user.id },
                })
              }
            >
              <ThemedText type="defaultSemiBold">
                {post?.user.username}
              </ThemedText>
              <ThemedText
                style={styles.communityText}
                colorName="secondaryText"
              >
                {post?.province}/{post?.city} • {post?.timeAgo}
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Post Content */}
          <ThemedView style={styles.postContent}>
            <ThemedText type="subtitle" style={styles.postTitle}>
              {post.title}
            </ThemedText>
            <ThemedText style={styles.postText}>{post.content}</ThemedText>

            {post.imageUrl && (
              <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
            )}
          </ThemedView>

          {/* Post Stats with theme colors */}
          <ThemedView
            style={[
              styles.postStats,
              {
                borderTopColor: dividerColor,
                borderBottomColor: dividerColor,
              },
            ]}
          >
            <ThemedView style={styles.statItem}>
              <Ionicons name="arrow-up-outline" size={18} color={iconColor} />
              <ThemedText style={styles.statText} colorName="secondaryText">
                {post.votes} votes
              </ThemedText>
            </ThemedView>

            <ThemedView style={styles.statItem}>
              <Ionicons name="chatbubble-outline" size={18} color={iconColor} />
              <ThemedText style={styles.statText} colorName="secondaryText">
                {comments.length} comments
              </ThemedText>
            </ThemedView>

            <TouchableOpacity style={styles.statItem} onPress={handleSharePost}>
              <Ionicons
                name="share-social-outline"
                size={18}
                color={iconColor}
              />
              <ThemedText style={styles.statText} colorName="secondaryText">
                Share
              </ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* Comments section */}
          <ThemedView style={styles.commentsSection}>
            <ThemedText type="subtitle" style={styles.commentsTitle}>
              Comments
            </ThemedText>

            {comments.length === 0 ? (
              <ThemedView
                style={[
                  styles.noCommentsContainer,
                  { backgroundColor: inputBgColor },
                ]}
              >
                <ThemedText
                  style={styles.noCommentsText}
                  colorName="secondaryText"
                >
                  No comments yet. Be the first to comment!
                </ThemedText>
              </ThemedView>
            ) : (
              comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  onLike={handleLikeComment}
                  onReport={handleReportComment}
                />
              ))
            )}
          </ThemedView>
        </ScrollView>

        {/* Comment Input with theme colors */}
        <ThemedView
          style={[
            styles.commentInputContainer,
            { borderTopColor: dividerColor },
          ]}
        >
          <TextInput
            style={[
              styles.commentInput,
              {
                backgroundColor: inputBgColor,
                color: useThemeColor({}, 'text'),
              },
            ]}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            placeholderTextColor={secondaryTextColor}
            multiline
          />
          <TouchableOpacity
            style={[
              styles.postButton,
              { backgroundColor: tintColor },
              (!newComment.trim() || isSubmitting) && {
                backgroundColor: buttonDisabledColor,
              },
            ]}
            onPress={handlePostComment}
            disabled={!newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <Ionicons name="send" size={18} color="#FFFFFF" />
            )}
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>

      <ReportModal
        visible={reportModalVisible}
        onClose={() => {
          setReportModalVisible(false)
          setReportingComment(null)
        }}
        onSubmit={handleReport}
        contentType={reportModalType}
      />
    </KeyboardAvoidingView>
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
  backButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#0a7ea4',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  profilePicContainer: {
    marginRight: 12,
  },
  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  defaultProfilePic: {
    backgroundColor: '#DDD',
  },
  userInfo: {
    flex: 1,
  },
  communityText: {
    fontSize: 12,
    color: '#687076',
  },
  postContent: {
    padding: 16,
  },
  postTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
  postText: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: 240,
    borderRadius: 12,
    marginBottom: 16,
  },
  postStats: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#F0F0F0',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
  },
  statText: {
    marginLeft: 6,
    color: '#687076',
  },
  commentsSection: {
    padding: 16,
    paddingBottom: 100, // Extra padding at the bottom
  },
  commentsTitle: {
    marginBottom: 16,
  },
  noCommentsContainer: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F9F9F9',
    borderRadius: 8,
  },
  noCommentsText: {
    color: '#687076',
    textAlign: 'center',
  },
  commentCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  commentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  commentUserInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentUserPic: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 10,
  },
  commentUsername: {
    fontSize: 14,
  },
  commentTime: {
    fontSize: 12,
    color: '#687076',
  },
  commentContent: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  likeCount: {
    fontSize: 12,
    color: '#687076',
    marginLeft: 4,
  },
  replyButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  replyText: {
    fontSize: 12,
    color: '#687076',
    marginLeft: 4,
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    backgroundColor: '#FFFFFF',
  },
  commentInput: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 100,
  },
  postButton: {
    backgroundColor: '#0a7ea4',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  postButtonDisabled: {
    backgroundColor: '#A0C4D1',
  },
  optionsButton: {
    padding: 8,
  },
  optionsMenu: {
    position: 'absolute',
    top: 56,
    right: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
    padding: 5,
    minWidth: 150,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  optionText: {
    marginLeft: 10,
    fontSize: 14,
  },
})
