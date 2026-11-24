const express = require('express');
const cors = require('cors');
const config = require('./config');
const requestLogger = require('./middleware/requestLogger');
const errorHandler = require('./middleware/errorHandler');
const apiRoutes = require('./routes');
const ApiResponse = require('./utils/response');

function createApp() {
  const app = express();

  // Middleware pipeline
  app.use(cors(config.cors));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(requestLogger);

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
