import ApiError from '../utils/ApiError.js';
import logger from '../utils/logger.js';

/**
 * 404 handler for unmatched routes.
 */
export function notFoundHandler(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

/**
 * Central error handler. Converts any thrown error into a consistent JSON
 * response and logs unexpected (non-operational) errors.
 */
export function errorHandler(err, req, res, _next) {
  const statusCode = err.statusCode || 500;
  const isOperational = err.isOperational === true;

  if (!isOperational) {
    logger.error('Unexpected error:', err);
  }

  res.status(statusCode).json({
    error: {
      message: isOperational ? err.message : 'Internal server error',
      ...(err.details ? { details: err.details } : {}),
    },
  });
}
