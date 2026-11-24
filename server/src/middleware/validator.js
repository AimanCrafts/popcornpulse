const ApiResponse = require('../utils/response');

const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
const SEAT_REGEX = /^[A-F][1-8]$/;
const ID_REGEX = /^[a-zA-Z0-9_-]+$/;

function validateBooking(req, res, next) {
  const { showtimeId, movieId, seats, customer, ticketType, concessions, totalAmount } = req.body;
  const errors = [];

  if (!showtimeId || typeof showtimeId !== 'string' || !ID_REGEX.test(showtimeId) || showtimeId.length > 40) {
    errors.push('Valid "showtimeId" identifier is required (alphanumeric, max 40 chars)');
  }

  if (movieId && (typeof movieId !== 'string' || !ID_REGEX.test(movieId) || movieId.length > 40)) {
    errors.push('"movieId" must be a valid alphanumeric identifier');
  }

  if (!Array.isArray(seats) || seats.length === 0 || seats.length > 6) {
    errors.push('Field "seats" must be an array of 1 to 6 seat codes');
  } else {
    const uniqueSeats = new Set();
    for (const seat of seats) {
      if (typeof seat !== 'string' || !SEAT_REGEX.test(seat)) {
        errors.push(`Invalid seat code: "${seat}". Must be format A1 through F8`);
      }
      uniqueSeats.add(seat);
    }
    if (uniqueSeats.size !== seats.length) {
      errors.push('Duplicate seat selection detected in payload');
    }
  }

  if (!customer || typeof customer !== 'object' || Array.isArray(customer)) {
    errors.push('Customer details object is required');
  } else {
    if (!customer.name || typeof customer.name !== 'string' || customer.name.trim().length > 60) {
      errors.push('Customer name must be between 1 and 60 characters');
    }
    if (!customer.email || typeof customer.email !== 'string' || !EMAIL_REGEX.test(customer.email.trim()) || customer.email.length > 100) {
      errors.push('A valid customer email address (max 100 chars) is required');
    }
    if (customer.phone && (typeof customer.phone !== 'string' || customer.phone.length > 25)) {
      errors.push('Customer phone must be a string up to 25 characters');
    }
  }

  if (ticketType && !['Standard', 'VIP Recliner'].includes(ticketType)) {
    errors.push('Field "ticketType" must be either "Standard" or "VIP Recliner"');
  }

  if (concessions !== undefined) {
    if (!Array.isArray(concessions) || concessions.length > 10) {
      errors.push('Concessions must be an array of at most 10 items');
    } else {
      for (const item of concessions) {
        if (!item || typeof item !== 'object' || !item.name || typeof item.name !== 'string') {
          errors.push('Each concession item must have a valid name');
        }
        if (typeof item.qty !== 'number' || item.qty < 1 || item.qty > 20 || !Number.isInteger(item.qty)) {
          errors.push('Concession quantity must be an integer between 1 and 20');
        }
        if (typeof item.price !== 'number' || item.price < 0 || item.price > 100) {
          errors.push('Concession price must be a valid number between 0 and 100');
        }
      }
    }
  }

  if (totalAmount !== undefined && (typeof totalAmount !== 'number' || totalAmount < 0 || totalAmount > 1500)) {
    errors.push('Field "totalAmount" must be a valid number between 0 and 1500');
  }

  if (errors.length > 0) {
    return ApiResponse.badRequest(res, 'Validation failed for cinema reservation', errors);
  }

  next();
}

function validateReview(req, res, next) {
  const { movieId, userName, headline, content, ratings, spoiler, tags } = req.body;
  const errors = [];

  if (movieId && (typeof movieId !== 'string' || movieId.length > 40)) {
    errors.push('"movieId" must be a string up to 40 characters');
  }

  if (userName && (typeof userName !== 'string' || userName.trim().length > 50)) {
    errors.push('"userName" must be a string up to 50 characters');
  }

  if (!headline || typeof headline !== 'string' || headline.trim().length < 2 || headline.length > 120) {
    errors.push('Review headline must be between 2 and 120 characters');
  }

  if (!content || typeof content !== 'string' || content.trim().length < 5 || content.length > 2000) {
    errors.push('Review content must be between 5 and 2000 characters');
  }

  if (!ratings || typeof ratings !== 'object' || Array.isArray(ratings)) {
    errors.push('Ratings object with story, visuals, sound, and popcorn scores is required');
  } else {
    for (const dimension of ['story', 'visuals', 'sound', 'popcorn']) {
      const val = Number(ratings[dimension]);
      if (isNaN(val) || val < 1 || val > 5 || !Number.isInteger(val)) {
        errors.push(`Rating dimension "${dimension}" must be an integer between 1 and 5`);
      }
    }
  }

  if (spoiler !== undefined && typeof spoiler !== 'boolean') {
    errors.push('Field "spoiler" must be a boolean');
  }

  if (tags !== undefined) {
    if (!Array.isArray(tags) || tags.length > 6) {
      errors.push('Field "tags" must be an array of at most 6 tags');
    } else {
      for (const tag of tags) {
        if (typeof tag !== 'string' || tag.length > 40) {
          errors.push('Each tag must be a string up to 40 characters');
        }
      }
    }
  }

  if (errors.length > 0) {
    return ApiResponse.badRequest(res, 'Validation failed for critique submission', errors);
  }

  next();
}

function validateEventRsvp(req, res, next) {
  const { name } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== 'string' || name.trim().length > 60)) {
    errors.push('Attendee name must be a string up to 60 characters');
  }

  if (errors.length > 0) {
    return ApiResponse.badRequest(res, 'Validation failed for event RSVP', errors);
  }

  next();
}

module.exports = {
  validateBooking,
  validateReview,
  validateEventRsvp
};
