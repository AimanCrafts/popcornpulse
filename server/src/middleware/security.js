const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const ApiResponse = require('../utils/response');

const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https://images.unsplash.com', 'https://api.dicebear.com'],
      frameSrc: ["'self'", 'https://www.youtube.com', 'https://www.youtube-nocookie.com'],
      connectSrc: ["'self'", 'http://localhost:5000', 'http://localhost:5173']
    }
  },
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  xContentTypeOptions: true,
  xFrameOptions: { action: 'sameorigin' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' }
});

const apiRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Too many requests from this IP address. Please try again after 15 minutes.',
      429,
      undefined,
      'RATE_LIMIT_EXCEEDED'
    );
  }
});

const writeRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    return ApiResponse.error(
      res,
      'Transaction rate limit exceeded. Please wait a few minutes before submitting again.',
      429,
      undefined,
      'WRITE_LIMIT_EXCEEDED'
    );
  }
});

function sanitizeValue(value) {
  if (typeof value === 'string') {
    return value
      .replace(/\0/g, '')
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript\s*:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
  }
  return value;
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;

  const forbiddenKeys = ['__proto__', 'constructor', 'prototype'];

  for (const key of Object.keys(obj)) {
    if (forbiddenKeys.includes(key)) {
      delete obj[key];
      continue;
    }

    if (Array.isArray(obj[key])) {
      obj[key] = obj[key].map(item => (typeof item === 'object' ? sanitizeObject(item) : sanitizeValue(item)));
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      obj[key] = sanitizeObject(obj[key]);
    } else {
      obj[key] = sanitizeValue(obj[key]);
    }
  }

  return obj;
}

function inputSanitizer(req, res, next) {
  if (req.body) req.body = sanitizeObject(req.body);
  if (req.query) req.query = sanitizeObject(req.query);
  if (req.params) req.params = sanitizeObject(req.params);

  // Prevent HTTP Parameter Pollution on query strings
  for (const [key, val] of Object.entries(req.query || {})) {
    if (Array.isArray(val) && val.length > 0) {
      req.query[key] = val[0];
    }
  }

  next();
}

module.exports = {
  helmetMiddleware,
  apiRateLimiter,
  writeRateLimiter,
  inputSanitizer
};
