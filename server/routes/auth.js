const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const { Op } = require('sequelize')
const User = require('../../models/User')

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ where: { email } })
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check password
    const isPasswordValid = await user.checkPassword(password)
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Return user data and token
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePic: user.profile_pic,
        createdAt: user.created_at,
        followedProvinces: [], // This would come from a separate query
        followedCities: [], // This would come from a separate query
      },
      token,
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// Signup endpoint
router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          existingUser.email === email
            ? 'Email already in use'
            : 'Username already taken',
      })
    }

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password_hash: password, // Will be hashed by the model hook
    })

    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    )

    // Return user data and token
    res.status(201).json({
      success: true,
      user: {
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        profilePic: newUser.profile_pic,
        createdAt: newUser.created_at,
        followedProvinces: [],
        followedCities: [],
      },
      token,
    })
  } catch (error) {
    console.error('Signup error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// Get current user endpoint
router.get('/me', async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user data
    const user = await User.findByPk(decoded.id)
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      })
    }

    // Return user data
    res.json({
      success: true,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        profilePic: user.profile_pic,
        createdAt: user.created_at,
        followedProvinces: [], // This would come from a separate query
        followedCities: [], // This would come from a separate query
      },
    })
  } catch (error) {
    console.error('Auth error:', error)
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
})

// Password reset request
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    // Check if the user exists
    const user = await User.findOne({ where: { email } })
    if (!user) {
      // For security reasons, always return success even if user doesn't exist
      return res.json({
        success: true,
        message:
          'If an account exists with this email, a reset link has been sent',
      })
    }

    // In a real app, you would generate a token and send an email here

    res.json({
      success: true,
      message:
        'If an account exists with this email, a reset link has been sent',
    })
  } catch (error) {
    console.error('Password reset error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    })
  }
})

// Logout endpoint (optional, as JWT are typically invalidated client-side)
router.post('/logout', (req, res) => {
  // In a real app, you might want to blacklist the token
  res.json({
    success: true,
    message: 'Logged out successfully',
  })
})

module.exports = router
