const createApp = require('./app');
const config = require('./config');

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[PopcornPulse Server] Online in ${config.env} mode at http://localhost:${config.port}`);
  console.log(`API Endpoints mounted at http://localhost:${config.port}/api`);
});

// DoS / Slowloris protection: enforce aggressive socket timeouts
server.timeout = 10000;
server.keepAliveTimeout = 5000;
server.headersTimeout = 6000;

// Process safety: prevent unhandled exceptions or rejections from terminating abruptly
process.on('unhandledRejection', (reason, promise) => {
  console.error('[CRITICAL] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('[CRITICAL] Uncaught Exception thrown:', err);
  // Allow pending requests 3 seconds to complete before exiting
  setTimeout(() => process.exit(1), 3000);
});

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed cleanly');
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed cleanly');
  });
});
