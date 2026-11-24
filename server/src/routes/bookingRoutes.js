const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { validateBooking } = require('../middleware/validator');

router.get('/showtimes', bookingController.getShowtimes);
router.get('/showtimes/:id', bookingController.getShowtimeById);
router.post('/reservations', validateBooking, bookingController.createBooking);
router.get('/reservations', bookingController.getAllBookings);

// Compatibility alias
router.get('/', bookingController.getAllBookings);
router.post('/', validateBooking, bookingController.createBooking);

module.exports = router;
