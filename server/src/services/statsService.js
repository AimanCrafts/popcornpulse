// server/src/services/statsService.js
const cinemaRepository = require('../repositories/cinemaRepository');

class StatsService {
  getPlatformTelemetry() {
    const movies = cinemaRepository.findAllMovies();
    const bookings = cinemaRepository.findAllBookings();
    const reviews = cinemaRepository.findAllReviews();
    const events = cinemaRepository.findAllEvents();

    const totalTicketsBooked = bookings.reduce(
      (sum, b) => sum + (Array.isArray(b.seats) ? b.seats.length : 1),
      0
    );

    const avgPulseScore = Math.round(
      movies.reduce((sum, m) => sum + (m.pulseScore || 90), 0) / (movies.length || 1)
    );

    const totalRsvps = events.reduce((sum, e) => sum + (e.rsvps || 0), 0);

    const genreCounts = {};
    movies.forEach(m => {
      (m.genres || []).forEach(g => {
        genreCounts[g] = (genreCounts[g] || 0) + 1;
      });
    });

    return {
      totalTicketsBooked,
      avgPulseScore,
      totalReviews: reviews.length,
      activeMovieNights: events.length,
      totalRsvps,
      genreCounts,
      topScreenFormat: 'IMAX 70mm Dual Laser',
      auditoriumsOnline: 12,
      activeShowtimesCount: cinemaRepository.findAllShowtimes().length,
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = new StatsService();
