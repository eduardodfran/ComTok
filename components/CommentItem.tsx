import { View, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import { Comment } from '@/types/comment'
import { useThemeColor } from '@/hooks/useThemeColor'

interface CommentItemProps {
  comment: Comment
  onLike: (comment: Comment) => Promise<void>
  onReport?: (comment: Comment) => void
}

export function CommentItem({ comment, onLike, onReport }: CommentItemProps) {
  const router = useRouter()
  const [isLiking, setIsLiking] = useState(false)
  const [showReplies, setShowReplies] = useState(false)
  const [showOptions, setShowOptions] = useState(false)

  // Get theme colors
  const cardBgColor = useThemeColor({}, 'inputBackground')
  const iconColor = useThemeColor({}, 'icon')
  const dividerColor = useThemeColor({}, 'divider')
  const likeColor = useThemeColor({}, 'like')
  const errorColor = useThemeColor({}, 'error')
  const shadowColor = useThemeColor({}, 'shadow')
  const bgColor = useThemeColor({}, 'cardBackground')

  const handleLike = async () => {
    if (isLiking) return

    setIsLiking(true)
    try {
      await onLike(comment)
    } finally {
      setIsLiking(false)
    }
  }

  const navigateToUserProfile = () => {
    router.push({
      pathname: '/user/[id]',
      params: { id: comment.user.id },
    })
  }

  const handleReport = () => {
    if (onReport) {
      onReport(comment)
    }
    setShowOptions(false)
  }

  return (
    <ThemedView style={[styles.commentCard, { backgroundColor: cardBgColor }]}>
      <View style={styles.commentHeader}>
        <TouchableOpacity
          style={styles.commentUserInfo}
          onPress={navigateToUserProfile}
        >
          {comment.user.profilePic ? (
            <Image
              source={{ uri: comment.user.profilePic }}
              style={styles.commentUserPic}
            />
          ) : (
            <View style={[styles.commentUserPic, styles.defaultProfilePic]} />
          )}
          <View>
            <ThemedText type="defaultSemiBold" style={styles.commentUsername}>
              {comment.user.username}
            </ThemedText>
            <ThemedText style={styles.commentTime} colorName="secondaryText">
              {comment.createdAt}
            </ThemedText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionsButton}
          onPress={() => setShowOptions(!showOptions)}
        >
          <Ionicons name="ellipsis-horizontal" size={18} color={iconColor} />
        </TouchableOpacity>
      </View>

      {showOptions && (
        <View
          style={[
            styles.optionsMenu,
            {
              backgroundColor: bgColor,
              borderColor: dividerColor,
              shadowColor,
            },
          ]}
        >
          <TouchableOpacity style={styles.optionItem} onPress={handleReport}>
            <Ionicons name="flag-outline" size={18} color={errorColor} />
            <ThemedText style={[styles.optionText, { color: errorColor }]}>
              Report
            </ThemedText>
          </TouchableOpacity>
        </View>
      )}

      <ThemedText style={styles.commentContent}>{comment.content}</ThemedText>

      <View style={styles.commentActions}>
        <TouchableOpacity
          style={styles.likeButton}
          onPress={handleLike}
          disabled={isLiking}
        >
          <Ionicons
            name={comment.isLiked ? 'heart' : 'heart-outline'}
            size={18}
            color={comment.isLiked ? likeColor : iconColor}
          />
          <ThemedText
            style={[styles.likeCount, comment.isLiked && { color: likeColor }]}
            colorName="secondaryText"
          >
            {comment.likes}
          </ThemedText>
        </TouchableOpacity>

        <TouchableOpacity style={styles.replyButton}>
          <Ionicons
            name="return-down-back-outline"
            size={18}
            color={iconColor}
          />
          <ThemedText style={styles.replyText} colorName="secondaryText">
            Reply
          </ThemedText>
        </TouchableOpacity>
      </View>

      {comment.replies && comment.replies.length > 0 && (
        <>
          <TouchableOpacity
            style={[styles.showRepliesButton, { borderTopColor: dividerColor }]}
            onPress={() => setShowReplies(!showReplies)}
          >
            <Ionicons
              name={showReplies ? 'chevron-up' : 'chevron-down'}
              size={16}
              color={iconColor}
            />
            <ThemedText
              style={styles.showRepliesText}
              colorName="secondaryText"
            >
              {showReplies ? 'Hide' : 'Show'} {comment.replies.length}{' '}
              {comment.replies.length === 1 ? 'reply' : 'replies'}
            </ThemedText>
          </TouchableOpacity>

          {showReplies && (
            <View
              style={[
                styles.repliesContainer,
                { borderLeftColor: dividerColor },
              ]}
            >
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReport={onReport}
                />
              ))}
            </View>
          )}
        </>
      )}
    </ThemedView>
  )
}

const styles = StyleSheet.create({
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
  defaultProfilePic: {
    backgroundColor: '#DDD',
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
  showRepliesButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#EFEFEF',
  },
  showRepliesText: {
    fontSize: 12,
    color: '#687076',
    marginLeft: 4,
  },
  repliesContainer: {
    marginTop: 12,
    paddingLeft: 16,
    borderLeftWidth: 1,
    borderLeftColor: '#EFEFEF',
  },
  optionsButton: {
    padding: 5,
  },
  optionsMenu: {
    position: 'absolute',
    top: 40,
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
    minWidth: 120,
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
