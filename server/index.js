const express = require('express')
const cors = require('cors')
const dotenv = require('dotenv')
const sequelize = require('../config/database')
const routes = require('./routes')
const { notFoundHandler, errorHandler } = require('./middleware/errors')

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(
      `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`
    )
  })
  next()
})

// Routes
app.use('/api', routes)

// Base route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to ComTok API',
    version: '1.0.0',
    status: 'online',
  })
})

// Error handling
app.use(notFoundHandler)
app.use(errorHandler)

// Sync database and start server
async function startServer() {
  try {
    // Sync all models with database
    await sequelize.sync({ alter: process.env.NODE_ENV === 'development' })
    console.log('✅ Database synchronized successfully')

    // Start the server
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Handle unexpected errors
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error)
  process.exit(1)
})

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason)
  process.exit(1)
})

startServer()
