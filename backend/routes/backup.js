const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');
const authMiddleware = require('../middleware/auth');

router.post('/run', authMiddleware, backupController.runBackup);
router.get('/list', authMiddleware, backupController.listBackups);

module.exports = router;
