// server/src/index.js
const createApp = require('./app');
const config = require('./config');

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`🍿 [PopcornPulse Server] Online in ${config.env} mode at http://localhost:${config.port}`);
  console.log(`📡 API Endpoints mounted at http://localhost:${config.port}/api`);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
  });
});
