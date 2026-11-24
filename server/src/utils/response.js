/**
 * Standardized API Response Helpers
 * Follows industry best practices (JSend-inspired structure)
 */

class ApiResponse {
  static success(res, data, meta = {}, statusCode = 200) {
    return res.status(statusCode).json({
      success: true,
      data,
      meta: {
        timestamp: new Date().toISOString(),
        ...meta
      }
    });
  }

  static created(res, data, meta = {}) {
    return this.success(res, data, meta, 201);
  }

  static error(res, message, statusCode = 500, details = null, errorCode = 'SERVER_ERROR') {
    return res.status(statusCode).json({
      success: false,
      error: {
        code: errorCode,
        message,
        details,
        timestamp: new Date().toISOString()
      }
    });
  }

  static badRequest(res, message = 'Bad Request', details = null) {
    return this.error(res, message, 400, details, 'BAD_REQUEST');
  }

  static notFound(res, message = 'Resource Not Found') {
    return this.error(res, message, 404, null, 'NOT_FOUND');
  }

  static conflict(res, message = 'Conflict detected') {
    return this.error(res, message, 409, null, 'RESOURCE_CONFLICT');
  }
}

module.exports = ApiResponse;
