const { Sequelize } = require('sequelize')
require('dotenv').config()

// Create a connection to the database
const sequelize = new Sequelize(
  process.env.DB_NAME || 'comtok_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    dialectOptions: {
      decimalNumbers: true,
      // Add timezone support
      timezone: '+00:00',
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    // Add retry logic for development
    retry: {
      max: 3,
      match: [
        /ETIMEDOUT/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/,
      ],
    },
  }
)

// Test the connection
async function testConnection() {
  try {
    await sequelize.authenticate()
    console.log('✅ Database connection has been established successfully.')
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error)

    // Provide helpful error messages based on common error types
    if (error.name === 'SequelizeConnectionRefusedError') {
      console.error('   Make sure your MySQL server is running.')
    } else if (error.name === 'SequelizeAccessDeniedError') {
      console.error('   Check your database credentials in .env file.')
    } else if (error.name === 'SequelizeConnectionError') {
      console.error(
        '   There might be an issue with your database configuration.'
      )
    } else if (error.name === 'SequelizeHostNotFoundError') {
      console.error('   The database host could not be found.')
    }

    console.error('   DB_HOST:', process.env.DB_HOST || 'localhost')
    console.error('   DB_NAME:', process.env.DB_NAME || 'comtok_db')
    console.error('   DB_USER:', process.env.DB_USER || 'root')
    console.error('   DB_PORT:', process.env.DB_PORT || '3306')
  }
}

// Run the test connection when this file is loaded
testConnection()

module.exports = sequelize
