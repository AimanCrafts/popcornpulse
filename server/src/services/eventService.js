const cinemaRepository = require('../repositories/cinemaRepository');

class EventService {
  getEvents() {
    return cinemaRepository.findAllEvents();
  }

  getEventById(id) {
    return cinemaRepository.findEventById(id);
  }

  rsvp(id, attendeeName) {
    const event = cinemaRepository.findEventById(id);
    if (!event) {
      const err = new Error(`Event with ID "${id}" was not found.`);
      err.statusCode = 404;
      throw err;
    }

    if (event.rsvps >= event.maxCapacity) {
      const err = new Error('This screening has reached maximum capacity.');
      err.statusCode = 400;
      err.code = 'CAPACITY_REACHED';
      throw err;
    }

    const updated = cinemaRepository.updateEvent(id, {
      rsvps: event.rsvps + 1
    });

    return {
      event: updated,
      attendee: attendeeName || 'Cinephile Guest',
      confirmedAt: new Date().toISOString()
    };
  }
}

module.exports = new EventService();
