// server/src/controllers/reviewController.js
const reviewService = require('../services/reviewService');
const ApiResponse = require('../utils/response');

class ReviewController {
  async getAll(req, res, next) {
    try {
      const { movieId } = req.query;
      const reviews = reviewService.getReviews(movieId);
      return ApiResponse.success(res, reviews, { total: reviews.length });
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const newReview = reviewService.createReview(req.body);
      return ApiResponse.created(res, newReview);
    } catch (err) {
      next(err);
    }
  }

  async upvote(req, res, next) {
    try {
      const updated = reviewService.upvoteReview(req.params.id);
      return ApiResponse.success(res, updated);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ReviewController();
