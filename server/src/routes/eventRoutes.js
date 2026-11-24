const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { validateEventRsvp } = require('../middleware/validator');
const { writeRateLimiter } = require('../middleware/security');

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/:id/rsvp', writeRateLimiter, validateEventRsvp, eventController.rsvp);

module.exports = router;
