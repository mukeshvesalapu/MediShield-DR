const express = require('express');
const router = express.Router();
const restoreController = require('../controllers/restoreController');
const authMiddleware = require('../middleware/auth');

router.post('/run', authMiddleware, restoreController.restoreLatest);

module.exports = router;
