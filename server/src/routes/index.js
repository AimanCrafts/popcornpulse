// server/src/routes/index.js
const express = require('express');
const router = express.Router();

const movieRoutes = require('./movieRoutes');
const bookingRoutes = require('./bookingRoutes');
const reviewRoutes = require('./reviewRoutes');
const eventRoutes = require('./eventRoutes');
const concessionRoutes = require('./concessionRoutes');
const statsRoutes = require('./statsRoutes');
const cinemaRepository = require('../repositories/cinemaRepository');
const reviewService = require('../services/reviewService');
const ApiResponse = require('../utils/response');

// Health probe
router.get('/health', (req, res) => {
  return ApiResponse.success(res, {
    status: 'ONLINE',
    service: 'PopcornPulse Enterprise Cinema API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Domain Routes
router.use('/movies', movieRoutes);
router.use('/bookings', bookingRoutes);
router.use('/showtimes', (req, res, next) => {
  // Alias /api/showtimes to bookingRoutes
  req.url = `/showtimes${req.url === '/' ? '' : req.url}`;
  return bookingRoutes(req, res, next);
});
router.use('/reviews', reviewRoutes);
router.use('/events', eventRoutes);
router.use('/concessions', concessionRoutes);
router.use('/stats', statsRoutes);

// Legacy Feedback compatibility
router.get('/feedback', (req, res) => {
  const reviews = cinemaRepository.findAllReviews();
  return ApiResponse.success(res, reviews);
});

router.post('/feedback', (req, res) => {
  const { firstName, lastName, eventName, rating, message } = req.body;
  const review = reviewService.createReview({
    userName: `${firstName || ''} ${lastName || ''}`.trim() || 'Guest Cinephile',
    movieTitle: eventName || 'Community Cinema Night',
    ratings: { story: rating, visuals: rating, sound: rating, popcorn: rating },
    headline: `Feedback for ${eventName || 'Screening'}`,
    content: message || '',
    tags: ['Community Attendee']
  });
  return ApiResponse.created(res, review);
});

module.exports = router;
