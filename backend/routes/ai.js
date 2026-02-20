const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const authMiddleware = require('../middleware/auth');

router.get('/analyze', authMiddleware, aiController.analyzeSystem);

module.exports = router;
