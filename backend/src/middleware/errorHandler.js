import logger from '../config/logger.js';

/**
 * Global error handling middleware
 * Should be last middleware in the stack
 */
export const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Database errors
  if (err.code === '23505') {
    // Unique constraint violation
    return res.status(400).json({
      success: false,
      error: 'Duplicate entry - resource already exists',
      details: err.detail,
    });
  }

  if (err.code === '23503') {
    // Foreign key constraint violation
    return res.status(400).json({
      success: false,
      error: 'Invalid reference - related resource not found',
      details: err.detail,
    });
  }

  // Validation errors
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      error: 'Validation error',
      details: err.details || err.message,
    });
  }

  // Custom API errors
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      success: false,
      error: err.message,
      details: err.details,
    });
  }

  // Default server error
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { details: err.message }),
  });
};

/**
 * Middleware to handle 404 Not Found
 */
export const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    path: req.originalUrl,
  });
};

export default {
  errorHandler,
  notFoundHandler,
};
