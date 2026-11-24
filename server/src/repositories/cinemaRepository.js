const fs = require('fs');
const path = require('path');

const STORE_PATH = path.join(__dirname, '../data/cinemaStore.json');

const DEFAULT_STORE = {
  movies: [],
  showtimes: [],
  concessions: [],
  events: [],
  reviews: [],
  bookings: []
};

class CinemaRepository {
  constructor() {
    this.data = { ...DEFAULT_STORE };
    this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(STORE_PATH)) {
        const fileContent = fs.readFileSync(STORE_PATH, 'utf-8');
        const parsed = JSON.parse(fileContent);
        this.data = {
          movies: Array.isArray(parsed.movies) ? parsed.movies : [],
          showtimes: Array.isArray(parsed.showtimes) ? parsed.showtimes : [],
          concessions: Array.isArray(parsed.concessions) ? parsed.concessions : [],
          events: Array.isArray(parsed.events) ? parsed.events : [],
          reviews: Array.isArray(parsed.reviews) ? parsed.reviews : [],
          bookings: Array.isArray(parsed.bookings) ? parsed.bookings : []
        };
      } else {
        this.data = { ...DEFAULT_STORE };
        this.saveData();
      }
    } catch (err) {
      console.warn('[Repository] File read error:', err.message);
      this.data = { ...DEFAULT_STORE };
    }
  }

  saveData() {
    try {
      fs.writeFileSync(STORE_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[Repository] Could not save store file:', err.message);
    }
  }

  // --- MOVIES ---
  findAllMovies() {
    return this.data.movies;
  }

  findMovieById(id) {
    return this.data.movies.find(m => m.id === id);
  }

  createMovie(movie) {
    this.data.movies.unshift(movie);
    this.saveData();
    return movie;
  }

  // --- SHOWTIMES ---
  findAllShowtimes() {
    return this.data.showtimes;
  }

  findShowtimeById(id) {
    return this.data.showtimes.find(s => s.id === id);
  }

  updateShowtime(id, updates) {
    const idx = this.data.showtimes.findIndex(s => s.id === id);
    if (idx !== -1) {
      this.data.showtimes[idx] = { ...this.data.showtimes[idx], ...updates };
      this.saveData();
      return this.data.showtimes[idx];
    }
    return null;
  }

  // --- BOOKINGS ---
  findAllBookings() {
    return this.data.bookings;
  }

  findBookingById(id) {
    return this.data.bookings.find(b => b.id === id);
  }

  createBooking(booking) {
    this.data.bookings.unshift(booking);
    this.saveData();
    return booking;
  }

  // --- REVIEWS ---
  findAllReviews() {
    return this.data.reviews;
  }

  findReviewsByMovieId(movieId) {
    return this.data.reviews.filter(r => r.movieId === movieId);
  }

  createReview(review) {
    this.data.reviews.unshift(review);
    this.saveData();
    return review;
  }

  upvoteReview(id) {
    const rev = this.data.reviews.find(r => r.id === id);
    if (rev) {
      rev.helpfulCount = (rev.helpfulCount || 0) + 1;
      this.saveData();
      return rev;
    }
    return null;
  }

  // --- EVENTS ---
  findAllEvents() {
    return this.data.events;
  }

  findEventById(id) {
    return this.data.events.find(e => e.id === id);
  }

  updateEvent(id, updates) {
    const idx = this.data.events.findIndex(e => e.id === id);
    if (idx !== -1) {
      this.data.events[idx] = { ...this.data.events[idx], ...updates };
      this.saveData();
      return this.data.events[idx];
    }
    return null;
  }

  // --- CONCESSIONS ---
  findAllConcessions() {
    return this.data.concessions;
  }
}

const cinemaRepository = new CinemaRepository();
module.exports = cinemaRepository;
