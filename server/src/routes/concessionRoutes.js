const express = require('express');
const router = express.Router();
const concessionController = require('../controllers/concessionController');

router.get('/', concessionController.getMenu);

module.exports = router;
