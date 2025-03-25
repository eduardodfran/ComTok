/**
 * Error handling middleware for Express
 */

// Not Found handler
const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`)
  error.status = 404
  next(error)
}

// General error handler
const errorHandler = (err, req, res, next) => {
  // Default status is 500 if not specified
  const statusCode = err.status || 500

  // Create the response object
  const response = {
    success: false,
    message: err.message || 'Something went wrong',
    status: statusCode,
  }

  // Add stack trace in development
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack
  }

  // Log errors in all environments
  console.error(`[${statusCode}] ${err.message}`)
  if (statusCode === 500) {
    console.error(err.stack)
  }

  // Send response
  res.status(statusCode).json(response)
}

module.exports = {
  notFoundHandler,
  errorHandler,
}
