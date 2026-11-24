import { initialMovies, initialShowtimes, initialConcessions, initialEvents, initialReviews } from '../data/seedData';

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}, fallback = null) {
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });

    if (!res.ok) {
      const errJson = await res.json().catch(() => ({}));
      throw new Error(errJson.error?.message || `HTTP error ${res.status}`);
    }

    const payload = await res.json();
    return payload.data !== undefined ? payload.data : payload;
  } catch (err) {
    if (fallback !== null) {
      return typeof fallback === 'function' ? fallback() : fallback;
    }
    throw err;
  }
}

export const api = {
  // Movies
  async getMovies({ search = '', genre = 'All', status = 'all', sortBy = 'pulse' } = {}) {
    const q = new URLSearchParams();
    if (search) q.append('search', search);
    if (genre && genre !== 'All') q.append('genre', genre);
    if (status && status !== 'all') q.append('status', status);
    if (sortBy) q.append('sortBy', sortBy);

    return request(`/movies?${q.toString()}`, {}, () => {
      let list = [...initialMovies];
      if (search) {
        const s = search.toLowerCase();
        list = list.filter(m => m.title.toLowerCase().includes(s) || m.genres.some(g => g.toLowerCase().includes(s)));
      }
      if (genre !== 'All') {
        list = list.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
      }
      if (status !== 'all') {
        list = list.filter(m => m.status === status);
      }
      if (sortBy === 'pulse') list.sort((a, b) => b.pulseScore - a.pulseScore);
      return list;
    });
  },

  async getMovieById(id) {
    return request(`/movies/${id}`, {}, () => {
      return initialMovies.find(m => m.id === id) || initialMovies[0];
    });
  },

  // Showtimes
  async getShowtimes(movieId = null) {
    const ep = movieId ? `/bookings/showtimes?movieId=${movieId}` : '/bookings/showtimes';
    return request(ep, {}, () => {
      return movieId ? initialShowtimes.filter(s => s.movieId === movieId) : initialShowtimes;
    });
  },

  // Bookings / Reservations
  async createBooking(bookingData) {
    return request('/bookings/reservations', {
      method: 'POST',
      body: JSON.stringify(bookingData)
    }, () => {
      const id = `BK-${Math.floor(100000 + Math.random() * 900000)}`;
      const bookingCode = `PP-LOCAL-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      return {
        id,
        bookingCode,
        ...bookingData,
        status: 'CONFIRMED',
        qrString: `POPCORNPULSE-PASS:${id}:${bookingCode}:${(bookingData.seats || []).join('-')}`,
        createdAt: new Date().toISOString()
      };
    });
  },

  async getAllBookings() {
    return request('/bookings/reservations', {}, []);
  },

  // Reviews
  async getReviews(movieId = null) {
    const ep = movieId ? `/reviews?movieId=${movieId}` : '/reviews';
    return request(ep, {}, () => {
      return movieId ? initialReviews.filter(r => r.movieId === movieId) : initialReviews;
    });
  },

  async submitReview(reviewData) {
    return request('/reviews', {
      method: 'POST',
      body: JSON.stringify(reviewData)
    }, () => {
      const story = Number(reviewData.ratings?.story || 5);
      const visuals = Number(reviewData.ratings?.visuals || 5);
      const sound = Number(reviewData.ratings?.sound || 5);
      const popcorn = Number(reviewData.ratings?.popcorn || 5);
      const pulseScore = Math.round(((story * 0.3) + (visuals * 0.25) + (sound * 0.2) + (popcorn * 0.25)) * 20);

      return {
        id: `rev-${Date.now()}`,
        movieId: reviewData.movieId,
        movieTitle: reviewData.movieTitle || 'Cinema Presentation',
        userName: reviewData.userName || 'Verified Cinephile',
        userBadge: 'Verified Cinema Goer',
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reviewData.userName || 'User')}`,
        date: 'Just now',
        ratings: { story, visuals, sound, popcorn },
        pulseScore,
        headline: reviewData.headline,
        content: reviewData.content,
        spoiler: reviewData.spoiler,
        helpfulCount: 0,
        tags: reviewData.tags || ['Community Review']
      };
    });
  },

  async upvoteReview(id) {
    return request(`/reviews/${id}/upvote`, { method: 'POST' }, () => ({ success: true, id }));
  },

  // Events / Movie Nights
  async getEvents() {
    return request('/events', {}, initialEvents);
  },

  async rsvpEvent(id, name) {
    return request(`/events/${id}/rsvp`, {
      method: 'POST',
      body: JSON.stringify({ name })
    }, () => {
      const evt = initialEvents.find(e => e.id === id);
      if (evt) evt.rsvps += 1;
      return evt;
    });
  },

  // Concessions
  async getConcessions(category = null) {
    const ep = category ? `/concessions?category=${category}` : '/concessions';
    return request(ep, {}, initialConcessions);
  },

  // Telemetry Stats
  async getStats() {
    return request('/stats', {}, {
      totalTicketsBooked: 582,
      avgPulseScore: 95,
      totalReviews: 124,
      activeMovieNights: 5,
      totalRsvps: 620,
      genreCounts: {
        "Sci-Fi": 6,
        "Action": 6,
        "Drama": 5,
        "Animation": 2,
        "Comedy": 2,
        "Romance": 2,
        "Thriller": 3
      },
      topScreenFormat: 'IMAX 70mm Dual Laser',
      auditoriumsOnline: 16
    });
  }
};
