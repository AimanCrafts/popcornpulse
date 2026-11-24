const ApiResponse = require('../utils/response');
const config = require('../config');

function errorHandler(err, req, res, next) {
  console.error(`[UNHANDLED ERROR] ${req.method} ${req.originalUrl}:`, err);

  const statusCode = err.statusCode || err.status || 500;
  const message = err.message || 'Internal Server Error';
  const details = config.env === 'development' ? err.stack : undefined;
  const errorCode = err.code || 'INTERNAL_ERROR';

  return ApiResponse.error(res, message, statusCode, details, errorCode);
}

module.exports = errorHandler;
