const express = require('express')
const router = express.Router()
const authRoutes = require('./auth')
const postRoutes = require('./posts')
const userRoutes = require('./users')
const provinceRoutes = require('./provinces')
const cityRoutes = require('./cities')
const commentRoutes = require('./comments')
const systemRoutes = require('./system')

// Register all route groups
router.use('/auth', authRoutes)
router.use('/posts', postRoutes)
router.use('/users', userRoutes)
router.use('/provinces', provinceRoutes)
router.use('/cities', cityRoutes)
router.use('/comments', commentRoutes)
router.use('/system', systemRoutes)

module.exports = router
