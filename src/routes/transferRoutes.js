const express = require('express');
const transferController = require('../controllers/transferController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Only use the /send endpoint for transfers (protected)
router.post('/send', authMiddleware, transferController.sendMoney);

module.exports = router;
