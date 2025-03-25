const sequelize = require('../../config/database')

// Check database connection
exports.checkConnection = async (req, res) => {
  try {
    await sequelize.authenticate()
    res.json({
      success: true,
      message: 'Database connection has been established successfully.',
      status: 'connected',
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    res.status(500).json({
      success: false,
      message: 'Unable to connect to the database.',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Database connection error',
      status: 'disconnected',
    })
  }
}

// Get database status with additional info
exports.getStatus = async (req, res) => {
  try {
    await sequelize.authenticate()

    // Get database information
    const [results] = await sequelize.query('SELECT VERSION() as version')
    const version = results[0]?.version || 'Unknown'

    // Get table counts
    const [userCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM users'
    )
    const [postCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM posts'
    )
    const [commentCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM comments'
    )
    const [provinceCount] = await sequelize.query(
      'SELECT COUNT(*) as count FROM provinces'
    )

    res.json({
      success: true,
      message: 'Database is connected and functioning properly.',
      status: 'connected',
      database: {
        version,
        dialect: sequelize.getDialect(),
        name: sequelize.config.database,
      },
      tables: {
        users: userCount[0]?.count || 0,
        posts: postCount[0]?.count || 0,
        comments: commentCount[0]?.count || 0,
        provinces: provinceCount[0]?.count || 0,
      },
    })
  } catch (error) {
    console.error('Error getting database status:', error)
    res.status(500).json({
      success: false,
      message: 'Error retrieving database status.',
      error:
        process.env.NODE_ENV === 'development'
          ? error.message
          : 'Database status error',
      status: 'error',
    })
  }
}
