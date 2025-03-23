const express = require('express')
const router = express.Router()
const {
  getAllDocuments,
  getDocumentById,
  addDocument,
  updateDocument,
  deleteDocument,
  queryDocuments,
} = require('../utils/database')

// Get all posts or filter by community
router.get('/', async (req, res, next) => {
  try {
    const { communityId, userId, category } = req.query
    let conditions = []

    if (communityId) {
      conditions.push({
        field: 'communityId',
        operator: '==',
        value: communityId,
      })
    }

    if (userId) {
      conditions.push({
        field: 'userId',
        operator: '==',
        value: userId,
      })
    }

    if (category) {
      conditions.push({
        field: 'category',
        operator: '==',
        value: category,
      })
    }

    const options = {
      orderBy: {
        field: 'createdAt',
        direction: 'desc',
      },
    }

    const posts =
      conditions.length > 0
        ? await queryDocuments('posts', conditions, options)
        : await queryDocuments('posts', [], options)

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (error) {
    next(error)
  }
})

// Get trending posts
router.get('/trending', async (req, res, next) => {
  try {
    const options = {
      orderBy: {
        field: 'upvotes',
        direction: 'desc',
      },
      limit: 10,
    }

    const posts = await queryDocuments('posts', [], options)

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    })
  } catch (error) {
    next(error)
  }
})

// Get a specific post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await getDocumentById('posts', req.params.id)
    res.status(200).json({
      success: true,
      data: post,
    })
  } catch (error) {
    next(error)
  }
})

// Create a new post
router.post('/', async (req, res, next) => {
  try {
    // Validate the request body
    const { title, content, userId, communityId, category, location } = req.body

    if (!title || !content || !userId || !communityId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    // Create the post
    const post = {
      title,
      content,
      userId,
      communityId,
      category: category || 'general',
      location: location || {},
      upvotes: 0,
      downvotes: 0,
      comments: 0,
      upvotedBy: [],
      downvotedBy: [],
    }

    const docRef = await addDocument('posts', post)

    // Update community activity
    const community = await getDocumentById('communities', communityId)
    await updateDocument('communities', communityId, {
      activity: community.activity + 1,
    })

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...post,
      },
    })
  } catch (error) {
    next(error)
  }
})

// Upvote a post
router.post('/:id/upvote', async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID',
      })
    }

    // Get the post
    const post = await getDocumentById('posts', req.params.id)

    // Check if the user already upvoted
    if (post.upvotedBy.includes(userId)) {
      // Remove upvote
      const updatedUpvotedBy = post.upvotedBy.filter((id) => id !== userId)

      await updateDocument('posts', req.params.id, {
        upvotedBy: updatedUpvotedBy,
        upvotes: updatedUpvotedBy.length,
      })

      return res.status(200).json({
        success: true,
        message: 'Upvote removed successfully',
      })
    }

    // Remove from downvoted if present
    let updatedDownvotedBy = [...post.downvotedBy]
    let wasDownvoted = false

    if (post.downvotedBy.includes(userId)) {
      updatedDownvotedBy = post.downvotedBy.filter((id) => id !== userId)
      wasDownvoted = true
    }

    // Add upvote
    const updatedUpvotedBy = [...post.upvotedBy, userId]

    await updateDocument('posts', req.params.id, {
      upvotedBy: updatedUpvotedBy,
      upvotes: updatedUpvotedBy.length,
      downvotedBy: updatedDownvotedBy,
      downvotes: updatedDownvotedBy.length,
    })

    res.status(200).json({
      success: true,
      message: wasDownvoted
        ? 'Changed from downvote to upvote'
        : 'Upvoted successfully',
    })
  } catch (error) {
    next(error)
  }
})

// Downvote a post
router.post('/:id/downvote', async (req, res, next) => {
  try {
    const { userId } = req.body

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a user ID',
      })
    }

    // Get the post
    const post = await getDocumentById('posts', req.params.id)

    // Check if the user already downvoted
    if (post.downvotedBy.includes(userId)) {
      // Remove downvote
      const updatedDownvotedBy = post.downvotedBy.filter((id) => id !== userId)

      await updateDocument('posts', req.params.id, {
        downvotedBy: updatedDownvotedBy,
        downvotes: updatedDownvotedBy.length,
      })

      return res.status(200).json({
        success: true,
        message: 'Downvote removed successfully',
      })
    }

    // Remove from upvoted if present
    let updatedUpvotedBy = [...post.upvotedBy]
    let wasUpvoted = false

    if (post.upvotedBy.includes(userId)) {
      updatedUpvotedBy = post.upvotedBy.filter((id) => id !== userId)
      wasUpvoted = true
    }

    // Add downvote
    const updatedDownvotedBy = [...post.downvotedBy, userId]

    await updateDocument('posts', req.params.id, {
      downvotedBy: updatedDownvotedBy,
      downvotes: updatedDownvotedBy.length,
      upvotedBy: updatedUpvotedBy,
      upvotes: updatedUpvotedBy.length,
    })

    res.status(200).json({
      success: true,
      message: wasUpvoted
        ? 'Changed from upvote to downvote'
        : 'Downvoted successfully',
    })
  } catch (error) {
    next(error)
  }
})

// Get comments for a post
router.get('/:id/comments', async (req, res, next) => {
  try {
    const conditions = [
      {
        field: 'postId',
        operator: '==',
        value: req.params.id,
      },
    ]

    const options = {
      orderBy: {
        field: 'createdAt',
        direction: 'asc',
      },
    }

    const comments = await queryDocuments('comments', conditions, options)

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments,
    })
  } catch (error) {
    next(error)
  }
})

// Add a comment to a post
router.post('/:id/comments', async (req, res, next) => {
  try {
    const { content, userId } = req.body

    if (!content || !userId) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields',
      })
    }

    // Create the comment
    const comment = {
      content,
      userId,
      postId: req.params.id,
      upvotes: 0,
      downvotes: 0,
      upvotedBy: [],
      downvotedBy: [],
    }

    const docRef = await addDocument('comments', comment)

    // Update post comments count
    const post = await getDocumentById('posts', req.params.id)
    await updateDocument('posts', req.params.id, {
      comments: post.comments + 1,
    })

    // Update community activity
    const community = await getDocumentById('communities', post.communityId)
    await updateDocument('communities', post.communityId, {
      activity: community.activity + 1,
    })

    res.status(201).json({
      success: true,
      data: {
        id: docRef.id,
        ...comment,
      },
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
