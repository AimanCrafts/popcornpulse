const movieService = require('../services/movieService');
const ApiResponse = require('../utils/response');

class MovieController {
  async getAll(req, res, next) {
    try {
      const { search, genre, status, sortBy, page, limit } = req.query;
      const result = movieService.getMovies({ search, genre, status, sortBy, page, limit });
      return ApiResponse.success(res, result.movies, result.meta);
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const movie = movieService.getMovieById(req.params.id);
      if (!movie) {
        return ApiResponse.notFound(res, `Movie with ID "${req.params.id}" was not found.`);
      }
      return ApiResponse.success(res, movie);
    } catch (err) {
      next(err);
    }
  }

  async create(req, res, next) {
    try {
      const { title } = req.body;
      if (!title || !title.trim()) {
        return ApiResponse.badRequest(res, 'Movie title is required.');
      }
      const newMovie = movieService.createMovie(req.body);
      return ApiResponse.created(res, newMovie);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new MovieController();
