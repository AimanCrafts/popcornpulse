// server/src/services/bookingService.js
const cinemaRepository = require('../repositories/cinemaRepository');
const config = require('../config');

class BookingService {
  getShowtimes(movieId) {
    const showtimes = cinemaRepository.findAllShowtimes();
    if (movieId) {
      return showtimes.filter(s => s.movieId === movieId);
    }
    return showtimes;
  }

  getShowtimeById(id) {
    return cinemaRepository.findShowtimeById(id);
  }

  createBooking({ showtimeId, customer, seats, ticketType = 'Standard', concessions = [] }) {
    const showtime = cinemaRepository.findShowtimeById(showtimeId);
    if (!showtime) {
      const err = new Error(`Showtime with ID "${showtimeId}" was not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (seats.length > config.cinema.maxSeatsPerBooking) {
      const err = new Error(`Maximum allowed seats per transaction is ${config.cinema.maxSeatsPerBooking}.`);
      err.statusCode = 400;
      throw err;
    }

    // Collision detection: Check if any seat is already occupied
    const occupiedSet = new Set(showtime.occupiedSeats || []);
    const conflictedSeats = seats.filter(s => occupiedSet.has(s));

    if (conflictedSeats.length > 0) {
      const err = new Error(
        `Seats [${conflictedSeats.join(', ')}] have already been reserved. Please select alternative seats.`
      );
      err.statusCode = 409;
      err.code = 'SEAT_COLLISION';
      throw err;
    }

    // Reserve seats atomically
    const updatedOccupied = [...showtime.occupiedSeats, ...seats];
    cinemaRepository.updateShowtime(showtime.id, { occupiedSeats: updatedOccupied });

    // Calculate financials
    const unitPrice = ticketType === 'VIP Recliner' ? showtime.vipPrice : showtime.price;
    const ticketsSubtotal = unitPrice * seats.length;
    const concessionsSubtotal = concessions.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const totalAmount = Number((ticketsSubtotal + concessionsSubtotal).toFixed(2));

    const movie = cinemaRepository.findMovieById(showtime.movieId);
    const bookingId = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
    const bookingCode = `PP-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${showtime.format.replace(/\s+/g, '')}`;

    const newBooking = {
      id: bookingId,
      bookingCode,
      movieId: showtime.movieId,
      movieTitle: movie ? movie.title : 'Cinema Presentation',
      showtimeId: showtime.id,
      cinema: showtime.cinema,
      screen: showtime.screen,
      format: showtime.format,
      date: showtime.date,
      time: showtime.time,
      customer: {
        name: customer.name?.trim() || 'Cinephile Guest',
        email: customer.email.trim(),
        phone: customer.phone?.trim() || 'N/A'
      },
      seats,
      ticketType,
      unitPrice,
      concessions,
      totalAmount,
      currency: config.cinema.currency,
      status: 'CONFIRMED',
      qrString: `POPCORNPULSE-PASS:${bookingId}:${bookingCode}:${seats.join('-')}`,
      createdAt: new Date().toISOString()
    };

    return cinemaRepository.createBooking(newBooking);
  }

  getAllBookings() {
    return cinemaRepository.findAllBookings();
  }
}

module.exports = new BookingService();
