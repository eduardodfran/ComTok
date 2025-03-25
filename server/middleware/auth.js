const jwt = require('jsonwebtoken')
const User = require('../../models/User')

// Middleware to verify JWT token and attach user to request
const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      })
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    // Get user from database
    const user = await User.findByPk(decoded.id)

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid user',
      })
    }

    // Attach user to request object
    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    }

    next()
  } catch (error) {
    console.error('Auth middleware error:', error)
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token',
    })
  }
}

// Middleware to check if user is admin
const adminMiddleware = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: 'Admin access required',
    })
  }
}

// Middleware to check if user is moderator or admin
const moderatorMiddleware = (req, res, next) => {
  if (
    req.user &&
    (req.user.role === 'admin' || req.user.role === 'moderator')
  ) {
    next()
  } else {
    return res.status(403).json({
      success: false,
      message: 'Moderator access required',
    })
  }
}

module.exports = {
  authMiddleware,
  adminMiddleware,
  moderatorMiddleware,
}
