const cinemaRepository = require('../repositories/cinemaRepository');

class ReviewService {
  getReviews(movieId) {
    if (movieId) {
      return cinemaRepository.findReviewsByMovieId(movieId);
    }
    return cinemaRepository.findAllReviews();
  }

  createReview({ movieId, movieTitle, userName, ratings, headline, content, spoiler = false, tags = [] }) {
    const movie = movieId ? cinemaRepository.findMovieById(movieId) : null;

    const story = Math.min(5, Math.max(1, Number(ratings?.story) || 5));
    const visuals = Math.min(5, Math.max(1, Number(ratings?.visuals) || 5));
    const sound = Math.min(5, Math.max(1, Number(ratings?.sound) || 5));
    const popcorn = Math.min(5, Math.max(1, Number(ratings?.popcorn) || 5));

    const weightedScore = Math.round(
      ((story * 0.3) + (visuals * 0.25) + (sound * 0.2) + (popcorn * 0.25)) * 20
    );

    const safeName = userName?.trim() || 'Verified Cinephile';

    const newReview = {
      id: `rev-${Date.now()}`,
      movieId: movieId || 'general',
      movieTitle: movie ? movie.title : (movieTitle || 'Community Cinema'),
      userName: safeName,
      userBadge: 'Verified Cinema Goer',
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(safeName)}`,
      date: 'Just now',
      ratings: { story, visuals, sound, popcorn },
      pulseScore: weightedScore,
      headline: headline.trim(),
      content: content.trim(),
      spoiler: Boolean(spoiler),
      helpfulCount: 0,
      tags: tags.length ? tags : ['PopcornPulse Review'],
      createdAt: new Date().toISOString()
    };

    return cinemaRepository.createReview(newReview);
  }

  upvoteReview(id) {
    const review = cinemaRepository.upvoteReview(id);
    if (!review) {
      const err = new Error(`Review with ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }
    return review;
  }
}

module.exports = new ReviewService();
