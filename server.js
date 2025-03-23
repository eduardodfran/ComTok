const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const path = require('path')
const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')))

// Import routes
const regionRoutes = require('./routes/regions')
const communityRoutes = require('./routes/communities')
const postRoutes = require('./routes/posts')
const userRoutes = require('./routes/users')

// Use routes
app.use('/api/regions', regionRoutes)
app.use('/api/communities', communityRoutes)
app.use('/api/posts', postRoutes)
app.use('/api/users', userRoutes)

// Serve the React app for any other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({
    success: false,
    message: 'Server error',
    error:
      process.env.NODE_ENV === 'development'
        ? err.message
        : 'An unexpected error occurred',
  })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

module.exports = app
