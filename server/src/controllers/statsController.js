// server/src/controllers/statsController.js
const statsService = require('../services/statsService');
const ApiResponse = require('../utils/response');

class StatsController {
  async getStats(req, res, next) {
    try {
      const stats = statsService.getPlatformTelemetry();
      return ApiResponse.success(res, stats);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new StatsController();
