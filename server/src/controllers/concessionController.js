// server/src/controllers/concessionController.js
const concessionService = require('../services/concessionService');
const ApiResponse = require('../utils/response');

class ConcessionController {
  async getMenu(req, res, next) {
    try {
      const { category } = req.query;
      const items = concessionService.getMenu(category);
      return ApiResponse.success(res, items, { total: items.length });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ConcessionController();
