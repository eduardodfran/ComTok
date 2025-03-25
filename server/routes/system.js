const express = require('express')
const router = express.Router()
const dbConnectionController = require('../controllers/db-connection')
const os = require('os')
const { version } = require('../../package.json')

// DB Connection check
router.get('/db-status', dbConnectionController.checkConnection)

// More detailed DB status
router.get('/db-info', dbConnectionController.getStatus)

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  })
})

// System info
router.get('/info', (req, res) => {
  // Calculate uptime in a more readable format
  const uptime = process.uptime()
  const days = Math.floor(uptime / 86400)
  const hours = Math.floor((uptime % 86400) / 3600)
  const minutes = Math.floor((uptime % 3600) / 60)
  const seconds = Math.floor(uptime % 60)

  // Format the uptime string
  let uptimeString = ''
  if (days > 0) uptimeString += `${days}d `
  if (hours > 0 || days > 0) uptimeString += `${hours}h `
  if (minutes > 0 || hours > 0 || days > 0) uptimeString += `${minutes}m `
  uptimeString += `${seconds}s`

  // Calculate memory usage in MB
  const memoryUsage = {
    rss: Math.round(process.memoryUsage().rss / 1048576), // Resident Set Size in MB
    heapTotal: Math.round(process.memoryUsage().heapTotal / 1048576), // Total heap size in MB
    heapUsed: Math.round(process.memoryUsage().heapUsed / 1048576), // Used heap size in MB
    external: Math.round(process.memoryUsage().external / 1048576), // External memory in MB
  }

  // Get system information
  const systemInfo = {
    platform: os.platform(),
    arch: os.arch(),
    cpus: os.cpus().length,
    totalMemory: Math.round(os.totalmem() / 1048576), // Total memory in MB
    freeMemory: Math.round(os.freemem() / 1048576), // Free memory in MB
    loadAvg: os.loadavg(),
  }

  res.json({
    success: true,
    message: 'System information retrieved successfully',
    data: {
      name: 'ComTok API',
      version: version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      nodejs: process.version,
      uptime: uptimeString,
      memoryUsage,
      system: systemInfo,
      timestamp: new Date().toISOString(),
    },
  })
})

module.exports = router
