const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validator');
const { writeRateLimiter } = require('../middleware/security');

router.get('/showtimes', bookingController.getShowtimes);
router.get('/showtimes/:id', bookingController.getShowtimeById);
router.post('/reservations', writeRateLimiter, validateBooking, bookingController.createBooking);
router.get('/reservations', bookingController.getAllBookings);

// Compatibility alias
router.get('/', bookingController.getAllBookings);
router.post('/', writeRateLimiter, validateBooking, bookingController.createBooking);

module.exports = router;
