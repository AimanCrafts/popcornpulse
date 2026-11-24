const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { validateReview } = require('../middleware/validator');
const { writeRateLimiter } = require('../middleware/security');

router.get('/', reviewController.getAll);
router.post('/', writeRateLimiter, validateReview, reviewController.create);
router.post('/:id/upvote', writeRateLimiter, reviewController.upvote);

module.exports = router;
