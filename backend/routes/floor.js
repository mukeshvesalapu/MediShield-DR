const express = require('express');
const router = express.Router();
const floorController = require('../controllers/floorController');
const authMiddleware = require('../middleware/auth');

router.get('/', authMiddleware, floorController.getAllFloors);
router.put('/:floorNumber', authMiddleware, floorController.updateFloor);

module.exports = router;
