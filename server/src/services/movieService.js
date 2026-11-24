const cinemaRepository = require('../repositories/cinemaRepository');

class MovieService {
  getMovies({ search, genre, status, sortBy = 'pulse', page = 1, limit = 50 }) {
    let movies = cinemaRepository.findAllMovies();

    // Full-text search
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      movies = movies.filter(m =>
        m.title.toLowerCase().includes(q) ||
        m.director.toLowerCase().includes(q) ||
        m.cast.some(c => c.toLowerCase().includes(q)) ||
        m.genres.some(g => g.toLowerCase().includes(q)) ||
        m.formats.some(f => f.toLowerCase().includes(q))
      );
    }

    // Genre Filter
    if (genre && genre !== 'All') {
      movies = movies.filter(m =>
        m.genres.some(g => g.toLowerCase() === genre.toLowerCase())
      );
    }

    // Status Filter (now_playing, upcoming, trending)
    if (status && status !== 'all') {
      movies = movies.filter(m => m.status === status);
    }

    // Sorting
    switch (sortBy) {
      case 'pulse':
        movies.sort((a, b) => b.pulseScore - a.pulseScore);
        break;
      case 'newest':
        movies.sort((a, b) => b.releaseYear - a.releaseYear);
        break;
      case 'title':
        movies.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    const total = movies.length;
    const startIndex = (page - 1) * limit;
    const paginated = movies.slice(startIndex, startIndex + Number(limit));

    return {
      movies: paginated,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  getMovieById(id) {
    const movie = cinemaRepository.findMovieById(id);
    if (!movie) return null;

    const showtimes = cinemaRepository.findAllShowtimes().filter(s => s.movieId === id);
    const reviews = cinemaRepository.findReviewsByMovieId(id);

    return {
      ...movie,
      showtimes,
      reviews
    };
  }

  createMovie(moviePayload) {
    const id = `mov-${Date.now()}`;
    const newMovie = {
      id,
      title: moviePayload.title,
      tagline: moviePayload.tagline || 'Experience the pulse of cinema.',
      synopsis: moviePayload.synopsis || moviePayload.description || 'No synopsis provided.',
      poster: moviePayload.poster || 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
      backdrop: moviePayload.backdrop || 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1600&q=80',
      genres: moviePayload.genres || ['Drama'],
      runtime: moviePayload.runtime || '120 min',
      releaseYear: moviePayload.releaseYear || new Date().getFullYear(),
      ageRating: moviePayload.ageRating || 'PG-13',
      director: moviePayload.director || 'Visionary Director',
      cast: moviePayload.cast || ['Ensemble Cast'],
      status: moviePayload.status || 'now_playing',
      pulseScore: moviePayload.pulseScore || 92,
      criticScore: moviePayload.criticScore || 90,
      audienceScore: moviePayload.audienceScore || 93,
      trailerUrl: moviePayload.trailerUrl || 'https://www.youtube.com',
      theaters: moviePayload.theaters || ['PopcornPulse Grand Cinema'],
      formats: moviePayload.formats || ['IMAX 70mm', 'Dolby Atmos']
    };

    return cinemaRepository.createMovie(newMovie);
  }
}

module.exports = new MovieService();
