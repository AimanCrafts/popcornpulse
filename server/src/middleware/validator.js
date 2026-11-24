// server/src/middleware/validator.js
const ApiResponse = require('../utils/response');

function validateBooking(req, res, next) {
  const { showtimeId, seats, customer } = req.body;
  const errors = [];

  if (!showtimeId) errors.push('Field "showtimeId" is required');
  if (!seats || !Array.isArray(seats) || seats.length === 0) {
    errors.push('Field "seats" must be a non-empty array of seat codes');
  }
  if (!customer || typeof customer !== 'object') {
    errors.push('Field "customer" is required and must contain contact details');
  } else {
    if (!customer.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      errors.push('A valid customer email address is required');
    }
  }

  if (errors.length > 0) {
    return ApiResponse.badRequest(res, 'Validation failed for reservation', errors);
  }

  next();
}

function validateReview(req, res, next) {
  const { headline, content, ratings } = req.body;
  const errors = [];

  if (!headline || !headline.trim()) errors.push('Review headline is required');
  if (!content || !content.trim()) errors.push('Review content is required');
  if (!ratings || typeof ratings !== 'object') {
    errors.push('Multi-axis ratings object is required');
  }

  if (errors.length > 0) {
    return ApiResponse.badRequest(res, 'Validation failed for review', errors);
  }

  next();
}

module.exports = {
  validateBooking,
  validateReview
};
