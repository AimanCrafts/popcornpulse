// server/src/controllers/bookingController.js
const bookingService = require('../services/bookingService');
const ApiResponse = require('../utils/response');

class BookingController {
  async getShowtimes(req, res, next) {
    try {
      const { movieId } = req.query;
      const showtimes = bookingService.getShowtimes(movieId);
      return ApiResponse.success(res, showtimes, { count: showtimes.length });
    } catch (err) {
      next(err);
    }
  }

  async getShowtimeById(req, res, next) {
    try {
      const showtime = bookingService.getShowtimeById(req.params.id);
      if (!showtime) {
        return ApiResponse.notFound(res, `Showtime with ID "${req.params.id}" not found.`);
      }
      return ApiResponse.success(res, showtime);
    } catch (err) {
      next(err);
    }
  }

  async createBooking(req, res, next) {
    try {
      const booking = bookingService.createBooking(req.body);
      return ApiResponse.created(res, booking);
    } catch (err) {
      next(err);
    }
  }

  async getAllBookings(req, res, next) {
    try {
      const bookings = bookingService.getAllBookings();
      return ApiResponse.success(res, bookings, { total: bookings.length });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new BookingController();
