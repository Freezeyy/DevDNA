/**
 * Operational error with an HTTP status code. Thrown by services/controllers
 * and translated into a JSON response by the error-handling middleware.
 */
export default class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message, details) {
    return new ApiError(400, message, details);
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message);
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message);
  }

  static tooManyRequests(message = 'Rate limit exceeded') {
    return new ApiError(429, message);
  }

  static badGateway(message = 'Upstream service error', details) {
    return new ApiError(502, message, details);
  }
}
