// server/src/routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.get('/', eventController.getAll);
router.get('/:id', eventController.getById);
router.post('/:id/rsvp', eventController.rsvp);

module.exports = router;
