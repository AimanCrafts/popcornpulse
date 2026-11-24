// server/src/controllers/eventController.js
const eventService = require('../services/eventService');
const ApiResponse = require('../utils/response');

class EventController {
  async getAll(req, res, next) {
    try {
      const events = eventService.getEvents();
      return ApiResponse.success(res, events, { total: events.length });
    } catch (err) {
      next(err);
    }
  }

  async getById(req, res, next) {
    try {
      const event = eventService.getEventById(req.params.id);
      if (!event) {
        return ApiResponse.notFound(res, `Event with ID "${req.params.id}" was not found.`);
      }
      return ApiResponse.success(res, event);
    } catch (err) {
      next(err);
    }
  }

  async rsvp(req, res, next) {
    try {
      const { name } = req.body;
      const result = eventService.rsvp(req.params.id, name);
      return ApiResponse.success(res, result.event, { attendee: result.attendee });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new EventController();
