const express = require('express');
const cors = require('cors');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const { helmetMiddleware, apiRateLimiter, inputSanitizer } = require('./middleware/security');
const apiRoutes = require('./routes');
const ApiResponse = require('./utils/response');

function createApp() {
  const app = express();

  // Trust reverse proxy (for accurate client IP in rate limiting & HTTPS enforcement)
  app.set('trust proxy', 1);

  // Security Headers (CSP, HSTS, X-Content-Type-Options, etc.)
  app.use(helmetMiddleware);

  // CORS Access Control
  app.use(cors(config.cors));

  // Request body parsing with strict payload bounds to prevent memory exhaustion DoS
  app.use(express.json({ limit: '20kb' }));
  app.use(express.urlencoded({ limit: '20kb', extended: true }));

  // Deep sanitization against XSS, prototype pollution, and SQL/parameter injection
  app.use(inputSanitizer);

  // Request logger
  app.use(requestLogger);

  // Global API rate limiter against DoS / brute force attacks
  app.use('/api', apiRateLimiter);
  app.use('/api/v1', apiRateLimiter);

  // Mount API routers
  app.use('/api', apiRoutes);
  app.use('/api/v1', apiRoutes);

  // 404 Fallback
  app.use((req, res) => {
    return ApiResponse.notFound(res, `Endpoint "${req.method} ${req.originalUrl}" does not exist.`);
  });

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

module.exports = createApp;
