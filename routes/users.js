const express = require('express')
const router = express.Router()
const {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} = require('firebase/auth')
const {
  getDocumentById,
  addDocument,
  updateDocument,
  queryDocuments,
} = require('../utils/database')
const { auth } = require('../config/firebase')

// Register a new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, username } = req.body

    // Validate input
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and username',
      })
    }

    // Check if username exists
    const usernameCheck = await queryDocuments('users', [
      {
        field: 'username',
        operator: '==',
        value: username,
      },
    ])

    if (usernameCheck.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Username already exists',
      })
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Create user profile in Firestore
    const userProfile = {
      uid: user.uid,
      email,
      username,
      avatarUrl: null,
      bio: '',
      joinedCommunities: [],
      postCount: 0,
      commentCount: 0,
    }

    await addDocument('users', userProfile)

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        uid: user.uid,
        email: user.email,
      },
    })
  } catch (error) {
    // Handle Firebase Auth errors
    if (error.code === 'auth/email-already-in-use') {
      return res.status(400).json({
        success: false,
        message: 'Email already in use',
      })
    }

    next(error)
  }
})

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password',
      })
    }

    // Sign in user
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    )
    const user = userCredential.user

    // Get user profile from Firestore
    const conditions = [
      {
        field: 'uid',
        operator: '==',
        value: user.uid,
      },
    ]

    const userProfiles = await queryDocuments('users', conditions)

    if (userProfiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      })
    }

    const userProfile = userProfiles[0]

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        uid: user.uid,
        email: user.email,
        username: userProfile.username,
        avatarUrl: userProfile.avatarUrl,
        bio: userProfile.bio,
      },
    })
  } catch (error) {
    // Handle Firebase Auth errors
    if (
      error.code === 'auth/user-not-found' ||
      error.code === 'auth/wrong-password'
    ) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    next(error)
  }
})

// Get user profile
router.get('/profile/:uid', async (req, res, next) => {
  try {
    const conditions = [
      {
        field: 'uid',
        operator: '==',
        value: req.params.uid,
      },
    ]

    const userProfiles = await queryDocuments('users', conditions)

    if (userProfiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      })
    }

    const userProfile = userProfiles[0]

    // Remove sensitive information
    delete userProfile.email

    res.status(200).json({
      success: true,
      data: userProfile,
    })
  } catch (error) {
    next(error)
  }
})

// Update user profile
router.put('/profile/:uid', async (req, res, next) => {
  try {
    const { username, bio, avatarUrl } = req.body

    // Find user by UID
    const conditions = [
      {
        field: 'uid',
        operator: '==',
        value: req.params.uid,
      },
    ]

    const userProfiles = await queryDocuments('users', conditions)

    if (userProfiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      })
    }

    const userProfile = userProfiles[0]

    // Check if username exists if it's being changed
    if (username && username !== userProfile.username) {
      const usernameCheck = await queryDocuments('users', [
        {
          field: 'username',
          operator: '==',
          value: username,
        },
      ])

      if (usernameCheck.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Username already exists',
        })
      }
    }

    // Update profile
    const updates = {}

    if (username) updates.username = username
    if (bio !== undefined) updates.bio = bio
    if (avatarUrl) updates.avatarUrl = avatarUrl

    await updateDocument('users', userProfile.id, updates)

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
    })
  } catch (error) {
    next(error)
  }
})

// Get user's joined communities
router.get('/profile/:uid/communities', async (req, res, next) => {
  try {
    // Find user by UID
    const conditions = [
      {
        field: 'uid',
        operator: '==',
        value: req.params.uid,
      },
    ]

    const userProfiles = await queryDocuments('users', conditions)

    if (userProfiles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User profile not found',
      })
    }

    const userProfile = userProfiles[0]

    // Get communities
    const communities = []

    for (const communityId of userProfile.joinedCommunities) {
      try {
        const community = await getDocumentById('communities', communityId)
        communities.push(community)
      } catch (error) {
        console.error(`Error fetching community ${communityId}:`, error)
      }
    }

    res.status(200).json({
      success: true,
      count: communities.length,
      data: communities,
    })
  } catch (error) {
    next(error)
  }
})

module.exports = router
