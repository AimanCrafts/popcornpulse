const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { validateReview } = require('../middleware/validator');

router.get('/', reviewController.getAll);
router.post('/', validateReview, reviewController.create);
router.post('/:id/upvote', reviewController.upvote);

module.exports = router;
