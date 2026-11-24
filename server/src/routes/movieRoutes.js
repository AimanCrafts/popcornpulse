// server/src/routes/movieRoutes.js
const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.getAll);
router.get('/:id', movieController.getById);
router.post('/', movieController.create);

module.exports = router;
